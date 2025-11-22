'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MessageCircleQuestion } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

// --- FAQ DATA ---
const faqData = [
  {
    question: "How does the AI video generator work?",
    answer: "Simply enter a text prompt, script, or upload an image. Our advanced AI analyzes your input and generates high-quality video clips, synchronizing visuals with professional voiceovers and background music automatically."
  },
  {
    question: "Can I use my own voiceovers?",
    answer: "Yes! You can upload your own audio files or record directly within the app. Alternatively, choose from our library of ultra-realistic AI voices in over 30 languages and accents."
  },
  {
    question: "Is there a free trial available?",
    answer: "Absolutely. You can start creating for free with our starter plan, which includes 5 credits per month. No credit card is required to get started."
  },
  {
    question: "What file formats can I export?",
    answer: "We support high-resolution exports in MP4 format, optimized for all major platforms including YouTube Shorts, TikTok, Instagram Reels, and standard widescreen formats."
  },
  {
    question: "Do I own the rights to the videos I create?",
    answer: "Yes, you have full commercial ownership of all videos generated on our paid plans. On the free plan, videos are available for personal use with a watermark."
  }
]

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

const FaqItem = ({ item, isOpen, onClick }) => {
  return (
    <motion.div 
      variants={itemVariants}
      className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden
                  ${isOpen 
                    // OPEN STATE
                    ? 'bg-yellow-50 border-yellow-400 shadow-md dark:bg-white/5 dark:border-yellow-500/50 dark:shadow-[0_0_30px_-10px_rgba(234,179,8,0.15)]' 
                    // CLOSED STATE
                    : 'bg-white border-zinc-200 hover:border-zinc-300 dark:bg-white/5 dark:border-white/10 dark:hover:border-white/20'}`}
    >
      {/* Active Gradient Glow (Dark Mode only) */}
      {isOpen && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent pointer-events-none opacity-0 dark:opacity-100" />
      )}

      <button
        onClick={onClick}
        className="relative w-full text-left px-6 py-5 flex items-center justify-between z-10"
      >
        <span className={`text-lg font-medium transition-colors duration-300 
                        ${isOpen 
                            ? 'text-yellow-700 dark:text-yellow-400' 
                            : 'text-zinc-700 group-hover:text-zinc-900 dark:text-gray-200 dark:group-hover:text-white'
                        }`}>
          {item.question}
        </span>
        
        <span className={`ml-4 flex-shrink-0 p-1 rounded-full border transition-all duration-300 
                        ${isOpen 
                            ? 'bg-yellow-400 border-yellow-400 rotate-45 dark:bg-yellow-500 dark:border-yellow-500' 
                            : 'bg-zinc-100 border-zinc-200 group-hover:border-zinc-300 dark:bg-white/5 dark:border-white/20 dark:group-hover:border-white/40'
                        }`}>
          <Plus className={`w-5 h-5 transition-colors 
                          ${isOpen 
                            ? 'text-white dark:text-black' 
                            : 'text-zinc-400 group-hover:text-zinc-600 dark:text-gray-400 dark:group-hover:text-white'
                          }`} />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 leading-relaxed relative z-10 text-zinc-600 dark:text-gray-400">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section 
        ref={ref}
        className='py-24 px-6 relative overflow-hidden transition-colors duration-300 bg-zinc-50 dark:bg-black selection:bg-yellow-500 selection:text-black'
    >
      
      {/* Background Ambience - Adapted for Light/Dark */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none 
                    bg-yellow-200/40 dark:bg-orange-500/5" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none 
                    bg-orange-200/40 dark:bg-yellow-500/5" />

      <div className='relative z-10 max-w-3xl mx-auto'>
        
        {/* Header */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
        >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm
                          bg-yellow-100 text-yellow-700 border border-yellow-200
                          dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20">
                <MessageCircleQuestion className="w-4 h-4" />
                <span>Common Questions</span>
            </div>
            
            <h2 className='text-4xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white'>
                Frequently Asked <br />
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-200 dark:via-yellow-400 dark:to-orange-500'>
                    Questions
                </span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-gray-400">
                Everything you need to know about creating viral videos with MritX SG.
            </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div 
          className='space-y-4'
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {faqData.map((item, index) => (
            <FaqItem 
              key={index} 
              item={item} 
              isOpen={openIndex === index} 
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)} 
            />
          ))}
        </motion.div>

      </div>
    </section>
  )
}

export default Faq