import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperience } from '@/lib/stores/useExperience';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const { isLoaded, setIsLoaded } = useExperience();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoaded(true), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [setIsLoaded]);
  
  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[10000] bg-[#1A1A1A] flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-2xl md:text-3xl font-light text-[#F5F5F5] tracking-[-0.02em] mb-2">
                Haley Bird
              </h1>
              <p className="text-xs tracking-[0.3em] uppercase text-[#4A4A4A]">
                Brand & Systems Architect
              </p>
            </motion.div>
            
            <div className="w-48 mx-auto">
              <div className="h-[1px] bg-[#2A2A2A] relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#E8E8E8]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-[#4A4A4A] mt-4 font-light"
              >
                {progress >= 100 ? 'Entering...' : 'Loading experience...'}
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
