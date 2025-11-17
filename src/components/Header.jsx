'use client'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { useAuthContext } from '@/app/provider'
import Link from 'next/link'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'

const Header = () => {
  const { isSignedIn } = useUser();
  return (
    <div className='p-4 flex items-center justify-between bg-black/70'>
      <div className='flex items-center gap-3'>
        <Link href={'/'} className='flex items-center gap-2'>
          <Image src={'/MritXLogoF.png'} alt='logo' width={120} height={60} />

        </Link>
      </div>
      <div>
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <Button>Get Started</Button>
          </SignInButton>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button className='text-white flex gap-2 items-center bg-gradient-to-r from-yellow-400 to-orange-600'>Dashboard</Button>
            </Link>
            
 <UserButton afterSignOutUrl="/" appearance={{
      elements: {
        avatarBox: "w-12 h-12"
      }
    }} />          </div>
        )}
      </div>
    </div>
  )
}

export default Header
