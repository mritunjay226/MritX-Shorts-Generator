"use client";
export default function NarrationToggle({ narration, setNarration }) {
  return (
    <div className="flex items-center space-x-2 mt-3">
      <input
        type="checkbox"
        checked={narration}
        onChange={() => setNarration(!narration)}
        className="w-5 h-5 accent-blue-500"
      />
      <label className="text-gray-300 text-sm">
        Include Narration (AI Voiceover)
      </label>
    </div>
  );
}
