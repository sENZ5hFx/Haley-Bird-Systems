import { motion } from 'framer-motion';
import { useExperience } from '@/lib/stores/useExperience';
import { useAudio } from '@/lib/stores/useAudio';
import { useEffect } from 'react';

export function SoundToggle() {
  const { soundEnabled, toggleSound } = useExperience();
  const { setCursorState } = useExperience();
  const { backgroundMusic, setBackgroundMusic, isMuted, toggleMute } = useAudio();
  
  useEffect(() => {
    const audio = new Audio('/sounds/background.mp3');
    audio.loop = true;
    audio.volume = 0.1;
    setBackgroundMusic(audio);
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [setBackgroundMusic]);
  
  const handleToggle = () => {
    toggleSound();
    toggleMute();
    
    if (backgroundMusic) {
      if (soundEnabled) {
        backgroundMusic.pause();
      } else {
        backgroundMusic.play().catch(console.log);
      }
    }
  };
  
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      onClick={handleToggle}
      onMouseEnter={() => setCursorState('pointer')}
      onMouseLeave={() => setCursorState('default')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2 border border-[#2A2A2A] rounded-full bg-[#1A1A1A]/80 backdrop-blur-sm hover:border-[#4A4A4A] transition-colors duration-300"
      aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
    >
      <div className="flex items-center gap-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-0.5 bg-[#E8E8E8] rounded-full"
            animate={{
              height: soundEnabled ? [4, 12, 4] : 4,
              opacity: soundEnabled ? 1 : 0.3
            }}
            transition={{
              duration: 0.5,
              repeat: soundEnabled ? Infinity : 0,
              delay: i * 0.1,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
      <span className="text-xs text-[#4A4A4A] tracking-wider uppercase">
        {soundEnabled ? 'Sound On' : 'Sound Off'}
      </span>
    </motion.button>
  );
}
