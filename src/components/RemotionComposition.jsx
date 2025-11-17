'use client';
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';

const RemotionComposition = ({ videoData }) => {
  const captions = videoData?.captionJson || [];
  const images = videoData?.images || [];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 🔥 SAFETY CHECKS
  if (!captions.length || !images.length) return null;

  const totalDuration = captions[captions.length - 1].end * fps;
  const imageDuration = totalDuration / images.length;

  // If invalid duration → return safely
  if (!imageDuration || imageDuration < 2) return null;

  const fadeDuration = Math.min(15, imageDuration / 6);

  // Caption helper
  const getCurrentCaption = () => {
    const currentSec = frame / fps;
    const active = captions.find(c => currentSec >= c.start && currentSec <= c.end);
    return active ? active.word : '';
  };

  return (
    <AbsoluteFill style={{ background: 'black' }}>

      {/* Images */}
      {images.map((item, index) => {
        const start = index * imageDuration;

        const inputRange = [
          start,
          start + imageDuration / 2,
          start + imageDuration,
        ];

        // Avoid identical input ranges
        if (inputRange[0] === inputRange[1] || inputRange[1] === inputRange[2]) {
          return null;
        }

        const scale = interpolate(
          frame,
          inputRange,
          index % 2 === 0 ? [1, 1.15, 1] : [1.15, 1, 1.15],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const opacity = interpolate(
          frame,
          [
            start,
            start + fadeDuration,
            start + imageDuration - fadeDuration,
            start + imageDuration
          ],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <Sequence key={index} from={start} durationInFrames={imageDuration}>
            <AbsoluteFill>
              <Img
                src={item}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity,
                  transform: `scale(${scale})`,
                }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Captions */}
      <AbsoluteFill
        style={{
          position: 'absolute',
          bottom: 80,
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: 48,
            color: 'white',
            textShadow: '2px 2px 10px rgba(0,0,0,0.8)',
          }}
        >
          {getCurrentCaption()}
        </h2>
      </AbsoluteFill>

      {/* Main Audio */}
      {videoData?.audioUrl && (
        <Audio src={videoData.audioUrl} volume={1} />
      )}

      {/* Background Music */}
      {videoData?.bgMusic?.src && (
        <Sequence from={15}>
          <Audio src={videoData.bgMusic.src} volume={0.1} />
        </Sequence>
      )}

    </AbsoluteFill>
  );
};

export default RemotionComposition;
