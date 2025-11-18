'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const greetings = [
  'Hello', 'नमस्ते', 'Bonjour', 'Hola', 'Ciao', 'Hallo', 'Olá',
  '你好', '안녕하세요', 'Привет', 'مرحبا', 'வணக்கம்', 'నమస్కారం'
];

// Faster, snappier duration
const TOTAL_DURATION = 2000; 
const WORD_DURATION = TOTAL_DURATION / (greetings.length + 1);

const LandingLoader = ({ onLoadingComplete }) => {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev + 1 >= greetings.length) {
          clearInterval(interval);
          setTimeout(() => setIsCompleting(true), 1000); // Pause on final word
          return prev;
        }
        return prev + 1;
      });
    }, WORD_DURATION);

    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white"
      initial={{ opacity: 1 }}
      animate={isCompleting ? { opacity: 0, pointerEvents: 'none' } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (isCompleting && onLoadingComplete) onLoadingComplete();
      }}
    >
      {/* Subtle background pattern to add texture without noise */}
      <div className="absolute inset-0 opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="overflow-hidden h-20 md:h-28 flex items-center justify-center min-w-[300px]">
          <AnimatePresence mode="wait">
            {!isCompleting ? (
              <motion.h1
                key={index}
                className="text-4xl md:text-6xl font-medium tracking-tight text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <span className="flex items-center gap-3">
                    {/* Small dot accent */}
                    <span className="w-2 h-2 rounded-full bg-white/20 inline-block" />
                    {greetings[index]}
                </span>
              </motion.h1>
            ) : (
              <motion.div
                key="brand"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                className="text-center"
              >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                  Mrit <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">X</span>
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingLoader;