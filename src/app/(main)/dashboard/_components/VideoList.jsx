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
import { Checkbox } from "@/components/ui/checkbox"; // assuming you use shadcn/ui

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

  useEffect(() => {
    user && GetUserVideoList();
  }, [user]);

  const GetUserVideoList = async () => {
    setLoadingVideos(true);
    const result = await convex.query(api.videoData.GetUserVideos, {
      uid: user?._id
    });
    setVideoList(result);
    setSelectedVideos([]);
    setSelectAll(false);
    setLoadingVideos(false);

    // Check for pending videos
    const pendingVideo = result?.find((item) => item.status === 'pending');
    if (pendingVideo) {
      GetPendingVideoStatus(pendingVideo);
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
    } catch (err) {
      console.error(err);
      alert("Error deleting videos");
    }
  };

  if (loadingVideos) {
    return <div className='flex justify-center items-center h-[90vh] w-full text-gray-400 text-xl '>Loading Videos...</div>;
  }
  return (
    <div>
      {videoList?.length === 0 ? (
        <div className='flex flex-col relative items-center justify-center mt-28 gap-5 p-5 border border-dashed rounded-xl py-16'>
          <Image src={'/logo.svg'} alt='logo' width={60} height={60} />
          <h2>You don't have any video created. Create a new one</h2>
          <Link href={'/create-new-video'}>
            <Button>+ Create New Video</Button>
          </Link>
        </div>
      ) : (
        <div>
          {/* Control bar */}
          <div className="flex items-center justify-between mt-5">
            {toggleDelete && <div className="flex items-center gap-3">
              <Checkbox checked={selectAll} onCheckedChange={toggleSelectAll} />
              <span>Select All</span>
            </div>}
            {!toggleDelete && (
              <Button variant="destructive" onClick={() => setToggleDelete(true)}>
                Delete Videos
              </Button>
            )}
            <div className="flex items-center gap-3">
            {selectedVideos.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
              >
                Delete Selected ({selectedVideos.length})
              </Button>
            )}
            {toggleDelete && (
              <Button variant="secondary" onClick={() => {
                setToggleDelete(false);
                setSelectedVideos([]);
                setSelectAll(false);
              }}>
                Cancel
              </Button>
            )}
            </div>
          </div>

          <Masonry
            breakpointCols={breakpoints}
            className="flex gap-5 mt-10"
            columnClassName="space-y-5"
          >
            {videoList.map((video, index) => {
              const isSelected = selectedVideos.includes(video._id);
              return (
                <div
                  key={index}
                  className={`relative mb-5 break-inside-avoid rounded-xl overflow-hidden shadow-md hover:shadow-lg transition border `}
                  style={{
                    height: `${300 + Math.floor(Math.random() * 180)}px`,
                  }}
                >
                  <div className="absolute top-2 left-2 z-10 bg-black/40 p-1 rounded-md">
                    {toggleDelete && <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(video._id)}
                      className="data-[state=checked]:bg-red-600 data-[state-checked]:border-red-600 h-4 w-4"
                    />}
                  </div>
                  <Link href={'/play-video/' + video?._id}>
                    <Image
                      src={
                        Array.isArray(video?.images) && video.images.length > 0
                          ? video.images[0]
                          : '/MLogo.png'
                      }
                      alt={video?.title || 'video thumbnail'}
                      fill
                      className="object-cover rounded-xl"
                    />
                    <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 via-black/20 to-black/80'></div>
                    <div className='absolute bottom-3 px-4 w-full'>
                      <h2 className="font-semibold text-white">{video?.title}</h2>
                      <p className="text-sm opacity-75 text-white">{moment(video?._creationTime).fromNow()}</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </Masonry>
        </div>
      )}
    </div>
  );
};

export default VideoList;
