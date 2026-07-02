'use client';

import { Stage, Layer, Rect, Text, Line, Circle, Group } from 'react-konva';

interface LocalRoom {
  id: string;
  roomNumber: string;
  roomName: string;
  category: string;
  capacity?: number;
  xCoordinate: number;
  yCoordinate: number;
  width: number;
  height: number;
  rotation: number;
}

interface LocalNode {
  id: string;
  x: number;
  y: number;
}

interface LocalEdge {
  fromNodeId: string;
  toNodeId: string;
  distance: number;
}

interface BlueprintCanvasProps {
  localRooms: LocalRoom[];
  localNodes: LocalNode[];
  localEdges: LocalEdge[];
  editorMode: 'select' | 'room' | 'node' | 'link' | 'erase';
  snapToGrid: boolean;
  gridSize: number;
  selectedRoomId: string | null;
  selectedNodeId: string | null;
  linkStartNodeId: string | null;
  scale: number;
  position: { x: number; y: number };
  setScale: (s: number | ((s: number) => number)) => void;
  setPosition: (pos: { x: number; y: number }) => void;
  setLocalRooms: (rooms: LocalRoom[]) => void;
  setLocalNodes: (nodes: LocalNode[]) => void;
  setLocalEdges: (edges: LocalEdge[]) => void;
  setSelectedRoomId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  setLinkStartNodeId: (id: string | null) => void;
  setEditorMode: (mode: any) => void;
}

