import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/lib/stores/useExperience';

interface Node {
  position: THREE.Vector3;
  connections: number[];
  scale: number;
  phase: number;
}

export function SystemsVisualization() {
  const groupRef = useRef<THREE.Group>(null);
  const getState = useExperience.getState;
  
  const nodes: Node[] = useMemo(() => {
    const nodeCount = 12;
    const result: Node[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 3 + Math.random() * 2;
      const height = (Math.random() - 0.5) * 4;
      
      result.push({
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ),
        connections: [],
        scale: 0.1 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2
      });
    }
    
    for (let i = 0; i < nodeCount; i++) {
      const connectionCount = 2 + Math.floor(Math.random() * 3);
      for (let j = 0; j < connectionCount; j++) {
        const target = Math.floor(Math.random() * nodeCount);
        if (target !== i && !result[i].connections.includes(target)) {
          result[i].connections.push(target);
        }
      }
    }
    
    return result;
  }, []);
  
  const linePositions = useMemo(() => {
    const positions: number[] = [];
    
    nodes.forEach((node, i) => {
      node.connections.forEach(targetIndex => {
        const target = nodes[targetIndex];
        positions.push(
          node.position.x, node.position.y, node.position.z,
          target.position.x, target.position.y, target.position.z
        );
      });
    });
    
    return new Float32Array(positions);
  }, [nodes]);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const { mousePosition, scrollProgress } = getState();
    const time = state.clock.getElapsedTime();
    
    groupRef.current.rotation.y = time * 0.05 + mousePosition.x * 0.3;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1 + mousePosition.y * 0.2;
    
    const scale = 1 + scrollProgress * 0.5;
    groupRef.current.scale.setScalar(scale);
    
    groupRef.current.position.y = -scrollProgress * 3;
  });
  
  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <NodeSphere key={i} node={node} index={i} />
      ))}
      
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color="#4A4A4A" 
          transparent 
          opacity={0.3}
          linewidth={1}
        />
      </lineSegments>
    </group>
  );
}

function NodeSphere({ node, index }: { node: Node; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    const pulseScale = 1 + Math.sin(time * 2 + node.phase) * 0.2;
    meshRef.current.scale.setScalar(node.scale * pulseScale);
    
    meshRef.current.position.x = node.position.x + Math.sin(time + node.phase) * 0.1;
    meshRef.current.position.y = node.position.y + Math.cos(time * 0.8 + node.phase) * 0.1;
    meshRef.current.position.z = node.position.z + Math.sin(time * 0.6 + node.phase) * 0.1;
  });
  
  return (
    <mesh ref={meshRef} position={node.position}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#E8E8E8"
        emissive="#4A4A4A"
        emissiveIntensity={0.3}
        roughness={0.3}
        metalness={0.7}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
