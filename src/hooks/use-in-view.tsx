'use client';
import { useState, useEffect, useRef } from 'react';

export function useInView(options = { threshold: 0.1 }) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      if (element) observer.disconnect();
    };
  }, [options.threshold]);

  return { ref, isInView };
}