"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { Film, Image, Sparkles, Play, Zap } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";

export default function CreateNewVideo() {
  const router = useRouter();
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Generate background particles (once)
    const newParticles = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 14 + 10,
      delay: Math.random() * 6,
    }));
    setParticles(newParticles);
  }, []);

  // Pause animations when offscreen to save CPU/GPU
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsVisible(entry.isIntersecting));
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br  relative overflow-hidden flex flex-col items-center justify-center text-white">
      
      {/* Animated Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-20 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-600/20 rounded-full blur-3xl"
      />

      {/* Floating Particles (CSS-driven for performance) */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            animationPlayState: isVisible ? "running" : "paused",
          }}
        />
      ))}

      {/* Floating insect-like icons (CSS-driven & memoized) */}
      <FloatingInsects count={12} isVisible={isVisible} />

      {/* Title with Sparkle Effects */}
      <div className="relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 70 }}
          className="relative"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-8 -right-8"
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
          <motion.div
            animate={{
              rotate: [360, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-6 -left-8"
          >
            <Sparkles className="w-5 h-5 text-pink-400" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-yellow-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your Video Type
          </h1>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl relative z-10">
        <Card
          title="Image-based Video"
          description="Generate videos using static images & narration."
          icon={Image}
          glowColor="pink"
          route="/create-new-video/ImageBased"
          router={router}
        />

        <Card
          title="Clip-based Video"
          description="Create highlights using video clips."
          icon={Film}
          glowColor="yellow"
          route="/create-new-video/ClipBased"
          router={router}
        />
      </div>
    </div>
  );
}

function Card({ title, description, icon: Icon, glowColor, route, router }) {
  const [isHovered, setIsHovered] = useState(false);
  const [burstParticles, setBurstParticles] = useState([]);
  const cardRef = useRef(null);

  // Motion values for smooth, low-overhead 3D tilt
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rafRef = useRef(null);

  const handleHover = () => {
    setIsHovered(true);
    // Generate burst particles on hover
    const newBurst = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      angle: (i / 12) * 360,
    }));
    setBurstParticles(newBurst);
  };

  const colorMap = {
    pink: {
      from: "from-pink-500",
      to: "to-cyan-500",
      border: "border-pink-500/40",
      bg: "bg-pink-600/20",
      text: "text-pink-400",
      shadow: "shadow-pink-500/50",
      glow: "bg-pink-500/25",
    },
    yellow: {
      from: "from-yellow-500",
      to: "to-pink-500",
      border: "border-yellow-500/40",
      bg: "bg-yellow-600/20",
      text: "text-yellow-400",
      shadow: "shadow-yellow-500/50",
      glow: "bg-yellow-500/25",
    },
  };

  const colors = colorMap[glowColor];

  const handleMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const newRx = ((y - cy) / cy) * 6; // rotateX (degrees)
    const newRy = -((x - cx) / cx) * 10; // rotateY (degrees)

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rx.set(newRx);
      ry.set(newRy);
    });
  };

  const handleLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rx.set(0);
    ry.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={() => router.push(route)}
      onHoverStart={() => { handleHover(); setIsHovered(true); }}
      onHoverEnd={handleLeave}
      onMouseMove={handleMove}
      style={{
        rotateX: rx,
        rotateY: ry,
        scale: isHovered ? 1.04 : 1,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
        boxShadow: isHovered ? `0 8px 40px ${glowColor === "pink" ? "#3b82f6" : "#a855f7"}` : "",
      }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer relative rounded-2xl overflow-hidden bg-[#111]/70 backdrop-blur-xl border border-white/10 shadow-2xl p-6 transition-all group"
    >
      {/* Animated Border Gradient */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 opacity-10 transition-opacity pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${glowColor === "pink" ? "#3b82f6" : "#a855f7"} 50%, transparent 100%)`,
          filter: "blur(24px)",
        }}
      />

      {/* Inner Content */}
      <div className="relative z-10">
        
        {/* Burst Particles on Hover */}
        <AnimatePresence>
          {burstParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: Math.cos((particle.angle * Math.PI) / 180) * 100,
                y: Math.sin((particle.angle * Math.PI) / 180) * 100,
                opacity: 0,
                scale: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className={`absolute top-1/2 left-1/2 w-2 h-2 ${colors.bg} rounded-full`}
            />
          ))}
        </AnimatePresence>

        {/* Icon Animation Area */}
        <div className="h-48 flex items-center justify-center relative overflow-visible mb-4">
          <motion.div
            className="relative w-48 h-32"
          >
            {/* LEFT ICON */}
            <motion.div
              initial={{ x: -80, opacity: 0, rotate: -20 }}
              animate={{
                x: [-80, -20, -20, 0, -80],
                opacity: [0, 1, 1, 1, 0],
                rotate: [-20, 0, 0, 0, -20],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                times: [0, 0.2, 0.4, 0.6, 1],
                ease: "easeInOut",
              }}
              className={`absolute top-1/2 -translate-y-1/2 p-4 ${colors.bg} border ${colors.border} rounded-xl backdrop-blur-sm`}
            >
              <Icon className={`w-10 h-10 ${colors.text}`} />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className={`absolute inset-0 ${colors.bg} rounded-xl blur-md -z-10`}
              />
            </motion.div>

            {/* RIGHT ICON */}
            <motion.div
              initial={{ x: 80, opacity: 0, rotate: 20 }}
              animate={{
                x: [80, 20, 20, 0, 80],
                opacity: [0, 1, 1, 1, 0],
                rotate: [20, 0, 0, 0, 20],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                times: [0, 0.2, 0.4, 0.6, 1],
                ease: "easeInOut",
              }}
              className={`absolute top-1/2 -translate-y-1/2 right-0 p-4 ${colors.bg} border ${colors.border} rounded-xl backdrop-blur-sm`}
            >
              <Icon className={`w-10 h-10 ${colors.text}`} />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: 0.3,
                }}
                className={`absolute inset-0 ${colors.bg} rounded-xl blur-md -z-10`}
              />
            </motion.div>

            {/* MERGE ENERGY WAVES */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [0, 2, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  times: [0.4, 0.55, 0.7],
                  delay: i * 0.1,
                }}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${colors.glow} blur-2xl rounded-full`}
              />
            ))}

            {/* SPARKLE EFFECTS DURING MERGE */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={`spark-${i}`}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [0, (i - 2) * 15],
                  y: [0, -20 + (i % 2) * 40],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  times: [0.5, 0.6, 0.7],
                  delay: i * 0.05,
                }}
                className={`absolute left-1/2 top-1/2 w-1 h-1 ${colors.bg} rounded-full`}
              />
            ))}

            {/* FINAL VIDEO FRAME WITH PLAY ICON */}
            <motion.div
              animate={{
                scale: [0, 1.1, 1, 0],
                opacity: [0, 1, 1, 0],
                rotate: [0, 360, 360, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                times: [0.6, 0.7, 0.85, 1],
              }}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-16 rounded-lg border-2 ${colors.border} ${colors.bg} flex items-center justify-center backdrop-blur-sm`}
            >
              <motion.div
                animate={{
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                }}
              >
                <Play className={`w-6 h-6 ${colors.text} fill-current`} />
              </motion.div>
            </motion.div>

            {/* SUCCESS FLASH */}
            <motion.div
              animate={{
                scale: [0, 2.5],
                opacity: [0.8, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                times: [0.7, 0.85],
              }}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${colors.glow} rounded-full`}
            />
          </motion.div>
        </div>

        {/* Lightning Bolts on Hover */}
        {isHovered && (
          <>
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.8 }}
              className="absolute top-4 right-4"
            >
              <Zap className={`w-5 h-5 ${colors.text}`} />
            </motion.div>
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.8, delay: 0.4 }}
              className="absolute bottom-4 left-4"
            >
              <Zap className={`w-5 h-5 ${colors.text}`} />
            </motion.div>
          </>
        )}

        {/* Text with Gradient */}
        <h2 className="text-2xl font-semibold text-gray-100">{title}</h2>
        <p className="text-gray-400 mt-2">{description}</p>

        {/* Hover Indicator */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : 0 }}
          transition={{ duration: 0.3 }}
          className={`h-0.5 bg-gray-700 mt-4 rounded-full`}
        />
      </div>

      {/* Corner Accents */}
      <div className={`absolute top-0 left-0 w-20 h-20 ${colors.bg} blur-2xl opacity-10 transition-opacity pointer-events-none`} />
      <div className={`absolute bottom-0 right-0 w-20 h-20 ${colors.bg} blur-2xl opacity-10 transition-opacity pointer-events-none`} />
    </motion.div>
  );
}

function FloatingInsects({ count = 12, isVisible = true }) {
  const icons = [Sparkles, Play, Zap, Image, Film];
  const insects = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 18 + 10,
        delay: Math.random() * 6,
        duration: Math.random() * 12 + 8,
        icon: icons[i % icons.length],
        sway: Math.random() * 30 + 10,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {insects.map((ins) => {
        const Icon = ins.icon;
        return (
          <div
            key={ins.id}
            className="insect"
            style={{
              left: `${ins.left}%`,
              top: `${ins.top}%`,
              width: ins.size,
              height: ins.size,
              animationDuration: `${ins.duration}s`,
              animationDelay: `${ins.delay}s`,
              animationPlayState: isVisible ? "running" : "paused",
            }}
          >
            <div className="insect-inner">
              <Icon className="w-full h-full p-1" />
            </div>
          </div>
        );
      })}
    </div>
  );
}