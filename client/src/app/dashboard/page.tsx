'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Layers, Navigation, ArrowUpDown, X, Building, Flag, Map, Info, Compass, QrCode } from 'lucide-react';
import dynamic from 'next/dynamic';
import api from '@/lib/api';

const API_BASE = 'http://localhost:3001/api';

// Konva must be dynamically imported with ssr disabled because it relies on the window object
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 animate-pulse text-slate-500 font-medium">
      <Compass className="animate-spin h-8 w-8 text-primary mr-2" />
      Loading Map Engine...
    </div>
  ),
});

const Building3D = dynamic(() => import('@/components/Building3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 animate-pulse text-slate-500 font-medium">
      <Compass className="animate-spin h-8 w-8 text-primary mr-2" />
      Loading 3D Engine...
    </div>
  ),
});

interface BuildingData {
  id: string;
  name: string;
  code: string;
  description: string;
}

interface FloorData {
  id: string;
  floorNumber: number;
  floorName: string;
}

interface RoomData {
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
  floor?: {
    floorName: string;
    building?: {
      name: string;
    };
  };
  faculty?: { name: string }[];
}

export default function Dashboard() {
  // Navigation states
  const [buildings, setBuildings] = useState<BuildingData[]>([]);
  const [activeBuildingId, setActiveBuildingId] = useState<string>('');
  
  const [floors, setFloors] = useState<FloorData[]>([]);
  const [activeFloorId, setActiveFloorId] = useState<string>('');
  
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [corridors, setCorridors] = useState<any[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Routing states
  const [startRoom, setStartRoom] = useState<RoomData | null>(null);
  const [endRoom, setEndRoom] = useState<RoomData | null>(null);
  const [navigationPath, setNavigationPath] = useState<any[]>([]);
  const [fullPathPoints, setFullPathPoints] = useState<any[]>([]);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RoomData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 3D Visualizer & QR States
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [showAllFloors3D, setShowAllFloors3D] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);

  // Parse QR query parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const floorParam = params.get('floorId');
      const roomParam = params.get('roomId');
      if (floorParam) {
        setActiveFloorId(floorParam);
      }
      if (roomParam) {
        setSelectedRoomId(roomParam);
      }
    }
  }, []);

  // Load buildings initially
  useEffect(() => {
    api.get('/buildings')
      .then(res => {
        setBuildings(res.data);
        if (res.data.length > 0) {
          setActiveBuildingId(res.data[0].id);
        }
      })
      .catch(err => console.error("Error loading buildings:", err));
  }, []);

  // Load floors when building changes
  useEffect(() => {
    if (!activeBuildingId) return;
    api.get(`/floors?buildingId=${activeBuildingId}`)
      .then(res => {
        setFloors(res.data);
        if (res.data.length > 0) {
          // Find ground floor (number 0) or default to first
          const ground = res.data.find((f: any) => f.floorNumber === 0) || res.data[0];
          setActiveFloorId(ground.id);
        } else {
          setActiveFloorId('');
          setRooms([]);
          setCorridors([]);
        }
      })
      .catch(err => console.error("Error loading floors:", err));
  }, [activeBuildingId]);

  // Load floor details (rooms, nodes, corridors) when floor changes
  useEffect(() => {
    if (!activeFloorId) return;
    api.get(`/floors/${activeFloorId}`)
      .then(res => {
        const floorObj = res.data;
        setRooms(floorObj.rooms || []);
        
        // Reconstruct corridors from nodes and edges
        const corrList: any[] = [];
        if (floorObj.nodes) {
          floorObj.nodes.forEach((node: any) => {
            if (node.outgoing) {
              node.outgoing.forEach((edge: any) => {
                const targetNode = floorObj.nodes.find((n: any) => n.id === edge.toNodeId);
                if (targetNode) {
                  corrList.push({
                    points: [node.x, node.y, targetNode.x, targetNode.y]
                  });
                }
              });
            }
          });
        }
        setCorridors(corrList);
      })
      .catch(err => console.error("Error loading floor details:", err));
  }, [activeFloorId]);

  // Autocomplete room search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const delayDebounce = setTimeout(() => {
      api.get(`/rooms?search=${searchQuery}`)
        .then(res => {
          setSearchResults(res.data);
          setIsSearching(false);
        })
        .catch(err => {
          console.error("Error searching rooms:", err);
          setIsSearching(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Compute route when startRoom and endRoom are both set
  useEffect(() => {
    if (startRoom && endRoom) {
      api.get(`/navigation/path?startRoomId=${startRoom.id}&endRoomId=${endRoom.id}`)
        .then(res => {
          setNavigationPath(res.data.path);
          setFullPathPoints(res.data.fullPathPoints);
          setRouteDistance(res.data.distance);
        })
        .catch(err => {
          console.error("Error computing path:", err);
          setNavigationPath([]);
          setFullPathPoints([]);
          setRouteDistance(null);
        });
    } else {
      setNavigationPath([]);
      setFullPathPoints([]);
      setRouteDistance(null);
    }
  }, [startRoom, endRoom]);

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  const handleSetStart = (room: RoomData) => {
    setStartRoom(room);
    setSelectedRoomId(null);
  };

  const handleSetEnd = (room: RoomData) => {
    setEndRoom(room);
    setSelectedRoomId(null);
  };

  const swapStartEnd = () => {
    const temp = startRoom;
    setStartRoom(endRoom);
    setEndRoom(temp);
  };

  const clearRoute = () => {
    setStartRoom(null);
    setEndRoom(null);
  };

  const handleSearchSelect = (room: RoomData) => {
    setSearchQuery('');
    setSearchResults([]);
    
    // Switch to building and floor of the selected room
    setActiveBuildingId(room.floor?.building?.name ? (buildings.find(b => b.name === room.floor?.building?.name)?.id || activeBuildingId) : activeBuildingId);
    setActiveFloorId(room.floorId);
    setSelectedRoomId(room.id);
  };

  // Find active building info
  const activeBuilding = buildings.find(b => b.id === activeBuildingId);
  const activeFloor = floors.find(f => f.id === activeFloorId);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      
      {/* Sidebar Panel */}
      <aside className="w-full md:w-[420px] h-2/5 md:h-full bg-white dark:bg-slate-900 border-b md:border-r border-slate-200 dark:border-slate-800 shadow-xl z-20 flex flex-col transition-all">
        
        {/* Logo and Search */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-amber-500 font-extrabold text-2xl tracking-tight">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-amber-950 shadow-md">
                <Compass size={22} className="animate-spin-slow" />
              </div>
              Mr. Bee
            </div>
            {/* Building Selection Dropdown */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full shadow-sm">
              <Building size={14} className="text-slate-400" />
              <select 
                value={activeBuildingId} 
                onChange={(e) => setActiveBuildingId(e.target.value)}
                className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer max-w-[120px] truncate"
              >
                {buildings.map(b => (
                  <option key={b.id} value={b.id}>{b.code} Block</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Autocomplete Search input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search classrooms, labs, offices, HODs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-10 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm transition-all dark:text-white"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            )}

            {/* Autocomplete Dropdown results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-30 max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in-50 duration-200">
                {searchResults.map((room) => (
                  <button 
                    key={room.id} 
                    onClick={() => handleSearchSelect(room)}
                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shrink-0 font-bold text-xs mt-0.5">
                      {room.roomNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{room.roomName}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{room.category}</span>
                        <span>•</span>
                        <span>{room.floor?.floorName || 'Unknown Floor'}</span>
                      </div>
                      {room.faculty && room.faculty.length > 0 && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5 truncate">
                          Staff: {room.faculty.map(f => f.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {searchQuery && searchResults.length === 0 && !isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-30 text-center text-sm text-slate-400">
                No matching rooms or faculty found.
              </div>
            )}
          </div>
        </div>

        {/* Route Details and Planning Panel */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Navigation Route planner box */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 relative">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Navigation size={12} className="text-amber-500" />
              Route Planner
            </h4>
            
            <div className="flex flex-col gap-3 relative">
              {/* Vertical dotted connection line */}
              <div className="absolute left-[17px] top-[18px] bottom-[18px] w-0.5 border-l-2 border-dashed border-slate-300 dark:border-slate-700 pointer-events-none" />

              {/* Start Room */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center shrink-0 z-10">
                  <Flag size={14} />
                </div>
                <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
                  {startRoom ? (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold truncate">{startRoom.roomName} ({startRoom.roomNumber})</span>
                      <button onClick={() => setStartRoom(null)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Select start point from map...</span>
                  )}
                </div>
              </div>

              {/* End Room */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/30 text-red-600 flex items-center justify-center shrink-0 z-10">
                  <MapPin size={14} />
                </div>
                <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
                  {endRoom ? (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold truncate">{endRoom.roomName} ({endRoom.roomNumber})</span>
                      <button onClick={() => setEndRoom(null)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Select destination point...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Swap and Clear Buttons */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800">
              <button 
                onClick={swapStartEnd} 
                disabled={!startRoom && !endRoom}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-500 disabled:opacity-40 disabled:hover:text-slate-600 transition-colors"
              >
                <ArrowUpDown size={13} />
                Swap Start/End
              </button>
              {(startRoom || endRoom) && (
                <button 
                  onClick={clearRoute} 
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                >
                  <X size={13} />
                  Clear Route
                </button>
              )}
            </div>
          </div>

          {/* Pathfinding Route Summary */}
          {routeDistance !== null && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/30 dark:border-amber-900/30 rounded-2xl p-4 animate-in slide-in-from-top-2">
              <h5 className="font-bold text-amber-900 dark:text-amber-400 text-sm mb-1.5 flex items-center gap-1.5">
                <Map size={16} />
                Route Calculated
              </h5>
              <div className="text-2xl font-black text-amber-950 dark:text-white">
                {routeDistance} <span className="text-sm font-normal text-slate-500">meters walking distance</span>
              </div>
              
              {/* Check if route goes across floors */}
              {startRoom && endRoom && startRoom.floorId !== endRoom.floorId && (
                <div className="mt-3 text-xs bg-amber-100/60 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/40 text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Multi-floor path:</span> Follow route to elevator/stairwell nodes to change floors. Switch floor tabs in the panel below to trace.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Floor Selection Tab Bar */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Floor Selection
            </h3>
            {floors.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {floors.map((floor) => {
                  const isActive = floor.id === activeFloorId;
                  return (
                    <button
                      key={floor.id}
                      onClick={() => setActiveFloorId(floor.id)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        isActive
                          ? 'bg-amber-500 border-amber-500 text-amber-950 shadow-md shadow-amber-500/20 font-black'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      {floor.floorName}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-slate-400 italic">No floors defined for this block.</div>
            )}
          </div>

          {/* Quick List of Rooms on active floor */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Rooms on this Floor ({rooms.length})
            </h3>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {rooms.map((room) => {
                const isSelected = selectedRoomId === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => handleRoomSelect(room.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{room.roomName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{room.category} • Number {room.roomNumber}</div>
                    </div>
                    <Navigation size={12} className={`shrink-0 ${isSelected ? 'text-amber-500' : 'text-slate-300'}`} />
                  </button>
                );
              })}
        </div>
      </div>
      </div>
      </aside>

      {/* Main Map Area */}
      <main className="flex-1 relative h-3/5 md:h-full bg-slate-105 dark:bg-slate-950">
        
        {/* Floating Building & Floor Title Banner */}
        <div className="absolute top-5 left-5 z-10 glass-panel px-4 py-2.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
            <Building size={16} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider leading-none">Active Map Location</h2>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white mt-1">
              {activeBuilding?.name || 'Loading Campus...'} / {activeFloor?.floorName || 'Loading Floor...'}
            </div>
          </div>
        </div>

        {/* Map Controls Floating Bar */}
        <div className="absolute top-5 right-5 z-10 glass-panel p-2 flex items-center gap-2">
          {/* 2D Mode Button */}
          <button 
            onClick={() => setViewMode('2D')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === '2D' 
                ? 'bg-amber-500 text-amber-950 font-extrabold shadow-sm' 
                : 'bg-white dark:bg-slate-800 hover:text-amber-505 dark:hover:text-amber-500 dark:text-slate-205'
            }`}
            title="2D Layout View"
          >
            2D Map
          </button>
          
          {/* 3D Mode Button */}
          <button 
            onClick={() => setViewMode('3D')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === '3D' 
                ? 'bg-amber-500 text-amber-950 font-extrabold shadow-sm' 
                : 'bg-white dark:bg-slate-800 hover:text-amber-505 dark:hover:text-amber-500 dark:text-slate-205'
            }`}
            title="3D Building view"
          >
            3D View
          </button>

          {/* 3D Stack Toggler (only shown in 3D mode) */}
          {viewMode === '3D' && (
            <button 
              onClick={() => setShowAllFloors3D(!showAllFloors3D)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 ${
                showAllFloors3D 
                  ? 'bg-slate-800 text-white font-extrabold shadow-sm dark:bg-slate-700' 
                  : 'bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-300'
              }`}
              title="Toggle stacked/isolated floors"
            >
              {showAllFloors3D ? 'Stacked View' : 'Isolated Level'}
            </button>
          )}

          {/* QR Code trigger */}
          <button 
            onClick={() => setShowQrModal(true)}
            className="p-2 bg-white dark:bg-slate-800 rounded-lg hover:text-amber-500 border border-transparent hover:border-slate-200 dark:hover:border-slate-750 transition-all dark:text-slate-200"
            title="Share current floor QR code"
          >
            <QrCode size={16} />
          </button>
        </div>

        {/* The Interactive canvas map component */}
        <div className="w-full h-full">
          {viewMode === '2D' ? (
            <InteractiveMap 
              rooms={rooms}
              corridors={corridors}
              activePathPoints={fullPathPoints}
              selectedRoomId={selectedRoomId}
              onRoomSelect={handleRoomSelect}
              activeFloorId={activeFloorId}
            />
          ) : (
            <Building3D 
              rooms={rooms.map(r => ({ ...r, floorId: activeFloorId }))}
              floors={floors}
              activeFloorId={activeFloorId}
              activePathPoints={fullPathPoints}
              showAllFloors={showAllFloors3D}
              selectedRoomId={selectedRoomId}
              onRoomSelect={handleRoomSelect}
            />
          )}
        </div>

        {/* Selected Room Popup Overlay Panel */}
        {selectedRoom && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 glass-panel p-5 flex flex-col sm:flex-row sm:items-center gap-5 z-10 w-[90%] max-w-xl animate-in slide-in-from-bottom-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 font-bold text-[10px] uppercase">
                  {selectedRoom.category}
                </span>
                <span className="text-xs font-bold text-slate-400">Room {selectedRoom.roomNumber}</span>
              </div>
              <h4 className="font-extrabold text-lg text-slate-950 dark:text-white mt-1 truncate">
                {selectedRoom.roomName}
              </h4>
              {selectedRoom.faculty && selectedRoom.faculty.length > 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1 truncate">
                  Faculty: {selectedRoom.faculty.map(f => f.name).join(', ')}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200/50">
              <button 
                onClick={() => handleSetStart(selectedRoom)}
                className="px-3.5 py-2 text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 transition-colors shadow-sm"
              >
                Set Start
              </button>
              <button 
                onClick={() => handleSetEnd(selectedRoom)}
                className="px-3.5 py-2 text-xs font-bold bg-amber-500 text-amber-950 rounded-xl hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/25"
              >
                Navigate Here
              </button>
              <button 
                className="text-slate-400 hover:text-slate-650 p-2 ml-1"
                onClick={() => setSelectedRoomId(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </main>

      {/* QR Code Share Modal Overlay */}
      {showQrModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-2xl relative text-center text-slate-800 dark:text-white">
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={18} />
            </button>
            
            <h3 className="font-extrabold text-lg flex items-center justify-center gap-2 mb-2">
              <QrCode className="text-amber-500" size={20} />
              Floor QR Navigation
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 mb-5 leading-relaxed">
              Scan this QR code with any mobile device to directly open the map layout for this floor block.
            </p>

            {/* QR Code Image Rendering via free API */}
            <div className="bg-white p-4 rounded-2xl inline-block border border-slate-100 shadow-inner mb-5">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  typeof window !== 'undefined' 
                    ? `${window.location.origin}/dashboard?floorId=${activeFloorId}` 
                    : `http://localhost:3000/dashboard?floorId=${activeFloorId}`
                )}`}
                alt="Floor Navigation QR Code"
                className="w-48 h-48 mx-auto select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
