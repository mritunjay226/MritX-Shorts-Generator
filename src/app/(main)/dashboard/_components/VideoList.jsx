"use client"
import { useConvex } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { api } from '../../../../../convex/_generated/api';
import moment from 'moment';
import { useAuthContext } from '@/app/provider';
import { Button } from '@/components/ui/button';
import Masonry from 'react-masonry-css';
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Trash2, X } from "lucide-react"; // Added Icons for better UX

const breakpoints = {
  default: 5,
  1600: 4,
  1100: 3,
  700: 2,
  500: 1
};

const VideoList = () => {
  const [videoList, setVideoList] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const convex = useConvex();
  const [toggleDelete, setToggleDelete] = useState(false);
  const { user } = useAuthContext();
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    user && GetUserVideoList();
  }, [user]);

  const GetUserVideoList = async (reset = true) => {
    if (reset) {
      setLoadingVideos(true);
      setCursor(null);
    } else {
      setLoadingMore(true);
    }

    const result = await convex.query(api.videoData.GetUserVideosPaginated, {
      uid: user?._id,
      paginationOpts: {
        numItems: 15,
        cursor: reset ? null : cursor
      }
    });

    if (reset) {
      setVideoList(result.page);
    } else {
      setVideoList(prev => [...prev, ...result.page]);
    }

    setCursor(result.continueCursor);
    setHasMore(result.isDone === false);
    setSelectedVideos([]);
    setSelectAll(false);
    setLoadingVideos(false);
    setLoadingMore(false);

    const pendingVideo = result.page?.find((item) => item.status === 'pending');
    if (pendingVideo) {
      GetPendingVideoStatus(pendingVideo);
    }
  };

  const loadMoreVideos = () => {
    if (!loadingMore && hasMore && cursor) {
      GetUserVideoList(false);
    }
  };

  const GetPendingVideoStatus = (pendingVideo) => {
    const intervalId = setInterval(async () => {
      const result = await convex.query(api.videoData.GetVideoById, { videoId: pendingVideo?._id });
      if (result?.status === 'completed') {
        clearInterval(intervalId);
        GetUserVideoList();
      }
    }, 5000);
  };

  const toggleSelect = (id) => {
    setSelectedVideos((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(videoList.map((v) => v._id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = async () => {
    if (selectedVideos.length === 0) return alert("No videos selected!");

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedVideos.length} video(s)?`
    );
    if (!confirmDelete) return;

    try {
      await convex.mutation(api.videoData.RemoveMultipleVideos, {
        videoIds: selectedVideos,
      });
      await GetUserVideoList();
      setToggleDelete(false); // Exit delete mode after success
    } catch (err) {
      console.error(err);
      alert("Error deleting videos");
    }
  };

  // --- LOADING STATE ---
  if (loadingVideos) {
    return (
      <div className='flex flex-col justify-center items-center h-[60vh] w-full text-gray-500 dark:text-gray-400 font-medium gap-3'>
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        Loading your studio...
      </div>
    );
  }
  
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white selection:bg-yellow-500 selection:text-black transition-colors duration-500 p-4 md:p-10">
      
      {videoList?.length === 0 ? (
        // --- EMPTY STATE ---
        <div className='flex flex-col relative items-center justify-center mt-20 gap-6 p-10 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm max-w-2xl mx-auto'>
          <div className="p-4 bg-yellow-500/10 rounded-full">
             <Image src={'/logo.svg'} alt='logo' width={50} height={50} className="opacity-80" />
          </div>
          <div className="text-center space-y-2">
             <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">No videos created yet</h2>
             <p className="text-gray-500 dark:text-gray-400">Start your journey by creating your first AI viral short.</p>
          </div>
          
          <Link href={'/create-new-video'}>
            <Button className="px-8 py-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg hover:shadow-[0_10px_20px_-10px_rgba(255,193,7,0.5)] transition-all transform hover:-translate-y-1">
              + Create New Video
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          {/* --- CONTROL BAR --- */}
          <div className="sticky top-0 z-40 bg-gray-50/90 dark:bg-black/90 backdrop-blur-md py-4 border-b border-transparent transition-all">
            <div className="flex items-center justify-between">
               <h1 className="text-2xl font-bold hidden md:block bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                  My Library
               </h1>

               <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  {toggleDelete ? (
                    <div className="flex items-center gap-4 bg-white dark:bg-white/10 px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          checked={selectAll} 
                          onCheckedChange={toggleSelectAll} 
                          className="data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 border-gray-400"
                        />
                        <span className="text-sm font-medium">Select All</span>
                      </div>
                      <div className="h-4 w-px bg-gray-300 dark:bg-white/20" />
                      <Button 
                         variant="ghost" 
                         size="sm"
                         className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                         onClick={() => {
                            setToggleDelete(false);
                            setSelectedVideos([]);
                            setSelectAll(false);
                         }}
                      >
                        Cancel
                      </Button>
                      {selectedVideos.length > 0 && (
                        <Button
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full px-4"
                          onClick={handleDeleteSelected}
                        >
                          Delete ({selectedVideos.length})
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => setToggleDelete(true)}
                      className="group border-gray-300 dark:border-white/20 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all rounded-full px-6"
                    >
                      <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Manage Videos
                    </Button>
                  )}
               </div>
            </div>
          </div>

          {/* --- VIDEO GRID --- */}
          <Masonry
            breakpointCols={breakpoints}
            className="flex gap-5 mt-8"
            columnClassName="space-y-5"
          >
            {videoList.map((video, index) => {
              const isSelected = selectedVideos.includes(video._id);
              return (
                <div
                  key={index}
                  className={`relative group mb-5 break-inside-avoid rounded-xl overflow-hidden 
                             border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900
                             transition-all duration-300
                             ${toggleDelete && isSelected ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-black' : ''}
                             ${!toggleDelete ? 'hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-2xl hover:-translate-y-1' : ''}
                             `}
                  style={{
                    height: `${300 + Math.floor(Math.random() * 10)}px`, // Reduced random height var slightly for cleaner look
                  }}
                >
                  {/* Selection Checkbox Overlay */}
                  {toggleDelete && (
                    <div className="absolute inset-0 z-20 bg-black/20 backdrop-blur-[1px] flex items-start justify-start p-3 transition-all">
                       <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelect(video._id)}
                          className="h-6 w-6 bg-white/90 border-white/50 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                        />
                    </div>
                  )}

                  <Link href={toggleDelete ? '#' : '/play-video/' + video?._id} className={toggleDelete ? 'cursor-default' : 'cursor-pointer'}>
                    <div className="relative w-full h-full">
                        <Image
                          src={
                            Array.isArray(video?.images) && video.images.length > 0
                              ? video.images[0]
                              : '/MLogo.png'
                          }
                          alt={video?.title || 'video thumbnail'}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className='absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/90 transition-opacity duration-300 opacity-80 group-hover:opacity-90'></div>
                        
                        {/* Content */}
                        <div className='absolute bottom-0 left-0 w-full p-4 transform translate-y-0 transition-transform duration-300'>
                          <h2 className="font-bold text-white text-lg leading-tight mb-1 line-clamp-2 drop-shadow-md">{video?.title}</h2>
                          <div className="flex items-center justify-between text-xs text-white/70 font-medium">
                              <span>{moment(video?._creationTime).fromNow()}</span>
                              {/* Optional: Add status indicator if needed */}
                              {video.status === 'pending' && <span className="text-yellow-400 animate-pulse">Processing...</span>}
                          </div>
                        </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </Masonry>

          {/* --- LOAD MORE BUTTON --- */}
          {hasMore && (
            <div className="flex justify-center mt-12 mb-16">
              <Button 
                onClick={loadMoreVideos} 
                disabled={loadingMore}
                className="px-8 py-6 rounded-full border border-gray-300 bg-white text-gray-900 hover:bg-gray-50
                           dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
                           transition-all flex items-center gap-2 font-medium"
              >
                {loadingMore ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                    </>
                ) : (
                    'Load More Videos'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoList;