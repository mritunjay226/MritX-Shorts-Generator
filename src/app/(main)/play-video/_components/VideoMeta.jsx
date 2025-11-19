'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'

const VideoMeta = ({ videoData }) => {
  const [downloadUrl, setDownloadUrl] = useState(videoData?.downloadUrl)
  const [loading, setLoading] = useState(false)



  return (
    <div className="p-5 border rounded-xl">
      <h2 className="text-gray-50 text-xl font-bold">{videoData?.title}</h2>
      <p className='text-md text-gray-400 my-3'>{videoData?.script}</p>
      <p className="text-md opacity-75 mb-4">{moment(videoData?._creationTime).fromNow()}</p>

      {downloadUrl && (
        <Link
          href={downloadUrl}
          download
          target="_blank"
        >
          <Button disabled={loading}>
            <DownloadIcon className="mr-2" />
            {loading ? 'Rendering...' : 'Download Video'}
          </Button>
        </Link>
      )}
    </div>
  )
}
export default VideoMeta
