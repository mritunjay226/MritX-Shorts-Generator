"use client"
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CoinsIcon, HomeIcon, LucideFileVideo, Package, Search, WalletCards, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthContext } from '@/app/provider'

const MenuItem = [
  {
    title: "Home",
    url: "/dashboard",
    icon: HomeIcon
  },
  {
    title: "Short Video",
    url: "/create-new-video",
    icon: LucideFileVideo
  },
  {
    title: "Product Ads",
    url: "/create-new-ad",
    icon: Package
  },
  {
    title: "Explore",
    url: "/explore",
    icon: Search
  },
  {
    title: "Billing",
    url: "/billing",
    icon: WalletCards
  },
]

const AppSidebar = () => {
  const path = usePathname();
  const { user } = useAuthContext();

  return (
    <Sidebar className="border-r border-zinc-200 dark:border-white/5 bg-white dark:bg-black">

      {/* --- Header --- */}
      <SidebarHeader className="pb-4">
        <div className='px-4 pt-6'>
          <Link href={'/'} className='flex items-center gap-4 mb-2'>
            <div className="relative w-8 h-8 ">
              {/* Ensure you have a logo that works on both or use CSS filters */}
              <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <span className="text-black font-bold text-xl">M</span>
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
              MritX <span className="text-yellow-500">SG</span>
            </span>
          </Link>
          <p className='text-xs font-medium text-zinc-500 dark:text-zinc-400 pl-1'>
            AI Video Generator Suite
          </p>
        </div>
      </SidebarHeader>

      {/* --- Content --- */}
      <SidebarContent className="px-2">
        <SidebarGroup>

          {/* CTA Button */}
          <div className='mb-8 mt-4 px-2'>
            <Link href={'/create-new-video'}>
              <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Sparkles className="w-4 h-4 mr-2 fill-black/10" />
                Create New Video
              </Button>
            </Link>
          </div>

          {/* Navigation */}
          <SidebarMenu>
            {MenuItem.map((menu, index) => {
              const isActive = path === menu.url;
              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={`
                        w-full justify-start text-base font-medium h-12 rounded-xl transition-all duration-200
                        ${isActive
                        ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200'
                      }
                    `}
                  >
                    <Link href={menu.url} className="flex items-center gap-3 px-3">
                      <menu.icon className={`w-5 h-5 ${isActive ? 'fill-current' : 'opacity-70'}`} />
                      <span>{menu.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* --- Footer (Credits) --- */}
      <SidebarFooter className="p-4">
        <div className='rounded-2xl p-4 border transition-colors
                      bg-zinc-50 border-zinc-200 
                      dark:bg-zinc-900 dark:border-zinc-800'>

          <div className='flex items-center justify-between mb-3'>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                <CoinsIcon className='w-4 h-4' />
              </div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white">Credits</span>
            </div>
            <span className='text-sm font-mono font-bold text-zinc-700 dark:text-zinc-300'>
              {user?.credits || 0}
            </span>
          </div>

          {/* Visual Progress Bar (Mockup based on standard 10 credits pack) */}
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-yellow-500 rounded-full"
              style={{ width: `${Math.min(((user?.credits || 0) / 10) * 100, 100)}%` }}
            />
          </div>

          <Button
            variant="outline"
            className='w-full border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs h-9'
          >
            <Zap className="w-3 h-3 mr-2 text-yellow-500" />
            Buy More
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar