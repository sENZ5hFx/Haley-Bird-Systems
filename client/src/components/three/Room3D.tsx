/**
 * Room3D - Individual interactive room in the 3D environment
 * Premium luxury render with enhanced glow, depth, and interactive animations
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
  const boxRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Smooth floating animation
      const t = clock.getElapsedTime();
      const targetY = position[1] + Math.sin(t * 0.7) * 0.4;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;
      
      if (!hovered) {
        groupRef.current.rotation.y += 0.0008;
      }
    }

    // Smooth scale animation with lerp
    if (boxRef.current && boxRef.current.scale) {
      const targetScale = hovered ? 1.15 : 1;
      const current = boxRef.current.scale.x;
      const next = current + (targetScale - current) * 0.1;
      boxRef.current.scale.set(next, next, next);
    }

    // Enhanced glow effect with safe material check
    if (glowRef.current && glowRef.current.material instanceof THREE.MeshBasicMaterial) {
      const targetScale = hovered ? 1.8 : 1.3;
      const current = glowRef.current.scale.x;
      const next = current + (targetScale - current) * 0.08;
      glowRef.current.scale.set(next, next, next);
      glowRef.current.material.opacity = hovered ? 0.8 : 0.4;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Premium glowing aura (outer) */}
      <mesh ref={glowRef} scale={1.3}>
        <boxGeometry args={[2.2, 2.7, 2.2]} />
        <meshBasicMaterial
          color={color}
          transparent={true}
          opacity={0.4}
          wireframe={false}
        />
      </mesh>

      {/* Main box with premium materials */}
      <mesh
        ref={boxRef}
        onClick={() => onSelect(id)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[2, 2.5, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 1}
          metalness={0.85}
          roughness={0.15}
          envMapIntensity={1.5}
          toneMapped={true}
        />
      </mesh>

      {/* Interior depth plane - luxury glass effect */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[1.9, 2.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          metalness={0.6}
          roughness={0.2}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* Multi-point lighting for luxury depth */}
      <pointLight
        position={[0.5, 0.5, 0.5]}
        color={color}
        intensity={hovered ? 4 : 2}
        distance={20}
        decay={2}
      />
      <pointLight
        position={[-0.5, -0.5, -0.5]}
        color={color}
        intensity={hovered ? 2.5 : 1}
        distance={15}
        decay={2}
      />
    </group>
  );
}
