"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Film, Image } from "lucide-react";

export default function CreateNewVideo() {
  const router = useRouter();

  const options = [
    {
      title: "Image-based Video",
      description: "Generate videos using static images, text, and narration.",
      icon: <Image className="w-10 h-10 text-blue-500" />,
      route: "/create-new-video/ImageBased",
    },
    {
      title: "Clip-based Video",
      description: "Use existing video clips to create engaging highlights.",
      icon: <Film className="w-10 h-10 text-purple-500" />,
      route: "/create-new-video/ClipBased",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold mb-8 text-gray-800"
      >
        Choose Your Video Type
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {options.map((opt, index) => (
          <motion.div
            key={opt.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            onClick={() => router.push(opt.route)}
            className="cursor-pointer bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-blue-500 transition-all flex flex-col items-center text-center"
          >
            {opt.icon}
            <h2 className="text-xl font-semibold mt-4 text-gray-800">{opt.title}</h2>
            <p className="text-gray-500 mt-2">{opt.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
