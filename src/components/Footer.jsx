'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Twitter, Youtube, Linkedin, Send, Sparkles } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

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
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <motion.footer 
        ref={ref}
        className='relative py-20 px-6 overflow-hidden transition-colors duration-300
                   bg-zinc-100 text-zinc-600 
                   dark:bg-black dark:text-gray-400 
                   border-t border-zinc-200 dark:border-white/10 
                   selection:bg-yellow-500 selection:text-black'
        variants={footerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
    >
        {/* --- Top Border Glow (Subtle in Light, Vibrant in Dark) --- */}
        <div 
            className='absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] blur-sm opacity-70'
            style={{
                background: `linear-gradient(90deg, transparent, #EAB308, #F97316, #EAB308, transparent)`
            }}
        />
        
        {/* --- Ambient Glow --- */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none -translate-y-1/2
                      bg-yellow-200/30 dark:bg-yellow-500/5" />

        {/* --- Main Grid --- */}
        <div className='relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12'>
            
            {/* Column 1: Brand & Socials */}
            <div className='md:col-span-2 space-y-6'>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <span className="text-black font-bold text-lg">M</span>
                    </div>
                    <h3 className='text-2xl font-bold tracking-tight text-zinc-900 dark:text-white'>
                        MritX <span className="text-yellow-600 dark:text-yellow-500">SG</span>
                    </h3>
                </div>
                
                <p className='text-sm leading-relaxed max-w-xs text-zinc-600 dark:text-gray-400'>
                    The ultimate AI-powered video creation platform. 
                    Turn simple prompts into viral clips in seconds.
                </p>
                
                <div className='flex gap-4'>
                    <SocialIcon icon={Twitter} />
                    <SocialIcon icon={Youtube} />
                    <SocialIcon icon={Linkedin} />
                </div>
            </div>

            {/* Column 2: Product */}
            <div>
                <h4 className='font-semibold mb-6 text-zinc-900 dark:text-white'>Product</h4>
                <ul className='space-y-4 text-sm'>
                    <li><FooterLink href="#">Features</FooterLink></li>
                    <li><FooterLink href="#">How It Works</FooterLink></li>
                    <li><FooterLink href="#">Pricing</FooterLink></li>
                    <li><FooterLink href="#">Showcase</FooterLink></li>
                </ul>
            </div>

            {/* Column 3: Company */}
            <div>
                <h4 className='font-semibold mb-6 text-zinc-900 dark:text-white'>Company</h4>
                <ul className='space-y-4 text-sm'>
                    <li><FooterLink href="#">About Us</FooterLink></li>
                    <li><FooterLink href="#">Blog</FooterLink></li>
                    <li><FooterLink href="#">Careers</FooterLink></li>
                    <li><FooterLink href="#">Contact</FooterLink></li>
                </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className='md:col-span-1'>
                <h4 className='font-semibold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white'>
                    <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                    Stay Updated
                </h4>
                <p className='text-xs mb-4 text-zinc-500 dark:text-gray-500'>
                    Get the latest AI video trends and feature updates.
                </p>
                <form className='flex flex-col gap-2'>
                    <div className="relative">
                        <input 
                            type="email" 
                            placeholder="your@email.com" 
                            className='w-full pl-4 pr-12 py-3 text-sm rounded-xl outline-none transition-all
                                     border bg-white border-zinc-300 text-zinc-900 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20
                                     dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-yellow-500/50 dark:focus:bg-white/10
                                     placeholder:text-zinc-400 dark:placeholder:text-gray-600'
                        />
                        <button 
                            type="submit"
                            className='absolute right-1 top-1 bottom-1 p-2 bg-gradient-to-r from-yellow-400 to-orange-500 
                                     rounded-lg text-black hover:opacity-90 transition-opacity shadow-sm'
                            aria-label="Submit email"
                        >
                            <Send className='w-4 h-4' />
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* ---- Bottom Bar ---- */}
        <div className='relative z-10 max-w-7xl mx-auto mt-20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs
                      border-t border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-gray-500'>
            <p>&copy; {new Date().getFullYear()} MritX SG. All rights reserved.</p>
            <div className='flex gap-6 mt-4 md:mt-0'>
                <a href="#" className='hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors'>Privacy Policy</a>
                <a href="#" className='hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors'>Terms of Service</a>
                <a href="#" className='hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors'>Cookie Policy</a>
            </div>
        </div>
    </motion.footer>
  )
}

// Helper Components
const FooterLink = ({ href, children }) => (
    <a href={href} className='hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200 flex items-center gap-2 group'>
        <span className="w-0 h-[1px] bg-yellow-500 transition-all duration-300 group-hover:w-3" />
        {children}
    </a>
)

const SocialIcon = ({ icon: Icon }) => (
    <a 
        href="#" 
        className='p-2 rounded-full transition-all duration-300 group border
                 bg-white border-zinc-200 hover:border-yellow-400 hover:bg-yellow-50
                 dark:bg-white/5 dark:border-white/5 dark:hover:border-yellow-500/30 dark:hover:bg-yellow-500/10'
    >
        <Icon className='w-5 h-5 transition-transform group-hover:scale-110
                       text-zinc-600 group-hover:text-yellow-600
                       dark:text-gray-400 dark:group-hover:text-yellow-400' />
    </a>
)

export default Footer