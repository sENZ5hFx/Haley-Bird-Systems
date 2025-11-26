import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useRooms, Room } from '@/lib/stores/useRooms';
import { useExperience } from '@/lib/stores/useExperience';

interface RoomNodeProps {
  room: Room;
  isActive: boolean;
  isVisited: boolean;
  onClick: () => void;
}

function RoomNode({ room, isActive, isVisited, onClick }: RoomNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const setCursorState = useExperience(state => state.setCursorState);
  
  const geometry = useMemo(() => {
    switch (room.theme) {
      case 'strategy':
        return new THREE.OctahedronGeometry(1, 0);
      case 'design':
        return new THREE.IcosahedronGeometry(1, 0);
      case 'systems':
        return new THREE.DodecahedronGeometry(1, 0);
      case 'collaboration':
        return new THREE.TorusGeometry(0.7, 0.3, 8, 16);
      default:
        return new THREE.SphereGeometry(1, 16, 16);
    }
  }, [room.theme]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    meshRef.current.rotation.y = time * 0.3;
    meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.2;
    
    const baseScale = isActive ? 1.5 : 1;
    const pulse = Math.sin(time * 2) * 0.1;
    meshRef.current.scale.setScalar(baseScale + (isActive ? pulse : 0));
    
    if (glowRef.current) {
      const glowScale = baseScale * 1.5 + Math.sin(time * 1.5) * 0.2;
      glowRef.current.scale.setScalar(glowScale);
      
      if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
        glowRef.current.material.opacity = isActive ? 0.15 : 0.05;
      }
    }
  });

  const handlePointerEnter = () => {
    setCursorState('explore');
  };

  const handlePointerLeave = () => {
    setCursorState('default');
  };

  return (
    <group position={[room.position.x, room.position.y, room.position.z]}>
      <mesh
        ref={glowRef}
        geometry={geometry}
      >
        <meshBasicMaterial
          color={room.color}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
      
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={onClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <meshStandardMaterial
          color={room.color}
          emissive={room.color}
          emissiveIntensity={isActive ? 0.3 : 0.1}
          transparent
          opacity={isVisited ? 0.9 : 0.6}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      <Text
        position={[0, -2, 0]}
        fontSize={0.5}
        color={room.color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
        visible={isActive}
      >
        {room.name}
      </Text>
      
      {!isVisited && room.unlocked && (
        <mesh position={[1.5, 1.5, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      )}
    </group>
  );
}

function ConnectionLines() {
  const rooms = useRooms(state => state.rooms);
  const currentRoom = useRooms(state => state.currentRoom);
  
  const connections = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3; opacity: number }[] = [];
    
    const connectionMap: Record<string, string[]> = {
      'origin': ['strategy', 'design'],
      'strategy': ['origin', 'systems'],
      'design': ['origin', 'systems'],
      'systems': ['strategy', 'design', 'collaboration'],
      'collaboration': ['systems']
    };
    
    rooms.forEach(room => {
      const connected = connectionMap[room.id] || [];
      connected.forEach(targetId => {
        const target = rooms.find(r => r.id === targetId);
        if (target) {
          const isActiveConnection = room.id === currentRoom || targetId === currentRoom;
          lines.push({
            start: new THREE.Vector3(room.position.x, room.position.y, room.position.z),
            end: new THREE.Vector3(target.position.x, target.position.y, target.position.z),
            opacity: isActiveConnection ? 0.3 : 0.1
          });
        }
      });
    });
    
    return lines;
  }, [rooms, currentRoom]);

  return (
    <group>
      {connections.map((conn, i) => (
        <ConnectionLine key={i} start={conn.start} end={conn.end} opacity={conn.opacity} />
      ))}
    </group>
  );
}

function ConnectionLine({ start, end, opacity }: { start: THREE.Vector3; end: THREE.Vector3; opacity: number }) {
  const lineRef = useRef<THREE.Line>(null);
  
  const points = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      start,
      new THREE.Vector3(
        (start.x + end.x) / 2,
        (start.y + end.y) / 2 + 2,
        (start.z + end.z) / 2
      ),
      end
    );
    return curve.getPoints(20);
  }, [start, end]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame((state) => {
    if (!lineRef.current) return;
    
    const time = state.clock.getElapsedTime();
    if (lineRef.current.material instanceof THREE.LineBasicMaterial) {
      lineRef.current.material.opacity = opacity + Math.sin(time * 2) * 0.05;
    }
  });

  return (
    <primitive
      ref={lineRef}
      object={new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: '#4A4A4A',
          transparent: true,
          opacity: opacity
        })
      )}
    />
  );
}

export function RoomVisualization() {
  const groupRef = useRef<THREE.Group>(null);
  const rooms = useRooms(state => state.rooms);
  const currentRoom = useRooms(state => state.currentRoom);
  const visitedRooms = useRooms(state => state.visitedRooms);
  const setCurrentRoom = useRooms(state => state.setCurrentRoom);
  const visitRoom = useRooms(state => state.visitRoom);
  const getState = useExperience.getState;
  
  const { camera } = useThree();
  const targetCameraPos = useRef(new THREE.Vector3(0, 0, 15));

  useFrame(() => {
    if (!groupRef.current) return;
    
    const { scrollProgress } = getState();
    
    const activeRoom = rooms.find(r => r.id === currentRoom);
    if (activeRoom && scrollProgress > 0.6) {
      targetCameraPos.current.set(
        activeRoom.position.x,
        activeRoom.position.y + 5,
        activeRoom.position.z + 15
      );
    } else {
      targetCameraPos.current.set(0, 0, 15);
    }
    
    camera.position.lerp(targetCameraPos.current, 0.02);
    
    const visibility = scrollProgress > 0.5 ? (scrollProgress - 0.5) * 2 : 0;
    groupRef.current.children.forEach(child => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
        child.visible = visibility > 0.1;
      }
    });
  });

  const handleRoomClick = (roomId: string) => {
    setCurrentRoom(roomId);
    visitRoom(roomId);
  };

  return (
    <group ref={groupRef} position={[0, -20, -10]}>
      <ConnectionLines />
      
      {rooms.map(room => (
        <RoomNode
          key={room.id}
          room={room}
          isActive={room.id === currentRoom}
          isVisited={visitedRooms.includes(room.id)}
          onClick={() => handleRoomClick(room.id)}
        />
      ))}
    </group>
  );
}
