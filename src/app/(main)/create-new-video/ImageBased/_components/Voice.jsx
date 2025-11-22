'use client';
import React, { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { AudioLines, Play, Mic } from 'lucide-react'
import Image from 'next/image';

const voiceOptions = [
  { value: "28ca2041-5dda-42df-8123-f58ea9c3da00", name: "Palak", langIcon: "indiaFlag.svg" },
  { value: "faf0731e-dfb9-4cfc-8119-259a79b27e12", name: "Riya", langIcon: "indiaFlag.svg" },
  { value: "be79f378-47fe-4f9c-b92b-f02cefa62ccf", name: "Sunil", langIcon: "indiaFlag.svg" },
  { value: "bdab08ad-4137-4548-b9db-6142854c7525", name: "Imran", langIcon: "indiaFlag.svg" },
  { value: "694f9389-aac1-45b6-b726-9d9369183238", name: "Sarah", langIcon: "usFlag.svg" },
  { value: "hm_omega", name: "Omega (Male)", langIcon: "indiaFlag.svg" },
  { value: "hm_psi", name: "Psi (Male)", langIcon: "indiaFlag.svg" },
  { value: "am_echo", name: "Echo (Male)", langIcon: "usFlag.svg" },
  { value: "am_eric", name: "Eric (Male)", langIcon: "usFlag.svg" },
  { value: "am_fenrir", name: "Fenrir (Male)", langIcon: "usFlag.svg" },
  { value: "am_liam", name: "Liam (Male)", langIcon: "usFlag.svg" },
  { value: "am_michael", name: "Michael (Male)", langIcon: "usFlag.svg" },
  { value: "am_onyx", name: "Onyx (Male)", langIcon: "usFlag.svg" },
];

const Voice = ({ onHandleInputChange }) => {
  const [selectedVoice, setSelectedVoice] = useState(null);

  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice.value);
    onHandleInputChange("voice", voice.value);
  };

  return (
    <div className='transition-all duration-300'>
      
      {/* Header */}
      <h2 className='flex items-center gap-2 font-semibold text-lg text-zinc-900 dark:text-white mb-1'>
        <span className='p-1.5 rounded-md bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'>
            <AudioLines className="w-4 h-4" />
        </span>
        Video Voice
      </h2>
      <p className='text-sm text-zinc-500 dark:text-gray-400 ml-9 mb-4'>
        Select the AI narrator for your video.
      </p>

      {/* Scrollable List */}
      <ScrollArea className="h-[280px] w-full pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {voiceOptions.map((voice, index) => {
            const isSelected = selectedVoice === voice.value;
            
            return (
              <div
                key={index}
                onClick={() => handleVoiceSelect(voice)}
                className={`relative group flex items-center p-3 rounded-xl cursor-pointer border transition-all duration-200
                  ${isSelected
                    // Selected State
                    ? "bg-yellow-50 border-yellow-500 ring-1 ring-yellow-500 dark:bg-yellow-500/10 dark:border-yellow-500"
                    // Default State
                    : "bg-white border-zinc-200 hover:border-yellow-400 hover:shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700"
                  }`}
              >
                
                {/* Play Button Placeholder */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-colors
                    ${isSelected 
                        ? "bg-yellow-200 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400" 
                        : "bg-zinc-100 text-zinc-400 group-hover:bg-yellow-50 group-hover:text-yellow-600 dark:bg-zinc-800 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                    }`}>
                   {isSelected ? <Mic className="w-5 h-5" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </div>

                {/* Voice Details */}
                <div className="flex flex-col">
                    <h3 className={`text-sm font-semibold transition-colors flex items-center gap-2
                        ${isSelected ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300"}`}>
                        {voice.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        {/* Flag Icon - Ensure these files exist in public/ folder */}
                        <div className="relative w-4 h-4 rounded-full overflow-hidden border border-black/10">
                            <Image
                                src={`/${voice.langIcon}`}
                                alt="Lang"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-500">
                            {voice.langIcon.includes('india') ? 'Hindi/English' : 'English (US)'}
                        </span>
                    </div>
                </div>

                {/* Active Indicator Dot */}
                {isSelected && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                )}

              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Voice;