export default function BlueprintCanvas({
  localRooms,
  localNodes,
  localEdges,
  editorMode,
  snapToGrid,
  gridSize,
  selectedRoomId,
  selectedNodeId,
  linkStartNodeId,
  scale,
  position,
  setScale,
  setPosition,
  setLocalRooms,
  setLocalNodes,
  setLocalEdges,
  setSelectedRoomId,
  setSelectedNodeId,
  setLinkStartNodeId,
  setEditorMode,
}: BlueprintCanvasProps) {
  
  const snap = (val: number) => {
    if (!snapToGrid) return val;
    return Math.round(val / gridSize) * gridSize;
  };

  const handleStageClick = (e: any) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    
    const mapX = (pointerPosition.x - position.x) / scale;
    const mapY = (pointerPosition.y - position.y) / scale;

    const snappedX = snap(mapX);
    const snappedY = snap(mapY);

    if (editorMode === 'node') {
      const tempId = `temp-node-${Date.now()}`;
      const newNode: LocalNode = {
        id: tempId,
        x: snappedX,
        y: snappedY,
      };
      setLocalNodes([...localNodes, newNode]);
    }
  };

  const handleNodeClick = (nodeId: string, e: any) => {
    e.cancelBubble = true;

    if (editorMode === 'erase') {
      setLocalNodes(localNodes.filter((n) => n.id !== nodeId));
      setLocalEdges(
        localEdges.filter(
          (edge) => edge.fromNodeId !== nodeId && edge.toNodeId !== nodeId
        )
      );
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
      if (linkStartNodeId === nodeId) setLinkStartNodeId(null);
      return;
    }

    if (editorMode === 'link') {
      if (linkStartNodeId === null) {
        setLinkStartNodeId(nodeId);
      } else if (linkStartNodeId !== nodeId) {
        const nodeA = localNodes.find((n) => n.id === linkStartNodeId);
        const nodeB = localNodes.find((n) => n.id === nodeId);
        if (nodeA && nodeB) {
          const dist = Math.round(
            Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2))
          );
          setLocalEdges([
            ...localEdges,
            {
              fromNodeId: linkStartNodeId,
              toNodeId: nodeId,
              distance: dist,
            },
          ]);
        }
        setLinkStartNodeId(null);
      }
      return;
    }

    if (editorMode === 'select') {
      setSelectedNodeId(nodeId);
      setSelectedRoomId(null);
    }
  };

  const deleteRoom = (roomId: string) => {
    setLocalRooms(localRooms.filter((r) => r.id !== roomId));
    if (selectedRoomId === roomId) setSelectedRoomId(null);
  };

  const deleteEdge = (fromId: string, toId: string) => {
    setLocalEdges(
      localEdges.filter(
        (e) =>
          !(e.fromNodeId === fromId && e.toNodeId === toId) &&
          !(e.fromNodeId === toId && e.toNodeId === fromId)
      )
    );
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden cursor-crosshair"
      style={{
        backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
        backgroundSize: `${gridSize}px ${gridSize}px`,
        backgroundPosition: `${position.x}px ${position.y}px`,
      }}
    >
      <Stage
        width={1200}
        height={800}
        onClick={handleStageClick}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable={editorMode === 'select' && !selectedRoomId}
        onDragEnd={(e) => {
          if (editorMode === 'select') {
            setPosition({ x: e.target.x(), y: e.target.y() });
          }
        }}
        className="h-full w-full"
      >
        <Layer>
          {/* 1. Connections/Edges */}
          {localEdges.map((edge, index) => {
            const nodeA = localNodes.find((n) => n.id === edge.fromNodeId);
            const nodeB = localNodes.find((n) => n.id === edge.toNodeId);
            if (!nodeA || !nodeB) return null;

            return (
              <Line
                key={`edge-${index}`}
                points={[nodeA.x, nodeA.y, nodeB.x, nodeB.y]}
                stroke="#e2e8f0"
                strokeWidth={24}
                lineCap="round"
                lineJoin="round"
                opacity={0.3}
                onClick={(e) => {
                  if (editorMode === 'erase') {
                    e.cancelBubble = true;
                    deleteEdge(edge.fromNodeId, edge.toNodeId);
                  }
                }}
              />
            );
          })}

          {/* 2. Rooms */}
          {localRooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            return (
              <Group
                key={room.id}
                x={room.xCoordinate}
                y={room.yCoordinate}
                rotation={room.rotation}
                draggable={editorMode === 'select'}
                onDragStart={() => {
                  setSelectedRoomId(room.id);
                  setSelectedNodeId(null);
                }}
                onDragEnd={(e) => {
                  const newX = snap(e.target.x());
                  const newY = snap(e.target.y());
                  e.target.x(newX);
                  e.target.y(newY);

                  setLocalRooms(
                    localRooms.map((r) => {
                      if (r.id === room.id) {
                        return { ...r, xCoordinate: newX, yCoordinate: newY };
                      }
                      return r;
                    })
                  );
                }}
                onClick={(e) => {
                  e.cancelBubble = true;
                  if (editorMode === 'erase') {
                    deleteRoom(room.id);
                  } else {
                    setSelectedRoomId(room.id);
                    setSelectedNodeId(null);
                  }
                }}
              >
                <Rect
                  width={room.width}
                  height={room.height}
                  fill={isSelected ? '#3b82f6' : '#1e293b'}
                  stroke={isSelected ? '#3b82f6' : '#475569'}
                  strokeWidth={isSelected ? 3 : 1}
                  cornerRadius={6}
                  opacity={0.7}
                />
                <Text
                  text={`${room.roomName}\nRoom ${room.roomNumber}`}
                  x={10}
                  y={10}
                  fontSize={11}
                  fill="#e2e8f0"
                  width={room.width - 20}
                  wrap="char"
                />
              </Group>
            );
          })}

          {/* 3. Navigation Nodes */}
          {localNodes.map((node) => {
            const isStart = linkStartNodeId === node.id;
            const isSelected = selectedNodeId === node.id;
            return (
              <Circle
                key={node.id}
                x={node.x}
                y={node.y}
                radius={8}
                fill={isStart ? '#f59e0b' : isSelected ? '#3b82f6' : '#10b981'}
                stroke="#ffffff"
                strokeWidth={1.5}
                onClick={(e) => handleNodeClick(node.id, e)}
                onMouseEnter={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'pointer';
                }}
                onMouseLeave={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'crosshair';
                }}
              />
            );
          })}
        </Layer>
      </Stage>

      {/* Stage Zoom Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
        <button
          className="w-10 h-10 bg-slate-900 rounded-full shadow-lg flex items-center justify-center font-bold text-xl text-slate-200 border border-slate-800 hover:bg-slate-800 transition-colors"
          onClick={() => setScale((s) => Math.min(4, s * 1.2))}
        >
          +
        </button>
        <button
          className="w-10 h-10 bg-slate-900 rounded-full shadow-lg flex items-center justify-center font-bold text-xl text-slate-200 border border-slate-800 hover:bg-slate-800 transition-colors"
          onClick={() => setScale((s) => Math.max(0.2, s / 1.2))}
        >
          -
        </button>
      </div>
    </div>
  );
}
