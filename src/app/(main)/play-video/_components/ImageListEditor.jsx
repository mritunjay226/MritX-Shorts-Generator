"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImageIcon, Trash, GripVertical, Plus } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ImageListEditor = ({ images, setImages }) => {
  const handleAddImage = () => {
    const url = prompt("Enter Image URL:");
    if (url) setImages([...images, url]);
  };

  const handleRemoveImage = (index) =>
    setImages(images.filter((_, i) => i !== index));

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setImages(reordered);
  };

  return (
    <div className="mt-6 p-6 border border-zinc-800 bg-zinc-900/50 rounded-2xl backdrop-blur-xl shadow-lg">
      {/* Header */}
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-100 tracking-tight">
        <ImageIcon className="text-cyan-500" /> Image Sequence
      </h2>

      {/* Drag + Scroll Wrapper */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="image-list" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-5 overflow-x-auto pb-4 px-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
            >
              {images.map((img, i) => (
                <Draggable key={i} draggableId={`image-${i}`} index={i}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="relative flex-shrink-0 group"
                    >
                      {/* Card */}
                      <div className="w-[200px] h-[250px] rounded-xl border border-zinc-700 overflow-hidden shadow-md bg-black/40 hover:border-zinc-500 transition-all">
                        {/* Drag Handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="absolute top-2 left-2 bg-black/40 backdrop-blur-md p-1 rounded-lg opacity-0 group-hover:opacity-100 transition cursor-grab active:cursor-grabbing border border-zinc-700"
                        >
                          <GripVertical className="w-4 h-4 text-gray-300" />
                        </div>

                        {/* Image */}
                        <Image
                          src={img}
                          alt={`Image ${i + 1}`}
                          width={200}
                          height={250}
                          className="object-cover w-full h-full"
                        />

                        {/* Delete Button */}
                        <button
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-[6px] rounded-lg opacity-0 group-hover:opacity-100 transition shadow-md"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}

              {/* Add Image Card */}
              <button
                onClick={handleAddImage}
                className="w-[200px] h-[250px] flex flex-col justify-center items-center border border-dashed border-zinc-600 rounded-xl text-gray-400 hover:text-white hover:border-zinc-400 transition bg-zinc-900/30"
              >
                <Plus className="w-10 h-10 mb-2" />
                Add Image
              </button>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ImageListEditor;
