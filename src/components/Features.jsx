// Features.jsx
import { Captions, Download, Layers, Mic, NotepadText, VideoIcon } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
// 1. Import our new background
import InteractiveBackground from './InteractiveBackground'

const featuresData = [
    {
        icon: VideoIcon,
        iconColor: 'text-pink-400',
        iconBg: 'bg-pink-400/10',
        color: '#EC4899', 
        title: 'AI-Powered Creation',
        description: 'Generate scripts, images, and voiceovers in seconds using advanced AI.',
        // 2. Add a layout property
        layout: 'col-span-1 md:col-span-2' // This one is larger
    },
    {
        icon: NotepadText,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-400/10',
        color: '#A855F7',
        title: 'Multiple Script Options',
        description: 'Receive multiple script options to choose from, ensuring your content is unique.',
        layout: 'col-span-1' // This one is standard
    },
    {
        icon: Mic,
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-400/10',
        color: '#3B82F6',
        title: 'Custom Voiceovers',
        description: 'Select from a variety of AI-generated voices to match your short\'s tone.',
        layout: 'col-span-1' // Standard
    },
    {
        icon: Layers,
        iconColor: 'text-green-400',
        iconBg: 'bg-green-400/10',
        color: '#22C55E',
        title: 'Variety of Styles',
        description: 'Choose from different video styles to create visually appealing shorts that stand out.',
        layout: 'col-span-1 md:col-span-1' // Larger
    },
    {
        icon: Captions,
        iconColor: 'text-yellow-400',
        iconBg: 'bg-yellow-400/10',
        color: '#EAB308', 
        title: 'Auto Subtitles',
        description: 'Automatically generate accurate subtitles with different styles to enhance engagement.',
        layout: 'col-span-1' // Standard
    },
      {
        icon: Download,
        iconColor: 'text-red-400',
        iconBg: 'bg-red-400/10',
        color: '#EF4444', // red-400
        title: 'Easy Download & Share',
        description: 'Quickly download your AI-generated shorts and share them across multiple platforms with ease.',
        layout: 'col-span-1 md:col-span-2' // Standard
        
    }
    // We removed the 6th item to make the grid 2+1 and 1+2.
    // You can add it back and adjust the layout as needed (e.g., make the last one col-span-3)
]

const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
}

const gridVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
}

const Features = () => {
    // This state will track the mouse position
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        // e.currentTarget is the element the listener is attached to (our main div)
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({ 
            x: e.clientX - rect.left, 
            y: e.clientY - rect.top 
        });
    };

    return (
        // 1. Add the onMouseMove listener to the main container
        <div 
            className='relative min-h-screen text-white overflow-hidden'
            onMouseMove={handleMouseMove}
            // 2. Pass the mouse position to the CSS variables
            style={{
                '--mouse-x': `${mousePosition.x}px`,
                '--mouse-y': `${mousePosition.y}px`,
            }}
        >
            <InteractiveBackground /> {/* Our new background */}
            
            <div className='relative z-10 px-6 py-20'>
                <motion.h1 
                    className='text-3xl md:text-5xl text-center font-bold mb-12 text-shadow-lg'
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    Everything You Need to 
                    {/* 3. Add classes for the animated gradient text */}
                    <span className='animated-gradient-text'> Create AI Clips</span>
                </motion.h1>

                {/* 4. Use `grid-cols-1 md:grid-cols-3` for the bento layout */}
                <motion.div 
                    className='grid grid-cols-1 md:grid-cols-4  p-4 gap-6 md:gap-8 max-w-6xl mx-auto'
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {featuresData.map((feature, index) => (
                        <motion.div
                            key={index}
                            // 5. Apply the dynamic layout class
                            className={`rounded-2xl p-6 flex flex-col items-center text-center 
                                       border border-white/10 bg-white/5 backdrop-blur-md
                                       transition-all duration-300 ease-out ${feature.layout}`}
                            variants={cardVariants}
                            style={{ '--glow-color': feature.color }}
                            whileHover={{
                                y: -6,
                                scale: 1.03,
                                boxShadow: `0px 10px 30px -5px ${feature.color}33`,
                                transition: { type: 'spring', stiffness: 300, damping: 20 }
                            }}
                        >
                            {/* 6. Wrap icon in motion.div to animate it */}
                            <motion.div
                                className={`mb-4 p-3 rounded-xl ${feature.iconBg} border border-white/10`}
                                // Add rotate animation on the card's hover
                                whileHover={{ rotate: 360 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <feature.icon className={`w-10 h-10 ${feature.iconColor}`} />
                            </motion.div>

                            <h2 className='text-xl font-semibold mb-2'>{feature.title}</h2>
                            <p className='text-gray-300 text-sm'>{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default Features