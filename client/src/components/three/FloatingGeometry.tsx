import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/lib/stores/useExperience';

interface FloatingShape {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  type: 'box' | 'octahedron' | 'tetrahedron' | 'torus';
  speed: number;
  phase: number;
}

export function FloatingGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  const getState = useExperience.getState;
  
  const shapes: FloatingShape[] = useMemo(() => {
    const types: FloatingShape['type'][] = ['box', 'octahedron', 'tetrahedron', 'torus'];
    const result: FloatingShape[] = [];
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 8 + Math.random() * 4;
      const height = (Math.random() - 0.5) * 8;
      
      result.push({
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        scale: 0.3 + Math.random() * 0.5,
        type: types[Math.floor(Math.random() * types.length)],
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2
      });
    }
    
    return result;
  }, []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const { mousePosition, scrollProgress } = getState();
    const time = state.clock.getElapsedTime();
    
    groupRef.current.rotation.y = time * 0.02;
    groupRef.current.position.y = -scrollProgress * 5;
    
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const shape = shapes[i];
        if (!shape) return;
        
        child.rotation.x += shape.speed * 0.01;
        child.rotation.y += shape.speed * 0.015;
        
        child.position.y = shape.position.y + Math.sin(time * shape.speed + shape.phase) * 0.5;
        
        const mouseInfluence = new THREE.Vector3(
          mousePosition.x * 0.5,
          mousePosition.y * 0.3,
          0
        );
        child.position.add(mouseInfluence.multiplyScalar(0.1));
      }
    });
  });
  
  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <ShapeComponent key={i} shape={shape} />
      ))}
    </group>
  );
}

function ShapeComponent({ shape }: { shape: FloatingShape }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    switch (shape.type) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[1, 0]} />;
      case 'torus':
        return <torusGeometry args={[0.5, 0.2, 8, 16]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  }, [shape.type]);
  
  return (
    <mesh
      ref={meshRef}
      position={shape.position}
      rotation={shape.rotation}
      scale={shape.scale}
    >
      {geometry}
      <meshStandardMaterial
        color="#1A1A1A"
        emissive="#4A4A4A"
        emissiveIntensity={0.1}
        roughness={0.8}
        metalness={0.2}
        transparent
        opacity={0.4}
        wireframe
      />
    </mesh>
  );
}
