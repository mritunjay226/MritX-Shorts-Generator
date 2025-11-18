// Create a new file: InteractiveBackground.jsx
import React from 'react'
import { motion } from 'framer-motion'

const InteractiveBackground = () => {
  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* This div will track the mouse.
        We use a radial gradient centered at the mouse position (set by CSS variables)
        'pointer-events-none' is crucial so it doesn't block clicks on the content..
      */}
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(
              600px circle at var(--mouse-x) var(--mouse-y), 
              rgba(236, 72, 153, 0.15), /* pink-400 with 15% opacity */
              transparent 80%
            )
          `
        }}
      />
    </motion.div>
  )
}

export default InteractiveBackground