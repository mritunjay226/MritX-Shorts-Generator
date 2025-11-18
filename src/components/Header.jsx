'use client'

import React, { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, Video, MonitorPlay, LayoutDashboard, Sparkles } from 'lucide-react'

import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'

// (Clerk's `useUser` is imported above; no local mock needed)

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useUser();

  // Handle scroll effect for the glassmorphism intensity
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toolsList = [
    { name: 'Video Generator', href: '/create-new-video', icon: Video },
    { name: 'Ad Maker', href: '/create-new-ad', icon: MonitorPlay },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* 🔹 LOGO AREA */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* Replace this div with your <Image /> component */}
            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-black font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight group-hover:text-yellow-400 transition-colors">
              MritX <span className="text-yellow-500">SG</span>
            </span>
          </Link>

          {/* 🔹 DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/features">Features</NavLink>
            
            {/* Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button 
                className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors py-2"
                onClick={() => setToolsOpen(!toolsOpen)}
              >
                Tools
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 w-60 transition-all duration-200 origin-top ${
                toolsOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
              }`}>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl shadow-yellow-500/10 p-2 overflow-hidden">
                  {toolsList.map((tool) => (
                    <Link 
                      key={tool.href} 
                      href={tool.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 group transition-colors"
                    >
                      <tool.icon className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                      <span className="text-sm text-gray-200 group-hover:text-white font-medium">
                        {tool.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/about">About</NavLink>

            {/* Divider */}
            <div className="h-6 w-px bg-white/10 mx-2"></div>

            {/* Auth Buttons */}
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button className="relative px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                  Get Started
                </button>
              </SignInButton>
            ) : (
               <UserButton afterSignOutUrl="/" />
            )}
          </nav>

          {/* 🔹 MOBILE HAMBURGER */}
          <button 
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors z-50 relative"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 🔹 MOBILE DRAWER */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-lg md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-[#0f0f0f] border-l border-white/10 shadow-2xl p-6 pt-24 transform transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside drawer
        >
          <div className="flex flex-col gap-6">
            <MobileLink href="/features" onClick={() => setMenuOpen(false)}>Features</MobileLink>
            
            {/* Mobile Tools Section */}
            <div className="border-y border-white/5 py-4 my-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Tools</p>
              {toolsList.map((tool) => (
                <Link 
                  key={tool.href} 
                  href={tool.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <tool.icon className="w-5 h-5 text-yellow-500" />
                  {tool.name}
                </Link>
              ))}
            </div>

            <MobileLink href="/contact" onClick={() => setMenuOpen(false)}>Contact</MobileLink>
            <MobileLink href="/about" onClick={() => setMenuOpen(false)}>About</MobileLink>
            
            <div className="mt-8">
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <button className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg shadow-lg shadow-orange-500/20 active:scale-95 transition-transform">
                    Get Started Now
                  </button>
                </SignInButton>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <UserButton afterSignOutUrl="/" />
                  <div>
                    <p className="text-sm font-medium text-white">My Account</p>
                    <p className="text-xs text-gray-400">Manage subscription</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// Helper Components for clean code
const NavLink = ({ href, children }) => (
  <Link 
    href={href} 
    className="text-sm font-medium text-gray-300 hover:text-white relative group transition-colors"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
  </Link>
)

const MobileLink = ({ href, onClick, children }) => (
  <Link 
    href={href} 
    onClick={onClick}
    className="text-2xl font-light text-white hover:text-yellow-400 transition-colors px-4"
  >
    {children}
  </Link>
)

export default Header