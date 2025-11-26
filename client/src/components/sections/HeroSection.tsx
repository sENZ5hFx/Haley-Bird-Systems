import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useExperience } from '@/lib/stores/useExperience';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { setCursorState } = useExperience();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24"
      style={{ opacity, y, scale }}
    >
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mb-8"
        >
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-[#4A4A4A] font-light">
            Brand & Systems Architect
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.1] tracking-[-0.02em] text-[#F5F5F5] mb-12"
          onMouseEnter={() => setCursorState('hover')}
          onMouseLeave={() => setCursorState('default')}
        >
          <span className="block">Haley Bird</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          className="max-w-2xl"
        >
          <p className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-[#E8E8E8] mb-8">
            I design systems that connect brands to people. 
            <span className="text-[#4A4A4A]"> My work lives at the intersection of </span>
            strategic thinking
            <span className="text-[#4A4A4A]"> and </span>
            creative execution.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex items-center gap-4 mt-16"
        >
          <div className="w-12 h-[1px] bg-[#4A4A4A]" />
          <span className="text-xs tracking-[0.2em] uppercase text-[#4A4A4A]">
            Scroll to explore
          </span>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 0.1 } : {}}
        transition={{ duration: 2, delay: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border border-[#4A4A4A] rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 bg-[#4A4A4A] rounded-full"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
