"use client";
import { useState } from "react";

import axios from "axios";
import CharacterSelector from "./_components/CharacterSelecter";
import NarrationToggle from "./_components/NarrationToggle";
import VideoProgress from "./_components/VideoProgress";

const demoCharacters = [
  {
    id: "char_baan_001",
    name: "Baan",
    description:
      "a cute baby monkey in brown shirt and shorts, cartoon style, expressive face",
    referenceImage: "https://res.cloudinary.com/diah8zonu/image/upload/v1763008061/059dc961-dfb5-4947-b444-0957356947c4_ougycx.jpg",
  },
  {
    id: "char_milo_001",
    name: "Milo",
    description:
      "a cheerful panda with red scarf, cartoon cinematic lighting",
    referenceImage: "https://res.cloudinary.com/diah8zonu/image/upload/v1763008096/88e659c4-3844-4117-ad79-6d29388e72aa_eg1nhm.png",
  },
];

export default function CreatePage() {
  const [character, setCharacter] = useState(null);
  const [idea, setIdea] = useState("");
  const [tone, setTone] = useState("funny");
  const [narration, setNarration] = useState(true);
  const [status, setStatus] = useState("idle");
  const [videoUrl, setVideoUrl] = useState("");

  async function handleGenerate() {
    if (!character || !idea)
      return alert("Please select a character and enter an idea!");

    setStatus("processing");

    try {
      // Send event to your Inngest backend (which runs the AI pipeline)
      await axios.post("/api/generate-charater-video-data", {
        name: "generate-character-video",
        data: {
          idea,
          tone,
          characterId: character.id,
          recordId: "rec_" + Date.now(),
          narration,
        },
      });

      // Temporary simulation
      setTimeout(() => {
        setStatus("completed");
        setVideoUrl("/demo/final.mp4"); // Replace with real Convex video URL
      }, 120000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10 text-white">
      <h1 className="text-2xl font-bold mb-6">🎬 Create a New AI Short</h1>

      <CharacterSelector characters={demoCharacters} onSelect={setCharacter} />

      <div className="mt-6 space-y-3">
        <label className="block text-sm font-semibold">Idea / Theme</label>
        <input
          type="text"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. Monkey fails but never gives up"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-gray-200"
        />

        <label className="block text-sm font-semibold">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-gray-200"
        >
          <option value="funny">Funny</option>
          <option value="motivational">Motivational</option>
          <option value="sad">Emotional</option>
          <option value="educational">Educational</option>
        </select>

        <NarrationToggle narration={narration} setNarration={setNarration} />
      </div>

      <button
        onClick={handleGenerate}
        className="mt-6 w-full py-3 bg-blue-600 rounded-xl hover:bg-blue-700 font-semibold"
      >
        Generate Short
      </button>

      <VideoProgress status={status} videoUrl={videoUrl} />
    </div>
  );
}
