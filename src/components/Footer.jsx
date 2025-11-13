// Footer.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { Twitter, Youtube, Linkedin, Send } from 'lucide-react'

// Simple variants for the fade-in
const footerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }
    }
}

const Footer = () => {
  return (
    <motion.footer 
        className='relative py-20 px-6 text-gray-400 overflow-hidden'
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
    >
        {/* --- Top Border Glow --- */}
        {/* This uses the same gradient as your animated text for a cohesive theme */}
        <div 
            className='absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[2px]
                       blur-lg'
            style={{
                background: `linear-gradient(90deg, #EC4899, #A855F7, #EC4899)`
            }}
        />
        
        {/* --- Main Grid --- */}
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12'>
            
            {/* Column 1: Brand & Socials */}
            <div className='md:col-span-2'>
                <h3 className='text-2xl font-bold text-white mb-3'>AI Clips</h3>
                <p className='text-sm max-w-xs mb-6'>
                    Create viral AI clips in seconds, not hours.
                </p>
                <div className='flex gap-4'>
                    <a href="#" className='hover:text-white transition-colors'><Twitter className='w-5 h-5' /></a>
                    <a href="#" className='hover:text-white transition-colors'><Youtube className='w-5 h-5' /></a>
                    <a href="#" className='hover:text-white transition-colors'><Linkedin className='w-5 h-5' /></a>
                </div>
            </div>

            {/* Column 2: Product */}
            <div>
                <h4 className='font-semibold text-white mb-4'>Product</h4>
                <ul className='space-y-3'>
                    <li><a href="#" className='hover:text-white transition-colors'>Features</a></li>
                    <li><a href="#" className='hover:text-white transition-colors'>How It Works</a></li>
                    <li><a href="#" className='hover:text-white transition-colors'>Pricing</a></li>
                    <li><a href="#" className='hover:text-white transition-colors'>Testimonials</a></li>
                </ul>
            </div>

            {/* Column 3: Company */}
            <div>
                <h4 className='font-semibold text-white mb-4'>Company</h4>
                <ul className='space-y-3'>
                    <li><a href="#" className='hover:text-white transition-colors'>About Us</a></li>
                    <li><a href="#" className='hover:text-white transition-colors'>Blog</a></li>
                    <li><a href="#" className='hover:text-white transition-colors'>Contact</a></li>
                </ul>
            </div>

            {/* Column 4: Newsletter (Optional but good) */}
            <div>
                <h4 className='font-semibold text-white mb-4'>Join our newsletter</h4>
                <p className='text-sm mb-4'>Get updates on new features.</p>
                <form className='flex'>
                    <input 
                        type="email" 
                        placeholder="your@email.com" 
                        className='w-full px-3 py-2 text-sm bg-white/5 border border-white/10 
                                   rounded-l-lg focus:outline-none focus:border-pink-400'
                    />
                    <button 
                        className='p-2 bg-pink-500 rounded-r-lg hover:bg-pink-600 transition-colors'
                        aria-label="Submit email"
                    >
                        <Send className='w-5 h-5' />
                    </button>
                </form>
            </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className='max-w-6xl mx-auto mt-16 pt-8 border-t border-white/10 
                      flex flex-col md:flex-row justify-between items-center text-sm'>
            <p>&copy; {new Date().getFullYear()} AI Clips. All rights reserved.</p>
            <div className='flex gap-6 mt-4 md:mt-0'>
                <a href="#" className='hover:text-white transition-colors'>Privacy Policy</a>
                <a href="#" className='hover:text-white transition-colors'>Terms of Service</a>
            </div>
        </div>
    </motion.footer>
  )
}

export default Footer