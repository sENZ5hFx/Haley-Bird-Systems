import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useExperience } from '@/lib/stores/useExperience';
import { SectionId } from '@/types';

interface HeroSectionProps {
  onEnter?: (section: SectionId) => void;
}

export function HeroSection({ onEnter }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { setCursorState } = useExperience();
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 bg-gradient-to-b from-transparent via-transparent to-black/20"
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
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.1] tracking-[-0.02em] text-[#F5F5F5] mb-12 relative"
          onMouseEnter={() => setCursorState('hover')}
          onMouseLeave={() => setCursorState('default')}
        >
          <motion.span 
            className="absolute inset-0 blur-2xl opacity-0"
            style={{
              background: 'linear-gradient(135deg, rgba(74, 158, 255, 0.2), rgba(46, 204, 113, 0.1))',
            }}
            animate={isVisible ? { opacity: 0.3 } : { opacity: 0 }}
            transition={{ duration: 2, delay: 1 }}
          />
          <span className="block relative z-10">Haley Bird</span>
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
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
          className="flex gap-4 mt-16"
        >
          <motion.button
            onClick={() => onEnter?.('statement')}
            onMouseEnter={() => setCursorState('hover')}
            onMouseLeave={() => setCursorState('default')}
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(74, 158, 255, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 border border-[#4A9EFF] text-[#4A9EFF] text-sm uppercase tracking-wider font-light rounded-lg hover:bg-[#4A9EFF]/10 transition-colors"
          >
            Enter
          </motion.button>
          
          <motion.button
            onClick={() => onEnter?.('footer')}
            onMouseEnter={() => setCursorState('hover')}
            onMouseLeave={() => setCursorState('default')}
            className="px-8 py-3 border border-[#4A4A4A] text-[#4A4A4A] text-sm uppercase tracking-wider font-light rounded-lg hover:border-[#E8E8E8] hover:text-[#E8E8E8] transition-colors"
          >
            Explore
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
