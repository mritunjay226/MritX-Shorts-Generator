'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

// Animation variants
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
      type: 'spring',
      stiffness: 100
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
}

const Cta = () => {
  const [mousePosition, setMousePosition] = useState({ x: -999, y: -999 });
  const { ref, isInView } = useInView({ threshold: 0.3 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: -999, y: -999 });
  };

  const spotlightColor = '#EAB308'; // Yellow-500

  return (
    <section 
        ref={ref}
        className='py-24 px-6 relative overflow-hidden transition-colors duration-300 bg-zinc-50 dark:bg-black selection:bg-yellow-500 selection:text-black'
    >
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none 
                    bg-yellow-200/40 dark:bg-yellow-500/10" />

      <motion.div
        className='relative max-w-5xl mx-auto rounded-[2.5rem] border overflow-hidden group
                   /* LIGHT MODE */
                   bg-white border-zinc-200 shadow-xl
                   /* DARK MODE */
                   dark:bg-[#0a0a0a]/80 dark:border-white/10 dark:backdrop-blur-xl dark:shadow-none'
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.5 }}
      >
        {/* Mouse Spotlight Layer (Visible in Dark Mode mainly, subtle in Light) */}
        <div 
            className='pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-50 dark:opacity-100'
            style={{
                background: `
                    radial-gradient(
                        600px circle at ${mousePosition.x}px ${mousePosition.y}px,
                        ${spotlightColor}15,
                        transparent 40%
                    )
                `
            }}
        />

        <motion.div 
          className='relative z-10 flex flex-col items-center text-center p-12 md:p-24'
          variants={contentVariants}
        >
           {/* Premium Badge */}
           <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm
                       bg-yellow-100 text-yellow-700 border border-yellow-200
                       dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20 dark:shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)]"
           >
              <Sparkles className="w-4 h-4 fill-yellow-600 dark:fill-yellow-400 animate-pulse" />
              <span>Start Creating Today</span>
           </motion.div>

          <motion.h2 
            className='text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-zinc-900 dark:text-white'
            variants={itemVariants}
          >
            Ready to <span className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 dark:from-yellow-300 dark:via-orange-400 dark:to-red-500'>Go Viral?</span>
          </motion.h2>

          <motion.p 
            className='text-lg md:text-xl max-w-2xl mb-12 leading-relaxed text-zinc-600 dark:text-gray-400'
            variants={itemVariants}
          >
            Stop wasting time on complex editing tools. Join thousands of creators generating high-engagement AI clips in seconds.
            No credit card required.
          </motion.p>

          <motion.button 
            className='relative group flex items-center justify-center gap-3 px-8 py-4 
                       rounded-full text-lg font-bold text-black
                       bg-gradient-to-r from-yellow-400 to-orange-500
                       transition-all duration-300 ease-out
                       hover:shadow-[0_0_40px_-10px_rgba(234,179,8,0.6)]
                       hover:scale-105 active:scale-95 overflow-hidden'
            variants={itemVariants}
          >
            <span className="relative z-10 flex items-center gap-2">
                Get Started For Free
                <ArrowRight className='w-5 h-5 transition-transform group-hover:translate-x-1' />
            </span>
            
            {/* Button Shine Effect */}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Cta