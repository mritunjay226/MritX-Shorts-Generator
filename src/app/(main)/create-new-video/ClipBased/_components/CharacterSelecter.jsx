"use client";
import { useState } from "react";

export default function CharacterSelector({ characters, onSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-2">
      <label className="block text-lg font-semibold text-white">
        Choose Character
      </label>

      <div className="flex flex-wrap gap-3">
        {characters.map((char) => (
          <button
            key={char.id}
            onClick={() => {
              setSelected(char.id);
              onSelect(char);
            }}
            className={`p-2 rounded-xl border ${
              selected === char.id
                ? "border-blue-500 bg-blue-900"
                : "border-gray-600 bg-gray-800"
            }`}
          >
            <img
              src={char.referenceImage}
              alt={char.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <p className="text-sm mt-1 text-gray-200 text-center">{char.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
