import { create } from "zustand";

interface ExperienceState {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
  isLoaded: boolean;
  activeSection: string;
  cursorState: 'default' | 'hover' | 'pointer' | 'explore';
  soundEnabled: boolean;
  
  setScrollProgress: (progress: number) => void;
  setMousePosition: (x: number, y: number) => void;
  setIsLoaded: (loaded: boolean) => void;
  setActiveSection: (section: string) => void;
  setCursorState: (state: 'default' | 'hover' | 'pointer' | 'explore') => void;
  toggleSound: () => void;
}

export const useExperience = create<ExperienceState>((set) => ({
  scrollProgress: 0,
  mousePosition: { x: 0, y: 0 },
  isLoaded: false,
  activeSection: 'hero',
  cursorState: 'default',
  soundEnabled: false,
  
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setMousePosition: (x, y) => set({ mousePosition: { x, y } }),
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  setActiveSection: (section) => set({ activeSection: section }),
  setCursorState: (state) => set({ cursorState: state }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
}));
