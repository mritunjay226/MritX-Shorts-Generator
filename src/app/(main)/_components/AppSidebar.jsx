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
import { Coins, CoinsIcon, Gem, HomeIcon, LucideFileVideo, Package, Search, WalletCards } from 'lucide-react'
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
  const {user}=useAuthContext();

  return (
    <Sidebar>
      <SidebarHeader >
        <div>
          <div className='flex flex-col items-start w-full mt-5'>
            <Link href={'/'} className='flex items-center'>
            <Image src={'/MritXLogo.png'} alt='logo' width={100} height={40} />
            
            </Link>
          <h2 className='text-lg text-gray-400 text-center mt-1'>AI Short Video Generator</h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className='mx-3 mt-10'>
            <Link href={'/create-new-video'}>
              <Button className="w-full">+ Create New Video</Button>
            </Link>
          </div>

          <SidebarMenu>
            {MenuItem.map((menu, index) => (
              <SidebarMenuItem key={index} className="mt-3 mx-3">
                <SidebarMenuButton className="p-5" isActive={path == menu.url}>
                  <Link href={menu?.url} className={`flex items-center gap-4 p-3  `}>
                    <menu.icon />
                    <span>{menu?.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
            <div className='p-5 border rounded-lg mb-6 bg-gray-800'>
              <div className='flex items-center justify-between'>
                <CoinsIcon className='text-yellow-400'/>
                <h2 className='text-gray-400'>{user?.credits} Credits Left</h2>
              </div>
              <Button className='w-full mt-3'>Buy Credits</Button>
            </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
