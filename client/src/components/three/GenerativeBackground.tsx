import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGenerativeArt } from '@/lib/stores/useGenerativeArt';
import { useExperience } from '@/lib/stores/useExperience';

interface FlowLine {
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  phase: number;
  speed: number;
  width: number;
}

export function GenerativeBackground() {
  const groupRef = useRef<THREE.Group>(null);
  const params = useGenerativeArt(state => state.params);
  const evolve = useGenerativeArt(state => state.evolve);
  const getState = useExperience.getState;
  
  const flowLines = useMemo(() => {
    const lines: FlowLine[] = [];
    const count = Math.floor(30 * params.connectionDensity);
    const random = seededRandom(params.seed);
    
    for (let i = 0; i < count; i++) {
      const angle = random() * Math.PI * 2;
      const radius = 5 + random() * 15;
      const height = (random() - 0.5) * 20;
      
      lines.push({
        startPos: new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ),
        endPos: new THREE.Vector3(
          Math.cos(angle + params.spiralIntensity) * (radius + 5),
          height + (random() - 0.5) * 10,
          Math.sin(angle + params.spiralIntensity) * (radius + 5)
        ),
        phase: random() * Math.PI * 2,
        speed: (0.5 + random() * 0.5) * params.flowSpeed,
        width: 0.02 + random() * 0.03
      });
    }
    
    return lines;
  }, [params.seed, params.connectionDensity, params.spiralIntensity, params.flowSpeed]);

  const flowPositions = useMemo(() => {
    const allPositions: Float32Array[] = [];
    
    flowLines.forEach(line => {
      const positions = new Float32Array(60);
      const segments = 20;
      
      for (let i = 0; i < segments; i++) {
        const t = i / (segments - 1);
        const x = THREE.MathUtils.lerp(line.startPos.x, line.endPos.x, t);
        const y = THREE.MathUtils.lerp(line.startPos.y, line.endPos.y, t);
        const z = THREE.MathUtils.lerp(line.startPos.z, line.endPos.z, t);
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      
      allPositions.push(positions);
    });
    
    return allPositions;
  }, [flowLines]);

  const pulsingOrbs = useMemo(() => {
    const orbs: { position: THREE.Vector3; scale: number; phase: number }[] = [];
    const count = Math.floor(8 * params.geometryComplexity);
    const random = seededRandom(params.seed + 1000);
    
    for (let i = 0; i < count; i++) {
      orbs.push({
        position: new THREE.Vector3(
          (random() - 0.5) * 30,
          (random() - 0.5) * 20,
          (random() - 0.5) * 20 - 10
        ),
        scale: 0.5 + random() * 1.5,
        phase: random() * Math.PI * 2
      });
    }
    
    return orbs;
  }, [params.seed, params.geometryComplexity]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const { scrollProgress } = getState();
    const time = state.clock.getElapsedTime();
    
    evolve();
    
    groupRef.current.rotation.y = time * 0.01 * params.flowSpeed;
    
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && child.userData.isOrb) {
        const orb = pulsingOrbs[child.userData.orbIndex];
        if (!orb) return;
        
        const pulse = Math.sin(time * params.pulseRate + orb.phase) * 0.3 + 1;
        const wave = Math.sin(time * 0.5 + orb.position.x * 0.1) * params.waveAmplitude;
        
        child.scale.setScalar(orb.scale * pulse);
        child.position.y = orb.position.y + wave;
        
        if (child.material instanceof THREE.MeshBasicMaterial) {
          const alpha = 0.1 + Math.sin(time * params.pulseRate + orb.phase) * 0.05;
          child.material.opacity = alpha;
        }
      }
      
      if (child instanceof THREE.Line && child.userData.isFlowLine) {
        const lineIndex = child.userData.lineIndex;
        const line = flowLines[lineIndex];
        if (!line) return;
        
        const geometry = child.geometry as THREE.BufferGeometry;
        const positionAttr = geometry.attributes.position;
        if (!positionAttr) return;
        
        const posArray = positionAttr.array as Float32Array;
        const original = flowPositions[lineIndex];
        if (!original) return;
        
        for (let j = 0; j < 20; j++) {
          const t = j / 19;
          const waveOffset = Math.sin(time * line.speed + t * 5 + line.phase) * 0.3 * params.waveAmplitude;
          
          posArray[j * 3] = original[j * 3] + waveOffset;
          posArray[j * 3 + 1] = original[j * 3 + 1] + waveOffset * 0.5;
          posArray[j * 3 + 2] = original[j * 3 + 2];
        }
        
        positionAttr.needsUpdate = true;
      }
    });
    
    groupRef.current.position.y = -scrollProgress * 5;
  });

  const orbMaterial = useMemo(() => (
    new THREE.MeshBasicMaterial({
      color: '#4A4A4A',
      transparent: true,
      opacity: 0.1,
      wireframe: true
    })
  ), []);

  const lineMaterial = useMemo(() => (
    new THREE.LineBasicMaterial({
      color: '#3A3A3A',
      transparent: true,
      opacity: 0.15
    })
  ), []);

  return (
    <group ref={groupRef} position={[0, 0, -15]}>
      {pulsingOrbs.map((orb, i) => (
        <mesh
          key={`orb-${i}`}
          position={orb.position}
          scale={orb.scale}
          userData={{ isOrb: true, orbIndex: i }}
          material={orbMaterial}
        >
          <icosahedronGeometry args={[1, 1]} />
        </mesh>
      ))}
      
      {flowPositions.map((positions, i) => (
        <primitive
          key={`flow-${i}`}
          object={(() => {
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const line = new THREE.Line(geometry, lineMaterial);
            line.userData = { isFlowLine: true, lineIndex: i };
            return line;
          })()}
        />
      ))}
    </group>
  );
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = Math.sin(s * 9999) * 10000;
    return s - Math.floor(s);
  };
}
