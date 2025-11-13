"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import LandingLoader from "@/components/LandingLoader";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Cta from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LandingLoader />
        </motion.div>
      ) : (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Header />
          <Hero />
          <Features />
          <HowItWorks />
          <Testimonials />
          <Cta />
          <Footer />
          {/* <div className="px-16"><VideoList /></div> */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
