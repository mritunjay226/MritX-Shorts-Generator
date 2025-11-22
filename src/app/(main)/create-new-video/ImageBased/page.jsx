"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Topic from './_components/Topic'
import VideoStyle from './_components/VideoStyle'
import Voice from './_components/Voice'
import Captions from './_components/Captions'
import BgMusic from './_components/BgMusic'
import Preview from './_components/Preview'
import { Loader2Icon, WandSparkles, Sparkles, Video } from 'lucide-react'
import axios from 'axios'
import { useMutation } from 'convex/react'
import { useAuthContext } from '@/app/provider'
import { toast } from 'sonner'
import { api } from '../../../../../convex/_generated/api'

// Animation variants for smooth entry
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const CreateNewVideo = () => {
  const [formData, setFormData] = useState({})
  const CreateInitialVideoDataRecord = useMutation(api.videoData.CreateVideoData)
  const [loading, setLoading] = useState(false)
  const { user } = useAuthContext()

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }))
  }

  const GenerateVideo = async () => {
    if (user?.credits <= 0) {
      toast.error('Please add more credits!')
      return;
    }
    // Basic validation check
    // Note: Adjust fields based on what is strictly required
    if (!formData?.topic || !formData?.videoStyle || !formData?.voice) {
      toast.error('Please fill in the required fields!')
      return;
    }
    
    setLoading(true)

    try {
        // 1. Save initial record
        const resp = await CreateInitialVideoDataRecord({
          title: formData.title || "Untitled Video",
          topic: formData.topic,
          script: formData.script || "",
          videoStyle: formData.videoStyle,
          caption: formData.caption || {},
          voice: formData.voice,
          bgMusic: formData.bgMusic || "",
          uid: user?._id,
          createdBy: user?.email,
          credits: user?.credits
        });

        // 2. Trigger Generation API
        const result = await axios.post('/api/generate-video-data', {
          ...formData,
          recordId: resp
        });
        
        console.log(result);
        toast.success("Video generation started!");
        
    } catch (error) {
        console.error(error);
        toast.error("Something went wrong during generation.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className='min-h-screen pt-10 pb-32 px-4 md:px-8 relative overflow-hidden transition-colors duration-300
                    bg-zinc-50 dark:bg-black selection:bg-yellow-500/30'>
      
      {/* --- Ambient Background --- */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none 
                    bg-yellow-200/40 dark:bg-orange-500/5" />
      <div className="absolute top-20 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none 
                    bg-orange-100/40 dark:bg-yellow-500/5" />

      <motion.div 
        className='max-w-7xl mx-auto relative z-10'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* --- Header --- */}
        <motion.div variants={itemVariants} className="mb-10">
            <h2 className='text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white'>
                Create New <span className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-400 dark:to-orange-500'>Video</span>
            </h2>
            <p className="mt-2 text-lg text-zinc-500 dark:text-gray-400">
                Fill in the details below to generate your viral short.
            </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
          
          {/* --- LEFT COLUMN: Form Steps --- */}
          <motion.div variants={itemVariants} className='lg:col-span-2 space-y-8'>
            
            {/* We wrap each component in a clean styled block if they don't have their own cards, 
                or rely on their internal styling if they do. Assuming they need spacing. */}
            
            <div className="space-y-8">
                <SectionWrapper title="Topic & Script" icon={Video}>
                    <Topic onHandleInputChange={onHandleInputChange} />
                </SectionWrapper>

                <SectionWrapper title="Visual Style" icon={Sparkles}>
                    <VideoStyle onHandleInputChange={onHandleInputChange} />
                </SectionWrapper>

                <SectionWrapper title="Audio Settings" icon={WandSparkles}>
                    <div className="space-y-6">
                        <Voice onHandleInputChange={onHandleInputChange} />
                        <BgMusic onHandleInputChange={onHandleInputChange} />
                    </div>
                </SectionWrapper>

                <SectionWrapper title="Captions" icon={Video}>
                    <Captions onHandleInputChange={onHandleInputChange} />
                </SectionWrapper>
            </div>

          </motion.div>

          {/* --- RIGHT COLUMN: Sticky Preview --- */}
          <motion.div variants={itemVariants} className='lg:block'>
            <div className='sticky top-24'>
                <div className="rounded-3xl border shadow-xl overflow-hidden
                              bg-white border-zinc-200 
                              dark:bg-zinc-900/50 dark:border-white/10 dark:backdrop-blur-md">
                    <div className="p-4 border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/5">
                        <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">Live Preview</h3>
                    </div>
                    <div className="p-6">
                        <Preview formData={formData} />
                    </div>
                </div>
                
                {/* Credit Balance Badge (Desktop) */}
                <div className="mt-6 p-4 rounded-2xl border flex items-center justify-between
                              bg-yellow-50 border-yellow-200
                              dark:bg-yellow-500/10 dark:border-yellow-500/20">
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Available Credits</span>
                    <span className="text-lg font-bold text-yellow-700 dark:text-yellow-500">{user?.credits || 0}</span>
                </div>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* --- FLOATING BOTTOM BAR (Action Dock) --- */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className='fixed bottom-8 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none'
      >
        <button
            disabled={loading}
            onClick={GenerateVideo}
            className={`pointer-events-auto group relative flex items-center gap-4 py-4 px-8 pr-10 rounded-full shadow-2xl transition-all duration-300
                       ${loading ? 'cursor-not-allowed opacity-90' : 'hover:scale-105 active:scale-95 cursor-pointer'}
                       bg-gradient-to-r from-zinc-900 to-zinc-800 text-white
                       dark:bg-gradient-to-r dark:from-yellow-400 dark:to-orange-500 dark:text-black`}
        >
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl bg-yellow-500" />
            
            <div className="relative flex items-center gap-3">
                {loading ? (
                    <Loader2Icon className='w-6 h-6 animate-spin text-yellow-400 dark:text-black' />
                ) : (
                    <div className="p-2 rounded-full bg-white/10 dark:bg-black/10">
                        <WandSparkles className="w-5 h-5 text-yellow-400 dark:text-black" />
                    </div>
                )}
                
                <div className="text-left">
                    <div className="font-bold text-lg leading-none">
                        {loading ? 'Generating Magic...' : 'Generate Video'}
                    </div>
                    <div className="text-xs opacity-60 mt-1 font-medium">
                        Cost: 1 Credit • Balance: {user?.credits}
                    </div>
                </div>
            </div>
            
            {/* Arrow/Chevron */}
            {!loading && (
                <div className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    <Sparkles className="w-4 h-4 text-yellow-400 dark:text-black" />
                </div>
            )}
        </button>
      </motion.div>

    </div>
  )
}

// Helper wrapper to ensure consistent card styling for form sections
const SectionWrapper = ({ title, icon: Icon, children }) => (
    <div className="rounded-3xl border transition-all duration-300
                  bg-white border-zinc-200 shadow-sm
                  dark:bg-[#0a0a0a] dark:border-white/10 dark:shadow-none">
        {title && (
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/5 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-500/10">
                    <Icon className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-gray-100">{title}</h3>
            </div>
        )}
        <div className="p-6 md:p-8">
            {children}
        </div>
    </div>
)

export default CreateNewVideo