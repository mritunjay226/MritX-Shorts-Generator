import React from 'react'
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion'


const RemotionComposition = ({ videoData }) => {
  
  const captions = videoData?.captionJson;
  const imageList = videoData?.images;
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const getDurationFrames = () => {
    const totalDuration = captions[captions?.length - 1]?.end/1000*fps
    // setDurationInFrame(totalDuration);
    return totalDuration;
  }
  
  

  // ✅ Helper for captions
  const getCurrentCaption = () => {
    const currentTime = frame / fps;
    const currentCaption = captions?.find(
      (item) => currentTime >= item?.start && currentTime <= item?.end
    );
    return currentCaption ? currentCaption?.word : '';
  };

  // ✅ Compute durations
  const totalDuration = captions?.length ? captions[captions.length - 1]?.end * fps : 0;
  const imageDuration = imageList?.length ? totalDuration / imageList.length : 0;
  const fadeDuration = Math.min(15, imageDuration / 6); // fade ~0.5 sec (adjustable)

  return (
    <div>
    <AbsoluteFill>
      {imageList?.map((image, index) => {
        const startTime=(index*getDurationFrames())/imageList.length;
        const duration=getDurationFrames();

        const scale = (index) => interpolate(
          frame,
          [startTime, startTime+duration/2, startTime+duration],
          index%2==0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
        )
        return(
          <Sequence key={index} from={startTime} durationInFrames={getDurationFrames()}>
            <Img
              src={image}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${scale(index)})`,
              }}
            />
          </Sequence>
        )
      })}

    </AbsoluteFill>
      <AbsoluteFill
        style={{
          color:'white',
          justifyContent:'center',
          bottom: 50,
          height: 150,
          top: undefined,
          textAlign: 'center',
        }}
      >
          <h2>{getCurrentCaption()}</h2>
      </AbsoluteFill>
      {/* Main narration/audio */}
      {videoData?.audioUrl && <Audio src={videoData?.audioUrl} volume={1} />}

      {/* Background music */}
      {videoData?.bgMusic?.src && <Audio src={videoData?.bgMusic?.src} volume={0.1} />}
    </div>
  )
}

export default RemotionComposition;