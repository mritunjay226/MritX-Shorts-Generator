'use client';
import React, { useRef, useState } from "react";
import { Music, Play, Pause, Volume2 } from "lucide-react";
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
    <div className="transition-all duration-300">
      
      {/* Header */}
      <h2 className='flex items-center gap-2 font-semibold text-lg text-zinc-900 dark:text-white mb-1'>
        <span className='p-1.5 rounded-md bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400'>
            <Music className="w-4 h-4" />
        </span>
        Background Music
      </h2>
      <p className='text-sm text-zinc-500 dark:text-gray-400 ml-9 mb-4'>
        Choose a vibe for your video (Optional).
      </p>

      <ScrollArea className="h-[300px] w-full pr-4">
        <div className="flex flex-col gap-3">
          {BgMusics.map((music, index) => {
            const isSelected = selectedMusic === index;
            const isPlaying = playingIndex === index;

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 
                  ${isSelected
                    // Selected State
                    ? "bg-yellow-50 border-yellow-500 ring-1 ring-yellow-500 dark:bg-yellow-500/10 dark:border-yellow-500"
                    // Default State
                    : "bg-white border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700"
                  }`}
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  
                  {/* Play / Pause Button */}
                  <button
                    onClick={() => togglePlay(index)}
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors
                        ${isPlaying
                            ? "bg-yellow-500 text-black shadow-md"
                            : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                        }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  {/* Track Name & Visualizer */}
                  <div className="flex flex-col justify-center min-w-0">
                    <h3 className={`text-sm font-medium truncate transition-colors
                        ${isSelected ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300"}`}>
                      {music.name}
                    </h3>
                    
                    {isPlaying && (
                        <div className="flex gap-0.5 mt-1 h-3 items-end">
                            <span className="w-0.5 bg-yellow-500 animate-[music-bar_0.6s_ease-in-out_infinite]" />
                            <span className="w-0.5 bg-yellow-500 animate-[music-bar_0.8s_ease-in-out_infinite_0.1s]" />
                            <span className="w-0.5 bg-yellow-500 animate-[music-bar_0.5s_ease-in-out_infinite_0.2s]" />
                            <span className="w-0.5 bg-yellow-500 animate-[music-bar_0.7s_ease-in-out_infinite_0.3s]" />
                            <span className="text-[10px] text-yellow-600 dark:text-yellow-400 ml-1 font-medium">Playing</span>
                        </div>
                    )}
                  </div>
                </div>

                {/* Select Button */}
                <button
                    onClick={() => {
                        setSelectedMusic(index);
                        onHandleInputChange("bgMusic", music);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all
                        ${isSelected 
                            ? "bg-yellow-500 text-black shadow-sm" 
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        }`}
                >
                    {isSelected ? 'Selected' : 'Select'}
                </button>

                {/* Hidden Audio Element */}
                <audio
                  ref={(el) => (audioRefs.current[index] = el)}
                  src={music.src}
                  onEnded={() => setPlayingIndex(null)}
                />
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      <style jsx>{`
        @keyframes music-bar {
            0%, 100% { height: 4px; }
            50% { height: 12px; }
        }
      `}</style>
    </div>
  );
};

export default BgMusic;