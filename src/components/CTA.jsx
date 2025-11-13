// Cta.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// Animation variants for the content
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2, // Stagger the headline, text, and button
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
  // State for the internal spotlight
  const [mousePosition, setMousePosition] = useState({ x: -999, y: -999 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: -999, y: -999 }); // Move spotlight off-screen
  };

  // We'll use the pink color from your theme
  const spotlightColor = '#EC4899'; // pink-400

  return (
    <section className='py-24 px-6'>
      <motion.div
        className='relative max-w-5xl mx-auto rounded-3xl 
                   border border-white/10 backdrop-blur-md 
                   overflow-hidden' // Important to clip the gradient
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          '--mouse-x': `${mousePosition.x}px`,
          '--mouse-y': `${mousePosition.y}px`,
          // This is the internal spotlight
          background: `
            radial-gradient(
              400px circle at var(--mouse-x) var(--mouse-y),
              ${spotlightColor}1A, /* 10% opacity */
              rgba(255, 255, 255, 0.05) 40% /* Base glass color */
            )
          `,
          backgroundColor: 'rgba(255, 255, 255, 0.05)' // Fallback
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className='relative z-10 flex flex-col items-center text-center p-12 md:p-20'
          variants={contentVariants}
        >
          <motion.h2 
            className='text-4xl md:text-6xl font-bold mb-6'
            variants={itemVariants}
          >
            Ready to <span className='animated-gradient-text'>Go Viral?</span>
          </motion.h2>

          <motion.p 
            className='text-lg text-gray-300 max-w-lg mb-10'
            variants={itemVariants}
          >
            Stop wasting time on editing. Start creating high-engagement AI clips in seconds.
            No credit card required.
          </motion.p>

          <motion.button 
            className='flex items-center justify-center gap-2 px-8 py-4 
                       rounded-full text-lg font-semibold 
                       bg-pink-500 text-white
                       transition-all duration-300 ease-out'
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: `0px 0px 30px ${spotlightColor}80` // 50% opacity glow
            }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started For Free
            <ArrowRight className='w-5 h-5' />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Cta