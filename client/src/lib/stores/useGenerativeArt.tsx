import { create } from 'zustand';

interface GenerativeParams {
  seed: number;
  colorShift: number;
  noiseScale: number;
  flowSpeed: number;
  particleDensity: number;
  geometryComplexity: number;
  connectionDensity: number;
  pulseRate: number;
  spiralIntensity: number;
  waveAmplitude: number;
}

interface GenerativeArtState {
  sessionId: string;
  params: GenerativeParams;
  interactionHistory: { x: number; y: number; time: number }[];
  evolutionFactor: number;
  
  addInteraction: (x: number, y: number) => void;
  evolve: () => void;
  getPersonalizedColor: (baseHue: number) => string;
}

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = Math.sin(s * 9999) * 10000;
    return s - Math.floor(s);
  };
}

function generateParams(seed: number): GenerativeParams {
  const random = seededRandom(seed);
  
  return {
    seed,
    colorShift: random() * 360,
    noiseScale: 0.5 + random() * 1.5,
    flowSpeed: 0.3 + random() * 0.7,
    particleDensity: 0.7 + random() * 0.6,
    geometryComplexity: 0.5 + random() * 0.5,
    connectionDensity: 0.4 + random() * 0.6,
    pulseRate: 0.5 + random() * 1.0,
    spiralIntensity: 0.3 + random() * 0.7,
    waveAmplitude: 0.5 + random() * 0.5
  };
}

export const useGenerativeArt = create<GenerativeArtState>((set, get) => {
  const sessionId = generateSessionId();
  const seed = parseInt(sessionId.split('-')[0]) % 100000;
  
  return {
    sessionId,
    params: generateParams(seed),
    interactionHistory: [],
    evolutionFactor: 0,
    
    addInteraction: (x: number, y: number) => {
      const { interactionHistory } = get();
      const newHistory = [
        ...interactionHistory.slice(-100),
        { x, y, time: Date.now() }
      ];
      
      const avgX = newHistory.reduce((sum, p) => sum + p.x, 0) / newHistory.length;
      const avgY = newHistory.reduce((sum, p) => sum + p.y, 0) / newHistory.length;
      
      set(state => ({
        interactionHistory: newHistory,
        params: {
          ...state.params,
          colorShift: state.params.colorShift + (avgX - 0.5) * 2,
          flowSpeed: state.params.flowSpeed + (avgY - 0.5) * 0.1
        }
      }));
    },
    
    evolve: () => {
      set(state => {
        const newEvolution = Math.min(state.evolutionFactor + 0.001, 1);
        const random = seededRandom(state.params.seed + newEvolution * 1000);
        
        return {
          evolutionFactor: newEvolution,
          params: {
            ...state.params,
            pulseRate: state.params.pulseRate + (random() - 0.5) * 0.01,
            spiralIntensity: state.params.spiralIntensity + (random() - 0.5) * 0.01,
            waveAmplitude: state.params.waveAmplitude + (random() - 0.5) * 0.01
          }
        };
      });
    },
    
    getPersonalizedColor: (baseHue: number) => {
      const { colorShift } = get().params;
      const adjustedHue = (baseHue + colorShift) % 360;
      return `hsl(${adjustedHue}, 10%, 90%)`;
    }
  };
});
