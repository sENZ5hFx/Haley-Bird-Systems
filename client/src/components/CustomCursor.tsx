import { useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useExperience } from '@/lib/stores/useExperience';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const { cursorState, setMousePosition } = useExperience();
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setMousePosition(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY, setMousePosition]);
  
  const getCursorSize = () => {
    switch (cursorState) {
      case 'hover': return { width: 60, height: 60 };
      case 'pointer': return { width: 40, height: 40 };
      case 'explore': return { width: 80, height: 80 };
      default: return { width: 20, height: 20 };
    }
  };
  
  const getCursorOpacity = () => {
    switch (cursorState) {
      case 'hover': return 0.3;
      case 'pointer': return 0.5;
      case 'explore': return 0.2;
      default: return 0.6;
    }
  };
  
  const size = getCursorSize();
  
  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-[10000] mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: size.width,
            height: size.height,
            opacity: getCursorOpacity(),
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="rounded-full border border-white/50 bg-white/10"
          style={{
            backdropFilter: 'blur(2px)',
          }}
        />
      </motion.div>
      
      <motion.div
        ref={cursorDotRef}
        className="fixed pointer-events-none z-[10001] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: cursorState === 'default' ? 1 : 0.5,
            opacity: cursorState === 'default' ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
          className="w-1.5 h-1.5 rounded-full bg-white"
        />
      </motion.div>
    </>
  );
}
