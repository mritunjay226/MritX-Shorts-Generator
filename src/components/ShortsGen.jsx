'use client';
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, Wand2, Zap, Play, Image, Video, FileText, Mic, Palette, Music, Brain, Hash, TrendingUp, Captions, Pause } from "lucide-react";

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

export default function ShortsGen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  // Detect when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);
        
        // Start animation only once when it comes into view
        if (inView && !hasStarted) {
          setHasStarted(true);
        }
        
        // Reset when out of view for fresh start next time
        if (!inView && hasStarted) {
          setCurrentStep(0);
          setShowVideo(false);
          setIsVideoPlaying(false);
          setHasStarted(false);
        }
      },
      { threshold: 0.3 } // Requires 30% visibility to start
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, [hasStarted]);

  // Animation loop - only runs when in view AND has started
  useEffect(() => {
    if (!isInView || !hasStarted) return;

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
        }, 2000);
      }
    }, prefersReducedMotion ? 500 : 1000);

    return () => clearInterval(interval);
  }, [currentStep, showVideo, isInView, hasStarted, prefersReducedMotion]);

  // Memoize sparkles to prevent re-renders
  const sparklePositions = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      x: Math.cos((i * Math.PI * 2) / 8) * 200,
      y: Math.sin((i * Math.PI * 2) / 8) * 200,
    })), []
  );

  return (
    <section ref={sectionRef} className="relative min-h-screen mb-12 bg-black py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-4 overflow-hidden">
      {/* Simplified Background - CSS only */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse-slow-delayed" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4 sm:mb-6">
            <Video className="text-yellow-400" size={14} />
            <span className="text-yellow-400 text-xs sm:text-sm font-semibold">YouTube Shorts Generator</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            Create Viral{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500">
              Shorts in Minutes
            </span>
          </h2>
          <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into stunning TikTok and YouTube Shorts. Our AI handles the heavy lifting from concept to publication.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Left Side - Optimized Animation */}
          <div className="relative h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
            
            {/* Central Card - GPU Accelerated */}
            <motion.div
              className="relative w-56 sm:w-64 md:w-72 h-[320px] sm:h-[380px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-500/30"
              animate={isInView && hasStarted ? {
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
              {/* Simplified Glow - CSS animation */}
              <div 
                className={`absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl blur-lg ${hasStarted && (showVideo ? 'animate-pulse-fast' : 'animate-pulse')}`}
              />

              {/* Card Content */}
              <div className="relative w-full h-full bg-gradient-to-br from-zinc-900 to-black">
                <AnimatePresence mode="wait">
                  {!showVideo ? (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-6"
                    >
                      <div className={`mb-4 ${hasStarted ? 'animate-spin-slow' : ''}`}>
                        <Wand2 className="text-yellow-400" size={48} />
                      </div>
                      <p className="text-white font-semibold text-lg mb-2">
                        {hasStarted ? 'Creating Magic...' : 'Ready to Create'}
                      </p>
                      <motion.p 
                        className="text-white/60 text-sm text-center"
                        key={currentStep}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {hasStarted ? (STEPS[currentStep - 1]?.description || "Initializing...") : "Scroll to start the magic"}
                      </motion.p>
                      
                      {/* Optimized Progress Bar */}
                      <div className="w-full mt-6">
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500 ease-out"
                            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                          />
                        </div>
                        <p className="text-white/40 text-xs mt-2 text-center">
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
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Video Indicator */}
                      <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                        {isVideoPlaying ? <Play className="text-white" size={20} /> : <Pause className="text-white" size={20} />}
                      </div>

                      {/* Captions */}
                      <div className="absolute bottom-20 left-4 right-4 bg-black/80 rounded-lg p-3">
                        <p className="text-white text-sm font-bold text-center animate-pulse">
                          Auto-generated captions ✨
                        </p>
                      </div>

                      {/* Music Indicator - Simplified */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 rounded-full px-3 py-2">
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

                      {/* Hashtags */}
                      <div className="absolute top-16 left-4 right-4 flex flex-wrap gap-2">
                        {["#viral", "#trending", "#ai"].map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full border border-yellow-400/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
                        <Video size={20} />
                        <span className="font-semibold">Video Created!</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Optimized Flying Icons - Only current step */}
            <AnimatePresence mode="wait">
              {STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === index + 1;
                
                if (!isActive || prefersReducedMotion) return null;

                const fromLeft = index % 2 === 0;

                return (
                  <motion.div
                    key={step.id}
                    className="absolute z-20"
                    initial={{
                      x: fromLeft ? -200 : 200,
                      y: -50,
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: 0,
                      y: 0,
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                    }}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <div className="relative">
                      {/* Simplified Glow */}
                      <div className={`absolute -inset-4 bg-${step.color}-400/40 rounded-full blur-xl`} />
                      
                      {/* Icon Container */}
                      <div className={`relative w-20 h-20 bg-gradient-to-br from-yellow-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl`}>
                        <StepIcon className="text-black" size={36} />
                      </div>

                      {/* Label */}
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="text-white text-sm font-bold bg-gradient-to-r from-pink-500/80 to-amber-500/80 px-4 py-2 rounded-full shadow-lg border border-yellow-400/30">
                          {step.label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Simplified Sparkles - Fewer, CSS animated */}
            {!prefersReducedMotion && sparklePositions.slice(0, 4).map((pos, i) => (
              <div
                key={i}
                className="absolute animate-sparkle"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                
              </div>
            ))}

            {/* Simplified Celebration - Only when video shows */}
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
                      <Zap className="text-yellow-400" size={24} />
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
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
                Professional Shorts{" "}
                <span className="text-yellow-400">Made Easy</span>
              </h3>
              <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed">
                No editing experience needed. Let our AI handle scriptwriting, voiceovers, music selection, and effects. Focus on your idea, we handle the production.
              </p>
            </div>

            {/* Process Description */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">From Concept to Ready-to-Upload</h4>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                Simply upload your idea, footage, or even a rough concept. Our AI analyzes your content and automatically generates a complete, polished short through 9 intelligent production steps.
              </p>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                Get a production-ready short optimized for TikTok, YouTube Shorts, and Instagram Reels. Every element—from pacing to trending sounds—is calibrated for maximum virality and viewer engagement.
              </p>
            </div>

            {/* CTA Button */}
            <motion.button
              className="group relative w-full px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-black overflow-hidden mt-4 sm:mt-6"
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6">
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
                  <div className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-xs sm:text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        
        @keyframes pulse-slow-delayed {
          0%, 100% { opacity: 0.5; transform: scale(1.3); }
          50% { opacity: 0.3; transform: scale(1); }
        }
        
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes burst {
          0% { opacity: 1; transform: scale(0); }
          100% { opacity: 0; transform: scale(1); }
        }
        
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-pulse-slow-delayed { animation: pulse-slow-delayed 6s ease-in-out infinite 1s; }
        .animate-pulse-fast { animation: pulse-fast 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 2s linear infinite; }
        .animate-music-bar { animation: music-bar 0.6s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 1.5s ease-out infinite; }
        .animate-burst { animation: burst 1s ease-out forwards; }
      `}</style>
    </section>
  );
}