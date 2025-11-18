"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Film, Image as ImageIcon, Sparkles, Play, ArrowRight, Video, Layers, Wand2, Music, Scissors, Zap } from "lucide-react";

import { useRouter } from "next/navigation";

export default function CreateNewVideo() {
  const router = useRouter();
  
  // Generate random starting positions for the icons on mount
  // We use a fixed count of "flies"
  const flyCount = 15;
  const icons = [Film, Video, ImageIcon, Music, Sparkles, Layers, Wand2, Scissors, Play, Zap];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center p-6 selection:bg-yellow-500/30">
      
      {/* 🔹 FLYING ICONS BACKGROUND (The "Flies") */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(flyCount)].map((_, i) => (
            <FlyingIcon key={i} Icon={icons[i % icons.length]} index={i} />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <div className="relative p-3 rounded-full border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)]">
              <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
            Create Your <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Next Viral Video
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Choose your preferred workflow to bring your story to life.
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
          <VideoCard
            title="Image to Video"
            description="Transform static images into cinematic videos with AI-powered narration and smooth transitions."
            icon={ImageIcon}
            accentColor="gold"
            route="/create-new-video/ImageBased"
            router={router}
            delay={0.1}
            features={["AI Narration", "Auto Transitions", "Music Sync"]}
          />

          <VideoCard
            title="Clip Compilation"
            description="Combine raw video clips into professional highlight reels with seamless editing and smart effects."
            icon={Film}
            accentColor="orange"
            route="/create-new-video/ClipBased"
            router={router}
            delay={0.2}
            features={["Smart Cuts", "Auto Editing", "Dynamic Effects"]}
          />
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
    </div>
  );
}

// --- Sub-Components ---

function FlyingIcon({ Icon, index }) {
    // Generate random movement paths
    return (
        <motion.div
            initial={{ 
                x: Math.random() * 1000, // Random start
                y: Math.random() * 1000,
                opacity: 0,
                scale: 0
            }}
            animate={{ 
                x: [null, Math.random() * 1000, Math.random() * -100, Math.random() * 1000], // Wandering path
                y: [null, Math.random() * 800, Math.random() * 1000, Math.random() * -100],
                rotate: [0, 45, -45, 180, 0],
                opacity: [0, 0.1, 0.2, 0.1, 0], // Fade in/out naturally
                scale: [0.5, 1, 0.8, 1.2, 0.5]
            }}
            transition={{ 
                duration: Math.random() * 20 + 20, // Very slow, varying duration (20-40s)
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.5 // Stagger start times
            }}
            className="absolute z-0"
        >
            <Icon className="w-8 h-8 md:w-12 md:h-12 text-yellow-500/10" />
        </motion.div>
    )
}

function VideoCard({ title, description, icon: Icon, accentColor, route, router, delay, features }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 20 });

  const colors = {
    gold: {
      gradient: "from-yellow-500 to-amber-600",
      glow: "bg-yellow-500/20",
      border: "border-yellow-500/30",
      text: "text-yellow-400",
      bg: "group-hover:shadow-yellow-500/20",
      iconBg: "text-yellow-500"
    },
    orange: {
      gradient: "from-orange-500 to-red-600",
      glow: "bg-orange-500/20",
      border: "border-orange-500/30",
      text: "text-orange-400",
      bg: "group-hover:shadow-orange-500/20",
      iconBg: "text-orange-500"
    },
  };

  const color = colors[accentColor];

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => router.push(route)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileTap={{ scale: 0.98 }}
      className={`relative cursor-pointer group h-full`}
    >
      {/* Perspective Container */}
      <div className="relative h-full bg-[#0a0a0a] backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden transition-all duration-500 group-hover:border-white/20 shadow-2xl">
        
        {/* Spotlight Gradient Follower */}
        <motion.div 
            className="absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
            style={{
                background: `radial-gradient(600px circle at ${useTransform(mouseX, v => (v + 0.5) * 100).get()}% ${useTransform(mouseY, v => (v + 0.5) * 100).get()}%, rgba(255,255,255,0.04), transparent 40%)`
            }}
        />

        <div className="relative p-8 flex flex-col h-full z-10">
          
          {/* Icon Area */}
          <div className="mb-8 flex items-center justify-between">
             {/* Animated Icon Container */}
            <div className={`relative w-16 h-16 flex items-center justify-center rounded-2xl ${color.glow} border ${color.border} backdrop-blur-sm overflow-hidden`}>
                <motion.div
                    animate={{
                        rotate: isHovered ? 15 : 0,
                        scale: isHovered ? 1.1 : 1
                    }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <Icon className={`w-8 h-8 ${color.text}`} strokeWidth={1.5} />
                </motion.div>
                
                {/* Shine Effect */}
                <motion.div
                    animate={{
                        x: isHovered ? ["100%", "-100%"] : "100%"
                    }}
                    transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                />
            </div>
            
            <motion.div 
                animate={{ x: isHovered ? 5 : 0 }}
                className={`p-2 rounded-full border border-white/5 bg-white/5 text-white/50 group-hover:text-white transition-colors`}
            >
                <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Text Content */}
          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-yellow-200 transition-all">
              {title}
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 group-hover:text-gray-300 transition-colors">
              {description}
            </p>
          </div>

          {/* Features Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {features.map((feature, i) => (
              <div 
                key={i}
                className={`px-3 py-1 rounded-full text-xs font-medium border border-white/5 bg-white/5 text-gray-400 group-hover:border-white/10 group-hover:text-white transition-colors`}
              >
                {feature}
              </div>
            ))}
          </div>
          
          {/* Bottom Highlight Lines */}
          <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${color.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </div>
      </div>
    </motion.div>
  );
}