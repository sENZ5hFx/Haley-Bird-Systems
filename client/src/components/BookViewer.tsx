/**
 * Book Viewer Component - "The Broken Transmission"
 * Multi-perspective reading experience
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Perspective {
  label: string;
  content: string;
}

interface BookViewerProps {
  title: string;
  perspectives: Perspective[];
  initialPerspective?: number;
}

export function BookViewer({
  title,
  perspectives,
  initialPerspective = 0,
}: BookViewerProps) {
  const [currentPerspective, setCurrentPerspective] = useState(initialPerspective);
  const [isFlipped, setIsFlipped] = useState(false);

  const current = perspectives[currentPerspective];
  if (!current) return null;

  return (
    <div className="space-y-6 w-full">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-light text-white">{title}</h2>
        <p className="text-sm text-gray-400">Multi-perspective reading</p>
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        {perspectives.map((perspective, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentPerspective(idx);
              setIsFlipped(false);
            }}
            className={`px-4 py-2 rounded text-sm transition-all ${
              currentPerspective === idx
                ? 'bg-white/20 text-white border border-white/40'
                : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
            }`}
          >
            {perspective.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentPerspective}-${isFlipped}`}
          initial={{ opacity: 0, rotateZ: -5 }}
          animate={{
            opacity: 1,
            rotateZ: isFlipped ? 180 : 0,
          }}
          exit={{ opacity: 0, rotateZ: 5 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-8 border border-white/20 backdrop-blur-sm min-h-96"
        >
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="text-xs text-gray-400 hover:text-white transition px-3 py-1 rounded border border-white/10 hover:border-white/30"
              title={isFlipped ? 'Flip back' : 'Flip to alternate reading'}
            >
              {isFlipped ? '↻ Flip back' : '↺ Flip view'}
            </button>
          </div>

          <div
            style={isFlipped ? { transform: 'rotateZ(180deg)', transformOrigin: 'center' } : undefined}
            className="prose prose-invert max-w-none text-sm leading-relaxed text-gray-300"
          >
            {current.content.split('\n').map((paragraph, idx) => {
              if (paragraph.startsWith('#')) {
                const level = paragraph.match(/^#+/)?.[0].length || 1;
                const text = paragraph.replace(/^#+\s/, '');
                const headingClass =
                  level === 1
                    ? 'text-2xl font-semibold text-white mt-6 mb-3'
                    : level === 2
                      ? 'text-xl font-medium text-gray-200 mt-4 mb-2'
                      : 'text-lg font-medium text-gray-300 mt-3 mb-1';
                return (
                  <div key={idx} className={headingClass}>
                    {text}
                  </div>
                );
              }

              if (paragraph.trim() === '') {
                return <div key={idx} className="h-2" />;
              }

              return (
                <p key={idx} className="mb-3 text-gray-300">
                  {paragraph}
                </p>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-500 text-center">
            Viewing: <strong>{current.label}</strong>
            {isFlipped && ' (flipped)'}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="text-xs text-gray-500 bg-white/5 rounded p-3 border border-white/10">
        💡 This book can be read from multiple perspectives. Switch above or flip the current view to
        discover alternate readings.
      </div>
    </div>
  );
}
