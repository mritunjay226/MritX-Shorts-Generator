'use client'
import React, { useState } from 'react'
import { Player } from "@remotion/player";
import RemotionComposition from '@/components/RemotionComposition';
import { useVideoConfig } from 'remotion';

const RemotionPlayer = ({videoData}) => {
    const [durationInFrames, setDurationInFrame] = useState(100)
  
  return (
    <div>
      <Player
      component={RemotionComposition}
      durationInFrames={Number(durationInFrames.toFixed(0))+100}
      compositionWidth={720}
      compositionHeight={1280}
      fps={30}
      controls
      style={{
        width:'25vw',
        height:'70vh'
      }}
      inputProps={{
        videoData:videoData,
        bgMusicSrc: videoData?.bgMusic?.src,
        setDurationInFrame: (frameValue) => setDurationInFrame(frameValue)
      }}
    />
    </div>
  )
}

export default RemotionPlayer
