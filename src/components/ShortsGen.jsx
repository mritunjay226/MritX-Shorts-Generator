'use client';
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, Wand2, Zap, Play, Image, Video, FileText, Mic, Palette, Music, Brain, Hash, TrendingUp, Captions, Pause } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const STEPS = [
  { id: 1, icon: Image, label: "Upload Content", color: "pink", description: "Analyzing your content..." },
  { id: 2, icon: Brain, label: "AI Processing", color: "amber", description: "Understanding themes..." },
  { id: 3, icon: Hash, label: "Trend Analysis", color: "orange", description: "Finding viral angles..." },
  { id: 4, icon: FileText, label: "Script Writing", color: "pink", description: "Creating engaging copy..." },
  { id: 5, icon: Mic, label: "Voice Over", color: "amber", description: "Recording narration..." },
  { id: 6, icon: Music, label: "Audio Mix", color: "orange", description: "Adding sound effects..." },
  { id: 7, icon: Captions, label: "Captions", color: "pink", description: "Syncing subtitles..." },
  { id: 8, icon: Palette, label: "Visual Effects", color: "amber", description: "Applying animations..." },
  { id: 9, icon: TrendingUp, label: "Video Ready", color: "orange", description: "Optimizing for upload..." },
];

// Explicit color mapping for Tailwind
const COLOR_VARIANTS = {
  pink: { bg: "bg-pink-400/40", from: "from-pink-600" },
  amber: { bg: "bg-amber-400/40", from: "from-amber-500" },
  orange: { bg: "bg-orange-400/40", from: "from-orange-500" },
};

