'use client'

import React, { useState, useRef } from 'react'
import { Captions, Download, Layers, Mic, NotepadText, Video as VideoIcon, Sparkles } from 'lucide-react'

// ⚠️ IN YOUR EDITOR: Uncomment the line below and delete the 'InteractiveBackground' component defined at the bottom of this file.
import InteractiveBackground from './InteractiveBackground'

// --- DATA (Gold & Black Theme) ---
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
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({ 
            x: e.clientX - rect.left, 
            y: e.clientY - rect.top 
        });
    };

    // --- Custom CSS for Gold Glow Effects --
    return (
        <div 
            ref={containerRef}
            className='relative min-h-screen bg-black text-white overflow-hidden feature-container font-sans selection:bg-yellow-500 selection:text-black'
            onMouseMove={handleMouseMove}
            style={{
                '--mouse-x': `${mousePosition.x}px`,
                '--mouse-y': `${mousePosition.y}px`,
            }}
        >
            
            
            {/* Using the embedded background for preview */}
            <InteractiveBackground />
            
            {/* Dark Overlay to ensure text legibility over interactive background */}
            <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

            <div className='relative z-10 px-4 sm:px-6 py-24 max-w-7xl mx-auto'>
                
                {/* Header Section ( Matching Hero Style ) */}
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-md text-sm font-medium text-yellow-400 shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)]">
                        <Sparkles className="w-4 h-4 fill-yellow-400" />
                        <span>MritX SG Features</span>
                    </div>
                    
                    <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight'>
                        Everything You Need to <br className="hidden md:block" />
                        <span className='bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400'>
                           Create Viral 
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 ml-2">
                            Clips
                        </span>
                    </h1>
                    
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
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
                                border border-white/10 bg-[#0a0a0a]/60 backdrop-blur-xl
                                hover:bg-[#0a0a0a]/80 transition-all duration-300 overflow-hidden
                                ${feature.layout}
                            `}
                        >
                            {/* Icon Container (Gold Theme) */}
                            <div 
                                className={`
                                    mb-6 p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/5 
                                    border border-yellow-500/20 group-hover:border-yellow-500/40
                                    transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)]
                                `}
                            >
                                <feature.icon className="w-8 h-8 text-yellow-400" />
                            </div>

                            <h2 className='text-2xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors'>
                                {feature.title}
                            </h2>
                            <p className='text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors'>
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