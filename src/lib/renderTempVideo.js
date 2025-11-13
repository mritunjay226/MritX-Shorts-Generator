// render-video.js
import { bundle } from "@remotion/bundler";
import { renderMedia } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const compositionId = "mritXShorts"; // your composition ID
const outputDir = path.resolve("./renders"); // folder to save videos

async function renderVideo() {
  try {
    // Ensure output folder exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    console.log("🔄 Bundling Remotion project...");
    const entry = path.resolve("src/remotion/index.js");
    const bundled = await bundle(entry);

    console.log("🎬 Rendering video...");
    const outputPath = path.join(outputDir, `short-${Date.now()}.mp4`);

    await renderMedia({
      composition: compositionId,
      serveUrl: bundled,
      codec: "h264",
      outPath: outputPath,
      inputProps: {
        // You can pass your custom props here
        videoData: {
          text: "Hello World",
          images: ["./assets/image1.png"],
        },
      },
    });

    console.log(`✅ Render complete! Saved at: ${outputPath}`);
  } catch (err) {
    console.error("❌ Render failed:", err);
  }
}

renderVideo();
