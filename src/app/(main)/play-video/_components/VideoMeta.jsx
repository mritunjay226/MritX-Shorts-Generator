'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileText, Calendar, Copy, Check } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import { toast } from 'sonner'

const VideoMeta = ({ videoData }) => {
  const [downloadUrl, setDownloadUrl] = useState(videoData?.downloadUrl)
  const [isCopied, setIsCopied] = useState(false)

  // Update download url if data changes (e.g. finishes processing)
  if (videoData?.downloadUrl && videoData.downloadUrl !== downloadUrl) {
      setDownloadUrl(videoData.downloadUrl);
  }

  const handleCopyScript = () => {
    if (videoData?.script) {
        navigator.clipboard.writeText(videoData.script)
        setIsCopied(true)
        toast.success("Script copied to clipboard")
        setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className="group relative p-6 md:p-8 rounded-3xl border transition-all duration-300
                    bg-white border-zinc-200 shadow-sm hover:shadow-md
                    dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-none dark:hover:border-zinc-700">
      
      {/* Subtle Glow */}
      {/* <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}

      {/* Header Section */}
      <div className="relative z-10 mb-8">
        <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold leading-tight text-zinc-900 dark:text-white">
              {videoData?.title || "Untitled Video"}
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 shrink-0">
                {videoData?.duration ? `${Math.round(videoData.duration)}s` : 'SHORT'}
            </span>
        </div>
        
        <div className="flex items-center gap-3 text-sm font-medium mt-3 text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
             <Calendar className="w-3.5 h-3.5" />
             <span>{moment(videoData?._creationTime).format('MMM Do, YYYY')}</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span>{moment(videoData?._creationTime).fromNow()}</span>
        </div>
      </div>

      {/* Script Area */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    <FileText className="w-4 h-4" />
                </div>
                Video Script
            </div>
            
            <button 
                onClick={handleCopyScript}
                className="text-xs flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors
                         text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100
                         dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
            >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? 'Copied' : 'Copy'}
            </button>
        </div>
        
        <div className='relative pl-4 border-l-2 border-yellow-500/30'>
            <p className='text-base leading-relaxed text-zinc-600 dark:text-zinc-300 max-h-[200px] overflow-y-auto custom-scrollbar pr-2'>
              {videoData?.script || "No script available."}
            </p>
        </div>
      </div>

      {/* Action Buttons */}
      {downloadUrl ? (
        <div className="flex flex-col gap-3">
            <Link
              href={downloadUrl}
              download
              target="_blank"
              className="w-full"
            >
              <Button 
                className="w-full py-6 rounded-xl text-lg font-bold shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.02] active:scale-[0.98]
                           bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 border-0"
              >
                <Download className="mr-2 w-5 h-5" />
                Download Video
              </Button>
            </Link>
            <p className="text-xs text-center text-zinc-400 dark:text-zinc-600">
                Ready for TikTok, Reels & Shorts (9:16)
            </p>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 font-medium">Processing Video...</p>
            <div className="h-1.5 w-3/4 mx-auto bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 animate-[pulse_1s_ease-in-out_infinite] w-full opacity-80" />
            </div>
        </div>
      )}
    </div>
  )
}

export default VideoMeta