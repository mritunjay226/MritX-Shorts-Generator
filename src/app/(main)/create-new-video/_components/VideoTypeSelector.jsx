import { Button } from '@/components/ui/button'
import Image from 'next/image'
import path from 'path'
import React from 'react'

const AdsToolsList = [
    {
        name: 'Image Based Video',
        desc: 'Generate stunning product images with AI technology.',
        bannerImage:'/product-image.png',
        path:'/ImageBased'
    },
    {
        name: 'Clip Based Video',
        desc: 'Create engaging product videos using AI tools.',
        bannerImage:'/product-video.png',
        path:'/ClipBased'
    },
]
const ToolList = () => {
  return (
    <div>
      <h2 className='font-bold text-2xl mb-2'>Creative AI Tools</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
            {AdsToolsList.map((tool, index) => (
                <div key={index} className='p-7 rounded-2xl bg-zinc-800 flex items-center justify-between'>
                    <div>
                        <h2 className='font-bold text-2xl'>{tool.name}</h2>
                        <p className='opacity-60 mt-2'>{tool.desc}</p>
                        <Button className='mt-4'>Create Now</Button>
                    </div>
                    <Image src={tool.bannerImage} alt={tool.name} width={300} height={300}
                     className='w-[200px]'/>
                    
                </div>
                      ))}  
        </div>
    </div>
  )
}

export default ToolList
