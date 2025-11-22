'use client'

import React, { useState, useRef } from 'react'
import { Captions, Download, Layers, Mic, NotepadText, Video as VideoIcon, Sparkles } from 'lucide-react'

// 1. Import the hook
import { useInView } from '@/hooks/use-in-view'

// ⚠️ IN YOUR EDITOR: Uncomment the line below and delete the 'InteractiveBackground' component defined at the bottom of this file.
import InteractiveBackground from './InteractiveBackground'

// --- DATA ---
const featuresData = [
    {
        icon: VideoIcon,
        title: 'AI-Powered Creation',
        description: 'Generate scripts, images, and voiceovers in seconds using advanced AI models.',
        layout: 'col-span-1 md:col-span-2' 
    },
    {
        icon: NotepadText,
        title: 'Multiple Script Options',
        description: 'Receive varied script drafts to ensure unique and engaging content.',
        layout: 'col-span-1' 
    },
    {
        icon: Mic,
        title: 'Custom Voiceovers',
        description: 'Select from a library of hyper-realistic AI voices to match your tone.',
        layout: 'col-span-1' 
    },
    {
        icon: Layers,
        title: 'Cinematic Styles',
        description: 'Choose from varied video styles to create visually stunning shorts.',
        layout: 'col-span-1' 
    },
    {
        icon: Captions,
        title: 'Smart Subtitles',
        description: 'Auto-generate accurate, animated subtitles to boost retention.',
        layout: 'col-span-1' 
    },
    {
        icon: Download,
        title: 'Instant Export',
        description: 'One-click download optimized for TikTok, Reels, and YouTube Shorts.',
        layout: 'col-span-1 md:col-span-2' 
    }
]

const Features = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    // 2. Initialize hook with a slight threshold so it loads just before the user sees it
    const { ref, isInView } = useInView({ threshold: 0 });

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setMousePosition({ 
            x: e.clientX - rect.left, 
            y: e.clientY - rect.top 
        });
    };

    return (
        <div 
            ref={ref}
            className='relative min-h-screen overflow-hidden feature-container font-sans transition-colors duration-300
                     bg-gray-50 text-gray-900 
                     dark:bg-black dark:text-white 
                     selection:bg-yellow-500 selection:text-black'
            onMouseMove={handleMouseMove}
            style={{
                '--mouse-x': `${mousePosition.x}px`,
                '--mouse-y': `${mousePosition.y}px`,
            }}
        >
            
            {/* 3. Performance: Only render the heavy background if the component is in view (or keep it mounted but hidden) */}
            {/* Ideally, pass a 'paused={!isInView}' prop to InteractiveBackground if it supports it. 
                If not, conditional rendering saves GPU resources. */}
            {isInView && (
                <div className="absolute inset-0 z-0">
                    <InteractiveBackground />
                </div>
            )}
            
            {/* Overlays for readability */}
            {/* Light: White fade. Dark: Black fade */}
            <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-300 bg-white/70 dark:bg-black/60" />

            <div className='relative z-10 px-4 sm:px-6 py-24 max-w-7xl mx-auto'>
                
                {/* Header Section */}
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium shadow-sm transition-colors duration-300
                                  bg-yellow-100 text-yellow-700 border border-yellow-200
                                  dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20 dark:shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)]">
                        <Sparkles className="w-4 h-4 fill-yellow-600 dark:fill-yellow-400 text-yellow-600 dark:text-yellow-400" />
                        <span>MritX SG Features</span>
                    </div>
                    
                    <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight transition-colors duration-300 text-gray-900 dark:text-white'>
                        Everything You Need to <br className="hidden md:block" />
                        <span className='bg-clip-text text-transparent bg-gradient-to-r 
                                       from-gray-900 via-gray-700 to-gray-500
                                       dark:from-white dark:via-gray-200 dark:to-gray-400'>
                           Create Viral 
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 ml-2 drop-shadow-sm">
                           Clips
                        </span>
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed transition-colors duration-300 text-gray-600 dark:text-gray-400">
                        Unleash your creativity with our professional suite of AI tools. 
                        Designed for speed, built for engagement.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                    {featuresData.map((feature, index) => (
                        <div
                            key={index}
                            className={`
                                group relative feature-card rounded-3xl p-8 flex flex-col items-start text-left
                                transition-all duration-300 overflow-hidden
                                ${feature.layout}
                                
                                /* LIGHT MODE STYLES */
                                bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-yellow-400/50
                                
                                /* DARK MODE STYLES */
                                dark:bg-[#0a0a0a]/60 dark:backdrop-blur-xl dark:border-white/10 dark:hover:bg-[#0a0a0a]/80 dark:shadow-none
                            `}
                        >
                            {/* Icon Container */}
                            <div 
                                className={`
                                    mb-6 p-4 rounded-2xl transition-all duration-500 group-hover:scale-105
                                    
                                    /* LIGHT MODE */
                                    bg-yellow-400 border border-yellow-100 group-hover:border-yellow-400 group-hover:shadow-md
                                    
                                    /* DARK MODE */
                                    dark:bg-gradient-to-br dark:from-yellow-500/10 dark:to-orange-500/5 
                                    dark:border-yellow-500/20 dark:group-hover:border-yellow-500/40
                                    dark:group-hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)]
                                `}
                            >
                                <feature.icon className="w-8 h-8 text-black" />
                            </div>

                            <h2 className='text-2xl font-bold mb-3 transition-colors
                                         text-gray-900 group-hover:text-yellow-600
                                         dark:text-white dark:group-hover:text-yellow-400'>
                                {feature.title}
                            </h2>
                            <p className='leading-relaxed transition-colors
                                        text-gray-600 group-hover:text-gray-900
                                        dark:text-gray-400 dark:group-hover:text-gray-300'>
                                {feature.description}
                            </p>

                            {/* Decorative Corner Gradient */}
                            <div 
                                className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-0 transition-opacity duration-500 group-hover:opacity-20 pointer-events-none"
                                style={{ background: `radial-gradient(circle at top right, #EAB308, transparent)` }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Features