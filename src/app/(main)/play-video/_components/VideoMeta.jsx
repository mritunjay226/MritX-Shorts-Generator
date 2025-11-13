'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import moment from 'moment'

const VideoMeta = ({ videoData }) => {
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    const res = await fetch('/api/render-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoData }),
    })
    const { downloadUrl } = await res.json()
    setDownloadUrl(downloadUrl)
    setLoading(false)
  }

  return (
    <div className="p-5 border rounded-xl">
      <h2 className="text-gray-50 text-xl font-bold">{videoData?.title}</h2>
      <p className='text-md text-gray-400 my-3'>{videoData?.script}</p>
      <p className="text-md opacity-75 mb-4">{moment(videoData?._creationTime).fromNow()}</p>
      <Button onClick={handleDownload} disabled={loading}>
        <DownloadIcon className="mr-2" />
        {loading ? 'Rendering...' : 'Download Video'}
      </Button>
      {downloadUrl && (
        <a
          href={downloadUrl}
          download
          target="_blank"
          className="text-blue-400 underline mt-3 block"
        >
          Click to download
        </a>
      )}
    </div>
  )
}
export default VideoMeta
