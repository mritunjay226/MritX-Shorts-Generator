"use client"
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2Icon, Pen, SparklesIcon, TextCursorInput, Sparkles, PencilLine } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useAuthContext } from '@/app/provider'
import { motion, AnimatePresence } from 'framer-motion'

const Suggestions = [
  "History Story",
  "Kids Story",
  "Movie Stories",
  "AI Innovation",
  "Space Mysteries",
  "Horror Stories",
  "Mythological Tales",
  "Tech Reviews",
  "True Crime Stories",
  "Fantasy Adventures",
  "Science Experiments",
  "Motivational Stories",
]

const Topic = ({ onHandleInputChange }) => {
  const [selectedTopic, setSelectedTopic] = useState();
  const [selectedScriptIndex, setSelectedScriptIndex] = useState();
  const [scripts, setScripts] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();

  const GenerateScript = async () => {
    if (user?.credits <= 0) {
      toast('Please add more credits!')
    }
    setLoading(true)
    setSelectedScriptIndex(null)
    try {
      const result = await axios.post('/api/generate-script', {
        topic: selectedTopic
      });
      setScripts(result.data.scripts)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <div className='relative transition-all duration-300'>
      
      {/* 1. Project Title Section */}
      <div className='mb-6'>
          <h2 className='mb-2 flex items-center gap-2 font-semibold text-lg text-zinc-900 dark:text-white'>
             <span className='p-1.5 rounded-md bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400'>
                <TextCursorInput className="w-4 h-4" />
             </span>
             Project Title
          </h2>
          <Input 
            placeholder='Enter a catchy title for your video' 
            onChange={(event) => onHandleInputChange("title", event?.target.value)}
            className="h-12 text-base bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-yellow-500"
          />
      </div>

      <div className='border-t border-zinc-200 dark:border-white/10 my-6' />

      {/* 2. Topic Selection Section */}
      <div>
        <h2 className='flex items-center gap-2 font-semibold text-lg text-zinc-900 dark:text-white'>
            <span className='p-1.5 rounded-md bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400'>
                <PencilLine className="w-4 h-4" />
            </span>
            Video Topic
        </h2>
        <p className='text-sm text-zinc-500 dark:text-gray-400 ml-9 mb-4'>What is your video about?</p>

        <Tabs defaultValue="suggestion" className="w-full">
          <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl w-full md:w-auto h-auto grid grid-cols-2 mb-4">
            <TabsTrigger 
                value="suggestion"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800 py-2"
            >
                Suggestions
            </TabsTrigger>
            <TabsTrigger 
                value="your_topic"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800 py-2"
            >
                Custom Topic
            </TabsTrigger>
          </TabsList>
          
          {/* Suggestion Grid */}
          <TabsContent value="suggestion">
            <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
              {Suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border text-left
                            ${suggestion === selectedTopic 
                                // Selected State
                                ? 'bg-yellow-500 border-yellow-500 text-white shadow-md transform scale-[1.02]' 
                                // Default State
                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-yellow-400 hover:bg-yellow-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-gray-300 dark:hover:border-yellow-500/50 dark:hover:bg-white/5'
                            }`}
                  onClick={() => {
                    setSelectedTopic(suggestion)
                    onHandleInputChange("topic", suggestion)
                  }}
                >
                    {suggestion}
                </button>
              ))}
            </div>
          </TabsContent>
          
          {/* Custom Topic Input */}
          <TabsContent value="your_topic">
             <Textarea 
                placeholder='Describe your video topic in detail... (e.g. The secret history of the pyramids)'
                onChange={(event) => onHandleInputChange("topic", event?.target.value)}
                className="min-h-[150px] resize-none bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-base p-4 focus:ring-yellow-500"
             />
          </TabsContent>
        </Tabs>
      </div>

      {/* 3. Generate Script Button */}
      <div className='mt-6 flex justify-end'>
          <Button 
            disabled={loading || !selectedTopic} // Disable if no topic selected
            onClick={GenerateScript}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20 rounded-xl py-6 px-8 text-base"
          >
             {loading ? <Loader2Icon className='animate-spin mr-2' /> : <Sparkles className="w-5 h-5 mr-2" />} 
             {loading ? 'Writing Script...' : 'Generate Script'}
          </Button>
      </div>

      {/* 4. Script Selection (Conditional Render) */}
      <AnimatePresence>
        {scripts && scripts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-8 pt-8 border-t border-zinc-200 dark:border-white/10'
          >
            <h2 className='flex items-center gap-2 font-semibold text-lg text-zinc-900 dark:text-white mb-4'>
                <Sparkles className="w-5 h-5 text-yellow-500" /> Select a Script Version
            </h2>
            <div className='grid grid-cols-1 gap-4'>
              {scripts.map((script, index) => (
                <div 
                    key={index} 
                    className={`p-5 border rounded-2xl cursor-pointer transition-all duration-200
                        ${selectedScriptIndex === index 
                            // Selected
                            ? 'bg-yellow-50 border-yellow-500 ring-1 ring-yellow-500 dark:bg-yellow-500/10 dark:border-yellow-500' 
                            // Default
                            : 'bg-white border-zinc-200 hover:border-yellow-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700'
                        }`}
                    onClick={() => {
                        setSelectedScriptIndex(index);
                        onHandleInputChange("script", script.content);
                    }}
                >
                  <div className="flex justify-between items-start mb-2">
                     <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md
                         ${selectedScriptIndex === index ? 'bg-yellow-200 text-yellow-800' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                        Option {index + 1}
                     </span>
                  </div>
                  <p className='text-sm leading-relaxed text-zinc-600 dark:text-gray-300'>
                    {script.content}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  )
}

export default Topic