'use client'
import { useAuthContext } from '@/app/provider'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/clerk-react'
import Image from 'next/image'
import React from 'react'

const AppHeader = () => {
    const {user}=useAuthContext()
  return (
    <div className='p-3 flex justify-between items-center md:px-16 lg:px-24 xl:px-32 '>
      <SidebarTrigger />
      {user?.pictureUrl &&
      <UserButton />
}
    </div>
  )
}

export default AppHeader
