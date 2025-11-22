'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

// --- Sample Testimonial Data ---
const testimonialsData = [
    {
        quote: "This tool is a game-changer. I went from spending hours editing to creating 10 clips a day. My engagement is through the roof!",
        name: 'Sarah K.',
        title: 'TikTok Creator (500k+)',
        image: 'https://i.pravatar.cc/150?img=1'
    },
    {
        quote: "The AI voices are shockingly realistic. I was skeptical, but the quality is insane. It's like having a full production team.",
        name: 'Mark T.',
        title: 'Marketing Agency Owner',
        image: 'https://i.pravatar.cc/150?img=12'
    },
    {
        quote: "I love the 'Multiple Script Options' feature. It helps me beat writer's block and find the perfect hook every single time.",
        name: 'Alex J.',
        title: 'YouTube Shorts Creator',
        image: 'https://i.pravatar.cc/150?img=3'
    },
    {
        quote: "As a non-editor, this is a lifesaver. The auto-subtitles are more accurate than any other service I've tried. Highly recommend!",
        name: 'Emily R.',
        title: 'Course Creator',
        image: 'https://i.pravatar.cc/150?img=4'
    },
    {
        quote: "The variety of styles lets me keep my content fresh. My audience never gets bored, and my workflow is 10x faster.",
        name: 'David L.',
        title: 'Startup Founder',
        image: 'https://i.pravatar.cc/150?img=5'
    },
    {
        quote: "Insanely fast. I can take a long-form podcast and chop it into 20 viral clips in under an hour. This is the future.",
        name: 'Chris P.',
        title: 'Podcast Host',
        image: 'https://i.pravatar.cc/150?img=6'
    }
]

// --- INJECTED STYLES for Marquee ---
const styleTag = `
@keyframes scroll-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes scroll-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}
.animate-scroll-left {
  animation: scroll-left 40s linear infinite;
}
.animate-scroll-right {
  animation: scroll-right 40s linear infinite;
}
/* Pause on hover */
.marquee-track:hover {
  animation-play-state: paused !important;
}
`;

// 1. Optimized Marquee Component
const Marquee = ({ children, direction = 'left', isInView }) => {
    return (
        <div className='w-full overflow-hidden group'>
            <div 
                className={`flex gap-6 w-max marquee-track ${direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'}`}
                // Crucial: Pause animation if not in view
                style={{ animationPlayState: isInView ? 'running' : 'paused' }}
            >
                {/* Render children twice for seamless loop */}
                {children}
                {children}
            </div>
        </div>
    )
}

// 2. The Testimonial Card
const TestimonialCard = ({ quote, name, title, image }) => {
    return (
        <div className='flex-shrink-0 w-80 md:w-96 p-6 rounded-2xl relative overflow-hidden transition-all duration-300
                      hover:-translate-y-1 hover:shadow-lg
                      
                      /* LIGHT MODE */
                      bg-white border border-zinc-200 shadow-sm
                      
                      /* DARK MODE */
                      dark:bg-white/5 dark:border-white/10 dark:backdrop-blur-md dark:shadow-none'>
            
            {/* Decorative Quote Icon */}
            <Quote className="absolute top-4 right-4 w-8 h-8 text-zinc-100 dark:text-white/5 fill-current rotate-180" />

            <div className='flex items-center mb-4 relative z-10'>
                <img 
                    src={image} 
                    alt={name} 
                    className='w-12 h-12 rounded-full mr-4 object-cover border border-zinc-100 dark:border-white/10' 
                />
                <div>
                    <h3 className='text-lg font-bold text-zinc-900 dark:text-white'>{name}</h3>
                    <p className='text-sm text-zinc-500 dark:text-zinc-400'>{title}</p>
                </div>
            </div>
            
            <div className='flex mb-3 relative z-10'>
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className='w-4 h-4 text-yellow-400 fill-yellow-400' />
                ))}
            </div>
            
            <p className='text-zinc-600 dark:text-gray-300 italic leading-relaxed relative z-10'>
                "{quote}"
            </p>
        </div>
    )
}

// --- Main Component ----
const Testimonials = () => {
    const { ref, isInView } = useInView({ threshold: 0 });
    
    const row1 = testimonialsData.slice(0, Math.ceil(testimonialsData.length / 2))
    const row2 = testimonialsData.slice(Math.ceil(testimonialsData.length / 2))

    return (
        <section 
            ref={ref}
            className='py-24 overflow-hidden transition-colors duration-300 bg-zinc-50 dark:bg-black'
        >
            <style>{styleTag}</style>
            
            {/* --- Section Title --- */}
            <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
                <motion.h2 
                    className='text-3xl md:text-5xl font-bold mb-4 text-zinc-900 dark:text-white'
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
                    Don't Just Take <span className='bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-400 dark:to-red-500'>Our Word...</span>
                </motion.h2>
                <motion.p 
                    className='text-lg text-zinc-600 dark:text-gray-400 max-w-2xl mx-auto'
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    See what top creators and marketers are saying about our platform.
                </motion.p>
            </div>

            {/* --- Marquee Container --- */}
            <div className='flex flex-col gap-y-8'>
                {/* Row 1: Scrolls Left */}
                <Marquee direction='left' isInView={isInView}>
                    {row1.map((item, index) => (
                        <TestimonialCard key={index} {...item} />
                    ))}
                </Marquee>

                {/* Row 2: Scrolls Right */}
                <Marquee direction='right' isInView={isInView}>
                    {row2.map((item, index) => (
                        <TestimonialCard key={index} {...item} />
                    ))}
                </Marquee>
            </div>
            
            {/* Gradient Fades on Edges for Smoothness */}
            <div className="absolute top-0 left-0 h-full w-20 md:w-32 bg-gradient-to-r from-zinc-50 to-transparent dark:from-black pointer-events-none z-10" />
            <div className="absolute top-0 right-0 h-full w-20 md:w-32 bg-gradient-to-l from-zinc-50 to-transparent dark:from-black pointer-events-none z-10" />

        </section>
    )
}

export default Testimonials