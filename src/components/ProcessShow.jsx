"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const steps = [
    {
        img: "/create.png",
        title: "Give it a Topic, Style and Voice",
    },
    {
        img: "/generating.png",
        title: "Generating Using AI...",
    },
    {
        img: "/ready.png",
        title: "Your Shorts is Ready to Publish",
    },
];

const ProcessShow = () => {
    return (
        <section className="flex flex-col justify-center items-center w-full h-screen ">
            <p className="text-soundraw-gradient font-medium uppercase">
                Create and Personalize Your Tracks
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mt-4 mb-6 text-center">
                Choose and make everything custom
            </h1>

            <p className="text-center lg:w-[70%] text-bright font-medium mx-auto mb-8">
                Use the MritX SG to tweak mood, pacing, visuals, and voice — MritX SG regenerates your short instantly, perfectly synced and ready to post.
            </p>
            <div className="processShow-box flex flex-wrap md:flex-nowrap justify-between w-[90%] max-w-6xl h-[70%] backdrop-blur-md border border-gray-700 rounded-3xl p-10 md:px-16 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] relative">


                {/* Subtle glowing ring background
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-purple-500/20 blur-[200px] top-10 left-10 rounded-full"></div>
          <div className="absolute w-96 h-96 bg-cyan-500/20 blur-[200px] bottom-10 right-10 rounded-full"></div>
        </div> */}

                {steps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2, duration: 0.7 }}
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center gap-4 border border-gray-600 bg-[#1b1b1b]/60 rounded-2xl w-full md:w-[30%] shadow-lg hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] transition-all duration-300"
                    >
                        <div className="relative w-[200px] h-[150px] overflow-hidden rounded-lg">
                            <Image
                                src={step.img}
                                alt={step.title}
                                width={200}
                                height={150}
                                className="object-cover w-full transform transition-transform duration-500 hover:scale-110"
                            />
                        </div>
                        <h2 className="text-lg text-gray-300 font-medium text-center leading-snug">
                            {step.title}
                        </h2>

                        </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ProcessShow;
