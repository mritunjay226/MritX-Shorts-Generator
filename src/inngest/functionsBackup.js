import axios from "axios";
import { inngest } from "./client";
import { createClient } from "@deepgram/sdk";
import { generateImagePrompt } from "@/configs/AiModel";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { getServices, renderMediaOnCloudrun } from '@remotion/cloudrun/client';
import cloudinary from "@/lib/cloudinary";

const ImagePromptScript = `Generate Image prompt of {style} style woth all details for each scene for 30 seconds video : script: {script} 
- Just Give specifing image prompt depends on the story line
- do not give camera angle umage prompt
- Follow the following schema and return JSON data (Max 7-8 Images)
- [
    {
        imagePrompt:'',
        sceneContent: ' <Script Content>'
    }
]`

const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY;
const BASE_URL = 'https://aigurulab.tech';

export const GenerateVideoData = inngest.createFunction(
    { id: "generate-video-data" },
    { event: "generate-video-data" },
    async ({ event, step }) => {
        const { script, topic, title, caption, bgMusic , videoStyle, voice, recordId } = event?.data;
        const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

        // -------------------------------
        // Generate Audio File
        // -------------------------------
        const GenerateAudioFile = await step.run("GenerateAudioFile", async () => {
            try {
                const response = await axios.post(
                    "https://api.cartesia.ai/tts/bytes",
                    {
                        model_id: "sonic-2",
                        transcript: script,
                        voice: { mode: "id", id: voice },
                        output_format: { container: "mp3", encoding: "mp3", sample_rate: 44100 },
                        speed: "normal",
                    },
                    {
                        headers: {
                            "X-API-Key": CARTESIA_API_KEY,
                            "Cartesia-Version": "2024-06-10",
                            "Content-Type": "application/json",
                        },
                        responseType: "arraybuffer",
                    }
                );

                const audioBase64 = Buffer.from(response.data, "binary").toString("base64");
                return `data:audio/mp3;base64,${audioBase64}`;
            } catch (error) {
                console.error("Cartesia TTS Error:", error.response?.data || error.message);
                return null;
            }
        });

        // -------------------------------
        // Generate Captions
        // -------------------------------
        const GenerateCaptions = await step.run("generateCaptions", async () => {
            const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);
            const base64Data = GenerateAudioFile.replace(/^data:audio\/\w+;base64,/, "");
            const audioBuffer = Buffer.from(base64Data, "base64");

            const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
                audioBuffer,
                { model: "nova-3", smart_format: true, detect_language: true }
            );

            if (error) {
                console.error("Deepgram transcription error:", error);
                return [];
            }

            return result.results?.channels?.[0]?.alternatives?.[0]?.words || [];
        });

        // -------------------------------
        // Generate Image Prompts
        // -------------------------------
        const GenerateImagePrompt = await step.run("generateImagePrompt", async () => {
            const FINAL_PROMPT = ImagePromptScript
                .replace("{style}", videoStyle)
                .replace("{script}", script);

            const result = await generateImagePrompt.sendMessage(FINAL_PROMPT);
            return JSON.parse(result.response.text());
        });

        // -------------------------------
        // Generate Images
        // -------------------------------
        const GenerateImages = await step.run("generateImages", async () => {
            return await Promise.all(
                GenerateImagePrompt.map(async (element) => {
                    const result = await axios.post(
                        BASE_URL + "/api/generate-image",
                        {
                            width: 1024,
                            height: 1024,
                            input: element?.imagePrompt,
                            model: "sdxl",
                            aspectRatio: "1:1",
                        },
                        {
                            headers: {
                                "x-api-key": process.env.NEXT_PUBLIC_AIGURU_API_KEY,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    return result.data.image;
                })
            );
        });

        // -------------------------------
        // Save All Data to DB
        // -------------------------------
        await step.run("updateDB", async () => {
            return await convex.mutation(api.videoData.UpdateVideoRecord, {
                recordId: recordId,
                audioUrl: GenerateAudioFile,
                captionJson: GenerateCaptions,
                images: GenerateImages,
            });
        });

        // -------------------------------
        // Trigger Cloud Run FFmpeg Renderer
        // -------------------------------
        const RenderVideo = await step.run("renderVideoCloudRun", async () => {
            try {
                console.log("=== RenderVideo Step Started ===");
                console.log("Audio URL exists:", !!GenerateAudioFile);
                console.log("Number of images:", GenerateImages.length);
                console.log("Number of captions:", GenerateCaptions.length);

                // -----------------------------
                // Calculate Image Durations (FIXED)
                // -----------------------------
                // Get total audio duration from last caption
                const totalAudioDuration = GenerateCaptions.length > 0 
                    ? GenerateCaptions[GenerateCaptions.length - 1].end 
                    : 10; // fallback to 10 seconds
                
                console.log("Total audio duration:", totalAudioDuration, "seconds");
                
                // Calculate duration per image (equal distribution)
                const durationPerImage = totalAudioDuration / GenerateImages.length;
                
                // Create image durations array (one per image - MUST match images.length)
                const imageDurations = GenerateImages.map(() => 
                    parseFloat(durationPerImage.toFixed(3))
                );
                
                console.log("Image durations (one per image):", imageDurations);
                console.log("Duration per image:", durationPerImage.toFixed(2) + "s");

                // -----------------------------
                // Format captions with timing
                // -----------------------------
                const formattedCaptions = GenerateCaptions.map(caption => ({
                    word: caption.word || '',
                    start: caption.start || 0,
                    end: caption.end || 0
                }));

                // -----------------------------
                // Validate before sending
                // -----------------------------
                if (imageDurations.length !== GenerateImages.length) {
                    throw new Error(
                        `CRITICAL ERROR: Duration/Image mismatch - ` +
                        `${imageDurations.length} durations, ${GenerateImages.length} images`
                    );
                }

                console.log("✅ Validation passed - arrays match");

                // -----------------------------
                // Prepare payload for Cloud Run
                // -----------------------------
                const payload = {
                    audioUrl: GenerateAudioFile,
                    images: GenerateImages,
                    durations: imageDurations,  // ✅ Now matches images.length
                    captions: formattedCaptions, // With start/end times
                    watermarkUrl: null // Optional
                };

                console.log("Payload summary:", {
                    images: payload.images.length,
                    durations: payload.durations.length,
                    captions: payload.captions.length,
                    totalDuration: payload.durations.reduce((sum, d) => sum + d, 0).toFixed(2) + 's'
                });

                console.log("Sending payload to Cloud Run...");

                // -----------------------------
                // Call Cloud Run
                // -----------------------------
                const response = await axios.post(
                    "https://video-renderer-780371904666.asia-south1.run.app/render",
                    payload,
                    {
                        headers: { 
                            "Content-Type": "application/json" 
                        },
                        timeout: 300000, // 5 minutes
                        maxContentLength: Infinity,
                        maxBodyLength: Infinity,
                    }
                );

                console.log("✅ Cloud Run response received");
                
                // Cloud Run returns JSON with videoBase64
                if (!response.data || !response.data.videoBase64) {
                    throw new Error("No video data received from Cloud Run");
                }

                console.log("Video base64 length:", response.data.videoBase64.length);

                // -----------------------------
                // Convert base64 to buffer
                // -----------------------------
                const videoBuffer = Buffer.from(response.data.videoBase64, "base64");
                console.log("Video buffer length:", videoBuffer.length);

                // -----------------------------
                // Upload video to Cloudinary
                // -----------------------------
                console.log("Uploading video to Cloudinary...");
                const videoUpload = await new Promise((resolve, reject) => {
                    const upload = cloudinary.uploader.upload_stream(
                        {
                            resource_type: "video",
                            folder: "generated_videos",
                            format: "mp4",
                            public_id: `video_${recordId}_${Date.now()}`
                        },
                        (error, result) => {
                            if (error) {
                                console.error("Cloudinary upload error:", error);
                                return reject(error);
                            }
                            console.log("✅ Cloudinary upload successful");
                            resolve(result);
                        }
                    );
                    upload.end(videoBuffer);
                });

                console.log("✅ RenderVideo step completed successfully");
                console.log("Video URL:", videoUpload.secure_url);
                
                return videoUpload.secure_url;

            } catch (err) {
                console.error("❌ Cloud Run or Cloudinary error:");
                
                if (err.response) {
                    console.error("Status:", err.response.status);
                    console.error("Data:", err.response.data);
                    console.error("Headers:", err.response.headers);
                } else if (err.request) {
                    console.error("No response received");
                } else {
                    console.error("Error:", err.message);
                }
                
                throw err;
            }
        });

        // -------------------------------
        // Update DB with Download URL
        // -------------------------------
        await step.run("updateDownloadUrl", async () => {
            try {
                console.log("=== Updating Download URL in Database ===");
                console.log("Record ID:", recordId);
                console.log("Download URL:", RenderVideo);

                // Use the dedicated mutation to update only the downloadUrl
                await convex.mutation(api.videoData.UpdateDownloadUrl, {
                    recordId: recordId,
                    downloadUrl: RenderVideo
                });

                console.log("✅ Download URL successfully saved to database");
                return { success: true, url: RenderVideo };

            } catch (error) {
                console.error("❌ Failed to update download URL:", error);
                throw error;
            }
        });

        return "Process Completed Successfully";
    }
);