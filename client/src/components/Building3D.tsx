'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import { useMemo } from 'react';

interface Room {
  id: string;
  roomNumber: string;
  roomName: string;
  category: string;
  xCoordinate: number;
  yCoordinate: number;
  width: number;
  height: number;
  rotation: number;
  floorId: string;
}

interface PathPoint {
  x: number;
  y: number;
  floorId: string;
}

interface FloorInfo {
  id: string;
  floorNumber: number;
  floorName: string;
}

interface Building3DProps {
  rooms: Room[];
  floors: FloorInfo[];
  activeFloorId: string;
  activePathPoints: PathPoint[];
  showAllFloors: boolean;
  selectedRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
}

export default function Building3D({
  rooms,
  floors,
  activeFloorId,
  activePathPoints,
  showAllFloors,
  selectedRoomId,
  onRoomSelect,
}: Building3DProps) {
  // Map floor ID to its stacked Y offset
  const floorYOffsets = useMemo(() => {
    const offsets = new Map<string, number>();
    // Sort floors by number so we stack them correctly
    const sorted = [...floors].sort((a, b) => a.floorNumber - b.floorNumber);
    sorted.forEach((floor, idx) => {
      // 40 units of vertical spacing per floor
      offsets.set(floor.id, idx * 45);
    });
    return offsets;
  }, [floors]);

  // Color mapping based on category
  const getRoomColor = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'LAB':
        return '#3b82f6'; // Blue
      case 'CLASSROOM':
        return '#f59e0b'; // Amber
      case 'OFFICE':
        return '#a855f7'; // Purple
      case 'SEMINAR':
        return '#ef4444'; // Red
      case 'RESTROOM':
        return '#94a3b8'; // Slate
      default:
        return '#cbd5e1';
    }
  };

  // Convert 2D path points to 3D coordinate vector coordinates
  const threeDPathPoints = useMemo(() => {
    const points: [number, number, number][] = [];
    activePathPoints.forEach((pt) => {
      const yOffset = floorYOffsets.get(pt.floorId) ?? 0;
      // Map 2D (x, y) to 3D (x, yOffset, z)
      // Scale down by 10 for better rendering sizing in ThreeJS
      points.push([pt.x / 10, yOffset + 1.5, pt.y / 10]);
    });
    return points;
  }, [activePathPoints, floorYOffsets]);

  // Center coordinate mapping
  const activeFloorIndex = floors.findIndex((f) => f.id === activeFloorId);
  const activeFloorY = activeFloorIndex >= 0 ? activeFloorIndex * 45 : 0;

  return (
    <div className="w-full h-full bg-slate-950 relative">
      
      {/* 3D Orbit Help overlay banner */}
      <div className="absolute top-24 left-5 z-10 bg-slate-900/60 border border-white/5 px-3 py-1.5 rounded-full text-[10px] text-slate-400 font-semibold backdrop-blur-md">
        🖱️ Left Click + Drag to Rotate | 🖱️ Right Click + Drag to Pan | 📜 Scroll to Zoom
      </div>

      <Canvas
        camera={{ position: [50, 80, 150], fov: 40 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[100, 200, 100]} intensity={0.8} castShadow />
        <directionalLight position={[-50, 100, -50]} intensity={0.4} />

        <group position={[-50, -10, -50]}>
          
          {/* Floors Stack or Isolated Floor */}
          {floors.map((floor) => {
            const isCurrentFloor = floor.id === activeFloorId;
            // Skip rendering other floors if isolated view is enabled
            if (!showAllFloors && !isCurrentFloor) return null;

            const yOffset = floorYOffsets.get(floor.id) ?? 0;

            // Renders standard floor base plate plane
            return (
              <group key={`floor-plate-${floor.id}`} position={[0, yOffset, 0]}>
                
                {/* Floor Plate mesh */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[50, 0, 50]}>
                  <planeGeometry args={[120, 120]} />
                  <meshStandardMaterial
                    color={isCurrentFloor ? '#1e293b' : '#0f172a'}
                    roughness={0.8}
                    transparent
                    opacity={isCurrentFloor ? 0.9 : 0.2}
                  />
                </mesh>

                {/* Grid guidelines for current floor */}
                {isCurrentFloor && (
                  <gridHelper
                    args={[120, 12, '#475569', '#334155']}
                    position={[50, 0.1, 50]}
                  />
                )}

                {/* Floating label at the edge of the floor plate */}
                <Html position={[115, 1, 50]} center>
                  <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors shadow ${
                    isCurrentFloor 
                      ? 'bg-amber-500 border-amber-400 text-amber-950 shadow-amber-500/20' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
                  }`}>
                    {floor.floorName}
                  </div>
                </Html>

              </group>
            );
          })}

          {/* Rooms Rendering in 3D */}
          {rooms.map((room) => {
            const isCurrentFloor = room.floorId === activeFloorId;
            // Skip if isolated floor mode is on and this room is on another floor
            if (!showAllFloors && !isCurrentFloor) return null;

            const yOffset = floorYOffsets.get(room.floorId) ?? 0;
            const isSelected = selectedRoomId === room.id;

            // Coordinates scaled down by 10 for three.js rendering grid
            const roomW = room.width / 10;
            const roomH = 3; // Fixed 3D wall height
            const roomD = room.height / 10;
            
            const roomX = (room.xCoordinate + room.width / 2) / 10;
            // Height mapping to Z axis in threeJS
            const roomZ = (room.yCoordinate + room.height / 2) / 10;

            const color = getRoomColor(room.category);
            const roomY = yOffset + roomH / 2;

            return (
              <group key={`room-3d-${room.id}`} position={[roomX, roomY, roomZ]}>
                
                {/* 3D Extruded Room Box */}
                <mesh 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRoomSelect(room.id);
                  }}
                >
                  <boxGeometry args={[roomW, roomH, roomD]} />
                  <meshStandardMaterial
                    color={isSelected ? '#3b82f6' : color}
                    metalness={0.1}
                    roughness={isSelected ? 0.2 : 0.6}
                    transparent
                    opacity={isCurrentFloor ? (isSelected ? 0.9 : 0.65) : 0.15}
                    wireframe={!isCurrentFloor} // Render inactive levels as transparent skeletons
                  />
                </mesh>

                {/* Glowing outline if room selected */}
                {isSelected && isCurrentFloor && (
                  <mesh>
                    <boxGeometry args={[roomW + 0.3, roomH + 0.3, roomD + 0.3]} />
                    <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.6} />
                  </mesh>
                )}

                {/* HTML text label floating above rooms on the active floor */}
                {isCurrentFloor && (
                  <Html position={[0, roomH / 2 + 1.2, 0]} center>
                    <div className="pointer-events-none select-none text-[8px] font-bold bg-slate-900/80 text-slate-300 px-1 py-0.5 rounded border border-white/5 whitespace-nowrap">
                      {room.roomName}
                    </div>
                  </Html>
                )}

              </group>
            );
          })}

          {/* 3D Walking Path Ribbon Line */}
          {threeDPathPoints.length > 1 && (
            <group>
              {/* Outer glow line */}
              <Line
                points={threeDPathPoints}
                color="#f59e0b"
                lineWidth={4}
                opacity={0.7}
                transparent
              />
              {/* Core dashed routing line */}
              <Line
                points={threeDPathPoints}
                color="#d97706"
                lineWidth={2}
              />
            </group>
          )}

        </group>

        {/* Camera controls */}
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.1} // Stop camera from sinking below floor plates
          minDistance={10}
          maxDistance={300}
        />
      </Canvas>
    </div>
  );
}
