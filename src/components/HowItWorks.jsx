// HowItWorks.jsx
import React, { useState } from 'react' // Keep useState for local cards
import { motion } from 'framer-motion'
import { PenSquare, Wand2, Download } from 'lucide-react'

// Define the steps (no change)
const stepsData = [
    {
        icon: PenSquare,
        color: 'text-purple-400',
        iconBg: 'bg-purple-400/10',
        hex: '#A855F7',
        title: 'Step 1: Provide Your Prompt',
        description: 'Start with a simple text prompt, a topic, or paste in a longer script.'
    },
    {
        icon: Wand2,
        color: 'text-pink-400',
        iconBg: 'bg-pink-400/10',
        hex: '#EC4899',
        title: 'Step 2: Customize & Generate',
        description: 'Select your favorite AI voice, choose a visual style, and let the AI work its magic.'
    },
    {
        icon: Download,
        color: 'text-blue-400',
        iconBg: 'bg-blue-400/10',
        hex: '#3B82F6',
        title: 'Step 3: Download & Share',
        description: 'Export your high-resolution video and share it directly to all your platforms.'
    }
]

// Define animation variants (no change)
const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', duration: 0.8 } }
}
const subtitleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } }
}
const lineVariants = {
    hidden: { pathLength: 0 },
    visible: { 
        pathLength: 1,
        transition: { duration: 1.5, ease: "easeInOut", delay: 0.4 }
    }
}
const cardsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { delayChildren: 1.5, staggerChildren: 0.3 }
    }
}
const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
}

// The Component
const HowItWorks = () => {
    // 1. We ONLY keep the state for the individual CARD spotlights
    const [mousePositions, setMousePositions] = useState({});

    // 2. Handlers for the CARD spotlights (unchanged)
    const handleCardMouseMove = (e, index) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePositions(prev => ({
            ...prev,
            [index]: {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            }
        }));
    };

    const handleCardMouseLeave = (index) => {
        setMousePositions(prev => ({
            ...prev,
            [index]: { x: -999, y: -999 }
        }));
    };

    const getCardMousePosition = (index) => mousePositions[index] || { x: -999, y: -999 };

  return (
    // 3. REMOVED the onMouseMove and style props from the <section>
    <section className='py-24 text-white overflow-hidden relative'>
        
        {/* 4. REMOVED the global spotlight <div> that was here */}

        {/* The content container now just needs 'relative' */}
        <div className='max-w-6xl mx-auto px-6 relative'>
            
            {/* --- Section Title --- */}
            <motion.h2 
                className='text-3xl md:text-5xl text-center font-bold mb-4'
                variants={titleVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
            >
                Get Your Clip in <span className='animated-gradient-text'>3 Simple Steps</span>
            </motion.h2>
            <motion.p 
                className='text-lg text-gray-300 text-center mb-16 max-w-2xl mx-auto'
                variants={subtitleVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
            >
                From idea to viral-ready video in just a few clicks.
            </motion.p>

            {/* --- Steps Grid & SVG --- */}
            <div className='relative'>
                {/* --- The Animated SVG Line (Desktop Only) --- */}
                <motion.svg
                    className='hidden md:block absolute top-12 left-0 w-full h-1'
                    width="100%" height="4" viewBox="0 0 1000 4"
                    preserveAspectRatio="none"
                    initial="hidden" whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <motion.path
                        d="M 0 2 L 1000 2"
                        stroke="#FFFFFF" strokeWidth="4" strokeOpacity="0.2"
                        strokeDasharray="10 10"
                        variants={lineVariants}
                    />
                </motion.svg>

                {/* --- Steps Grid Container --- */}
                <motion.div 
                    className='relative grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-12'
                    variants={cardsContainerVariants}
                    initial="hidden" whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {stepsData.map((step, index) => {
                        // Get the specific position for this card
                        const { x, y } = getCardMousePosition(index);
                        return (
                            <motion.div 
                                key={index} 
                                className='relative rounded-2xl p-6 flex flex-col items-center text-center
                                           border border-white/10 backdrop-blur-md
                                           transition-all duration-300 ease-out 
                                           overflow-hidden'
                                style={{
                                    '--glow-color': step.hex,
                                    '--mouse-x': `${x}px`,
                                    '--mouse-y': `${y}px`,
                                    // This background style for the LOCAL card spotlight is unchanged
                                    background: `
                                        radial-gradient(
                                            200px circle at var(--mouse-x) var(--mouse-y),
                                            ${step.hex}25,
                                            rgba(255, 255, 255, 0.05) 50%, 
                                            rgba(255, 255, 255, 0.05)
                                        )
                                    `,
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                }}
                                variants={cardVariants}
                                whileHover={{
                                    y: -6,
                                    boxShadow: `0px 10px 30px -5px ${step.hex}33`,
                                    transition: { type: 'spring', stiffness: 300, damping: 20 }
                                }}
                                // Use the CARD-specific handlers here
                                onMouseMove={(e) => handleCardMouseMove(e, index)}
                                onMouseLeave={() => handleCardMouseLeave(index)}
                            >
                                {/* --- Icon & Ghost Number --- */}
                                <div className='relative flex items-center justify-center mb-6'>
                                    <span 
                                        className='absolute text-8xl font-bold text-white/5 -z-10' 
                                        style={{ top: '-1.5rem' }}
                                    >
                                        0{index + 1}
                                    </span>
                                    <div className={`p-4 rounded-xl ${step.iconBg} border border-white/10`}>
                                        <step.icon className={`w-10 h-10 ${step.color}`} />
                                    </div>
                                </div>
                                
                                {/* --- Text Content --- */}
                                <h3 className='text-2xl font-semibold mb-3'>{step.title}</h3>
                                <p className='text-gray-300'>{step.description}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    </section>
  )
}

export default HowItWorks