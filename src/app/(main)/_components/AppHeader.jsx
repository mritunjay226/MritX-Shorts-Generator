'use client'
import { useAuthContext } from '@/app/provider'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/clerk-react'
import React from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import { Sparkles } from 'lucide-react'

const AppHeader = () => {
  const { user } = useAuthContext()

  return (
    <header className="sticky top-0 z-30 w-full transition-colors duration-300
                       bg-white/80 border-b border-zinc-200 backdrop-blur-xl
                       dark:bg-black/80 dark:border-white/10">
      
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* --- LEFT: Sidebar Trigger & Title --- */}
        <div className="flex items-center gap-4">
          <div className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition-colors">
            <SidebarTrigger className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </div>
          
          {/* Optional: Dashboard Breadcrumb/Title */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-zinc-400 dark:text-zinc-600">/</span>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">Dashboard</span>
          </div>
        </div>

        {/* --- RIGHT: Controls & Profile --- */}
        <div className="flex items-center gap-4">
          
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile Section */}
          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-white/10">
              {/* Welcome Text (Hidden on mobile) */}
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-500" /> 
                  Welcome back
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white leading-none">
                  {user?.name || 'Creator'}
                </span>
              </div>
              
              <div className="ring-2 ring-transparent hover:ring-yellow-500/50 rounded-full transition-all duration-300">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

export default AppHeader