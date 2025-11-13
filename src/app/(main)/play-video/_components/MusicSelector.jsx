'use client';
import React, { useRef, useState, useEffect } from "react";
import { Music, Play, Pause } from "lucide-react";
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
  { name: "Another Love", src: "https://strshrt.xyz/assets/66aa10418347bec8eceb96f1/audio.mp3" },
  { name: "String Arpeggios", src: "https://strshrt.xyz/assets/66ae6590d4dd8e5e64104bc6/audio.mp3" },
];

const MusicSelector = ({ value, onChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const audioRefs = useRef([]);

  // Set selectedIndex based on current value (helpful when editing existing video)
  useEffect(() => {
    if (value?.src) {
      const idx = BgMusics.findIndex((m) => m.src === value.src);
      if (idx !== -1) setSelectedIndex(idx);
    }
  }, [value]);

  const togglePlay = (index) => {
    const currentAudio = audioRefs.current[index];
    if (!currentAudio) return;

    // Pause others
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

  const handleSelect = (music, index) => {
    setSelectedIndex(index);
    onChange(music); // sends full object { name, src }
  };

  return (
    <div className="mt-6 p-5 border border-gray-800 bg-zinc-900/60 rounded-2xl">
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-2">
        <Music className="text-pink-500" /> Background Music
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        Choose a soundtrack to enhance your video 🎶
      </p>

      <ScrollArea className="h-[300px] w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BgMusics.map((music, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer
                ${
                  selectedIndex === index
                    ? "border-pink-500/60 bg-gradient-to-r from-pink-500/10 to-purple-500/10"
                    : "border-gray-800 hover:border-gray-700 bg-zinc-800/60"
                }`}
            >
              <div className="flex items-center gap-3">
                {/* Play / Pause */}
                <button
                  onClick={() => togglePlay(index)}
                  className="p-2 rounded-full hover:bg-zinc-700/50 transition-all"
                >
                  {playingIndex === index ? (
                    <Pause className="text-pink-400 w-5 h-5" />
                  ) : (
                    <Play className="text-gray-300 w-5 h-5" />
                  )}
                </button>

                {/* Track Name */}
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      selectedIndex === index ? "text-pink-400" : "text-gray-100"
                    }`}
                  >
                    {music.name}
                  </h3>
                </div>
              </div>

              {/* Select / Selected Button */}
              {selectedIndex === index ? (
                <span className="px-3 py-1 text-sm rounded-lg border border-pink-400 text-pink-400">
                  Selected
                </span>
              ) : (
                <button
                  onClick={() => handleSelect(music, index)}
                  className="px-3 py-1 text-sm rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800/60 transition-all"
                >
                  Select
                </button>
              )}

              {/* Hidden Audio */}
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

export default MusicSelector;
