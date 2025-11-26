import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/lib/stores/useExperience';

interface ParticleFieldProps {
  count?: number;
  size?: number;
  spread?: number;
}

export function ParticleField({ count = 2000, size = 0.015, spread = 15 }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const getState = useExperience.getState;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * spread;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, [count, spread]);
  
  const velocities = useMemo(() => {
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      vel[i] = (Math.random() - 0.5) * 0.002;
    }
    return vel;
  }, [count]);
  
  const originalPositions = useMemo(() => new Float32Array(positions), [positions]);
  
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const { mousePosition, scrollProgress } = getState();
    const time = state.clock.getElapsedTime();
    const geometry = pointsRef.current.geometry;
    const positionAttribute = geometry.attributes.position;
    const posArray = positionAttribute.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      const originalX = originalPositions[i3];
      const originalY = originalPositions[i3 + 1];
      const originalZ = originalPositions[i3 + 2];
      
      const noiseX = Math.sin(time * 0.3 + originalX * 0.5) * 0.3;
      const noiseY = Math.cos(time * 0.2 + originalY * 0.5) * 0.3;
      const noiseZ = Math.sin(time * 0.4 + originalZ * 0.5) * 0.3;
      
      const mouseInfluenceX = mousePosition.x * 2;
      const mouseInfluenceY = mousePosition.y * 2;
      
      const scrollInfluence = scrollProgress * 5;
      
      posArray[i3] = originalX + noiseX + mouseInfluenceX * 0.5 + velocities[i3] * time;
      posArray[i3 + 1] = originalY + noiseY + mouseInfluenceY * 0.5 - scrollInfluence;
      posArray[i3 + 2] = originalZ + noiseZ;
    }
    
    positionAttribute.needsUpdate = true;
    
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color="#F5F5F5"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
