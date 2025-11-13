const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const generateScript = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `Write a two different script for 30 to 45 Seconds video on Topic: {topic} in Hinglish. 
Do not add Scene description.
Do not add speaker names or narrator info.
Do not add anything in braces. 
Just return plain story text. 
after that give me json array of objects with each object containing "content" and "mood" keys.
The "content" key should have the script content for each scene and the "mood" key should have the mood of that particular script.
Make sure the total script is of 30 seconds only.
Give me response in JSON format as:
{
  "scripts": [
    { "content": "..." , mood: "..."},
    { "content": "..." , mood: "..."}
  ]
}`,
        },
      ],
    },
  ],
});

export const generateImagePrompt = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        { text: "Generate Image prompt of Cinematic style woth all details for each scene for 30 seconds video : script: Rosa Parks refused to give up her seat on a bus in 1955.Her quite act of defiance sparked the Montgomery Bus Boycott, a pivotal moment in the Civil Rights Movement. One person's bravery can inspire lasting change for everyone." }
      ]
    },
    {
      role: "model",
      parts: [
        { text: "```json\n[\n  {\n    \"imagePrompt\": \"A dimly lit interior of a 1950s public bus, filled with passengers. The seats are upholstered in a patterned fabric, and natural light filters through the windows. Focus on the expressions and period-appropriate clothing of the passengers, showing a mix of everyday life and subtle tension.\",\n    \"scriptContent\": \"Sample script content here.\"\n  }\n]\n```" }
      ]
    }
  ]
})
