/**
 * InteractiveRoomEnvironment - Main 3D exploration space
 * 
 * Shows all rooms at once in an explorable 3D environment.
 * Users can rotate, zoom, and click rooms to interact.
 * Similar to Apple Maps 3D or Google Earth interface.
 */

import { Suspense, useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Room3D } from './Room3D';
import { SectionId } from '@/types';
import * as React from 'react';

interface RoomPosition {
  id: SectionId;
  position: [number, number, number];
  color: string;
  label: string;
}

interface InteractiveRoomEnvironmentProps {
  onRoomSelect: (id: SectionId) => void;
}

// Define room positions in 3D space (arranged in a grid pattern)
const ROOM_POSITIONS: RoomPosition[] = [
  { id: 'statement', position: [-3, 0, 3], color: '#4A9EFF', label: 'Statement' },
  { id: 'portals', position: [3, 0, 3], color: '#2ECC71', label: 'Portals' },
  { id: 'journey', position: [-3, 0, -3], color: '#E74C3C', label: 'Journey' },
  { id: 'garden', position: [3, 0, -3], color: '#9B59B6', label: 'Garden' },
  { id: 'practices', position: [-5, -2, 0], color: '#F39C12', label: 'Practices' },
  { id: 'connections', position: [5, -2, 0], color: '#1ABC9C', label: 'Connections' },
  { id: 'process', position: [0, 2, -5], color: '#E8E8E8', label: 'Process' },
  { id: 'cases', position: [-7, -2, -5], color: '#95A5A6', label: 'Cases' },
];

export function InteractiveRoomEnvironment({ onRoomSelect }: InteractiveRoomEnvironmentProps) {
  const positions = useMemo(() => ROOM_POSITIONS, []);

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} color="#ffffff" />

      {/* Directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color="#ffffff"
        castShadow
      />

      {/* Grid floor reference */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#0F1419"
          wireframe={true}
          wireframeLinewidth={0.5}
          transparent={true}
          opacity={0.2}
        />
      </mesh>

      {/* Render all rooms */}
      <Suspense fallback={null}>
        {positions.map((room) => (
          <Room3D
            key={room.id}
            id={room.id}
            position={room.position}
            color={room.color}
            label={room.label}
            onSelect={onRoomSelect}
          />
        ))}
      </Suspense>

      {/* Orbit controls - free camera exploration */}
      <OrbitControls
        autoRotate={true}
        autoRotateSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
        enableZoom={true}
        zoomSpeed={1.2}
        enablePan={true}
        minDistance={15}
        maxDistance={40}
        enableRotate={true}
      />
    </>
  );
}
