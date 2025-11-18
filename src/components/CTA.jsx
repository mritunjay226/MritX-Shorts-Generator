import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

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

  // Gold theme color for spotlight
  const spotlightColor = '#EAB308'; // Yellow-500

  return (
    <section className='py-24 px-6 bg-black relative overflow-hidden selection:bg-yellow-500 selection:text-black'>
      
      {/* Background Glow to blend with previous sections */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        className='relative max-w-5xl mx-auto rounded-[2.5rem] 
                   border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl
                   overflow-hidden group'
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        {/* Mouse Spotlight Layer */}
        <div 
            className='pointer-events-none absolute inset-0 transition-opacity duration-300'
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-md text-sm font-medium text-yellow-400 shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)] mb-8"
           >
              <Sparkles className="w-4 h-4 fill-yellow-400 animate-pulse" />
              <span>Start Creating Today</span>
           </motion.div>

          <motion.h2 
            className='text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white tracking-tight'
            variants={itemVariants}
          >
            Ready to <span className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500'>Go Viral?</span>
          </motion.h2>

          <motion.p 
            className='text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed'
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