export default function ShortsGen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  const { ref, isInView } = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (!isInView) {
        setIsVideoPlaying(false);
        return;
    }

    const interval = setInterval(() => {
      if (currentStep < STEPS.length) {
        setCurrentStep(prev => prev + 1);
      } else if (currentStep === STEPS.length && !showVideo) {
        setShowVideo(true);
        setTimeout(() => setIsVideoPlaying(true), 200);
        setTimeout(() => {
          setCurrentStep(0);
          setShowVideo(false);
          setIsVideoPlaying(false);
        }, 6000);
      }
    }, prefersReducedMotion ? 500 : 1000);

    return () => clearInterval(interval);
  }, [currentStep, showVideo, isInView, prefersReducedMotion]);

  return (
    <section 
        ref={ref} 
        className="relative min-h-screen mb-12 py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-4 overflow-hidden transition-colors duration-300
                   bg-zinc-50 dark:bg-black"
    >
      
      {/* --- UPDATED BACKGROUND (Matches FAQ Section) --- */}
      {/* Light Mode: Soft Yellow/Orange Wash. Dark Mode: Deep Glowing Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none 
                    bg-yellow-200/40 dark:bg-orange-500/5" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none 
                    bg-orange-200/40 dark:bg-yellow-500/5" />
      {/* ----------------------------------------------- */}

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6
                          bg-yellow-100 border border-yellow-200
                          dark:bg-yellow-500/10 dark:border-yellow-500/20">
            <Video className="text-yellow-600 dark:text-yellow-400" size={14} />
            <span className="text-yellow-700 dark:text-yellow-400 text-xs sm:text-sm font-semibold">YouTube Shorts Generator</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4 text-zinc-900 dark:text-white">
            Create Viral{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 dark:from-yellow-400 dark:via-orange-400 dark:to-red-500">
              Shorts in Minutes
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-zinc-600 dark:text-white/60">
            Transform your ideas into stunning TikTok and YouTube Shorts. Our AI handles the heavy lifting from concept to publication.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Left Side - Animation Container */}
          <div className="relative h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
            
            {/* Central Card */}
            <motion.div
              className="relative w-56 sm:w-64 md:w-72 h-[320px] sm:h-[380px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl 
                         border-2 bg-black
                         border-zinc-200 dark:border-yellow-500/30"
              animate={isInView ? {
                y: prefersReducedMotion ? 0 : [0, -20, 0],
                rotateY: showVideo ? [0, 360] : 0,
              } : {}}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 1 }
              }}
              style={{ 
                transformStyle: "preserve-3d",
                willChange: 'transform',
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Glow Effect */}
              <div 
                className={`absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl blur-lg 
                           ${isInView && (showVideo ? 'animate-pulse-fast' : 'animate-pulse')}`}
              />

              {/* Card Content */}
              <div className="relative w-full h-full bg-zinc-950">
                <AnimatePresence mode="wait">
                  {!showVideo ? (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-6"
                    >
                      <div className={`mb-4 ${isInView ? 'animate-spin-slow' : ''}`}>
                        <Wand2 className="text-yellow-400" size={48} />
                      </div>
                      <p className="text-white font-semibold text-lg mb-2">
                        {isInView ? 'Creating Magic...' : 'Ready to Create'}
                      </p>
                      <motion.p 
                        className="text-zinc-400 text-sm text-center"
                        key={currentStep}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {isInView ? (STEPS[currentStep - 1]?.description || "Initializing...") : "Scroll to start the magic"}
                      </motion.p>
                      
                      {/* Progress Bar */}
                      <div className="w-full mt-6">
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500 ease-out"
                            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                          />
                        </div>
                        <p className="text-zinc-500 text-xs mt-2 text-center">
                          Step {currentStep} of {STEPS.length}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      <video 
                        src="https://image01.cf.vidu.studio/vidu/landing-page/travel.a52da706.mp4"
                        autoPlay={isInView}
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      
                      <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                        {isVideoPlaying ? <Play className="text-white" size={20} /> : <Pause className="text-white" size={20} />}
                      </div>

                      <div className="absolute bottom-20 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
                        <p className="text-white text-sm font-bold text-center animate-pulse">
                          Auto-generated captions ✨
                        </p>
                      </div>

                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-2">
                        <Music className="text-yellow-400" size={16} />
                        <div className="flex gap-1">
                          {[4, 12, 4].map((h, i) => (
                            <div
                              key={i}
                              className="w-1 bg-yellow-400 rounded-full animate-music-bar"
                              style={{ 
                                height: h,
                                animationDelay: `${i * 120}ms`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Flying Icons */}
            <AnimatePresence mode="wait">
              {STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === index + 1;
                
                if (!isActive || prefersReducedMotion) return null;
                const fromLeft = index % 2 === 0;
                // Get safe colors
                const colors = COLOR_VARIANTS[step.color] || COLOR_VARIANTS.amber;

                return (
                  <motion.div
                    key={step.id}
                    className="absolute z-20"
                    initial={{ x: fromLeft ? -200 : 200, y: -50, scale: 0, opacity: 0 }}
                    animate={{ x: 0, y: 0, scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <div className="relative">
                      <div className={`absolute -inset-4 ${colors.bg} rounded-full blur-xl`} />
                      
                      <div className={`relative w-20 h-20 bg-gradient-to-br from-yellow-400 ${colors.from} rounded-2xl flex items-center justify-center shadow-2xl`}>
                        <StepIcon className="text-black" size={36} />
                      </div>

                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="text-white text-sm font-bold bg-gradient-to-r from-pink-600 to-amber-600 px-4 py-2 rounded-full shadow-lg border border-white/20">
                          {step.label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Celebration Burst */}
            {showVideo && !prefersReducedMotion && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => {
                  const angle = (i * Math.PI * 2) / 6;
                  return (
                    <div
                      key={i}
                      className="absolute left-1/2 top-1/2 animate-burst"
                      style={{
                        transform: `translate(${Math.cos(angle) * 200}px, ${Math.sin(angle) * 200}px)`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    >
                      <Zap className="text-yellow-500" size={24} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Side - Content */}
          <motion.div
            className="space-y-5 sm:space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-zinc-900 dark:text-white">
                Professional Shorts{" "}
                <span className="text-yellow-600 dark:text-yellow-400">Made Easy</span>
              </h3>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-zinc-600 dark:text-white/60">
                No editing experience needed. Let our AI handle scriptwriting, voiceovers, music selection, and effects. Focus on your idea, we handle the production.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-zinc-800 dark:text-white">From Concept to Ready-to-Upload</h4>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-white/70">
                Simply upload your idea, footage, or even a rough concept. Our AI analyzes your content and automatically generates a complete, polished short through 9 intelligent production steps.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-white/70">
                Get a production-ready short optimized for TikTok, YouTube Shorts, and Instagram Reels. Every element—from pacing to trending sounds—is calibrated for maximum virality and viewer engagement.
              </p>
            </div>

            <motion.button
              className="group relative w-full px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-black overflow-hidden mt-4 sm:mt-6 shadow-lg shadow-orange-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg">
                <Sparkles size={18} />
                Create Your First Short
                <Zap size={18} />
              </span>
            </motion.button>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-zinc-200 dark:border-white/10">
              {[
                { label: "Shorts Created", value: "50K+" },
                { label: "Avg Views", value: "1.8M" },
                { label: "Users Love It", value: "98%" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm mt-1 text-zinc-500 dark:text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}