import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/lib/stores/useExperience';

interface AtmosphericLightsProps {
  lightIntensity?: number;
}

export function AtmosphericLights({ lightIntensity = 1.0 }: AtmosphericLightsProps) {
  const pointLight1Ref = useRef<THREE.PointLight>(null);
  const pointLight2Ref = useRef<THREE.PointLight>(null);
  const getState = useExperience.getState;
  
  const baseIntensity = useMemo(() => 0.5 * lightIntensity, [lightIntensity]);
  
  useFrame((state) => {
    const { mousePosition } = getState();
    const time = state.clock.getElapsedTime();
    
    if (pointLight1Ref.current) {
      pointLight1Ref.current.position.x = Math.sin(time * 0.3) * 10 + mousePosition.x * 5;
      pointLight1Ref.current.position.y = Math.cos(time * 0.2) * 5 + 5;
      pointLight1Ref.current.position.z = Math.sin(time * 0.4) * 5;
      pointLight1Ref.current.intensity = baseIntensity + 0.2;
    }
    
    if (pointLight2Ref.current) {
      pointLight2Ref.current.position.x = Math.cos(time * 0.25) * 8 - mousePosition.x * 3;
      pointLight2Ref.current.position.y = Math.sin(time * 0.35) * 4 - 2;
      pointLight2Ref.current.position.z = Math.cos(time * 0.3) * 6;
      pointLight2Ref.current.intensity = baseIntensity * 0.7;
    }
  });
  
  return (
    <>
      <ambientLight intensity={0.1 * lightIntensity} color="#E8E8E8" />
      
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.3 * lightIntensity}
        color="#F5F5F5"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      <pointLight
        ref={pointLight1Ref}
        position={[5, 5, 5]}
        intensity={0.5}
        color="#F5F5F5"
        distance={30}
        decay={2}
      />
      
      <pointLight
        ref={pointLight2Ref}
        position={[-5, -2, 3]}
        intensity={0.3}
        color="#E8E8E8"
        distance={25}
        decay={2}
      />
      
      <hemisphereLight
        intensity={0.2 * lightIntensity}
        color="#F5F5F5"
        groundColor="#1A1A1A"
      />
    </>
  );
}
