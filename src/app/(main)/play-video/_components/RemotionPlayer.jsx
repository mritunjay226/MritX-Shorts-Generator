'use client';
import React, { useMemo } from 'react'
import { Player } from "@remotion/player";
import RemotionComposition from '@/components/RemotionComposition';

const RemotionPlayer = ({ videoData }) => {

  // compute duration once safely
  const durationInFrames = useMemo(() => {
    const fps = 30;

    const lastCaptionEnd = videoData?.captionJson?.length
      ? videoData.captionJson[videoData.captionJson.length - 1].end
      : 1;

    return Math.floor(lastCaptionEnd * fps);
  }, [videoData]);

  return (
    <div>
      <Player
        component={RemotionComposition}
        durationInFrames={durationInFrames}
        compositionWidth={720}
        compositionHeight={1280}
        fps={30}
        controls
        style={{
          width: '25vw',
          height: '70vh'
        }}
        inputProps={{
          videoData: videoData,
        }}
      />
    </div>
  );
};

export default RemotionPlayer;
