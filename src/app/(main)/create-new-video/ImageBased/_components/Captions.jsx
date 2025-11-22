import { Captions as CaptionsIcon, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react'

const options = [
    {
        name: 'Youtuber',
        style: 'text-yellow-400 font-extrabold uppercase tracking-wide drop-shadow-md'
    },
    {
        name: 'Supreme',
        style: 'text-white font-bold italic drop-shadow-lg'
    },
    {
        name: "Neon",
        style: 'text-green-500 font-extrabold uppercase tracking-wide drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]'
    },
    {
        name: "Glitch",
        style: "text-pink-500 font-extrabold uppercase tracking-wide drop-shadow-[2px_2px_0_rgba(0,255,255,0.7)]"
    },
    {
        name: "Fire",
        style: "text-red-500 font-extrabold uppercase drop-shadow-md"
    },
    {
        name: "Futuristic",
        style: "text-blue-400 font-semibold uppercase tracking-widest drop-shadow-sm"
    }
]

const Captions = ({ onHandleInputChange }) => {
    const [selectedCaptionStyle, setSelectedCaptionStyle] = useState();

    return (
        <div className='transition-all duration-300'>
            
            {/* Header */}
            <h2 className='flex items-center gap-2 font-semibold text-lg text-zinc-900 dark:text-white mb-1'>
                <span className='p-1.5 rounded-md bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400'>
                    <CaptionsIcon className="w-4 h-4" />
                </span>
                Caption Style
            </h2>
            <p className='text-sm text-zinc-500 dark:text-gray-400 ml-9 mb-4'>
                Select how your subtitles will look on screen.
            </p>

            {/* Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                {options.map((option, index) => {
                    const isSelected = option.name === selectedCaptionStyle;

                    return (
                        <div 
                            key={index}
                            onClick={() => {
                                setSelectedCaptionStyle(option.name);
                                onHandleInputChange('caption', option)
                            }}
                            className={`group relative p-3 rounded-xl cursor-pointer border transition-all duration-200
                                ${isSelected 
                                    ? 'bg-yellow-50 border-yellow-500 ring-1 ring-yellow-500 dark:bg-yellow-500/10 dark:border-yellow-500' 
                                    : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-md dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700'
                                }
                            `}
                        >
                            {/* Preview Box (Simulating Video Background) */}
                            {/* We keep this dark in both modes so white captions are visible */}
                            <div className="h-24 w-full bg-zinc-950 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden border border-zinc-100/10">
                                {/* Grid Pattern to simulate transparency/video */}
                                <div className="absolute inset-0 opacity-20" 
                                     style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '10px 10px' }} 
                                />
                                
                                <h2 className={`${option.style} text-xl text-center px-2 relative z-10`}>
                                    {option.name}
                                </h2>
                            </div>

                            {/* Footer Label */}
                            <div className="flex items-center justify-between px-1">
                                <span className={`text-sm font-medium transition-colors 
                                    ${isSelected ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200'}`}>
                                    {option.name}
                                </span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-yellow-500" />}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Captions