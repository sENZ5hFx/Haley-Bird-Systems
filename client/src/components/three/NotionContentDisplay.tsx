import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useNotionContent } from '@/lib/stores/useNotionContent';
import { useExperience } from '@/lib/stores/useExperience';

interface ContentPanelProps {
  type: 'hiring' | 'projects' | 'collaborators';
  position: [number, number, number];
  rotation?: [number, number, number];
}

function ContentPanel({ type, position, rotation = [0, 0, 0] }: ContentPanelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const page = useNotionContent(state => state.pages[type]);
  const loading = useNotionContent(state => state.loading[type]);
  const fetchContent = useNotionContent(state => state.fetchContent);
  const getState = useExperience.getState;
  const setCursorState = useExperience(state => state.setCursorState);
  
  useEffect(() => {
    if (!page && !loading) {
      fetchContent(type);
    }
  }, [type, page, loading, fetchContent]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const { scrollProgress } = getState();
    const time = state.clock.getElapsedTime();
    
    const visibility = scrollProgress > 0.4 ? Math.min(1, (scrollProgress - 0.4) * 3) : 0;
    groupRef.current.visible = visibility > 0.1;
    
    if (visibility > 0.1) {
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2;
    }
  });

  if (!page) {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh>
          <boxGeometry args={[4, 3, 0.1]} />
          <meshStandardMaterial
            color="#2A2A2A"
            transparent
            opacity={0.8}
          />
        </mesh>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.3}
          color="#4A4A4A"
          anchorX="center"
          anchorY="middle"
        >
          {loading ? 'Loading...' : 'No content'}
        </Text>
      </group>
    );
  }

  const blocks = page.blocks.slice(0, 6);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerEnter={() => setCursorState('pointer')}
      onPointerLeave={() => setCursorState('default')}
    >
      <mesh>
        <boxGeometry args={[5, 4, 0.1]} />
        <meshStandardMaterial
          color="#1A1A1A"
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[5.1, 4.1, 0.05]} />
        <meshBasicMaterial
          color="#3A3A3A"
          transparent
          opacity={0.3}
        />
      </mesh>
      
      <Text
        position={[0, 1.5, 0.1]}
        fontSize={0.25}
        color="#F5F5F5"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
      >
        {page.title}
      </Text>
      
      {blocks.map((block, i) => (
        <Text
          key={block.id}
          position={[0, 1 - i * 0.4, 0.1]}
          fontSize={block.type.includes('heading') ? 0.18 : 0.12}
          color={block.type.includes('heading') ? '#E8E8E8' : '#4A4A4A'}
          anchorX="center"
          anchorY="middle"
          maxWidth={4.5}
        >
          {block.content.substring(0, 60)}
          {block.content.length > 60 ? '...' : ''}
        </Text>
      ))}
    </group>
  );
}

export function NotionContentDisplay() {
  const groupRef = useRef<THREE.Group>(null);
  const checkStatus = useNotionContent(state => state.checkStatus);
  const getState = useExperience.getState;
  
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useFrame(() => {
    if (!groupRef.current) return;
    
    const { scrollProgress } = getState();
    
    const visibility = scrollProgress > 0.35 ? Math.min(1, (scrollProgress - 0.35) * 2) : 0;
    groupRef.current.visible = visibility > 0.1;
    
    groupRef.current.position.y = -5 + scrollProgress * 10;
  });

  return (
    <group ref={groupRef} position={[0, -10, -8]}>
      <ContentPanel
        type="hiring"
        position={[-6, 0, 0]}
        rotation={[0, 0.3, 0]}
      />
      
      <ContentPanel
        type="collaborators"
        position={[0, 0, -2]}
        rotation={[0, 0, 0]}
      />
      
      <ContentPanel
        type="projects"
        position={[6, 0, 0]}
        rotation={[0, -0.3, 0]}
      />
    </group>
  );
}
