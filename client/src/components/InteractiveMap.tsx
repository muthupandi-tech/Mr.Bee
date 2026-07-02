'use client';

import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, Circle } from 'react-konva';

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
}

interface Corridor {
  points: number[]; // [x1, y1, x2, y2]
}

interface PathPoint {
  x: number;
  y: number;
  floorId: string;
}

interface InteractiveMapProps {
  rooms: Room[];
  corridors: Corridor[];
  activePathPoints: PathPoint[];
  selectedRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  activeFloorId: string;
}

export default function InteractiveMap({
  rooms,
  corridors,
  activePathPoints,
  selectedRoomId,
  onRoomSelect,
  activeFloorId,
}: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Update canvas size to match parent container
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });

      // Reset camera view to fit content
      if (rooms.length > 0) {
        // Find bounding box of rooms
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        rooms.forEach(r => {
          minX = Math.min(minX, r.xCoordinate);
          minY = Math.min(minY, r.yCoordinate);
          maxX = Math.max(maxX, r.xCoordinate + r.width);
          maxY = Math.max(maxY, r.yCoordinate + r.height);
        });

        if (minX !== Infinity) {
          const mapWidth = maxX - minX + 200;
          const mapHeight = maxY - minY + 200;
          const containerWidth = containerRef.current.offsetWidth;
          const containerHeight = containerRef.current.offsetHeight;

          const newScale = Math.min(containerWidth / mapWidth, containerHeight / mapHeight, 1.5);
          setScale(newScale);
          setPosition({
            x: (containerWidth - (maxX + minX) * newScale) / 2,
            y: (containerHeight - (maxY + minY) * newScale) / 2,
          });
        }
      }
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rooms, activeFloorId]);

  // Center on a selected room when it changes
  useEffect(() => {
    if (selectedRoomId && rooms.length > 0) {
      const room = rooms.find(r => r.id === selectedRoomId);
      if (room && containerRef.current) {
        const roomCenterX = room.xCoordinate + room.width / 2;
        const roomCenterY = room.yCoordinate + room.height / 2;
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        setPosition({
          x: containerWidth / 2 - roomCenterX * scale,
          y: containerHeight / 2 - roomCenterY * scale,
        });
      }
    }
  }, [selectedRoomId]);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    // Limit zoom between 0.2x and 4x
    const clampedScale = Math.max(0.2, Math.min(4, newScale));
    
    setScale(clampedScale);
    setPosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  };

  const getRoomColor = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'LAB':
        return '#bfdbfe'; // blue-200
      case 'CLASSROOM':
        return '#fde68a'; // amber-200
      case 'OFFICE':
        return '#e9d5ff'; // purple-200
      case 'SEMINAR':
        return '#fecaca'; // red-200
      case 'RESTROOM':
        return '#f1f5f9'; // slate-100
      default:
        return '#e2e8f0'; // slate-200
    }
  };

  const getRoomBorderColor = (category: string, isSelected: boolean) => {
    if (isSelected) return '#f59e0b'; // Amber-500
    switch (category?.toUpperCase()) {
      case 'LAB':
        return '#3b82f6';
      case 'CLASSROOM':
        return '#d97706';
      case 'OFFICE':
        return '#a855f7';
      case 'SEMINAR':
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  };

  // Filter path points for the current floor
  const currentFloorPathPoints = activePathPoints.filter(
    (pt) => pt.floorId === activeFloorId
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: `${position.x}px ${position.y}px`,
      }}
    >
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onWheel={handleWheel}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable
        onDragEnd={(e) => {
          setPosition({ x: e.target.x(), y: e.target.y() });
        }}
      >
        <Layer>
          {/* 1. Corridors Background / Pathways */}
          {corridors.map((c, i) => (
            <Group key={`corr-group-${i}`}>
              {/* Thick outer path corridor */}
              <Line
                points={c.points}
                stroke="#e2e8f0"
                strokeWidth={32}
                lineCap="round"
                lineJoin="round"
                opacity={0.8}
              />
              {/* Inner walking grid line */}
              <Line
                points={c.points}
                stroke="#cbd5e1"
                strokeWidth={2}
                lineCap="round"
                lineJoin="round"
                dash={[10, 10]}
                opacity={0.6}
              />
            </Group>
          ))}

          {/* 2. Rooms Rendering */}
          {rooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            return (
              <Group
                key={room.id}
                x={room.xCoordinate}
                y={room.yCoordinate}
                rotation={room.rotation}
                onClick={() => onRoomSelect(room.id)}
                onTap={() => onRoomSelect(room.id)}
                onMouseEnter={(e) => {
                  const stage = e.target.getStage();
                  if (stage) {
                    const container = stage.container();
                    container.style.cursor = 'pointer';
                  }
                }}
                onMouseLeave={(e) => {
                  const stage = e.target.getStage();
                  if (stage) {
                    const container = stage.container();
                    container.style.cursor = 'default';
                  }
                }}
              >
                <Rect
                  width={room.width}
                  height={room.height}
                  fill={getRoomColor(room.category)}
                  stroke={getRoomBorderColor(room.category, isSelected)}
                  strokeWidth={isSelected ? 4 : 2}
                  cornerRadius={8}
                  shadowColor="#64748b"
                  shadowBlur={isSelected ? 12 : 4}
                  shadowOpacity={isSelected ? 0.35 : 0.1}
                  shadowOffset={{ x: 2, y: 2 }}
                />
                <Text
                  text={room.roomName}
                  x={10}
                  y={12}
                  fontSize={14}
                  fontFamily="Inter, sans-serif"
                  fontStyle="bold"
                  fill="#0f172a"
                  width={room.width - 20}
                  wrap="char"
                />
                <Text
                  text={`Room ${room.roomNumber}`}
                  x={10}
                  y={32}
                  fontSize={11}
                  fontFamily="Inter, sans-serif"
                  fill="#475569"
                />
              </Group>
            );
          })}

          {/* 3. Pathfinding Route Drawing */}
          {currentFloorPathPoints.length > 1 && (
            <Group>
              {/* Outer shadow/glow line */}
              <Line
                points={currentFloorPathPoints.flatMap((pt) => [pt.x, pt.y])}
                stroke="#f59e0b"
                strokeWidth={8}
                lineCap="round"
                lineJoin="round"
                opacity={0.4}
              />
              {/* Core active path line */}
              <Line
                points={currentFloorPathPoints.flatMap((pt) => [pt.x, pt.y])}
                stroke="#d97706"
                strokeWidth={4}
                lineCap="round"
                lineJoin="round"
                dash={[12, 6]}
              />

              {/* Start Room Point Marker */}
              <Circle
                x={currentFloorPathPoints[0].x}
                y={currentFloorPathPoints[0].y}
                radius={8}
                fill="#10b981" // Emerald green
                stroke="#ffffff"
                strokeWidth={2}
                shadowColor="#000000"
                shadowBlur={6}
              />
              
              {/* End Room Point Marker */}
              <Circle
                x={currentFloorPathPoints[currentFloorPathPoints.length - 1].x}
                y={currentFloorPathPoints[currentFloorPathPoints.length - 1].y}
                radius={8}
                fill="#ef4444" // Red
                stroke="#ffffff"
                strokeWidth={2}
                shadowColor="#000000"
                shadowBlur={6}
              />
            </Group>
          )}
        </Layer>
      </Stage>

      {/* Manual Zoom Controls overlay */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
        <button
          className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center font-bold text-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
          onClick={() => setScale((s) => Math.min(4, s * 1.2))}
          title="Zoom In"
        >
          +
        </button>
        <button
          className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center font-bold text-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
          onClick={() => setScale((s) => Math.max(0.2, s / 1.2))}
          title="Zoom Out"
        >
          -
        </button>
      </div>
    </div>
  );
}
