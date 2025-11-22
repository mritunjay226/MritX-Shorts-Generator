import React, { useRef, useState, useEffect } from 'react';

const IphoneVideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Handle Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update progress bar and time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    }
  };

  // Set duration when metadata loads
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle scrubbing
  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  // Helper to format time (mm:ss)
  const formatTime = (time) => {
    if (!time) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className='flex justify-center items-center '>
      {/* iPhone Frame Container - Added aspect-[9/16] and removed fixed height */}
      <div 
        className="relative mx-auto border-gray-900 dark:border-gray-900 bg-gray-900 border-[14px] rounded-[2.5rem] w-[300px] aspect-[9/16] shadow-xl flex flex-col overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-[22px] w-[120px] bg-black rounded-b-[1rem] z-20 pointer-events-none"></div>

        {/* Screen Content */}
        <div className="h-full w-full bg-black relative rounded-[2rem] overflow-hidden">
          
          <video
            ref={videoRef}
            src={videoUrl}
            className="h-full w-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            playsInline
          />

          {/* Custom Controls Overlay */}
          <div 
            className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
          >
            
            {/* Progress Bar */}
            <div className="w-full mb-3 flex items-center group">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-400 hover:h-1.5 transition-all"
              />
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between text-white">
              
              {/* Play/Pause Button */}
              <button 
                onClick={togglePlay} 
                className="text-yellow-400 hover:text-yellow-300 transition-colors p-1"
              >
                {isPlaying ? (
                  // Pause Icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  // Play Icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>

              {/* Time Display */}
              <div className="text-xs font-medium text-gray-200 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>

          {/* Center Play Button (Visible only when paused) */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
              onClick={togglePlay}
            >
              <div className="bg-yellow-400/90 text-black rounded-full p-4 shadow-lg backdrop-blur-sm transform transition hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default IphoneVideoPlayer;