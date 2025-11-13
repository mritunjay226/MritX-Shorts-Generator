'use client';
import React, { useRef, useState } from "react";
import { Music, PlayIcon, PauseIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const BgMusics = [
  { name: "Krishna Flute", src: "https://res.cloudinary.com/diah8zonu/video/upload/v1761585236/relaxing-krishna-flute-music-deep-sleep-relaxing-music-292793_nzpi4r.mp3" },
  { name: "Else - Paris", src: "https://strshrt.xyz/assets/66ae64e5d4dd8e5e64104ba5/audio.mp3" },
  { name: "Für Elise", src: "https://strshrt.xyz/assets/66ae6885d4dd8e5e64104c0e/audio.mp3" },
  { name: "Prelude in E minor (Op. 28 n°4)", src: "https://strshrt.xyz/assets/66ae68ffd4dd8e5e64104c1f/audio.mp3" },
  { name: "Eureka", src: "https://strshrt.xyz/assets/66ae69c7d4dd8e5e64104c4f/audio.mp3" },
  { name: "Tension In The Air", src: "https://strshrt.xyz/assets/66afca68de27265b798d657e/audio.mp3" },
  { name: "Winter", src: "https://strshrt.xyz/assets/66afcc96de27265b798d6587/audio.mp3" },
  { name: "Bladerunner 2049", src: "https://strshrt.xyz/assets/66aa0e918347bec8eceb96df/audio.mp3" },
  { name: "Snowfall", src: "https://strshrt.xyz/assets/66aa0fb28347bec8eceb96e3/audio.mp3" },
  { name: "Another love", src: "https://strshrt.xyz/assets/66aa10418347bec8eceb96f1/audio.mp3" },
  { name: "String Arpeggios", src: "https://strshrt.xyz/assets/66ae6590d4dd8e5e64104bc6/audio.mp3" },
];

const BgMusic = ({ onHandleInputChange }) => {
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const audioRefs = useRef([]);

  const togglePlay = (index) => {
    const currentAudio = audioRefs.current[index];

    // Pause all other audios
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== index) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    if (playingIndex === index) {
      currentAudio.pause();
      setPlayingIndex(null);
    } else {
      currentAudio.play();
      setPlayingIndex(index);
    }
  };

  return (
    <div className="mt-8 p-4 border border-gray-800 rounded-xl">
      <h2 className="flex items-center gap-2 mb-1">
        <Music className="text-orange-600" /> Background Music (Optional)
      </h2>
      <p className="text-sm text-gray-400 mb-3">
        Select background music for your video
      </p>

      <ScrollArea className="h-[300px] w-full">
        <div className="flex flex-col gap-3">
          {BgMusics.map((music, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border border-gray-800 transition-all ${
                selectedMusic === index
                  ? "bg-gradient-to-r from-pink-400/30 to-purple-500/30"
                  : "bg-zinc-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Play / Pause Button */}
                <button
                  onClick={() => togglePlay(index)}
                  className="cursor-pointer"
                >
                  {playingIndex === index ? (
                    <PauseIcon className="text-pink-500" />
                  ) : (
                    <PlayIcon className="text-gray-300" />
                  )}
                </button>

                {/* Track Name */}
                <h3
                  className={`text-sm ${
                    selectedMusic === index
                      ? "text-pink-400 font-semibold"
                      : "text-gray-100"
                  }`}
                >
                  {music.name}
                </h3>
              </div>

              {/* Select Button */}
              {selectedMusic === index ? (
                <span className="p-1 border border-gray-600 rounded-lg text-sm text-pink-400 cursor-pointer">
                  Selected
                </span>
              ) : (
                <span
                  className="p-1 border border-gray-600 bg-black rounded-lg text-sm text-gray-100 cursor-pointer hover:bg-gray-900"
                  onClick={() => {
                    setSelectedMusic(index);
                    onHandleInputChange("bgMusic", music);
                  }}
                >
                  Select
                </span>
              )}

              {/* Hidden Audio Element */}
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={music.src}
                onEnded={() => setPlayingIndex(null)}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BgMusic;
