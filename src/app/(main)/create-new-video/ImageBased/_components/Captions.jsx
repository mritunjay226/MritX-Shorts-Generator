import { CaptionsIcon } from 'lucide-react';
import React, { useState } from 'react'

const options = [
    {
        name:'Youtuber',
        style: 'text-yellow-400 text-3xl font-extrabold uppercase traking-wide drop-shadow-md px-3 py-1 rounded-lg'
    },
    {
        name:'Supreme',
        style:'text-white text-3xl font-bold italic drop-shadow-lg px-3 py-1 rounded-lg'
    },
    {
        name:"Neon",
        style:'text-green-500 text-3xl font-extrabold uppercase tracking-wide drop-shadow-lg px-3 py-1 rounded-lg'

    },
    {
        name:"Glitch",
        style:"text-pink-500 text-3xl font-extrabold uppercase tracking-wide drop-shadow-[4px_4px_0_rga(0,0,0,0.2)] px-3 py-1 rounded-lg"
    },
    {
        name:"Fire",
        style:"text-red-500 text-3xl font-extrabold uppercase px-3 py-1 rounded-lg"
    },
    {
        name:"Futuristic",
        style:"text-blue-500 text-3xl font-semibold uppercase tracking-wide px-3 py-1 rounded-lg"
    }
]
const Captions = ({ onHandleInputChange }) => {
    const [selectedCaptionStyle, setSelectedCaptionStyle] = useState();
  return (
    <div className='mt-8 p-4 border border-gray-800 rounded-xl'>
      <h2 className='flex items-center gap-2'><CaptionsIcon className='text-green-600'/>Caption Style</h2>
      <p className='text-sm text-gray-400 mb-1'>Select caption style</p>
    
        <div className='flex flex-wrap gap-4'>
            {options.map((option,index)=>(
                <div key={index} 
                className={`p-2 bg-slate-900 hover:border border-gray-300 cursor-pointer rounded-lg
                ${option.name == selectedCaptionStyle && 'border'}`} 
                onClick={()=>{
                    setSelectedCaptionStyle(option.name);
                    onHandleInputChange('caption',option)
                }}
                >
                    <h2 className={option.style}>{option.name}</h2>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Captions
