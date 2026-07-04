'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Building, Layers, MapPin, Grid, ShieldAlert, Trash2, Save, X, Plus } from 'lucide-react';
import api from '@/lib/api';

const API_BASE = 'http://localhost:3001/api';

const BlueprintCanvas = dynamic(() => import('@/components/BlueprintCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500 font-medium">
      Loading Editor Workspace...
    </div>
  ),
});

interface BuildingData {
  id: string;
  name: string;
  code: string;
}

interface FloorData {
  id: string;
  floorNumber: number;
  floorName: string;
}

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

export default function VisualEditor() {
  const [buildings, setBuildings] = useState<BuildingData[]>([]);
  const [activeBuildingId, setActiveBuildingId] = useState<string>('');
  
  const [floors, setFloors] = useState<FloorData[]>([]);
  const [activeFloorId, setActiveFloorId] = useState<string>('');

  const [localRooms, setLocalRooms] = useState<LocalRoom[]>([]);
  const [localNodes, setLocalNodes] = useState<LocalNode[]>([]);
  const [localEdges, setLocalEdges] = useState<LocalEdge[]>([]);

  const [editorMode, setEditorMode] = useState<'select' | 'room' | 'node' | 'link' | 'erase'>('select');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [linkStartNodeId, setLinkStartNodeId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    api.get('/buildings')
      .then(res => {
        setBuildings(res.data);
        if (res.data.length > 0) setActiveBuildingId(res.data[0].id);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!activeBuildingId) return;
    api.get(`/floors?buildingId=${activeBuildingId}`)
      .then(res => {
        setFloors(res.data);
        if (res.data.length > 0) {
          setActiveFloorId(res.data[0].id);
        } else {
          setActiveFloorId('');
          setLocalRooms([]);
          setLocalNodes([]);
          setLocalEdges([]);
        }
      })
      .catch(err => console.error(err));
  }, [activeBuildingId]);

  useEffect(() => {
    if (!activeFloorId) return;
    api.get(`/floors/${activeFloorId}`)
      .then(res => {
        const floorObj = res.data;
        setLocalRooms(floorObj.rooms || []);
        
        const nodesList: LocalNode[] = [];
        const edgesList: LocalEdge[] = [];
        
        if (floorObj.nodes) {
          floorObj.nodes.forEach((node: any) => {
            nodesList.push({ id: node.id, x: node.x, y: node.y });
            if (node.outgoing) {
              node.outgoing.forEach((edge: any) => {
                const exists = edgesList.some(e => 
                  (e.fromNodeId === edge.fromNodeId && e.toNodeId === edge.toNodeId) ||
                  (e.fromNodeId === edge.toNodeId && e.toNodeId === edge.fromNodeId)
                );
                if (!exists) {
                  edgesList.push({
                    fromNodeId: edge.fromNodeId,
                    toNodeId: edge.toNodeId,
                    distance: edge.distance
                  });
                }
              });
            }
          });
        }
        
        setLocalNodes(nodesList);
        setLocalEdges(edgesList);
        setSelectedRoomId(null);
        setSelectedNodeId(null);
        setLinkStartNodeId(null);
      })
      .catch(err => console.error(err));
  }, [activeFloorId]);

  const addNewRoom = () => {
    const tempId = `temp-room-${Date.now()}`;
    const newRoom: LocalRoom = {
      id: tempId,
      roomNumber: (localRooms.length + 101).toString(),
      roomName: `New Classroom ${localRooms.length + 1}`,
      category: 'CLASSROOM',
      capacity: 40,
      xCoordinate: 100,
      yCoordinate: 100,
      width: 140,
      height: 100,
      rotation: 0
    };
    setLocalRooms([...localRooms, newRoom]);
    setSelectedRoomId(tempId);
    setSelectedNodeId(null);
    setEditorMode('select');
  };

  const deleteRoom = (roomId: string) => {
    setLocalRooms(localRooms.filter(r => r.id !== roomId));
    if (selectedRoomId === roomId) setSelectedRoomId(null);
  };

  const updateSelectedRoom = (field: keyof LocalRoom, value: any) => {
    if (!selectedRoomId) return;
    setLocalRooms(localRooms.map(r => {
      if (r.id === selectedRoomId) {
        return { ...r, [field]: value };
      }
      return r;
    }));
  };

  const handleSave = async () => {
    if (!activeFloorId) return;
    setSaving(true);
    setSuccessMsg('');
    
    const backendEdges: any[] = [];
    localEdges.forEach(e => {
      backendEdges.push({ fromNodeId: e.fromNodeId, toNodeId: e.toNodeId, distance: e.distance });
      backendEdges.push({ fromNodeId: e.toNodeId, toNodeId: e.fromNodeId, distance: e.distance });
    });

    try {
      await api.post('/navigation/save-layout', {
        floorId: activeFloorId,
        rooms: localRooms,
        nodes: localNodes,
        edges: backendEdges
      });
      setSuccessMsg('Blueprint saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to save layout coordinates.');
    } finally {
      setSaving(false);
    }
  };

  const selectedRoom = localRooms.find(r => r.id === selectedRoomId);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 font-sans">
      
      {/* Top Header Control bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-base font-extrabold text-white flex items-center gap-2">
            <Building size={16} className="text-amber-500" />
            Visual Blueprint Editor
          </h1>
          
          {/* Dropdowns */}
          <div className="flex items-center gap-3">
            <select
              value={activeBuildingId}
              onChange={(e) => setActiveBuildingId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-355 cursor-pointer"
            >
              {buildings.map(b => (
                <option key={b.id} value={b.id}>{b.code} Block</option>
              ))}
            </select>

            <select
              value={activeFloorId}
              onChange={(e) => setActiveFloorId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-355 cursor-pointer"
              disabled={floors.length === 0}
            >
              {floors.map(f => (
                <option key={f.id} value={f.id}>{f.floorName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {successMsg && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-955/20 border border-emerald-900/30 px-3 py-1.5 rounded-full">
              {successMsg}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !activeFloorId}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-amber-950 rounded-xl transition-all shadow-md active:scale-95"
          >
            <Save size={13} />
            {saving ? 'Saving...' : 'Save Blueprint'}
          </button>
        </div>
      </header>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Toolbox */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col gap-6 shrink-0 overflow-y-auto">
          
          {/* Drawing Tools */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Toolbox Mode</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { mode: 'select', label: 'Select / Drag' },
                { mode: 'room', label: '+ Add Room', onClick: addNewRoom },
                { mode: 'node', label: 'Place Nodes' },
                { mode: 'link', label: 'Link Nodes' },
                { mode: 'erase', label: 'Eraser' },
              ].map((tool) => (
                <button
                  key={tool.mode}
                  onClick={() => {
                    if (tool.onClick) {
                      tool.onClick();
                    } else {
                      setEditorMode(tool.mode as any);
                      setSelectedRoomId(null);
                      setSelectedNodeId(null);
                      setLinkStartNodeId(null);
                    }
                  }}
                  className={`py-3.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    editorMode === tool.mode
                      ? 'bg-amber-500 border-amber-500 text-amber-955 font-black shadow-md'
                      : 'bg-slate-955 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Configuration */}
          <div className="border-t border-slate-800/60 pt-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Grid settings</h4>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Snap to Grid</span>
                <input
                  type="checkbox"
                  checked={snapToGrid}
                  onChange={(e) => setSnapToGrid(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Grid Size (px)</span>
                <select
                  value={gridSize}
                  onChange={(e) => setGridSize(parseInt(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300"
                >
                  <option value="10">10 px</option>
                  <option value="20">20 px</option>
                  <option value="40">40 px</option>
                </select>
              </div>
            </div>
          </div>

          {/* Guidelines notes */}
          <div className="border-t border-slate-800/60 pt-4 text-xs text-slate-500 leading-relaxed space-y-2">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider">How to Edit:</h4>
            {editorMode === 'room' && <p>• Click "+ Add Room" to drop a room at coordinates (100, 100). Use "Select" tool to drag, resize, and position it.</p>}
            {editorMode === 'node' && <p>• Click anywhere on the map grid to place a navigation node coordinate.</p>}
            {editorMode === 'link' && <p>• Click the start node, then click a target node to establish a walking connection link.</p>}
            {editorMode === 'erase' && <p>• Click nodes, rooms, or connection lines to erase them from this floor blueprint.</p>}
            {editorMode === 'select' && <p>• Click any room to edit name, category, or dimension attributes in the sidebar.</p>}
          </div>

        </div>

        {/* Center Workspace: Canvas Stage */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden">
          <BlueprintCanvas 
            localRooms={localRooms}
            localNodes={localNodes}
            localEdges={localEdges}
            editorMode={editorMode}
            snapToGrid={snapToGrid}
            gridSize={gridSize}
            selectedRoomId={selectedRoomId}
            selectedNodeId={selectedNodeId}
            linkStartNodeId={linkStartNodeId}
            scale={scale}
            position={position}
            setScale={setScale}
            setPosition={setPosition}
            setLocalRooms={setLocalRooms}
            setLocalNodes={setLocalNodes}
            setLocalEdges={setLocalEdges}
            setSelectedRoomId={setSelectedRoomId}
            setSelectedNodeId={setSelectedNodeId}
            setLinkStartNodeId={setLinkStartNodeId}
            setEditorMode={setEditorMode}
          />
        </div>

        {/* Right Side: Options / Selected details */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 p-5 shrink-0 overflow-y-auto">
          {selectedRoom ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="font-extrabold text-sm text-white">Room Attributes</h3>
                <button 
                  onClick={() => deleteRoom(selectedRoom.id)}
                  className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Room details form */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Room Number</label>
                  <input
                    type="text"
                    value={selectedRoom.roomNumber}
                    onChange={(e) => updateSelectedRoom('roomNumber', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Room Name</label>
                  <input
                    type="text"
                    value={selectedRoom.roomName}
                    onChange={(e) => updateSelectedRoom('roomName', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={selectedRoom.category}
                    onChange={(e) => updateSelectedRoom('category', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="CLASSROOM">Classroom</option>
                    <option value="LAB">Laboratory</option>
                    <option value="OFFICE">Office</option>
                    <option value="SEMINAR">Seminar Hall</option>
                    <option value="RESTROOM">Restroom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Seating Capacity</label>
                  <input
                    type="number"
                    value={selectedRoom.capacity || 0}
                    onChange={(e) => updateSelectedRoom('capacity', parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Width (px)</label>
                    <input
                      type="number"
                      value={selectedRoom.width}
                      onChange={(e) => updateSelectedRoom('width', parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Height (px)</label>
                    <input
                      type="number"
                      value={selectedRoom.height}
                      onChange={(e) => updateSelectedRoom('height', parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">X Position</label>
                    <input
                      type="number"
                      value={selectedRoom.xCoordinate}
                      onChange={(e) => updateSelectedRoom('xCoordinate', parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Y Position</label>
                    <input
                      type="number"
                      value={selectedRoom.yCoordinate}
                      onChange={(e) => updateSelectedRoom('yCoordinate', parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : selectedNodeId ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-white">Node Attributes</h3>
                <button
                  onClick={() => {
                    setLocalNodes(localNodes.filter(n => n.id !== selectedNodeId));
                    setLocalEdges(localEdges.filter(e => e.fromNodeId !== selectedNodeId && e.toNodeId !== selectedNodeId));
                    setSelectedNodeId(null);
                  }}
                  className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="text-xs text-slate-400 space-y-2">
                <div>Node ID: <span className="font-semibold text-slate-200">{selectedNodeId}</span></div>
                <div>X Position: <span className="font-semibold text-slate-200">{localNodes.find(n => n.id === selectedNodeId)?.x}</span></div>
                <div>Y Position: <span className="font-semibold text-slate-200">{localNodes.find(n => n.id === selectedNodeId)?.y}</span></div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-slate-500 text-xs py-10 border border-dashed border-slate-800/80 rounded-2xl">
              Click on a room box or navigation node to inspect and modify layout attributes.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
