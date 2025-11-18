// HowItWorks.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PenSquare, Wand2, Download, Sparkles } from 'lucide-react'

// ⚠️ IN YOUR EDITOR: Uncomment the line below and delete the 'ShortsGeneratorSection' component defined at the bottom of this file.
// import ShortsGeneratorSection from './ShortsGen'

// --- DATA ---
const stepsData = [
    {
        icon: PenSquare,
        color: 'text-yellow-400',
        iconBg: 'bg-yellow-400/10',
        hex: '#EAB308', // Yellow-500
        title: 'Step 1: Provide Your Prompt',
        description: 'Start with a simple text prompt, a topic, or paste in a longer script.'
    },
    {
        icon: Wand2,
        color: 'text-orange-400',
        iconBg: 'bg-orange-400/10',
        hex: '#F97316', // Orange-500
        title: 'Step 2: Customize & Generate',
        description: 'Select your favorite AI voice, choose a visual style, and let the AI work its magic.'
    },
    {
        icon: Download,
        color: 'text-red-400',
        iconBg: 'bg-red-400/10',
        hex: '#EF4444', // Red-500
        title: 'Step 3: Download & Share',
        description: 'Export your high-resolution video and share it directly to all your platforms.'
    }
]

// --- ANIMATION VARIANTS ---
const cardsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { delayChildren: 0.2, staggerChildren: 0.3 }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 60, damping: 12 }
    }
}

// New: Continuous floating animation for icons
const iconVariants = {
    visible: { 
        scale: 1, 
        rotate: 0, 
        y: [0, -8, 0], // Continuous float
        transition: { 
            y: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }
        } 
    },
    hover: { 
        scale: 1.15, 
        rotate: [0, -5, 5, 0], 
        y: -5, // Lift up on hover
        transition: { duration: 0.4, ease: "backOut" } 
    }
}

const floatingOrbVariants = {
    animate: (i) => ({
        y: [0, -30, 0],
        x: [0, 15, 0],
        opacity: [0.1, 0.3, 0.1],
        scale: [1, 1.2, 1],
        transition: {
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
        }
    })
}

const HowItWorks = () => {
    const [mousePositions, setMousePositions] = useState({});

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
    <section className='py-24 bg-black text-white overflow-hidden relative selection:bg-yellow-500 selection:text-black'>
        
        {/* --- Animated Ambient Background --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-yellow-500/5 blur-[120px] rounded-full" />
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    custom={i}
                    variants={floatingOrbVariants}
                    animate="animate"
                    className="absolute rounded-full blur-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
                    style={{
                        width: `${Math.random() * 200 + 50}px`,
                        height: `${Math.random() * 200 + 50}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                />
            ))}
        </div>

        {/* <ShortsGeneratorSection /> */}

        <div className='max-w-7xl mx-auto px-6 relative z-10'>
            
            {/* --- Section Title --- */}
            <div className="text-center mb-20 space-y-4">
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-md text-sm font-medium text-yellow-400 shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)] mb-4"
                >
                    <Sparkles className="w-4 h-4 fill-yellow-400 animate-pulse" />
                    <span>Workflow</span>
                </motion.div>

                <motion.h2 
                    className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Get Your Clip in <br className="md:hidden" />
                    <span className='bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500'>
                        3 Simple Steps
                    </span>
                </motion.h2>
                
                <motion.p 
                    className='text-lg text-gray-400 text-center max-w-2xl mx-auto'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    From idea to viral-ready video in just a few clicks. No editing skills required.
                </motion.p>
            </div>

            {/* --- Steps Grid --- */}
            <div className='relative mt-16'>
                
                {/* Desktop Connector Line (With Draw Animation) */}
                <svg className='hidden md:block absolute top-12 left-0 w-full h-1 z-0' width="100%" height="4" viewBox="0 0 1000 4" preserveAspectRatio="none">
                    <motion.path
                        d="M 0 2 L 1000 2"
                        stroke="url(#gold-gradient)" 
                        strokeWidth="2" 
                        strokeOpacity="0.3"
                        strokeDasharray="12 12"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                    <defs>
                        <linearGradient id="gold-gradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#EAB308" />
                            <stop offset="50%" stopColor="#F97316" />
                            <stop offset="100%" stopColor="#EF4444" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* --- Cards Grid --- */}
                <motion.div 
                    className='relative grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-12 z-10'
                    variants={cardsContainerVariants}
                    initial="hidden" 
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {stepsData.map((step, index) => {
                        const { x, y } = getCardMousePosition(index);
                        return (
                            <motion.div 
                                key={index} 
                                className='group relative rounded-3xl p-8 flex flex-col items-center text-center
                                          border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl
                                          overflow-hidden'
                                variants={cardVariants}
                                whileHover="hover"
                                onMouseMove={(e) => handleCardMouseMove(e, index)}
                                onMouseLeave={() => handleCardMouseLeave(index)}
                            >
                                {/* Spotlight Effect Layer */}
                                <div 
                                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-100"
                                    style={{
                                        background: `radial-gradient(400px circle at ${x}px ${y}px, ${step.hex}15, transparent 40%)`
                                    }}
                                />

                                {/* --- Icon & Number --- */}
                                <div className='relative flex items-center justify-center mb-8'>
                                    <motion.div 
                                        className={`relative z-10 p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-lg group-hover:border-${step.color.split('-')[1]}-500/30 transition-colors duration-300`}
                                        variants={iconVariants}
                                    >
                                        <step.icon className={`w-10 h-10 ${step.color}`} />
                                    </motion.div>
                                    
                                    {/* Static Glow behind icon */}
                                    <div className={`absolute inset-0 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${step.iconBg}`} />
                                </div>
                                
                                {/* --- Text Content --- */}
                                <h3 className='text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors duration-300'>
                                    {step.title}
                                </h3>
                                <p className='text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300'>
                                    {step.description}
                                </p>

                                {/* Border Gradient on Hover */}
                                <div 
                                    className='absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100'
                                    style={{
                                        background: `radial-gradient(600px circle at ${x}px ${y}px, ${step.hex}40, transparent 40%)`,
                                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        maskComposite: 'xor',
                                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        WebkitMaskComposite: 'xor',
                                        padding: '1px'
                                    }} 
                                />
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