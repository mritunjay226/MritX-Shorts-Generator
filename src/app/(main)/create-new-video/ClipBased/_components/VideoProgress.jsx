"use client";
export default function VideoProgress({ status, videoUrl }) {
  return (
    <div className="text-center mt-6">
      {status === "processing" && (
        <p className="text-yellow-400">⏳ Generating your AI Short...</p>
      )}
      {status === "completed" && videoUrl && (
        <div>
          <p className="text-green-400">✅ Video generated successfully!</p>
          <video
            src={videoUrl}
            controls
            className="w-64 rounded-xl mt-3 border border-gray-700"
          />
        </div>
      )}
      {status === "error" && (
        <p className="text-red-500">❌ Something went wrong.</p>
      )}
    </div>
  );
}
