import React from "react";
import { Play, Sparkles, Wand2 } from "lucide-react";

// --- MOCK DATA ---
const sliderImages = [
  { src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop", alt: "Social Media Dashboard" },
  { src: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop", alt: "Video Editing" },
  { src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=1000&auto=format&fit=crop", alt: "Creative Studio" },
      { src: "/realistic.webp", alt: "slide1" },
    { src: "/slide1.png", alt: "slide1" },
    { src: "/slide2.jpg", alt: "slide2" },
    { src: "/slide3.jpg", alt: "slide3" },
    { src: "/slide4.jpg", alt: "slide4" },
    { src: "/slide5.png", alt: "slide5" },
];

// --- INJECTED STYLES ---
// This ensures the animation works without needing to update tailwind.config.js
const styleTag = `
@keyframes slide-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-slide-infinite {
  animation: slide-left 40s linear infinite;
}
/* Pause animation on hover for better UX */
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
  // We duplicate the images once. 
  // The CSS animation slides the whole container -50% of its width.
  // Since the content is exactly doubled, the -50% point looks identical to the 0% point, creating a seamless loop.
  const infiniteImages = [...sliderImages, ...sliderImages];

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-yellow-500 selection:text-black">
      <style>{styleTag}</style>

      {/* 🔹 BACKGROUND LAYER (With Infinite Animation) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-black/70 z-20 pointer-events-none" /> {/* Darken images */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-20 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-20 pointer-events-none opacity-80" />

        {/* The Infinite Slider Container */}
        <div className="flex h-full items-center">
          {/* w-max: Ensures container takes up width of all images
            animate-slide-infinite: The custom CSS animation defined above
          */}
          <div className="flex w-max animate-slide-infinite">
            {infiniteImages.map((image, index) => (
              <div key={index} className="flex-shrink-0 mx-3 md:mx-4">
                <img
                  src={image.src}
                  alt={image.alt}
                  // Matches your original request for size, but made responsive
                  className="w-[200px] h-[350px] md:w-[300px] md:h-[500px] object-cover rounded-xl border border-white/10 shadow-2xl opacity-60 hover:opacity-100 transition-opacity duration-500"
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
        <div className="animate-float mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg shadow-yellow-500/10">
          <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium text-gray-200 tracking-wide">#1 AI Video Generator</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6 drop-shadow-2xl">
          Create Stunning <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Shorts & Reels
          </span>
        </h1>

        {/* Subheading with Brand Highlight */}
        <h2 className="text-2xl md:text-4xl font-light text-gray-300 mb-8">
          with AI powered <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 drop-shadow-sm">MritX SG</span>
        </h2>

        {/* Description Paragraph */}
        <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Turn simple text into viral content. Our AI generates scripts, visualizes scenes, 
          and adds professional voiceovers in seconds.
        </p>

        {/* 🔹 CTA BUTTONS AREA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            
            {/* Primary Button */}
            <button className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full font-bold text-black text-lg shadow-[0_0_40px_-10px_rgba(255,193,7,0.5)] hover:shadow-[0_0_60px_-10px_rgba(255,193,7,0.7)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Wand2 className="w-5 h-5" />
                Start Creating for Free
              </span>
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
            </button>

            {/* Secondary Button */}
            <button className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2 group">
              <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
        </div>

        {/* Features / Social Proof */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 text-center opacity-60">
           <div className="flex flex-col items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold text-white">10k+</span>
              <span className="text-xs md:text-sm uppercase tracking-widest">Creators</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold text-white">5M+</span>
              <span className="text-xs md:text-sm uppercase tracking-widest">Videos Generated</span>
           </div>
           <div className="hidden md:flex flex-col items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold text-white">4.9/5</span>
              <span className="text-xs md:text-sm uppercase tracking-widest">User Rating</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;