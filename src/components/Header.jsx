'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { useAuthContext } from '@/app/provider'
import Link from 'next/link'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'

const Header = () => {
  const { isSignedIn } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  // Example tools list
  const toolsList = [
    { name: 'Video Generator', href: '/create-new-video' },
    { name: 'Ad Maker', href: '/create-new-ad' },
    { name: 'Dashboard', href: '/dashboard' },
  ];
  return (
    <header className="p-4 flex items-center justify-between bg-black/70 relative z-30">
      <div className='flex items-center gap-3'>
        <Link href={'/'} className='flex items-center gap-2'>
          <Image src={'/MritXLogoF.png'} alt='logo' width={120} height={60} />
        </Link>
      </div>
      {/* Desktop menu */}
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/features" className="text-white hover:text-yellow-400 transition">Features</Link>
        <div className="relative group">
          <button
            className="text-white hover:text-yellow-400 transition flex items-center gap-1 focus:outline-none"
            onClick={() => setToolsOpen((v) => !v)}
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
            aria-haspopup="true"
            aria-expanded={toolsOpen}
            type="button"
          >
            Tools
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {toolsOpen && (
            <div
              className="absolute left-0 mt-2 w-44 bg-black/95 rounded-xl shadow-lg py-2 z-50 animate-fade-in"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              {toolsList.map((tool) => (
                <Link key={tool.href} href={tool.href} className="block px-4 py-2 text-white hover:bg-yellow-500/10 rounded transition">
                  {tool.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link href="/contact" className="text-white hover:text-yellow-400 transition">Contact</Link>
        <Link href="/about" className="text-white hover:text-yellow-400 transition">About</Link>
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <Button>Get Started</Button>
          </SignInButton>
        ) : (
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" appearance={{
              elements: {
                avatarBox: "w-12 h-12"
              }
            }} />
          </div>
        )}
      </nav>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        aria-label="Open menu"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className={`block w-7 h-0.5 bg-white mb-1 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-7 h-0.5 bg-white mb-1 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-7 h-0.5 bg-white transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>
      {/* Mobile drawer menu */}
      <div
        className={`fixed left-0 top-0 w-full bg-black/95 z-50 transition-transform duration-300 md:hidden ${menuOpen ? 'translate-y-0' : '-translate-y-full'} shadow-2xl`}
        style={{ minHeight: '60vh' }}
      >
        <div className="flex flex-col gap-2 p-6 pt-20 relative">
          <button
            className="absolute top-4 right-4 w-10 h-10 flex flex-col items-center justify-center"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <span className="block w-7 h-0.5 bg-white mb-1 rotate-45 translate-y-2"></span>
            <span className="block w-7 h-0.5 bg-white opacity-0"></span>
            <span className="block w-7 h-0.5 bg-white -rotate-45 -translate-y-2"></span>
          </button>
          <Link href="/features" className="text-white text-lg py-2 px-2 rounded hover:bg-yellow-500/10 transition" onClick={() => setMenuOpen(false)}>Features</Link>
          <button
            className="text-white text-lg py-2 px-2 rounded flex items-center justify-between hover:bg-yellow-500/10 transition"
            onClick={() => setMobileToolsOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={mobileToolsOpen}
            type="button"
          >
            <span>Tools</span>
            <svg className={`w-4 h-4 ml-2 transition-transform ${mobileToolsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {mobileToolsOpen && (
            <div className="pl-4 flex flex-col gap-1">
              {toolsList.map((tool) => (
                <Link key={tool.href} href={tool.href} className="block px-2 py-2 text-white hover:bg-yellow-500/10 rounded transition text-base" onClick={() => setMenuOpen(false)}>
                  {tool.name}
                </Link>
              ))}
            </div>
          )}
          <Link href="/contact" className="text-white text-lg py-2 px-2 rounded hover:bg-yellow-500/10 transition" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/about" className="text-white text-lg py-2 px-2 rounded hover:bg-yellow-500/10 transition" onClick={() => setMenuOpen(false)}>About</Link>
          <div className="mt-4">
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <Button className="w-full">Get Started</Button>
              </SignInButton>
            ) : (
              <div className="flex justify-center">
                <UserButton afterSignOutUrl="/" appearance={{
                  elements: {
                    avatarBox: "w-12 h-12"
                  }
                }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
