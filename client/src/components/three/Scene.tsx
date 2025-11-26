import { Suspense } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { ParticleField } from './ParticleField';
import { SystemsVisualization } from './SystemsVisualization';
import { FloatingGeometry } from './FloatingGeometry';
import { AudiencePortals } from './AudiencePortals';
import { AtmosphericLights } from './AtmosphericLights';
import { GenerativeBackground } from './GenerativeBackground';
import { RoomVisualization } from './RoomVisualization';
import { NotionContentDisplay } from './NotionContentDisplay';
import { GodRays, ChromaticAberration, FilmGrain } from './AdvancedEffects';

export function Scene() {
  return (
    <>
      <color attach="background" args={['#1A1A1A']} />
      <fog attach="fog" args={['#1A1A1A', 10, 50]} />
      
      <AtmosphericLights />
      
      <Suspense fallback={null}>
        <GenerativeBackground />
        <ParticleField count={3000} size={0.01} spread={20} />
        <SystemsVisualization />
        <FloatingGeometry />
        <AudiencePortals />
        <RoomVisualization />
        <NotionContentDisplay />
      </Suspense>
      
      <EffectComposer>
        <Bloom
          intensity={0.3}
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
