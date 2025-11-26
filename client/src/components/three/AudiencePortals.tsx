import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useExperience } from '@/lib/stores/useExperience';

interface Portal {
  id: string;
  label: string;
  sublabel: string;
  position: THREE.Vector3;
  color: string;
  notionUrl: string;
}

const portals: Portal[] = [
  {
    id: 'hiring',
    label: 'Hiring Managers',
    sublabel: 'Skills & Experience',
    position: new THREE.Vector3(-4, 0, 2),
    color: '#F5F5F5',
    notionUrl: '#hiring'
  },
  {
    id: 'collaborators',
    label: 'Collaborators',
    sublabel: 'Process & Philosophy',
    position: new THREE.Vector3(0, 0, 3),
    color: '#E8E8E8',
    notionUrl: '#collaborators'
  },
  {
    id: 'projects',
    label: 'Project Opportunities',
    sublabel: 'Capabilities & Impact',
    position: new THREE.Vector3(4, 0, 2),
    color: '#F5F5F5',
    notionUrl: '#projects'
  }
];

export function AudiencePortals() {
  const groupRef = useRef<THREE.Group>(null);
  const getState = useExperience.getState;
  
  useFrame(() => {
    if (!groupRef.current) return;
    
    const { scrollProgress } = getState();
    
    const targetY = -2 + scrollProgress * 8;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.05
    );
    
    const visibility = Math.max(0, Math.min(1, (scrollProgress - 0.3) * 3));
    groupRef.current.children.forEach(child => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
        child.visible = visibility > 0.1;
      }
    });
  });
  
  return (
    <group ref={groupRef} position={[0, -10, 0]}>
      {portals.map((portal, i) => (
        <PortalObject key={portal.id} portal={portal} index={i} />
      ))}
    </group>
  );
}

function PortalObject({ portal, index }: { portal: Portal; index: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setCursorState } = useExperience();
  
  useFrame((state) => {
    if (!groupRef.current || !ringRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    groupRef.current.position.y = Math.sin(time * 0.5 + index) * 0.2;
    
    ringRef.current.rotation.z = time * 0.3;
    ringRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    
    const targetScale = hovered ? 1.2 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });
  
  const handlePointerEnter = () => {
    setHovered(true);
    setCursorState('explore');
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerLeave = () => {
    setHovered(false);
    setCursorState('default');
    document.body.style.cursor = 'none';
  };
  
  const handleClick = () => {
    window.open(portal.notionUrl, '_blank');
  };
  
  return (
    <group 
      ref={groupRef} 
      position={portal.position}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <mesh ref={ringRef}>
        <torusGeometry args={[0.8, 0.05, 16, 32]} />
        <meshStandardMaterial
          color={portal.color}
          emissive={portal.color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          transparent
          opacity={hovered ? 1 : 0.7}
        />
      </mesh>
      
      <mesh>
        <circleGeometry args={[0.7, 32]} />
        <meshStandardMaterial
          color="#1A1A1A"
          transparent
          opacity={0.5}
        />
      </mesh>
      
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.3, 0.35, 32]} />
        <meshBasicMaterial
          color={portal.color}
          transparent
          opacity={hovered ? 0.8 : 0.4}
        />
      </mesh>
      
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.15}
        color={portal.color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {portal.label}
      </Text>
      
      <Text
        position={[0, -1.45, 0]}
        fontSize={0.08}
        color="#4A4A4A"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {portal.sublabel}
      </Text>
    </group>
  );
}
