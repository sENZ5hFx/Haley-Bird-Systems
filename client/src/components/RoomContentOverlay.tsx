/**
 * RoomContentOverlay - Premium luxury overlay with sophisticated animations
 * Displays room content when selected with smooth transitions and glass-morphism effects
 */

import { motion } from 'framer-motion';
import { SectionId } from '@/types';
import { X } from 'lucide-react';

interface RoomContentOverlayProps {
  roomId: SectionId;
  onClose: () => void;
  children: React.ReactNode;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const contentVariants = {
  hidden: { scale: 0.92, opacity: 0, y: 40 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } 
  },
  exit: { scale: 0.92, opacity: 0, y: 40, transition: { duration: 0.2 } },
};

export function RoomContentOverlay({ roomId, onClose, children }: RoomContentOverlayProps) {
  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-4 md:inset-8 lg:inset-12 z-50 flex items-center justify-center pointer-events-auto"
    >
      {/* Premium backdrop with glass effect */}
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-lg rounded-2xl"
      />

      {/* Content container - Premium glass-morphism styling */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 21, 0.98) 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0px rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Decorative top border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Close button - Premium micro-interaction */}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.12, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute top-6 right-6 p-2 rounded-full transition-colors"
          aria-label="Close"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <X size={20} className="text-[#E8E8E8]" />
        </motion.button>

        {/* Content padding with subtle spacing */}
        <div className="p-8 md:p-12 lg:p-16 text-[#F5F5F5] space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>

        {/* Exit affordance hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 left-4 text-xs text-[#4A4A4A]"
        >
          Press ESC or click outside to close
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
