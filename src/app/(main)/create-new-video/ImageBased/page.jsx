"use client"
import React, { useState } from 'react'
import Topic from './_components/Topic'
import VideoStyle from './_components/VideoStyle'
import Voice from './_components/Voice'
import Captions from './_components/Captions'
import { Button } from '@/components/ui/button'
import { Loader2Icon, WandSparkles } from 'lucide-react'
import Preview from './_components/Preview'
import axios from 'axios'
import { useMutation } from 'convex/react'
import { useAuthContext } from '@/app/provider'
import { toast } from 'sonner'
import BgMusic from './_components/BgMusic'
import { api } from '../../../../../convex/_generated/api'

const CreateNewVideo = () => {
  const [formData, setFormData] = useState()
  const CreateInitialVideoDataRecord = useMutation(api.videoData.CreateVideoData)
  const [loading, setLoading] = useState(false)
  const { user } = useAuthContext()
  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }))
    console.log(formData)
  }

  const GenerateVideo = async () => {
    if (user?.credits <= 0) {
      toast.error('Please add more credits!')
      return;
    }
    if (!formData?.topic || !formData?.caption || !formData?.videoStyle || !formData?.voice) {
      toast.error('Please fill all the fields!')
      console.log("Please fill all the fields!")
      return;
    }
    setLoading(true)

    // save video data First
    const resp = await CreateInitialVideoDataRecord({
      title: formData.title,
      topic: formData.topic,
      script: formData.script,
      videoStyle: formData.videoStyle,
      caption: formData.caption,
      voice: formData.voice,
      bgMusic: formData.bgMusic,
      uid: user?._id,
      createdBy: user?.email,
      credits: user?.credits
    });
    console.log(resp);
    const result = await axios.post('/api/generate-video-data', {
      ...formData,
      recordId: resp
    });

    console.log(result)
    setLoading(false)
  }
  return (
    <div className='relative'>
      <h2 className='text-3xl'>Create New <span className='text-pink-400 font-bold'>Video</span></h2>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-8 gap-7'>
        <div className='col-span-2 md:p-7 rounded-xl mt-8 '>
          {/* Topic & SCript */}
          <Topic onHandleInputChange={onHandleInputChange} />
          {/* Video Image Style */}
          <VideoStyle onHandleInputChange={onHandleInputChange} />
          {/* Voice */}
          <Voice onHandleInputChange={onHandleInputChange} />
          {/* Background Music */}
          <BgMusic onHandleInputChange={onHandleInputChange} />
          {/* Captions */}
          <Captions onHandleInputChange={onHandleInputChange} />
          <div className='flex flex-col bg-gradient-to-r from-pink-600  to-purple-600 items-center rounded-lg p-1 md:p-2 fixed bottom-5 left-1/2 -translate-x-1/2 max-w-sm md:max-w-md w-full cursor-pointer '
            disabled={loading}
            onClick={() => GenerateVideo()}
          >
            <h2 className='text-xl flex gap-2 items-center text-white'>
              {loading ?
                <Loader2Icon className='animate-spin' /> : <WandSparkles />}
                Generate Video
            </h2>

            <p className='text-white opacity-60 text-sm'>{user?.credits} credits to Generate videos</p>
          </div>
        </div>
        <div>
          <Preview formData={formData} />
        </div>
      </div>
<div className='h-[100px]'></div>
    </div>
  )
}

export default CreateNewVideo
