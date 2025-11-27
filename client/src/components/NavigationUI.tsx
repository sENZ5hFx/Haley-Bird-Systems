/**
 * NavigationUI - Top navigation bar with back button, breadcrumb, and affordances
 * Provides clear navigation cues and visited state indication
 */

import { motion } from 'framer-motion';
import { ChevronLeft, Home } from 'lucide-react';
import { SectionId } from '@/types';

interface NavigationUIProps {
  currentRoom: SectionId | null;
  onBack: () => void;
  onHome: () => void;
  visitedRooms: Set<SectionId>;
}

const ROOM_LABELS: Record<SectionId, string> = {
  'hero': 'Home',
  'statement': 'Statement',
  'portals': 'Portals',
  'journey': 'Personal Journey',
  'garden': 'Garden',
  'practices': 'Practices',
  'connections': 'Connections',
  'process': 'Process',
  'cases': 'Case Studies',
  'rooms': 'Rooms',
  'footer': 'Footer',
};

export function NavigationUI({ currentRoom, onBack, onHome, visitedRooms }: NavigationUIProps) {
  const isInRoom = currentRoom && currentRoom !== 'hero';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 pointer-events-auto"
    >
      {/* Navigation bar */}
      <div className="bg-gradient-to-b from-black/80 to-black/20 backdrop-blur-md border-b border-white/10 px-6 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Back + Home */}
          <div className="flex items-center gap-3">
            {isInRoom && (
              <motion.button
                onClick={onBack}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Back"
                title="Return to environment"
              >
                <ChevronLeft size={20} className="text-[#E8E8E8]" />
              </motion.button>
            )}
            
            <motion.button
              onClick={onHome}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Home"
              title="Return to home"
            >
              <Home size={20} className="text-[#E8E8E8]" />
            </motion.button>
          </div>

          {/* Center: Breadcrumb */}
          {isInRoom && currentRoom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm"
            >
              <span className="text-[#4A4A4A]">Environment</span>
              <span className="text-[#4A4A4A]">/</span>
              <span className="text-[#F5F5F5] font-medium">{ROOM_LABELS[currentRoom]}</span>
              {visitedRooms.has(currentRoom) && (
                <span className="ml-2 px-2 py-1 bg-white/5 rounded text-[#4A4A4A] text-xs">
                  Visited
                </span>
              )}
            </motion.div>
          )}

          {/* Right: Navigation hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-[#4A4A4A] text-right"
          >
            {isInRoom ? (
              <p>Press ESC or click back to explore</p>
            ) : (
              <p>Drag to rotate • Scroll to zoom • Click rooms to enter</p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
