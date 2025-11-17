// src/RemotionRoot.jsx
import React from 'react';
import { Composition } from 'remotion';
import RemotionComposition from '@/components/RemotionComposition';

export const RemotionRoot = ({ videoData }) => {
  if (!videoData?.captionJson?.length) return null;

  const fps = 30;
  const lastCaptionEnd = videoData.captionJson[videoData.captionJson.length - 1].end;
  const durationInFrames = Math.floor(lastCaptionEnd * fps);

  return (
    <>
      <Composition
        id="FinalVideo"
        component={RemotionComposition}
        durationInFrames={durationInFrames}
        fps={fps}
        width={720}
        height={1280}
        defaultProps={{ videoData }}
      />
    </>
  );
};
