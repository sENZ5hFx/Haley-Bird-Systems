/**
 * NavigationUI - Top navigation bar with back button, breadcrumb, and affordances
 * Provides clear navigation cues and visited state indication
 */

import { motion } from 'framer-motion';
import { ChevronLeft, Home, ChevronRight } from 'lucide-react';
import { SectionId } from '@/types';
import { getBreadcrumbTrail, getRelatedLinks, BREADCRUMB_STRUCTURE } from '@/lib/linkResolver';

interface NavigationUIProps {
  currentRoom: SectionId | null;
  onBack: () => void;
  onHome: () => void;
  onNavigate?: (roomId: SectionId) => void;
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

export function NavigationUI({ currentRoom, onBack, onHome, onNavigate, visitedRooms }: NavigationUIProps) {
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

          {/* Center: Breadcrumb Navigation */}
          {isInRoom && currentRoom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 text-sm"
            >
              {getBreadcrumbTrail(currentRoom).map((roomId, idx, arr) => (
                <div key={roomId} className="flex items-center gap-1">
                  <button
                    onClick={() => onNavigate?.(roomId)}
                    className={`px-2 py-1 rounded transition-all ${
                      currentRoom === roomId
                        ? 'text-[#F5F5F5] font-medium cursor-default'
                        : 'text-[#4A4A4A] hover:text-[#8A8A8A] hover:bg-white/5'
                    }`}
                    disabled={currentRoom === roomId}
                  >
                    {ROOM_LABELS[roomId]}
                  </button>
                  {idx < arr.length - 1 && <ChevronRight size={16} className="text-[#4A4A4A]" />}
                </div>
              ))}
              {visitedRooms.has(currentRoom) && (
                <span className="ml-2 px-2 py-1 bg-white/5 rounded text-[#4A4A4A] text-xs">
                  Visited
                </span>
              )}
            </motion.div>
          )}

          {/* Right: Related Links or Navigation hint */}
          {isInRoom && currentRoom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              {getRelatedLinks(currentRoom).length > 0 && (
                <div className="flex gap-2">
                  {getRelatedLinks(currentRoom).map((relatedId) => (
                    <motion.button
                      key={relatedId}
                      onClick={() => onNavigate?.(relatedId)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 py-1 text-xs bg-white/5 text-[#8A8A8A] hover:text-[#F5F5F5] hover:bg-white/10 rounded transition-all border border-white/5 hover:border-white/20"
                    >
                      → {ROOM_LABELS[relatedId]}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          {!isInRoom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-[#4A4A4A] text-right"
            >
              <p>Drag to rotate • Scroll to zoom • Click rooms to enter</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
