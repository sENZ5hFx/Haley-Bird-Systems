/**
 * DepthLayer - Subtle background depth component
 * Adds layered shadow/opacity to create visual separation between foreground content and background
 * Used in sections to give text breathing room and visual hierarchy
 */

import { motion } from 'framer-motion';

interface DepthLayerProps {
  variant?: 'light' | 'medium' | 'dark';
}

export function DepthLayer({ variant = 'light' }: DepthLayerProps) {
  const opacity = {
    light: 'opacity-5',
    medium: 'opacity-10',
    dark: 'opacity-20'
  };

  return (
    <>
      {/* Subtle background gradient depth */}
      <motion.div
        className={`absolute inset-0 pointer-events-none ${opacity[variant]}`}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: variant === 'light' ? 0.05 : variant === 'medium' ? 0.1 : 0.2 }}
        transition={{ duration: 1.2 }}
      />
      
      {/* Shadow separation line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.3), transparent)',
        }}
      />
    </>
  );
}
