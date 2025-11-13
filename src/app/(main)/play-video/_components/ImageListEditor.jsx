'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ImageIcon, Trash } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const ImageListEditor = ({ images, setImages }) => {
  const handleAddImage = () => setImages([...images, ''])
  const handleRemoveImage = (index) => setImages(images.filter((_, i) => i !== index))

  const handleOnDragEnd = (result) => {
    if (!result.destination) return
    const reordered = Array.from(images)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    setImages(reordered)
  }

  return (
    <div className='mt-6 p-5 border border-gray-800 bg-zinc-900/60 rounded-2xl'>
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-2">
        <ImageIcon className='text-cyan-600' /> Images
      </h2>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="image-list" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className='flex gap-4 overflow-x-auto pb-3 px-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900'
            >
              {images.map((img, i) => (
                <Draggable key={i} draggableId={`image-${i}`} index={i}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative flex-shrink-0"
                    >
                      <div className="w-[200px] h-[250px] relative">
                        <Image
                          src={img}
                          alt={`Image ${i + 1}`}
                          width={200}
                          height={250}
                          className="object-cover w-full h-full rounded-lg border border-zinc-700"
                        />
                        <Button
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-2 right-2 rounded-full p-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        variant="secondary"
        onClick={handleAddImage}
        className="mt-4"
      >
        + Add Image
      </Button>
    </div>
  )
}

export default ImageListEditor
