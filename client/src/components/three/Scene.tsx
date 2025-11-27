/**
 * Scene Component - Responds to Active Room
 * 
 * The 3D environment shifts mood based on the current room (activeSection).
 * This creates immersive "stepping into a different space" effect.
 * 
 * Performance: All changes are lightweight (no heavy re-renders, just material tweaks).
 */

import { Suspense, useMemo } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { ParticleField } from './ParticleField';
import { SystemsVisualization } from './SystemsVisualization';
import { FloatingGeometry } from './FloatingGeometry';
import { AudiencePortals } from './AudiencePortals';
import { AtmosphericLights } from './AtmosphericLights';
import { GenerativeBackground } from './GenerativeBackground';
import { RoomVisualization } from './RoomVisualization';
import { SpatialAudioController } from './SpatialAudioController';
import { GodRays, ChromaticAberration, FilmGrain } from './AdvancedEffects';
import { SectionId, RoomProfile } from '../../types';

interface SceneProps {
  activeSection?: SectionId;
}

/**
 * Room profiles define the "mood" of each section.
 * Customize colors, lighting, and particle intensity here.
 */
const ROOM_PROFILES: Record<SectionId, RoomProfile> = {
  'hero': { id: 'hero', label: 'Entry', color: '#1A1A1A', lightIntensity: 1.0, particleIntensity: 1.0 },
  'statement': { id: 'statement', label: 'Signal', color: '#4A9EFF', lightIntensity: 0.9, particleIntensity: 0.8 },
  'portals': { id: 'portals', label: 'Portals', color: '#2ECC71', lightIntensity: 0.7, particleIntensity: 0.6 },
  'journey': { id: 'journey', label: 'Journey', color: '#E74C3C', lightIntensity: 0.8, particleIntensity: 0.9 },
  'garden': { id: 'garden', label: 'Garden', color: '#9B59B6', lightIntensity: 1.0, particleIntensity: 1.0 },
  'practices': { id: 'practices', label: 'Practices', color: '#F39C12', lightIntensity: 0.85, particleIntensity: 0.7 },
  'connections': { id: 'connections', label: 'Connections', color: '#1ABC9C', lightIntensity: 0.9, particleIntensity: 0.8 },
  'process': { id: 'process', label: 'Process', color: '#E8E8E8', lightIntensity: 1.1, particleIntensity: 0.5 },
  'cases': { id: 'cases', label: 'Cases', color: '#95A5A6', lightIntensity: 0.8, particleIntensity: 0.7 },
  'rooms': { id: 'rooms', label: 'Rooms', color: '#3498DB', lightIntensity: 0.9, particleIntensity: 0.9 },
  'footer': { id: 'footer', label: 'Close', color: '#1A1A1A', lightIntensity: 0.6, particleIntensity: 0.5 },
};

export function Scene({ activeSection = 'hero' }: SceneProps) {
  const roomProfile = useMemo(() => ROOM_PROFILES[activeSection], [activeSection]);

  return (
    <>
      <color attach="background" args={[roomProfile.color]} />
      <fog attach="fog" args={[roomProfile.color, 10, 50]} />
      
      <AtmosphericLights lightIntensity={roomProfile.lightIntensity || 1.0} />
      <SpatialAudioController />
      
      <Suspense fallback={null}>
        <GenerativeBackground />
        {/* Particle count adapts to room mood */}
        <ParticleField 
          count={Math.floor(3000 * roomProfile.particleIntensity)} 
          size={0.01} 
          spread={20} 
        />
        <SystemsVisualization />
        <FloatingGeometry />
        <AudiencePortals />
        <RoomVisualization />
      </Suspense>
      
      <EffectComposer>
        <Bloom
          intensity={0.3 * roomProfile.lightIntensity}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <GodRays />
        <ChromaticAberration />
        <FilmGrain />
        <Vignette offset={0.3} darkness={0.6} />
      </EffectComposer>
    </>
  );
}
