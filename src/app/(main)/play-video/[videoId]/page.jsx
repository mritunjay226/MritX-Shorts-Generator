'use client'
import React, { useEffect, useState } from 'react'
import RemotionPlayer from '../_components/RemotionPlayer'
import VideoMeta from '../_components/VideoMeta'
import { useConvex } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { useParams } from 'next/navigation'
import VideoEditor from '../_components/VideoEditor'
import Image from 'next/image'
import IphoneVideoPlayer from '../_components/IphoneVideoPlayer'

const PlayVideo = () => {
    const { videoId } = useParams()
    const convex = useConvex()
    const [videoData, setVideoData] = useState()

    useEffect(() => {
        videoId && GetVideoDataById()
    }, [videoId])
    const GetVideoDataById = async () => {
        const result = await convex.query(api.videoData.GetVideoById, {
            videoId: videoId
        });
        console.log(result)
        setVideoData(result)
    }
    if (!videoData) return (
        <div className="text-center h-screen w-full flex justify-center items-center -mt-6 text-gray-400 ">
            <div>
                <Image src={'/MLogo.png'} alt='logo' width={120} height={120} className='mx-auto mb-4 rounded-xl object-cover w-[120px] h-[120px] animate-pulse' />
                Loading video data...
            </div>
        </div>
    )

    return (
        <div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-5'>
                <div className='flex justify-center items-center'>
                    <IphoneVideoPlayer videoUrl={videoData?.downloadUrl} />
                </div>
                <div>
                    {/* Video Information */}
                    <VideoMeta videoData={videoData} />

                </div>
            </div>
            <VideoEditor videoId={videoId} videoData={videoData} />

        </div>

    )
}

export default PlayVideo
