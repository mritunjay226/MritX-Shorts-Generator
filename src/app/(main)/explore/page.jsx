"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useConvex } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import Masonry from "react-masonry-css";
import moment from "moment";
import { api } from "../../../../convex/_generated/api";
import { useAuthContext } from "@/app/provider";

const breakpoints = {
  default: 5,
  1600: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const ExplorePage = () => {
  const convex = useConvex();
  const { user } = useAuthContext();
  const [videos, setVideos] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const userID = "j570vgvc7jtr0zbzhsedegmpax7tgvyh";
  const limit = 10;

  // load paginated videos
  const loadVideos = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const result = await convex.query(api.videoData.GetUserVideosPaginated, {
        uid: userID,
        limit,
        ...(cursor ? { cursor } : {}),
      });

      if (result) {
        setVideos((prev) => {
          // Avoid duplicates
          const existingIds = new Set(prev.map(v => v._id));
          const newVideos = result.videos.filter(v => !existingIds.has(v._id));
          return [...prev, ...newVideos];
        });
        setCursor(result.continueCursor);
        setHasMore(!result.isDone);
      }
    } catch (error) {
      console.error("Failed to load videos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, hasMore, convex, isLoading]);

  useEffect(() => {
    // Initial load
    if (videos.length === 0) {
      loadVideos();
    }
  }, []); // Run once on mount

  // infinite scroll observer
  const lastVideoRef = useCallback(
    (node) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadVideos();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadVideos]
  );

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Explore</h1>

      <Masonry
        breakpointCols={breakpoints}
        className="flex gap-5 mt-5"
        columnClassName="space-y-5"
      >
        {videos.map((video, index) => {
          const isLast = index === videos.length - 1;
          return (
            <Link
              key={video._id}
              href={"/play-video/" + video._id}
              ref={isLast ? lastVideoRef : null}
            >
              <div
                className="relative mb-5 break-inside-avoid rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
                style={{
                  height: `${300 + Math.floor(Math.random() * 180)}px`,
                }}
              >
                <Image
                  src={
                    Array.isArray(video?.images) && video.images.length > 0
                      ? video.images[0]
                      : "/MLogo.png"
                  }
                  alt={video?.title || "video thumbnail"}
                  fill
                  className="object-cover rounded-xl"
                  loading="lazy"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 via-black/20 to-black/80"></div>
                <div className="absolute bottom-3 px-4 w-full">
                  <h2 className="font-semibold text-white">{video?.title}</h2>
                  <p className="text-sm opacity-75 text-white">
                    {moment(video?._creationTime).fromNow()}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </Masonry>

      {hasMore && videos.length > 0 && (
        <div className="text-center text-gray-400 mt-5">Loading more...</div>
      )}

      {!hasMore && videos.length > 0 && (
        <div className="text-center text-gray-500 mt-10">No more videos</div>
      )}

      {videos.length === 0 && !hasMore && (
        <div className="flex flex-col items-center justify-center mt-32 gap-3">
          <Image src="/logo.svg" alt="logo" width={60} height={60} />
          <h2>No videos available yet</h2>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
