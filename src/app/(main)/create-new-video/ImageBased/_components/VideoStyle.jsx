import { Film, Sparkles, Palette } from 'lucide-react';
import Image from 'next/image'
import React, { useState } from 'react'

export const options = [
    {
        name: "Realistic",
        image: "https://images.unsplash.com/photo-1696865521494-a92c11ca773c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: 'Cinematic',
        image: "https://images.unsplash.com/photo-1731575382848-96ff16bdaafc?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: 'Cartoon',
        image: "https://images.unsplash.com/photo-1676873261959-173b91552b0d?q=80&w=415&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: 'Watercolor',
        image: "https://images.unsplash.com/photo-1599797574782-fd636bdb5cd2?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: 'Cyberpunk',
        image: "https://images.unsplash.com/photo-1607419674405-256ed5bc8f69?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: 'GTA',
        image: "/gta.webp"
    },
    {
        name: 'Anime',
        image: "/anime.webp"
    }
]

const VideoStyle = ({ onHandleInputChange }) => {
    const [selectedStyle, setSelectedStyle] = useState();

    return (
        <div className='transition-all duration-300'>
            
            {/* Header */}
            <h2 className='flex items-center gap-2 font-semibold text-lg text-zinc-900 dark:text-white mb-1'>
                <span className='p-1.5 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'>
                    <Palette className="w-4 h-4" />
                </span>
                Video Style
            </h2>
            <p className='text-sm text-zinc-500 dark:text-gray-400 ml-9 mb-6'>
                Choose the aesthetic for your video generation.
            </p>

            {/* Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                {options.map((option, index) => {
                    const isSelected = option.name === selectedStyle;
                    
                    return (
                        <div 
                            key={index} 
                            onClick={() => {
                                setSelectedStyle(option.name);
                                onHandleInputChange("videoStyle", option.name)
                            }}
                            className={`relative group cursor-pointer rounded-xl overflow-hidden aspect-[4/3] transition-all duration-300
                                ${isSelected 
                                    ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-white dark:ring-offset-black shadow-lg scale-[1.02]' 
                                    : 'hover:shadow-md hover:-translate-y-1'
                                }
                            `}
                        >
                            {/* Image with Zoom Effect */}
                            <div className="absolute inset-0 w-full h-full">
                                <Image
                                    src={option.image}
                                    alt={option.name}
                                    fill
                                    className={`object-cover transition-transform duration-500 
                                        ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                                    `}
                                />
                            </div>

                            {/* Gradient Overlay for Text Readability */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300
                                ${isSelected ? 'opacity-80' : 'opacity-60 group-hover:opacity-80'}
                            `} />

                            {/* Selection Checkmark (Optional Visual Cue) */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 bg-yellow-500 text-black rounded-full p-1 shadow-sm">
                                    <Sparkles className="w-3 h-3 fill-black" />
                                </div>
                            )}

                            {/* Label */}
                            <div className="absolute bottom-0 left-0 w-full p-3">
                                <h3 className={`text-center font-bold text-sm tracking-wide transition-colors duration-300
                                    ${isSelected ? 'text-yellow-400' : 'text-white group-hover:text-white'}
                                `}>
                                    {option.name}
                                </h3>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default VideoStyle