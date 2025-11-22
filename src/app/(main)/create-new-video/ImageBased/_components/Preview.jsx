import Image from 'next/image'
import React from 'react'
import { options } from './VideoStyle'

const Preview = ({ formData }) => {
  const selectedVideoStyle = formData && options.find((item) => item?.name === formData?.videoStyle)

  if (!selectedVideoStyle) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center flex-col px-4 rounded-lg border border-dashed border-gray-400">
        <h2 className="mb-3 text-2xl font-semibold">Preview</h2>

        <p className="text-gray-500 text-lg font-medium text-center">
          Select a video style to see the preview
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      <h2 className="mb-3 text-2xl font-semibold">Preview</h2>
      <div className="relative w-full h-[70vh] rounded-lg overflow-hidden">
        <Image
          src={selectedVideoStyle?.image}
          alt={selectedVideoStyle?.name}
          fill
          className="object-cover"
        />
        <h2
          className={`${formData?.caption?.style} absolute bottom-7 text-center w-full `}
        >
          {formData?.caption?.name || 'Your caption will appear here'}
        </h2>
      </div>
    </div>
  )
}

export default Preview
