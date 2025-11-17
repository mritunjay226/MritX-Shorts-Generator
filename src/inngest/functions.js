import axios from "axios";
import { inngest } from "./client";
import { createClient } from "@deepgram/sdk";
import { generateImagePrompt } from "@/configs/AiModel";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { getServices, renderMediaOnCloudrun } from '@remotion/cloudrun/client';

const ImagePromptScript = `Generate Image prompt of {style} style woth all details for each scene for 30 seconds video : script: {script} 
- Just Give specifing image prompt depends on the story line
- do not give camera angle umage prompt
- Follow the following schema and return JSON data (Max 4-5 Images)
- [
    {
        imagePrompt:'',
        sceneContent: ' <Script Content>'
    }
]`

const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY;

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.email}!` };
    },
);

const BASE_URL = 'https://aigurulab.tech';

export const GenerateVideoData = inngest.createFunction(
    { id: "generate-video-data" },
    { event: "generate-video-data" },
    async ({ event, step }) => {

        const { script, topic, title, caption, videoStyle, voice, recordId } = event?.data
        const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

        // Generate Audio File
            const GenerateAudioFile = await step.run(
            "GenerateAudioFile",
            async () => {
                try {
                    const response = await axios.post(
                        "https://api.cartesia.ai/tts/bytes",
                        {
                            model_id: "sonic-2",
                            transcript: script, // <-- your input text
                            voice: {
                                mode: "id",
                                id: voice, // <-- voice ID from input (e.g. "6ccbfb76-1fc6-48f7-b71d-91ac6298247b")
                            },
                            output_format: {
                                container: "mp3",
                                encoding: "mp3",
                                sample_rate: 44100,
                            },
                            speed: "normal",
                        },
                        {
                            headers: {
                                "X-API-Key": CARTESIA_API_KEY,
                                "Cartesia-Version": "2024-06-10",
                                "Content-Type": "application/json",
                            },
                            responseType: "arraybuffer", // Important: receive audio as bytes
                        }
                    );

                    // Convert the binary audio data to base64
                    const audioBase64 = Buffer.from(response.data, "binary").toString("base64");

                    // Return it as a base64 data URL (for Remotion, Firebase, etc.)
                    const audioUrl = `data:audio/mp3;base64,${audioBase64}`;
                    return audioUrl;
                } catch (error) {
                    console.error("Cartesia TTS Error:", error.response?.data || error.message);
                    return null;
                }
            }
        );





        // // Generate Caption
        // const GenerateCaptions = await step.run(
        //     "generateCaptions",
        //     async () => {
        //         const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);

        //         // STEP 2: Call the transcribeUrl method with the audio payload option
        //         const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
        //             {
        //                 url: GenerateAudioFile,
        //             },
        //             // STEP 3: Configure Deepgram options for audio analysis
        //             {
        //                 model: "nova-3",
        //             }
        //         );

        //         return result.results?.channels[0]?.alternatives[0]?.words;
        //     }

        // )



        const GenerateCaptions = await step.run("generateCaptions", async () => {
            const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);

            // Remove data URL prefix to get raw base64
            const base64Data = GenerateAudioFile.replace(/^data:audio\/\w+;base64,/, "");
            const audioBuffer = Buffer.from(base64Data, "base64");

            // Transcribe raw audio buffer instead of URL
            const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
                audioBuffer,
                {
                    model: "nova-3",
                    smart_format: true,
                    detect_language: true,
                }
            );

            if (error) {
                console.error("Deepgram transcription error:", error);
                return null;
            }

            return result.results?.channels?.[0]?.alternatives?.[0]?.words || [];
        });




        // Generate Images Prompt using AI
        const GenerateImagePrompt = await step.run(
            "generateImagePrompt",
            async () => {
                const FINAL_PROMPT = ImagePromptScript
                    .replace('{style}', videoStyle).replace('{script}', script)
                const result = await generateImagePrompt.sendMessage(FINAL_PROMPT)
                const resp = JSON.parse(result.response.text())

                return resp;
            }
        )

        // Generate Images using the prompt generated above with AI
        const GenerateImages = await step.run(
            "generateImages",
            async () => {
                let images = [];
                images = await Promise.all(
                    GenerateImagePrompt.map(async (element) => {
                        const result = await axios.post(BASE_URL + '/api/generate-image',
                            {
                                width: 1024,
                                height: 1024,
                                input: element?.imagePrompt,
                                model: 'sdxl',//'flux'
                                aspectRatio: "1:1"//Applicable to Flux model only
                            },
                            {
                                headers: {
                                    'x-api-key': process.env.NEXT_PUBLIC_AIGURU_API_KEY, // Your API Key
                                    'Content-Type': 'application/json', // Content Type
                                },
                            })
                        console.log(result.data.image) //Output Result: Base 64 Image
                        return result.data.image;
                    })

                )
                return images
            }
        )

        // Save All Data to DB
        const UpdateDB = await step.run(
            "updateDB",
            async () => {
                const result = await convex.mutation(api.videoData.UpdateVideoRecord, {
                    recordId: recordId,
                    audioUrl: GenerateAudioFile,
                    captionJson: GenerateCaptions,
                    images: GenerateImages
                });
                return result;
            }
        )

        // // Trigger Remotion Cloud Run Render
        // const RenderVideo = await step.run(
        //     "renderVideo",
        //     async () => {
        //         const services = await getServices({
        //             region: 'us-east1',
        //             compatibleOnly: true,
        //         });

        //         const serviceName = services[0].serviceName;
        //         const result = await renderMediaOnCloudrun({
        //             serviceName,
        //             region: 'us-east1',
        //             serveUrl: process.env.GCP_SERVE_URL,
        //             composition: 'mritXShorts',
        //             inputProps: {
        //                 videoData: {
        //                     audioUrl: GenerateAudioFile,
        //                     captionJson: GenerateCaptions,
        //                     images: GenerateImages
        //                 }
        //             },
        //             codec: 'h264',

        //         });
        //         if (result.type === 'success') {
        //             console.log(result.bucketName)
        //             console.log(result.renderId)
        //         }
        //         return result?.publicUrl;
        //     })

        // const UpdateDownloadURL = await step.run(
        //     "updateDownloadURL",
        //     async () => {
        //         const result = await convex.mutation(api.videoData.UpdateVideoRecord, {
        //             recordId: recordId,
        //             audioUrl: GenerateAudioFile,
        //             captionJson: GenerateCaptions,
        //             images: GenerateImages,
        //             downloadUrl: RenderVideo
        //         });
        //         return result;
        //     }
        // )
        return "Process Completed Successfully";
    }
)