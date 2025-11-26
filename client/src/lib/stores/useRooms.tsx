import { create } from 'zustand';

export interface Room {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number; z: number };
  color: string;
  theme: 'strategy' | 'design' | 'systems' | 'collaboration';
  unlocked: boolean;
}

interface RoomsState {
  currentRoom: string;
  rooms: Room[];
  visitedRooms: string[];
  transitionProgress: number;
  isTransitioning: boolean;
  
  setCurrentRoom: (roomId: string) => void;
  visitRoom: (roomId: string) => void;
  startTransition: (targetRoom: string) => void;
  updateTransitionProgress: (progress: number) => void;
  completeTransition: () => void;
}

const defaultRooms: Room[] = [
  {
    id: 'origin',
    name: 'Origin',
    description: 'The starting point - where all systems begin',
    position: { x: 0, y: 0, z: 0 },
    color: '#F5F5F5',
    theme: 'strategy',
    unlocked: true
  },
  {
    id: 'strategy',
    name: 'Strategy Chamber',
    description: 'Where brand positioning and market systems converge',
    position: { x: -15, y: 0, z: -20 },
    color: '#E8E8E8',
    theme: 'strategy',
    unlocked: true
  },
  {
    id: 'design',
    name: 'Design Atelier',
    description: 'Visual systems and creative expression space',
    position: { x: 15, y: 5, z: -20 },
    color: '#D8D8D8',
    theme: 'design',
    unlocked: true
  },
  {
    id: 'systems',
    name: 'Systems Observatory',
    description: 'The interconnected view - seeing how everything relates',
    position: { x: 0, y: 10, z: -30 },
    color: '#C8C8C8',
    theme: 'systems',
    unlocked: true
  },
  {
    id: 'collaboration',
    name: 'Collaboration Hub',
    description: 'Where partnerships and collective thinking thrive',
    position: { x: 0, y: -5, z: -40 },
    color: '#B8B8B8',
    theme: 'collaboration',
    unlocked: true
  }
];

export const useRooms = create<RoomsState>((set, get) => ({
  currentRoom: 'origin',
  rooms: defaultRooms,
  visitedRooms: ['origin'],
  transitionProgress: 0,
  isTransitioning: false,
  
  setCurrentRoom: (roomId) => {
    set({ currentRoom: roomId });
  },
  
  visitRoom: (roomId) => {
    const { visitedRooms } = get();
    if (!visitedRooms.includes(roomId)) {
      set({ visitedRooms: [...visitedRooms, roomId] });
    }
  },
  
  startTransition: (targetRoom) => {
    const { currentRoom, rooms } = get();
    if (currentRoom === targetRoom) return;
    
    const room = rooms.find(r => r.id === targetRoom);
    if (!room || !room.unlocked) return;
    
    set({ isTransitioning: true, transitionProgress: 0 });
  },
  
  updateTransitionProgress: (progress) => {
    set({ transitionProgress: progress });
  },
  
  completeTransition: () => {
    set({ isTransitioning: false, transitionProgress: 0 });
  }
}));
