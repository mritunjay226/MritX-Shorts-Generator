'use client'
import { SignIn } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Sparkles, Quote } from 'lucide-react'
import Image from 'next/image'

export default function Page() {
  return (
    <div className="h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-zinc-50 dark:bg-black transition-colors duration-300">
      
      {/* --- LEFT SIDE: Image & Branding (Hidden on Mobile) --- */}
      <div className="hidden lg:flex relative h-full w-full flex-col justify-between p-12 text-white">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-zinc-900 z-0">
            <Image 
                src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop" 
                alt="Abstract Gold Fluid"
                fill
                className="object-cover opacity-90"
                priority
            />
            {/* Gradient Overlays for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
            <div className="absolute inset-0 bg-yellow-500/10 mix-blend-overlay" />
        </div>

        {/* Logo Area */}
        <div className="relative z-10 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                 <span className="text-white font-bold text-xl">M</span>
             </div>
             <span className="text-2xl font-bold tracking-tight">
                MritX <span className="text-yellow-400">SG</span>
             </span>
        </div>

        {/* Testimonial / Content Area */}
        <div className="relative z-10 max-w-lg space-y-6">
            <div className="p-3 w-fit rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400/50" />
            </div>
            
            <blockquote className="text-2xl font-medium leading-relaxed tracking-tight">
                "The AI workflow here is unmatched. I can generate an entire week's worth of viral shorts in a single afternoon. It's pure magic."
            </blockquote>
            
            <div className="flex items-center gap-4 pt-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-600 border-2 border-white/20 flex items-center justify-center text-sm font-bold">
                    JD
                </div>
                <div>
                    <div className="font-semibold text-white">Jason Davis</div>
                    <div className="text-sm text-white/60">Content Creator (1.2M+ Subs)</div>
                </div>
            </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: Form Area --- */}
      <div className="relative flex h-full w-full flex-col items-center justify-center p-6 lg:p-10">
         
         {/* Subtle Background Pattern for Form Side */}
         <div className="absolute inset-0 w-full h-full pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-yellow-500/5 blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[120px]" />
         </div>

         {/* Mobile Logo (Visible only on small screens) */}
         <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center">
                 <span className="text-white font-bold text-sm">M</span>
             </div>
             <span className="text-xl font-bold text-zinc-900 dark:text-white">MritX</span>
         </div>

         <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-[400px] relative z-10 flex flex-col justify-center"
         >
            <div className="mb-8 text-center lg:text-left">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                    Welcome back
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-base">
                    Enter your details to access your creative workspace.
                </p>
            </div>

            <SignIn />
            
            <p className="mt-8 text-center text-xs text-zinc-400">
                By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
         </motion.div>
      </div>

    </div>
  )
}