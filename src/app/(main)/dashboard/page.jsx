import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import VideoList from './_components/VideoList'

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 transition-colors duration-300 p-6 md:p-10">
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- Page Header --- */}
        <div className="flex items-end justify-between mb-10">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                    My Videos
                    <span className="text-sm font-medium px-3 py-1 rounded-full 
                                   bg-yellow-100 text-yellow-700 border border-yellow-200
                                   dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20">
                        Library
                    </span>
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                    Manage and track your AI-generated content history.
                </p>
            </div>

            {/* Primary Action */}
            <Link href="/create-new-video">
                <Button className="hidden md:flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all shadow-sm">
                    <Plus className="w-4 h-4" />
                    Create New
                </Button>
            </Link>
        </div>

        {/* --- Video List Component --- */}
        <VideoList />
        
      </div>
    </div>
  )
}

export default Dashboard