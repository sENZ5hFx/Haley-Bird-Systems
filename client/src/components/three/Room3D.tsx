/**
 * Room3D - Individual interactive room in the 3D environment
 * Actual room interiors with windows, doors, depth, and visited state communication
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
  isVisited?: boolean;
}

export function Room3D({ id, position, color, label, onSelect, isVisited = false }: Room3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const boxRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Floating animation: visited rooms float slower (subtly different motion)
      const t = clock.getElapsedTime();
      const floatSpeed = isVisited ? 0.5 : 0.7;
      const floatHeight = isVisited ? 0.2 : 0.4;
      const targetY = position[1] + Math.sin(t * floatSpeed) * floatHeight;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;
      
      if (!hovered) {
        // Visited rooms rotate slower (indicates they've been seen)
        const rotationSpeed = isVisited ? 0.0004 : 0.0008;
        groupRef.current.rotation.y += rotationSpeed;
      }
    }

    // Smooth scale animation
    if (boxRef.current && boxRef.current.scale) {
      const targetScale = hovered ? 1.15 : 1;
      const current = boxRef.current.scale.x;
      const next = current + (targetScale - current) * 0.1;
      boxRef.current.scale.set(next, next, next);
    }

    // Glow effect: visited rooms have dimmer/calmer glow (indicates settled state)
    if (glowRef.current && glowRef.current.material instanceof THREE.MeshBasicMaterial) {
      const targetScale = hovered ? (isVisited ? 1.5 : 1.8) : (isVisited ? 1.15 : 1.3);
      const current = glowRef.current.scale.x;
      const next = current + (targetScale - current) * 0.08;
      glowRef.current.scale.set(next, next, next);
      const targetOpacity = hovered ? (isVisited ? 0.6 : 0.8) : (isVisited ? 0.25 : 0.4);
      glowRef.current.material.opacity = targetOpacity;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer glow aura - visited rooms glow softer */}
      <mesh ref={glowRef} scale={1.3}>
        <boxGeometry args={[2.2, 2.7, 2.2]} />
        <meshBasicMaterial
          color={color}
          transparent={true}
          opacity={isVisited ? 0.25 : 0.4}
          wireframe={false}
        />
      </mesh>

      {/* Main room exterior box */}
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
          emissiveIntensity={hovered ? 2 : (isVisited ? 0.6 : 1)}
          metalness={0.85}
          roughness={0.15}
          envMapIntensity={1.5}
          toneMapped={true}
        />
      </mesh>

      {/* Front wall - main entry surface */}
      <mesh position={[0, 0, 0.95]}>
        <planeGeometry args={[2, 2.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isVisited ? 0.3 : 0.5}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Left wall suggestion */}
      <mesh position={[-0.95, 0, 0]}>
        <planeGeometry args={[2, 2.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isVisited ? 0.2 : 0.3}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Window - suggests interior light source */}
      <mesh position={[0, 0.6, 1]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.5 : 0.8}
          transparent={true}
          opacity={0.9}
        />
      </mesh>

      {/* Interior depth plane - suggests room interior exists */}
      <mesh position={[0, 0, -0.95]}>
        <planeGeometry args={[1.9, 2.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isVisited ? 0.3 : 0.5}
          metalness={0.5}
          roughness={0.3}
          transparent={true}
          opacity={0.7}
        />
      </mesh>

      {/* Floor suggestion (bottom interior) */}
      <mesh position={[0, -1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isVisited ? 0.15 : 0.25}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Dynamic lighting - intensity changes based on visited state */}
      <pointLight
        position={[0.5, 0.5, 0.5]}
        color={color}
        intensity={hovered ? (isVisited ? 3 : 4) : (isVisited ? 1 : 2)}
        distance={20}
        decay={2}
      />
      <pointLight
        position={[-0.5, -0.5, -0.5]}
        color={color}
        intensity={hovered ? (isVisited ? 2 : 2.5) : (isVisited ? 0.6 : 1)}
        distance={15}
        decay={2}
      />

      {/* Affordance indicator: subtle highlight on front surface when not hovered */}
      {!hovered && !isVisited && (
        <mesh position={[0, 0.2, 1.01]}>
          <planeGeometry args={[1.8, 0.3]} />
          <meshBasicMaterial
            color={color}
            transparent={true}
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}
