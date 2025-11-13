import RemotionComposition from '@/components/RemotionComposition';
import React from 'react';
import {Composition} from 'remotion';

const videoData = {
  audioUrl: 'https://firebasestorage.googleapis.com/v0/b/projects-2025-71366.firebasestorage.app/o/audio%2F1761463905563.mp3?alt=media&token=70dc8644-7d60-49ba-8656-2ffe393a0e09',
  captionJson: [
  {
    confidence: 0.92840564,
    end: 0.79999995,
    start: 0.24,
    word: "script",
  },
  {
    confidence: 0.54537994,
    end: 1.52,
    start: 0.79999995,
    word: "dough",
  },
  {
    confidence: 0.92522836,
    end: 2.48,
    start: 2.1599998,
    word: "child",
  },
  {
    confidence: 0.58829033,
    end: 2.8,
    start: 2.48,
    word: "ache",
  },
  {
    confidence: 0.5670519,
    end: 3.12,
    start: 2.8,
    word: "i",
  },
  {
    confidence: 0.9919927,
    end: 3.28,
    start: 3.12,
    word: "love",
  },
  {
    confidence: 0.848436,
    end: 3.9199998,
    start: 3.28,
    word: "science",
  },
  {
    confidence: 0.9435829,
    end: 4.24,
    start: 3.9199998,
    word: "let's",
  },
  {
    confidence: 0.99916875,
    end: 4.4,
    start: 4.24,
    word: "do",
  },
  {
    confidence: 0.99956506,
    end: 4.64,
    start: 4.4,
    word: "an",
  },
  {
    confidence: 0.9814945,
    end: 5.44,
    start: 4.64,
    word: "experiment",
  },
  {
    confidence: 0.968612,
    end: 6.48,
    start: 6.16,
    word: "child",
  },
  {
    confidence: 0.8433077,
    end: 6.7999997,
    start: 6.48,
    word: "dough",
  },
  {
    confidence: 0.47367078,
    end: 7.2799997,
    start: 6.7999997,
    word: "okay",
  },
  {
    confidence: 0.54621077,
    end: 7.68,
    start: 7.2799997,
    word: "how",
  },
  {
    confidence: 0.99658954,
    end: 7.9199996,
    start: 7.68,
    word: "about",
  },
  {
    confidence: 0.99907875,
    end: 8.32,
    start: 7.9199996,
    word: "making",
  },
  {
    confidence: 0.83057827,
    end: 9.12,
    start: 8.32,
    word: "slime",
  },
  {
    confidence: 0.9942556,
    end: 10.08,
    start: 9.76,
    word: "child",
  },
  {
    confidence: 0.9312191,
    end: 10.4,
    start: 10.08,
    word: "ache",
  },
  {
    confidence: 0.8649576,
    end: 11.2,
    start: 10.4,
    word: "awesome",
  },
  {
    confidence: 0.9498959,
    end: 11.5199995,
    start: 11.2,
    word: "glue",
  },
  {
    confidence: 0.93227667,
    end: 12.08,
    start: 11.5199995,
    word: "borax",
  },
  {
    confidence: 0.9973109,
    end: 12.24,
    start: 12.08,
    word: "and",
  },
  {
    confidence: 0.9944353,
    end: 12.48,
    start: 12.24,
    word: "glitter",
  },
  {
    confidence: 0.9584087,
    end: 12.88,
    start: 12.48,
    word: "let's",
  },
  {
    confidence: 0.978917,
    end: 13.12,
    start: 12.88,
    word: "mix",
  },
  {
    confidence: 0.9661873,
    end: 14.405,
    start: 14.165,
    word: "child",
  },
  {
    confidence: 0.23383309,
    end: 14.724999,
    start: 14.405,
    word: "dough",
  },
  {
    confidence: 0.6428894,
    end: 15.125,
    start: 14.724999,
    word: "woah",
  },
  {
    confidence: 0.78929484,
    end: 15.445,
    start: 15.125,
    word: "it's",
  },
  {
    confidence: 0.9702921,
    end: 15.525,
    start: 15.445,
    word: "so",
  },
  {
    confidence: 0.9975963,
    end: 16.005,
    start: 15.525,
    word: "stretchy",
  },
  {
    confidence: 0.98911613,
    end: 16.164999,
    start: 16.005,
    word: "and",
  },
  {
    confidence: 0.9741876,
    end: 16.884998,
    start: 16.164999,
    word: "gooey",
  },
  {
    confidence: 0.9718042,
    end: 17.845,
    start: 17.525,
    word: "child",
  },
  {
    confidence: 0.91638637,
    end: 18.164999,
    start: 17.845,
    word: "egg",
  },
  {
    confidence: 0.87296164,
    end: 18.564999,
    start: 18.164999,
    word: "now",
  },
  {
    confidence: 0.94757485,
    end: 18.884998,
    start: 18.564999,
    word: "let's",
  },
  {
    confidence: 0.9775968,
    end: 19.045,
    start: 18.884998,
    word: "try",
  },
  {
    confidence: 0.9694418,
    end: 19.445,
    start: 19.045,
    word: "growing",
  },
  {
    confidence: 0.9657933,
    end: 20.404999,
    start: 19.445,
    word: "crystals",
  },
  {
    confidence: 0.981092,
    end: 21.365,
    start: 21.045,
    word: "child",
  }
],
  images: [  "https://firebasestorage.googleapis.com/v0/b/projects-2025-71366.firebasestorage.app/o/ai-guru-lab-images%2F1761463916858.png?alt=media&token=d3e0f50a-3d5d-492f-a0bb-0ac9dc553312"]
}
export const RemotionRoot = () => {
  const durationInFrames = Number(
  ((videoData?.captionJson?.[videoData.captionJson.length - 1]?.end || 0) / 1000 * 30).toFixed(0)
);

console.log("Calculated Duration in Frames:", durationInFrames);
  return (
    <>
      <Composition
        id="mritXShorts"
        component={RemotionComposition}
        durationInFrames={Number((videoData?.captionJson[videoData?.captionJson?.length - 1]?.end/1000*30).toFixed(0))}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          videoData: videoData
        }}
      />
    </>
  );
};