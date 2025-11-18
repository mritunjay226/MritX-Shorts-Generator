// Testimonials.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

// --- Sample Testimonial Data ---
const testimonialsData = [
    {
        quote: "This tool is a game-changer. I went from spending hours editing to creating 10 clips a day. My engagement is through the roof!",
        name: 'Sarah K.',
        title: 'TikTok Creator (500k+)',
        image: 'https://i.pravatar.cc/150?img=1' // Using placeholder avatars
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

// --- Sub-Components for Clarity ---

// 1. The Marquee Component
// This component handles the infinite scrolling animation
const Marquee = ({ children, duration = 40, direction = 'left' }) => {
    
    const marqueeVariants = {
        animate: {
            x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: duration,
                    ease: 'linear'
                }
            }
        }
    }

    return (
        <div className='w-full overflow-hidden'>
            {/* We render the children twice for the seamless loop */}
            <motion.div 
                className='flex' 
                variants={marqueeVariants} 
                animate="animate"
            >
                {children}
                {children}
            </motion.div>
        </div>
    )
}

// 2. The Testimonial Card
// This is the card that uses our glassmorphism style
const TestimonialCard = ({ quote, name, title, image }) => {
    return (
        <div className='flex-shrink-0 w-80 md:w-96 mx-4 p-6
                        rounded-2xl border border-white/10 bg-white/5 
                        backdrop-blur-md'>
            <div className='flex items-center mb-4'>
                <img src={image} alt={name} className='w-12 h-12 rounded-full mr-4' />
                <div>
                    <h3 className='text-lg font-semibold'>{name}</h3>
                    <p className='text-sm text-gray-400'>{title}</p>
                </div>
            </div>
            <div className='flex mb-3'>
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className='w-5 h-5 text-yellow-400 fill-yellow-400' />
                ))}
            </div>
            <p className='text-gray-300 italic'>" {quote} "</p>
        </div>
    )
}


// --- Main Testimonials Component ----
const Testimonials = () => {
    // Split the data for two different rows
    const row1 = testimonialsData.slice(0, Math.ceil(testimonialsData.length / 2))
    const row2 = testimonialsData.slice(Math.ceil(testimonialsData.length / 2))

    return (
        <section className='py-24 text-white overflow-hidden'>
            {/* --- Section Title --- */}
            <motion.h2 
                className='text-3xl md:text-5xl text-center font-bold mb-4'
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
            >
                Don't Just Take <span className='bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500'>Our Word...</span>
            </motion.h2>
            <motion.p 
                className='text-lg text-gray-300 text-center mb-16 max-w-2xl mx-auto'
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                See what top creators and marketers are saying about our platform.
            </motion.p>

            {/* --- Marquee Container --- */}
            <div className='flex flex-col gap-y-6'>
                {/* Row 1: Scrolls Left */}
                <Marquee duration={50} direction='left'>
                    {row1.map((item, index) => (
                        <TestimonialCard key={index} {...item} />
                    ))}
                </Marquee>

                {/* Row 2: Scrolls Right */}
                <Marquee duration={60} direction='right'>
                    {row2.map((item, index) => (
                        <TestimonialCard key={index} {...item} />
                    ))}
                </Marquee>
            </div>
        </section>
    )
}

export default Testimonials