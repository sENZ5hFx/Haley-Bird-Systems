/**
 * RoomContentOverlay - Displays room content when selected
 * Overlays on top of the 3D environment with close button
 */

import { motion } from 'framer-motion';
import { SectionId } from '@/types';
import { X } from 'lucide-react';

interface RoomContentOverlayProps {
  roomId: SectionId;
  onClose: () => void;
  children: React.ReactNode;
}

export function RoomContentOverlay({ roomId, onClose, children }: RoomContentOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-4 md:inset-8 lg:inset-12 z-50 flex items-center justify-center pointer-events-auto"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg"
      />

      {/* Content container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative max-w-4xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-[#1A1A1A] to-[#0F0F15] border border-white/10 rounded-lg p-8 md:p-12"
      >
        {/* Close button */}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X size={24} className="text-[#E8E8E8]" />
        </motion.button>

        {/* Room content */}
        <div className="text-[#F5F5F5]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
