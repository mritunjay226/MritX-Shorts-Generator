'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { PenSquare, Wand2, Download, Sparkles, ArrowRight } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

// --- DATA ---
const stepsData = [
    {
        id: 1,
        icon: PenSquare,
        color: 'pink', // Matches the previous component theme
        title: 'Provide Your Prompt',
        description: 'Start with a simple text prompt, a topic, or paste in a longer script. Our AI understands context instantly.',
        tag: 'Input'
    },
    {
        id: 2,
        icon: Wand2,
        color: 'amber',
        title: 'Customize & Generate',
        description: 'Select your favorite AI voice, choose a visual style (3D, Anime, Realistic), and let the AI work its magic.',
        tag: 'Processing'
    },
    {
        id: 3,
        icon: Download,
        color: 'orange',
        title: 'Download & Share',
        description: 'Export your high-resolution video in vertical format (9:16) and share it directly to TikTok or Reels.',
        tag: 'Output'
    }
]

const HowItWorks = () => {
    const containerRef = useRef(null);
    
    // Scroll progress for the connecting line
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <section ref={containerRef} className='relative py-24 overflow-hidden transition-colors duration-300 bg-zinc-50 dark:bg-black'>
            
            {/* Ambient Background (Light & Dark compatible) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-30 blur-[120px] rounded-full bg-yellow-200 dark:bg-yellow-500/5" />
            </div>

            <div className='max-w-5xl mx-auto px-6 relative z-10'>
                
                {/* --- Header --- */}
                <div className="text-center mb-20 space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-colors duration-300
                                 bg-yellow-100 text-yellow-700 border border-yellow-200
                                 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"
                    >
                        <Sparkles className="w-4 h-4 fill-yellow-600 dark:fill-yellow-400 animate-pulse" />
                        <span>Simple Workflow</span>
                    </motion.div>

                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white'
                    >
                        From Idea to Clip in <br className="md:hidden" />
                        <span className='bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-400 dark:to-red-500'>
                            3 Steps
                        </span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, delay: 0.1 }}
                        className='text-lg text-zinc-600 dark:text-gray-400 text-center max-w-2xl mx-auto'
                    >
                        No editing skills required. Just type what you want, and watch the magic happen.
                    </motion.p>
                </div>

                {/* --- VERTICAL PATH LAYOUT --- */}
                <div className="relative">
                    
                    {/* The Central Gray Line (Background) */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-white/10 -translate-x-1/2" />

                    {/* The Progress Line (Fills as you scroll) */}
                    <motion.div 
                        className="absolute left-8 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500 -translate-x-1/2 origin-top"
                        style={{ height: lineHeight }}
                    />

                    {/* Steps */}
                    <div className="space-y-16 md:space-y-32">
                        {stepsData.map((step, index) => (
                            <TimelineStep key={step.id} step={step} index={index} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}

const TimelineStep = ({ step, index }) => {
    const { ref, isInView } = useInView({ threshold: 0.5 });
    const isEven = index % 2 === 0;

    return (
        <div 
            ref={ref}
            className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
        >
            {/* 1. Content Side */}
            <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Tag */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3
                                   bg-zinc-200 text-zinc-600
                                   dark:bg-white/10 dark:text-gray-400`}>
                        {step.tag}
                    </span>
                    
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 text-zinc-900 dark:text-white">
                        {step.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-gray-400 leading-relaxed text-lg">
                        {step.description}
                    </p>
                </motion.div>
            </div>

            {/* 2. Center Node (Icon) */}
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                    className="relative z-10 w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-black border-4 border-zinc-100 dark:border-zinc-900 shadow-xl flex items-center justify-center group"
                >
                    {/* Glowing Ring behind node */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md bg-${step.color}-500/50`} />
                    
                    {/* Icon */}
                    <step.icon className={`w-7 h-7 text-zinc-400 dark:text-zinc-500 group-hover:text-${step.color}-500 transition-colors duration-300`} />
                </motion.div>
                
                {/* Pulse Effect on Active Node */}
                {isInView && (
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl animate-ping opacity-20 bg-yellow-500" />
                )}
            </div>

            {/* 3. Empty Side (Spacer for alignment) */}
            <div className="hidden md:block md:w-1/2" />
            
        </div>
    )
}

export default HowItWorks