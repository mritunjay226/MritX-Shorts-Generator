'use client'
import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ImageListEditor from './ImageListEditor'
import MusicSelector from './MusicSelector'
import { api } from '../../../../../convex/_generated/api'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

const VideoEditor = ({ videoId , videoData }) => {
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
      toast.success('✅ Video updated successfully!')
    } catch (err) {
      toast.error('⚠️ Failed to update video')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!videoData) return <div className="text-center text-gray-400 ">Loading video data...</div>

  return (
    <div className="w-full mx-auto mt-6 p-6 space-y-6 bg-cardbg rounded-2xl shadow-lg border border-gray-800">
      <h1 className="text-2xl font-semibold text-gray-100">🎬 Edit Video</h1>

      {/* Title input */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-300">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title..."
          className="bg-zinc-900 border-gray-700 text-gray-100"
        />
      </div>

      {/* Background music selector */}
      <MusicSelector
        value={bgMusic}
        onChange={(music) => setBgMusic(music)}
      />

      {/* Image editor */}
      <ImageListEditor images={images} setImages={setImages} />

      {/* Save button */}
      <Button
        onClick={handleSave}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  )
}

export default VideoEditor
