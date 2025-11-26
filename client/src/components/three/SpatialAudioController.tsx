import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpatialAudio } from '@/lib/stores/useSpatialAudio';
import { useExperience } from '@/lib/stores/useExperience';
import { useRooms } from '@/lib/stores/useRooms';

const AUDIO_SOURCES = [
  {
    id: 'ambient-main',
    url: '/sounds/background.mp3',
    position: { x: 0, y: 0, z: 0 },
    volume: 0.2,
    room: 'origin'
  },
  {
    id: 'ambient-strategy',
    url: '/sounds/background.mp3',
    position: { x: -15, y: 0, z: -20 },
    volume: 0.15,
    room: 'strategy'
  },
  {
    id: 'ambient-design',
    url: '/sounds/background.mp3',
    position: { x: 15, y: 5, z: -20 },
    volume: 0.15,
    room: 'design'
  }
];

export function SpatialAudioController() {
  const initialized = useRef(false);
  const addSource = useSpatialAudio(state => state.addSource);
  const updateListenerPosition = useSpatialAudio(state => state.updateListenerPosition);
  const setEnabled = useSpatialAudio(state => state.setEnabled);
  const initializeAudio = useSpatialAudio(state => state.initializeAudio);
  const soundEnabled = useExperience(state => state.soundEnabled);
  const getExperienceState = useExperience.getState;
  const currentRoom = useRooms(state => state.currentRoom);

  useEffect(() => {
    if (!initialized.current) {
      initializeAudio();
      
      AUDIO_SOURCES.forEach(source => {
        addSource(source.id, source.url, source.position, {
          volume: source.volume,
          loop: true
        });
      });
      
      initialized.current = true;
    }
  }, [addSource, initializeAudio]);

  useEffect(() => {
    setEnabled(soundEnabled);
  }, [soundEnabled, setEnabled]);

  useFrame(() => {
    const { scrollProgress, mousePosition } = getExperienceState();
    
    const listenerZ = scrollProgress * -40;
    const listenerX = mousePosition.x * 5;
    const listenerY = mousePosition.y * 3 + scrollProgress * 10;
    
    updateListenerPosition(listenerX, listenerY, listenerZ);
  });

  return null;
}
