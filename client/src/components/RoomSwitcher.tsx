/**
 * RoomSwitcher Component
 * 
 * Appears in each room to let users navigate to other rooms.
 * Provides sensory feedback (color, sound) when switching.
 * This replaces horizontal scroll or tab navigation.
 * 
 * Usage: Include in any section component to add room navigation
 */

import { motion } from 'framer-motion';
import { SectionId } from '../types';

interface RoomSwitcherProps {
  currentRoom: SectionId;
  onSwitchRoom: (room: SectionId) => void;
  /** Respect prefers-reduced-motion for accessibility */
  reduceMotion?: boolean;
}

const ROOMS: { id: SectionId; label: string; color: string }[] = [
  { id: 'statement', label: 'Signal', color: '#4A9EFF' },
  { id: 'portals', label: 'Portals', color: '#2ECC71' },
  { id: 'journey', label: 'Journey', color: '#E74C3C' },
  { id: 'garden', label: 'Garden', color: '#9B59B6' },
  { id: 'practices', label: 'Practices', color: '#F39C12' },
  { id: 'connections', label: 'Connections', color: '#1ABC9C' },
  { id: 'process', label: 'Process', color: '#E8E8E8' },
  { id: 'cases', label: 'Cases', color: '#95A5A6' },
  { id: 'rooms', label: 'Rooms', color: '#3498DB' },
  { id: 'footer', label: 'Close', color: '#34495E' },
];

export function RoomSwitcher({ currentRoom, onSwitchRoom, reduceMotion = false }: RoomSwitcherProps) {
  const prefersReducedMotion = reduceMotion || 
    (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const playSound = (freq: number) => {
    if (prefersReducedMotion || typeof window === 'undefined') return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.05, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.15);
    } catch (e) {
      // Silently fail if audio not available
    }
  };

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex gap-2 flex-wrap justify-center bg-black/40 backdrop-blur-sm px-4 py-3 rounded-full border border-white/10">
        {ROOMS.map((room) => {
          const isActive = room.id === currentRoom;
          return (
            <motion.button
              key={room.id}
              onClick={() => {
                playSound(440 + Math.random() * 200);
                onSwitchRoom(room.id);
              }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              className="relative px-3 py-2 text-xs uppercase tracking-wider font-light rounded transition-colors"
              style={{
                color: isActive ? room.color : '#888',
                borderColor: isActive ? room.color : '#333',
                borderWidth: '1px',
                backgroundColor: isActive ? `${room.color}20` : 'transparent',
              }}
              title={`Go to ${room.label}`}
            >
              {room.label}
              {isActive && (
                <motion.div
                  layoutId="activeRoom"
                  className="absolute inset-0 rounded pointer-events-none"
                  style={{
                    boxShadow: `0 0 12px ${room.color}60`,
                  }}
                  initial={false}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
