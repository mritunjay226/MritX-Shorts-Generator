import { inngest } from "./client.js";
import axios from "axios";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api.js";
import child_process from "child_process";
import fs from "fs";
import FormData from "form-data";

// 🧠 The entire AI video pipeline
export const GenerateCharacterVideo = inngest.createFunction(
  { id: "generate-character-video" },
  { event: "generate-character-video" },
  async ({ event, step }) => {
    const { idea, tone, characterId, recordId, narration = true } = event.data;
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

    // STEP 1️⃣ — Fetch character details (for consistent appearance)
    const character = await convex.query(api.characters.getById, { id: characterId });

    // STEP 2️⃣ — Generate 3 scripts using Gemini
    const scripts = await step.run("generate-scripts", async () => {
      const prompt = `
        Write 3 short, fun YouTube Shorts scripts featuring this character:
        ${character.name}: ${character.description}.
        Theme: ${idea}. Tone: ${tone}.
        Each script must have exactly 3 scenes.
        Return JSON only:
        [{"title":"...","scenes":[{"scene":1,"action":"..."},{"scene":2,"action":"..."},{"scene":3,"action":"..."}]}]
      `;
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] }
      );
      const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      return JSON.parse(text);
    });

    const chosenScript = scripts[0];
    await convex.mutation(api.videoData.UpdateVideoRecord, { recordId, script: chosenScript });

    // STEP 3️⃣ — Generate images (Aiguru) with referenceImage for consistent character
    const images = await step.run("generate-images", async () => {
      const prompts = chosenScript.scenes.map(
        (scene) =>
          `${character.description}, ${scene.action}, same face, same outfit, cartoon cinematic 9:16 lighting`
      );

      const results = await Promise.all(
        prompts.map(async (p) => {
          const res = await axios.post(
            "https://aigurulab.tech/api/generate-image",
            {
              input: p,
              referenceImage: character.referenceImage,
              width: 720,
              height: 1280,
              model: "sdxl",
            },
            { headers: { "x-api-key": process.env.NEXT_PUBLIC_AIGURU_API_KEY } }
          );
          return res.data.image; // base64
        })
      );

      return results;
    });

    // STEP 4️⃣ — Optional narration via Cartesia (if narration=true)
    const audioFiles = narration
      ? await step.run("generate-narration", async () => {
          const audios = await Promise.all(
            chosenScript.scenes.map(async (scene, i) => {
              const res = await axios.post(
                "https://api.cartesia.ai/tts",
                { text: scene.action, voice: "CalmMale", format: "mp3" },
                {
                  headers: {
                    Authorization: `Bearer ${process.env.CARTESIA_API_KEY}`,
                  },
                  responseType: "arraybuffer",
                }
              );
              const path = `/tmp/audio_${recordId}_${i}.mp3`;
              fs.writeFileSync(path, res.data);
              return path;
            })
          );
          return audios;
        })
      : [];

    // STEP 5️⃣ — Animate each image using deAPI (via your proxy route)
    const videoClips = await step.run("animate-scenes", async () => {
      const clips = await Promise.all(
        images.map(async (base64, i) => {
          const imageUrl = `data:image/png;base64,${base64}`;
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/client/img2video`,
            {
              model: "img2video-v1",
              image_url: imageUrl,
              prompt: `${character.name} ${chosenScript.scenes[i].action}`,
              duration: 6,
              aspect_ratio: "9:16",
            }
          );
          return res.data.clipUrl;
        })
      );
      return clips;
    });

    // STEP 6️⃣ — Merge video clips (and optional narration)
    const finalPath = `/tmp/final_${recordId}.mp4`;

    await step.run("merge-video", async () => {
      const listPath = `/tmp/${recordId}_list.txt`;
      fs.writeFileSync(listPath, videoClips.map((v) => `file '${v}'`).join("\n"));

      const ffmpegCmd = narration
        ? `ffmpeg -f concat -safe 0 -i ${listPath} -i ${audioFiles[0]} -shortest -c:v copy -c:a aac ${finalPath}`
        : `ffmpeg -f concat -safe 0 -i ${listPath} -c copy ${finalPath}`;

      child_process.execSync(ffmpegCmd);
    });

    // STEP 7️⃣ — Upload to S3 (optional)
    // import your S3 helper and do:
    // const buffer = fs.readFileSync(finalPath);
    // const url = await uploadFile(buffer, `final/${recordId}.mp4`);

    const videoUrl = `/videos/final_${recordId}.mp4`; // mock URL for now

    // STEP 8️⃣ — Update Convex DB
    await convex.mutation(api.videoData.UpdateVideoRecord, {
      recordId,
      videoUrl,
      narration,
      status: "completed",
      completedAt: Date.now(),
    });

    return { success: true, videoUrl };
  }
);
