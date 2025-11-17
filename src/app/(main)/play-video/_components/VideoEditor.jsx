'use client'
import React, { useState, useEffect } from 'react'
import { useMutation } from 'convex/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ImageListEditor from './ImageListEditor'
import MusicSelector from './MusicSelector'
import { api } from '../../../../../convex/_generated/api'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

const VideoEditor = ({ videoId, videoData }) => {
  const updateVideo = useMutation(api.videoData.EditVideoData)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [bgMusic, setBgMusic] = useState({ name: '', src: '' })
  const [images, setImages] = useState([])

  useEffect(() => {
    if (videoData) {
      setTitle(videoData.title || '')
      setBgMusic(videoData.bgMusic || { name: '', src: '' })
      setImages(videoData.images || [])
    }
  }, [videoData])

  const handleSave = async () => {
    try {
      setLoading(true)
      await updateVideo({
        videoId,
        title,
        bgMusic,
        images,
      })
      toast.success('🎉 Video updated successfully!')
    } catch (err) {
      toast.error('⚠️ Failed to update video')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!videoData) {
    return (
      <div className="text-center text-gray-300 py-10 animate-pulse">
        Loading video data...
      </div>
    )
  }

  return (
    <div className="w-full mx-auto mt-8 p-8 space-y-8 bg-[#0d0d0f] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.4)] border border-zinc-800/70 backdrop-blur-2xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-100 tracking-tight">
          🎬 Edit Video
        </h1>
        <span className="text-sm text-gray-400">
          ID: {videoId}
        </span>
      </div>

      {/* Title Card */}
      <div className="bg-black/20 rounded-xl border border-zinc-800/50 p-5 space-y-2 hover:border-zinc-700 transition-all">
        <label className="text-sm font-medium text-gray-300">
          Video Title
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter an engaging video title..."
          className="bg-zinc-900/70 border-zinc-700/60 text-gray-100 placeholder:text-zinc-500 focus-visible:ring-pink-600"
        />
      </div>

      {/* Music & Images Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Music */}
        <div className="bg-black/20 rounded-xl border border-zinc-800/50 p-5 hover:border-zinc-700 transition-all">
          <h2 className="text-lg font-semibold text-gray-200 mb-3">
            🎵 Background Music
          </h2>
          <MusicSelector 
            value={bgMusic}
            onChange={(music) => setBgMusic(music)}
          />
        </div>

        {/* Image List */}
        <div className="bg-black/20 rounded-xl border border-zinc-800/50 p-5 hover:border-zinc-700 transition-all">
          <h2 className="text-lg font-semibold text-gray-200 mb-3">
            🖼️ Image Sequence
          </h2>
          <ImageListEditor images={images} setImages={setImages} />
        </div>

      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={loading}
        className="w-full py-6 text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-semibold rounded-xl shadow-xl transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            Saving your changes...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  )
}

export default VideoEditor
