import { Film } from 'lucide-react';
import Image from 'next/image'
import React, { useState } from 'react'

export const options=[
    {
        name:"Realistic",
        image:"/realistic.webp"
    },
    {
        name:'Cinematic',
        image:"/cinematic2.png"
    },
    {
        name:'Cartoon',
        image:"/3d.webp"
    },
    {
        name:'Watercolor',
        image:"/watercolor.jpg"
    },
    {
        name:'Cyberpunk',
        image:"/cyberpunk.webp"
    },
    {
        name:'GTA',
        image:"/gta.webp"
    },
    {
        name:'Anime',
        image:"/anim.webp"
    }
]

const VideoStyle = ({onHandleInputChange}) => {
    const [selectedStyle, setSelectedStyle] = useState();
  return (
    <div className='p-4 border border-gray-800 rounded-xl'>
        <h2 className='flex items-center gap-2'><Film className='text-blue-500'/> Video Style</h2>
        <p className='text-sm text-gray-400 mb-1'>Select video style</p>
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
            {options.map((option,index)=>(
                <div className='relative' key={index} onClick={()=>{setSelectedStyle(option.name);
                onHandleInputChange("videoStyle",option.name)}}>
                    <Image
                    src={option.image}
                    alt={option.name}
                    width={500}
                    height={120}
                    className={`object-cover h-[90px]
                    lg:h-[130px] xl:h-[180px] rounded-lg p-1 
                    hover:border border-gray-300 cursor-pointer
                    ${option.name==selectedStyle && 'border'}
                    `}
                    />
                    <h2 className='absolute bottom-1 text-center w-full text-shadow-lg'>{option.name}</h2>
                </div>
            ))}
        </div>
    </div>
  )
}

export default VideoStyle
