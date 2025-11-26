import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useExperience } from '@/lib/stores/useExperience';

export function StatementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: false, margin: '-20%' });
  const { setCursorState } = useExperience();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);
  
  const words = [
    { text: 'I believe', highlight: false },
    { text: 'every brand', highlight: true },
    { text: 'is a', highlight: false },
    { text: 'living system', highlight: true },
    { text: '—', highlight: false },
    { text: 'a network of', highlight: false },
    { text: 'relationships,', highlight: true },
    { text: 'touchpoints,', highlight: true },
    { text: 'and', highlight: false },
    { text: 'experiences', highlight: true },
    { text: 'that evolve together.', highlight: false },
  ];
  
  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-32"
      style={{ opacity }}
    >
      <motion.div
        ref={textRef}
        style={{ y }}
        className="max-w-4xl"
      >
        <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-[1.4] tracking-[-0.01em]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.6,
                delay: i * 0.05,
                ease: [0.16, 1, 0.3, 1]
              }}
              className={`inline-block mr-[0.25em] ${
                word.highlight ? 'text-[#F5F5F5]' : 'text-[#4A4A4A]'
              }`}
              onMouseEnter={() => word.highlight && setCursorState('hover')}
              onMouseLeave={() => setCursorState('default')}
            >
              {word.text}
            </motion.span>
          ))}
        </p>
        
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={isInView ? { opacity: 1, width: '100%' } : { opacity: 0, width: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-[1px] bg-gradient-to-r from-[#4A4A4A] via-[#E8E8E8] to-transparent mt-16"
        />
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm md:text-base text-[#4A4A4A] mt-8 max-w-xl font-light leading-relaxed"
        >
          My approach combines strategic clarity with creative intuition, 
          building brand architectures that are both systematic and deeply human.
        </motion.p>
      </motion.div>
    </motion.section>
  );
}
