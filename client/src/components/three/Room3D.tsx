/**
 * Room3D - Individual interactive room in the 3D environment
 * Represents a clickable, glowing box in the explorable space
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SectionId } from '@/types';

interface Room3DProps {
  id: SectionId;
  position: [number, number, number];
  color: string;
  label: string;
  onSelect: (id: SectionId) => void;
}

export function Room3D({ id, position, color, label, onSelect }: Room3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (groupRef.current && !hovered) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime()) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Glowing box */}
      <mesh
        ref={meshRef}
        onClick={() => onSelect(id)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <boxGeometry args={[2, 2.5, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.5 : 0.8}
          metalness={0.7}
          roughness={0.3}
          wireframe={false}
        />
      </mesh>

      {/* Room interior suggestion */}
      <mesh position={[0, 0, -0.95]}>
        <planeGeometry args={[1.8, 2.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Glow effect */}
      <pointLight
        position={[0, 0, 0]}
        color={color}
        intensity={hovered ? 3 : 1.5}
        distance={15}
      />

      {/* Label - Simplified */}
      <mesh position={[0, 1.5, 0]}>
        <planeGeometry args={[3, 0.8]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}
