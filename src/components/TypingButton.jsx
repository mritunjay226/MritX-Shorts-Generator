'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "lucide-react";

const TypingButton = () => {
  const texts = [
    "Get Started with MritX SG for free",
    "Create Shorts in seconds with MritX SG",
    "Turn your ideas into videos instantly",
  ];

  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const typingSpeed = deleting ? 25 : 50;

    const timeout = setTimeout(() => {
      if (!deleting && subIndex < texts[index].length) {
        setDisplayText((prev) => prev + texts[index][subIndex]);
        setSubIndex((prev) => prev + 1);
      } else if (deleting && subIndex > 0) {
        setDisplayText((prev) => prev.slice(0, -1));
        setSubIndex((prev) => prev - 1);
      } else if (!deleting && subIndex === texts[index].length) {
        setTimeout(() => setDeleting(true), 1000);
      } else if (deleting && subIndex === 0) {
        setDeleting(false);
        setIndex((prev) => (prev + 1) % texts.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, texts]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-secondary rounded-full max-w-full">
      {/* 🔹 Typing text + cursor */}
      <span className="p-2 text-sm md:text-base font-normal flex-1 min-w-0 flex items-center">
        <span className="truncate">{displayText}</span>
        <span
          className={`ml-[1px] h-5 w-[2px] bg-white transition-opacity duration-200 ${
            blink ? "opacity-100" : "opacity-0"
          }`}
        />
      </span>

      {/* 🔹 Button */}
      <Link href="/dashboard">
        <Button
          size="sm"
          className="rounded-full text-white flex gap-2 items-center bg-gradient-to-r from-yellow-400 to-orange-600 whitespace-nowrap"
        >
          Try now <ArrowRightIcon size={16} />
        </Button>
      </Link>
    </div>
  );
};

export default TypingButton;
