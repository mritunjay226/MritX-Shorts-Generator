'use client';
import React, { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { AudioLines, PlayCircleIcon } from 'lucide-react'
import Image from 'next/image';

const voiceOptions = [
  { value: "28ca2041-5dda-42df-8123-f58ea9c3da00", name: "Palak" , langIcon: "indiaFlag.svg"},
  { value: "faf0731e-dfb9-4cfc-8119-259a79b27e12", name: "Riya" , langIcon: "indiaFlag.svg"},
  { value: "be79f378-47fe-4f9c-b92b-f02cefa62ccf", name: "Sunil" , langIcon: "indiaFlag.svg"},
  { value: "bdab08ad-4137-4548-b9db-6142854c7525", name: "Imran" , langIcon: "indiaFlag.svg" },
  { value: "694f9389-aac1-45b6-b726-9d9369183238", name: "Sarah" , langIcon: "usFlag.svg"},
  { value: "hm_omega", name: "🇮🇳 Omega (Male)" , langIcon: "indiaFlag.svg"},
  { value: "hm_psi", name: "🇮🇳 Psi (Male)" , langIcon: "indiaFlag.svg"},
  { value: "am_echo", name: "🇺🇸 Echo (Male)" , langIcon: "indiaFlag.svg"},
  { value: "am_eric", name: "🇺🇸 Eric (Male)" , langIcon: "indiaFlag.svg"},
  { value: "am_fenrir", name: "🇺🇸 Fenrir (Male)" , langIcon: "indiaFlag.svg"},
  { value: "am_liam", name: "🇺🇸 Liam (Male)" , langIcon: "indiaFlag.svg"},
  { value: "am_michael", name: "🇺🇸 Michael (Male)" , langIcon: "indiaFlag.svg"},
  { value: "am_onyx", name: "🇺🇸 Onyx (Male)" , langIcon: "indiaFlag.svg"},
];

const Voice = ({ onHandleInputChange }) => {
  const [selectedVoice, setSelectedVoice] = useState(null);

  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice.value);
    onHandleInputChange("voice", voice.value);
    console.log("Selected Voice:", voice.value);
  };

  return (
    <div className="mt-8 p-4 border border-gray-800 rounded-xl">
      <h2 className="flex items-center gap-2">
        <AudioLines className="text-yellow-600" /> Video Voice
      </h2>
      <p className="text-sm text-gray-400 mb-3">
        Select voice for your video
      </p>

      <ScrollArea className="h-[200px] w-full">
        <div className="grid grid-cols-2 gap-3">
          {voiceOptions.map((voice, index) => {
            const isSelected = selectedVoice === voice.value;
            return (
              <div
                key={index}
                onClick={() => handleVoiceSelect(voice)}
                className={`flex items-center p-2 rounded-lg cursor-pointer transition-all border 
                  ${isSelected
                    ? "border-pink-400 bg-gradient-to-r from-pink-400/20 to-purple-500/20"
                    : "border-transparent bg-zinc-800 hover:border-gray-600"
                  }`}
              >
                <span className="bg-black rounded-lg flex justify-center items-center p-4">
                  <PlayCircleIcon className={`${isSelected ? "text-pink-400" : "text-gray-300"}`} />
                </span>
                <h2
                  className={`cursor-pointer p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    isSelected ? "text-pink-400" : "text-gray-200"
                  }`}
                >
                  <Image
                    src={`/${voice.langIcon}`}
                    alt={voice.name}
                    width={20}
                    height={20}
                  />
                  {voice.name}
                </h2>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Voice;
