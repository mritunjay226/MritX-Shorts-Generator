'use client'

import React from "react";
import { Play, Sparkles, Wand2 } from "lucide-react";
// 1. Import the reusable hook
import { useInView } from "@/hooks/use-in-view";

// --- MOCK DATA ---
const sliderImages = [
  { src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop", alt: "Social Media Dashboard" },
  { src: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop", alt: "Video Editing" },
  { src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=1000&auto=format&fit=crop", alt: "Creative Studio" },
  { src: "https://images.unsplash.com/photo-1616461046183-f62780d4f879?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "AI Analysis" },
  { src: "https://images.unsplash.com/photo-1608874973277-a34ed4aba3f8?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Cyperpunk" },
  { src: "https://images.unsplash.com/photo-1676873261959-173b91552b0d?q=80&w=415&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Cartoon Art" },
  { src: "https://images.unsplash.com/photo-1666153184621-bc6445e3568d?q=80&w=357&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Cartoon Art" },
];

// --- INJECTED STYLES ---
const styleTag = `
@keyframes slide-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-slide-infinite {
  animation: slide-left 40s linear infinite;
}
.animate-slide-infinite:hover {
  animation-play-state: paused;
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
`;

const Hero = () => {
  const infiniteImages = [...sliderImages, ...sliderImages];

  // 2. Initialize the hook
  const { ref, isInView } = useInView({ threshold: 0 });

  return (
    <div className="relative w-full min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white overflow-hidden font-sans selection:bg-yellow-500 selection:text-black transition-colors duration-500">
      <style>{styleTag}</style>

      {/* 🔹 BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-white/30 dark:bg-black/40 z-20 pointer-events-none transition-colors duration-300" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-transparent to-gray-50 dark:from-black dark:via-transparent dark:to-black z-20 pointer-events-none transition-colors duration-300" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#f9fafb_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-20 pointer-events-none opacity-80 transition-colors duration-300" />

        {/* The Infinite Slider Container */}
        {/* 3. Attach the Ref here */}
        <div ref={ref} className="flex h-full items-center">
          <div 
            className="flex w-max animate-slide-infinite"
            // 4. Apply Logic: Pause if not in view. If in view, use 'undefined' so CSS :hover works.
            style={{ animationPlayState: isInView ? undefined : 'paused' }}
          >
            {infiniteImages.map((image, index) => (
              <div key={index} className="flex-shrink-0 mx-3 md:mx-4">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-[200px] h-[350px] md:w-[300px] md:h-[500px] object-cover rounded-xl 
                           border border-gray-200 dark:border-white/10 
                           shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-2xl 
                           opacity-80 dark:opacity-60 hover:opacity-100 
                           transition-all duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 FOREGROUND CONTENT */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-20 text-center w-full max-w-7xl mx-auto">
        
        {/* Floating Badge */}
        <div className="animate-float mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full 
                      bg-white/80 dark:bg-white/10 
                      border border-gray-200 dark:border-white/20 
                      backdrop-blur-md shadow-sm dark:shadow-lg shadow-yellow-500/10">
          <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
            #1 AI Video Generator
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6 drop-shadow-sm dark:drop-shadow-2xl transition-colors duration-300">
          Create Stunning <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r 
                         from-gray-900 via-gray-600 to-gray-400 
                         dark:from-white dark:via-gray-200 dark:to-gray-400">
            Shorts & Reels
          </span>
        </h1>

        {/* Subheading */}
        <h2 className="text-2xl md:text-4xl font-light text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300">
          with AI powered <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 dark:from-yellow-400 dark:via-orange-400 dark:to-red-500 drop-shadow-sm">MritX SG</span>
        </h2>

        {/* Description */}
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 transition-colors duration-300">
          Turn simple text into viral content. Our AI generates scripts, visualizes scenes, 
          and adds professional voiceovers in seconds.
        </p>

        {/* 🔹 CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            
            <button className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full font-bold text-black text-lg shadow-[0_10px_20px_-10px_rgba(255,193,7,0.5)] hover:shadow-[0_20px_30px_-10px_rgba(255,193,7,0.6)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Wand2 className="w-5 h-5" />
                Start Creating for Free
              </span>
              <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
            </button>

            <button className="w-full sm:w-auto px-8 py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 group
                             border border-gray-300 bg-white text-gray-900 hover:bg-gray-50
                             dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
              <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
        </div>

        {/* Features / Social Proof */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 text-center 
                      opacity-100 dark:opacity-60 transition-opacity duration-300">
           <div className="flex flex-col items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">10k+</span>
              <span className="text-xs md:text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">Creators</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">5M+</span>
              <span className="text-xs md:text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">Videos Generated</span>
           </div>
           <div className="hidden md:flex flex-col items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">4.9/5</span>
              <span className="text-xs md:text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">User Rating</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;