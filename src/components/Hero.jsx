import React from "react";
import Image from "next/image";
import TypingButton from "./TypingButton";

const sliderImages = [
    { src: "/realistic.webp", alt: "slide1" },
    { src: "/slide1.png", alt: "slide1" },
    { src: "/slide2.jpg", alt: "slide2" },
    { src: "/slide3.jpg", alt: "slide3" },
    { src: "/slide4.jpg", alt: "slide4" },
    { src: "/slide5.png", alt: "slide5" },
];

const Hero = () => {
    return (
        <div className="relative w-full h-[100vh] overflow-hidden">
            {/* 🔹 Infinite Scrolling Background */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                <div className="flex animate-slide-slow w-max mt-6 md:mt-0 items-start h-full bg-black/70 blur-[1px]">
                    {[...sliderImages, ...sliderImages].map((image, index) => (
                        <div key={index} className="mx-5 flex-shrink-0">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                width={300}
                                loading="lazy"
                                height={500}
                                className=" rounded-xl w-[300px] h-[500px] md:w-[300px] md:h-[500px] object-cover"
                            />
                        </div>
                    ))}
                </div>
                {/* Transparent black overlay */}
                <div className="absolute inset-0 bg-black/70" />
            </div>

            {/* 🔹 Foreground Content */}
            <div className="relative z-10 font-sen flex flex-col items-center justify-center h-full px-4 md:px-20 lg:px-36 xl:px-48 text-center">
                <h2 className="font-normal text-4xl md:text-6xl text-white drop-shadow-lg leading-tight mb-4">
                    Create Stunning <strong className="font-bold">Shorts, Reels & Ads</strong> with <br /><span className="text-pink-400 tracking-wide">AI powered MritX SG</span>
                </h2>
                <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl">
                    AI generates scripts, images, and voiceovers in seconds. Create, edit,
                    and publish engaging shorts effortlessly!
                </p>

                <div className="mt-[5rem] md:mt-[2rem] flex gap-6">
                        <TypingButton />
                </div>
            </div>
        </div>
    );
};

export default Hero;
