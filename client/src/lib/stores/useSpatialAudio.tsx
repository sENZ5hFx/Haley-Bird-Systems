import { create } from 'zustand';
import { Howl, Howler } from 'howler';

interface AudioSource {
  id: string;
  sound: Howl;
  position: { x: number; y: number; z: number };
  volume: number;
  loop: boolean;
}

interface SpatialAudioState {
  sources: Map<string, AudioSource>;
  masterVolume: number;
  isEnabled: boolean;
  listenerPosition: { x: number; y: number; z: number };
  
  initializeAudio: () => void;
  addSource: (id: string, url: string, position: { x: number; y: number; z: number }, options?: { volume?: number; loop?: boolean }) => void;
  removeSource: (id: string) => void;
  updateListenerPosition: (x: number, y: number, z: number) => void;
  setMasterVolume: (volume: number) => void;
  setEnabled: (enabled: boolean) => void;
  playSource: (id: string) => void;
  stopSource: (id: string) => void;
  updateAllVolumes: () => void;
}

function calculateSpatialVolume(
  sourcePos: { x: number; y: number; z: number },
  listenerPos: { x: number; y: number; z: number },
  baseVolume: number,
  maxDistance: number = 30
): number {
  const dx = sourcePos.x - listenerPos.x;
  const dy = sourcePos.y - listenerPos.y;
  const dz = sourcePos.z - listenerPos.z;
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  if (distance >= maxDistance) return 0;
  
  const falloff = 1 - (distance / maxDistance);
  return baseVolume * falloff * falloff;
}

function calculatePan(
  sourcePos: { x: number; y: number; z: number },
  listenerPos: { x: number; y: number; z: number }
): number {
  const dx = sourcePos.x - listenerPos.x;
  const maxPan = 15;
  return Math.max(-1, Math.min(1, dx / maxPan));
}

export const useSpatialAudio = create<SpatialAudioState>((set, get) => ({
  sources: new Map(),
  masterVolume: 0.5,
  isEnabled: false,
  listenerPosition: { x: 0, y: 0, z: 0 },
  
  initializeAudio: () => {
    Howler.volume(get().masterVolume);
  },
  
  addSource: (id, url, position, options = {}) => {
    const { sources } = get();
    
    if (sources.has(id)) {
      const existing = sources.get(id);
      existing?.sound.unload();
    }
    
    const sound = new Howl({
      src: [url],
      volume: options.volume ?? 0.5,
      loop: options.loop ?? true,
      html5: true
    });
    
    const newSource: AudioSource = {
      id,
      sound,
      position,
      volume: options.volume ?? 0.5,
      loop: options.loop ?? true
    };
    
    const newSources = new Map(sources);
    newSources.set(id, newSource);
    
    set({ sources: newSources });
  },
  
  removeSource: (id) => {
    const { sources } = get();
    const source = sources.get(id);
    
    if (source) {
      source.sound.stop();
      source.sound.unload();
      
      const newSources = new Map(sources);
      newSources.delete(id);
      set({ sources: newSources });
    }
  },
  
  updateListenerPosition: (x, y, z) => {
    set({ listenerPosition: { x, y, z } });
    get().updateAllVolumes();
  },
  
  setMasterVolume: (volume) => {
    set({ masterVolume: volume });
    Howler.volume(volume);
    get().updateAllVolumes();
  },
  
  setEnabled: (enabled) => {
    set({ isEnabled: enabled });
    
    const { sources } = get();
    sources.forEach((source) => {
      if (enabled) {
        if (!source.sound.playing()) {
          source.sound.play();
        }
      } else {
        source.sound.stop();
      }
    });
  },
  
  playSource: (id) => {
    const { sources, isEnabled } = get();
    const source = sources.get(id);
    
    if (source && isEnabled && !source.sound.playing()) {
      source.sound.play();
    }
  },
  
  stopSource: (id) => {
    const { sources } = get();
    const source = sources.get(id);
    
    if (source) {
      source.sound.stop();
    }
  },
  
  updateAllVolumes: () => {
    const { sources, listenerPosition, masterVolume, isEnabled } = get();
    
    if (!isEnabled) return;
    
    sources.forEach((source) => {
      const spatialVolume = calculateSpatialVolume(
        source.position,
        listenerPosition,
        source.volume
      );
      
      const pan = calculatePan(source.position, listenerPosition);
      
      source.sound.volume(spatialVolume * masterVolume);
      source.sound.stereo(pan);
    });
  }
}));
