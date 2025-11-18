import React from 'react'
import { motion } from 'framer-motion'
import { Twitter, Youtube, Linkedin, Send, Sparkles } from 'lucide-react'

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
        className='relative py-20 px-6 bg-black text-gray-400 overflow-hidden border-t border-white/10 selection:bg-yellow-500 selection:text-black'
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
    >
        {/* --- Top Border Glow --- */}
        <div 
            className='absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] blur-sm opacity-70'
            style={{
                background: `linear-gradient(90deg, transparent, #EAB308, #F97316, #EAB308, transparent)`
            }}
        />
        
        {/* --- Ambient Glow --- */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />

        {/* --- Main Grid --- */}
        <div className='relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12'>
            
            {/* Column 1: Brand & Socials */}
            <div className='md:col-span-2 space-y-6'>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <span className="text-black font-bold text-lg">M</span>
                    </div>
                    <h3 className='text-2xl font-bold text-white tracking-tight'>
                        MritX <span className="text-yellow-500">SG</span>
                    </h3>
                </div>
                
                <p className='text-sm leading-relaxed max-w-xs'>
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
                <h4 className='font-semibold text-white mb-6'>Product</h4>
                <ul className='space-y-4 text-sm'>
                    <li><FooterLink href="#">Features</FooterLink></li>
                    <li><FooterLink href="#">How It Works</FooterLink></li>
                    <li><FooterLink href="#">Pricing</FooterLink></li>
                    <li><FooterLink href="#">Showcase</FooterLink></li>
                </ul>
            </div>

            {/* Column 3: Company */}
            <div>
                <h4 className='font-semibold text-white mb-6'>Company</h4>
                <ul className='space-y-4 text-sm'>
                    <li><FooterLink href="#">About Us</FooterLink></li>
                    <li><FooterLink href="#">Blog</FooterLink></li>
                    <li><FooterLink href="#">Careers</FooterLink></li>
                    <li><FooterLink href="#">Contact</FooterLink></li>
                </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className='md:col-span-1'>
                <h4 className='font-semibold text-white mb-4 flex items-center gap-2'>
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    Stay Updated
                </h4>
                <p className='text-xs mb-4 text-gray-500'>
                    Get the latest AI video trends and feature updates.
                </p>
                <form className='flex flex-col gap-2'>
                    <div className="relative">
                        <input 
                            type="email" 
                            placeholder="your@email.com" 
                            className='w-full pl-4 pr-12 py-3 text-sm bg-white/5 border border-white/10 
                                       rounded-xl focus:outline-none focus:border-yellow-500/50 focus:bg-white/10
                                       transition-all placeholder:text-gray-600 text-white'
                        />
                        <button 
                            type="submit"
                            className='absolute right-1 top-1 bottom-1 p-2 bg-gradient-to-r from-yellow-400 to-orange-500 
                                       rounded-lg text-black hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20'
                            aria-label="Submit email"
                        >
                            <Send className='w-4 h-4' />
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* ---- Bottom Bar ---- */}
        <div className='relative z-10 max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 
                        flex flex-col md:flex-row justify-between items-center text-xs text-gray-500'>
            <p>&copy; {new Date().getFullYear()} MritX SG. All rights reserved.</p>
            <div className='flex gap-6 mt-4 md:mt-0'>
                <a href="#" className='hover:text-yellow-500 transition-colors'>Privacy Policy</a>
                <a href="#" className='hover:text-yellow-500 transition-colors'>Terms of Service</a>
                <a href="#" className='hover:text-yellow-500 transition-colors'>Cookie Policy</a>
            </div>
        </div>
    </motion.footer>
  )
}

// Helper Components
const FooterLink = ({ href, children }) => (
    <a href={href} className='hover:text-yellow-400 transition-colors duration-200 flex items-center gap-2 group'>
        <span className="w-0 h-[1px] bg-yellow-500 transition-all duration-300 group-hover:w-3" />
        {children}
    </a>
)

const SocialIcon = ({ icon: Icon }) => (
    <a 
        href="#" 
        className='p-2 rounded-full bg-white/5 border border-white/5 hover:border-yellow-500/30 hover:bg-yellow-500/10 
                   hover:text-yellow-400 transition-all duration-300 group'
    >
        <Icon className='w-5 h-5 transition-transform group-hover:scale-110' />
    </a>
)

export default Footer