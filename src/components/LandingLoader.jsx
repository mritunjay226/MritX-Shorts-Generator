'use client';
import React, { useEffect, useState } from 'react'; // <-- Make sure useState is imported
import { motion, AnimatePresence } from 'framer-motion';

const greetings = [
  'Hello', 'नमस्ते', 'নমস্কার', 'வணக்கம்', 'హలో', 'नमस्कार',
  'નમસ્તે', 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'നമസ്കാരം', 'ನಮસ્ಕಾರ', 'سلام', 'ନମସ୍କାର'
];

// Total time for the loader (in milliseconds)
const LOADER_DURATION = 3600; 
// Time for each word (in milliseconds)
const WORD_CHANGE_INTERVAL = 300;

// --- Animation Variants ---

// 1. For the H1 (the word container)
const wordVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04, // Stagger in each letter
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// 2. For each SPAN (the letter)
const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 20,
    },
  },
};

// --- Sub-Component for Animating Letters ---
const AnimatedLetters = ({ text, isBrand = false }) => {
  const letters = text.split('');

  return (
    <motion.h1
      key={text}
      className={`text-5xl font-semibold tracking-wide ${isBrand ? 'animated-gradient-text' : ''}`}
      variants={wordVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {letters.map((letter, i) => (
        <motion.span
          key={`${text}-${i}`}
          variants={letterVariants}
        >
          {/* Handle spaces explicitly for layout */}
          {letter === ' ' ? '\u00A0' : letter} 
        </motion.span>
      ))}
    </motion.h1>
  );
};


// --- Main Loader Component ---
const LandingLoader = ({ onLoadingComplete }) => {
  // --- FIX IS HERE ---
  const [index, setIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  // --- END FIX ---

  useEffect(() => {
    // 1. Start cycling through the greetings
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, WORD_CHANGE_INTERVAL);

    // 2. Set a timer for the *entire* sequence
    const completeTimer = setTimeout(() => {
      clearInterval(interval); // Stop the cycling
      setIsCompleting(true); // Trigger the "finale" animation
    }, LOADER_DURATION);

    return () => {
      clearInterval(interval);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <motion.div
      className="h-screen w-screen flex items-center justify-center 
                 bg-black text-white"
      // This animates the *entire screen* fading out
      animate={isCompleting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.5 }} // Delay 1.5s after "AI Clips" appears
      onAnimationComplete={() => {
        if (isCompleting) {
          onLoadingComplete(); // Tell the parent component we're done
        }
      }}
    >
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!isCompleting ? (
            // --- The Greeting Cycler ---
            <AnimatedLetters
              text={greetings[index]}
              key={index}
            />
          ) : (
            // --- The "Finale" ---
            <AnimatedLetters
              text="AI Clips"
              key="brand-finale"
              isBrand={true} // This applies the animated gradient!
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LandingLoader;