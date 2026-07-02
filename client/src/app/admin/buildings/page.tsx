'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Building, Layers, FileText, ChevronRight, X } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

interface BuildingData {
  id: string;
  name: string;
  code: string;
  description: string;
  floors?: any[];
}

export default function AdminBuildings() {
  const [buildings, setBuildings] = useState<BuildingData[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [floors, setFloors] = useState<any[]>([]);
  
  // Modals / forms states
  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [bName, setBName] = useState('');
  const [bCode, setBCode] = useState('');
  const [bDesc, setBDesc] = useState('');
  
  const [showAddFloor, setShowAddFloor] = useState(false);
  const [fNumber, setFNumber] = useState(0);
  const [fName, setFName] = useState('');

  const [loading, setLoading] = useState(true);

  const loadBuildings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/buildings`);
      setBuildings(res.data);
      if (res.data.length > 0 && !selectedBuildingId) {
        setSelectedBuildingId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadFloors = async (buildingId: string) => {
    try {
      const res = await axios.get(`${API_BASE}/floors?buildingId=${buildingId}`);
      setFloors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBuildings();
  }, []);

  useEffect(() => {
    if (selectedBuildingId) {
      loadFloors(selectedBuildingId);
    } else {
      setFloors([]);
    }
  }, [selectedBuildingId]);

  const handleAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/buildings`, {
        name: bName,
        code: bCode,
        description: bDesc
      });
      setBName('');
      setBCode('');
      setBDesc('');
      setShowAddBuilding(false);
      loadBuildings();
    } catch (err) {
      console.error(err);
      alert('Error creating building');
    }
  };

  const handleDeleteBuilding = async (id: string) => {
    if (!confirm('Are you sure you want to delete this building? This will delete all associated floors and rooms!')) return;
    try {
      await axios.delete(`${API_BASE}/buildings/${id}`);
      if (selectedBuildingId === id) {
        setSelectedBuildingId(null);
      }
      loadBuildings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFloor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuildingId) return;
    try {
      await axios.post(`${API_BASE}/floors`, {
        buildingId: selectedBuildingId,
        floorNumber: parseInt(fNumber as any),
        floorName: fName
      });
      setFNumber(0);
      setFName('');
      setShowAddFloor(false);
      loadFloors(selectedBuildingId);
    } catch (err) {
      console.error(err);
      alert('Error creating floor');
    }
  };

  const handleDeleteFloor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this floor? All room and path details will be deleted!')) return;
    try {
      await axios.delete(`${API_BASE}/floors/${id}`);
      if (selectedBuildingId) {
        loadFloors(selectedBuildingId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeBuilding = buildings.find(b => b.id === selectedBuildingId);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950 text-slate-100 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Buildings & Floors</h1>
          <p className="text-slate-400 text-sm mt-1">Define campus infrastructure blocks and floor listings.</p>
        </div>
        <button
          onClick={() => setShowAddBuilding(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold shadow-lg shadow-amber-500/15 transition-all text-sm self-start"
        >
          <Plus size={16} />
          Create Building
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Buildings Grid list */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Buildings ({buildings.length})</h3>
          
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2].map(i => <div key={i} className="h-28 bg-slate-900 rounded-3xl" />)}
            </div>
          ) : buildings.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {buildings.map((b) => {
                const isActive = selectedBuildingId === b.id;
                return (
                  <div 
                    key={b.id} 
                    onClick={() => setSelectedBuildingId(b.id)}
                    className={`p-5 rounded-3xl cursor-pointer border transition-all text-left flex flex-col justify-between h-36 ${
                      isActive 
                        ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/5' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">{b.code} Block</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBuilding(b.id);
                          }}
                          className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <h4 className="font-extrabold text-white text-lg mt-2 truncate">{b.name}</h4>
                    </div>
                    {b.description && (
                      <p className="text-xs text-slate-500 line-clamp-1 mt-2">{b.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-3xl">
              No buildings registered yet. Click "Create Building" to get started.
            </div>
          )}
        </div>

        {/* Floors list for selected building */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Floors for {activeBuilding?.code || 'Block'}
            </h3>
            {selectedBuildingId && (
              <button 
                onClick={() => setShowAddFloor(true)}
                className="flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-400"
              >
                <Plus size={14} /> Add Floor
              </button>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 min-h-[300px]">
            {selectedBuildingId ? (
              floors.length > 0 ? (
                <div className="space-y-2">
                  {floors.map((f) => (
                    <div 
                      key={f.id}
                      className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-800/40 rounded-2xl hover:border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                          F{f.floorNumber}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-200">{f.floorName}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteFloor(f.id)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 text-sm">
                  <Layers size={32} className="text-slate-600 mb-2" />
                  No floors added for this building block yet.
                </div>
              )
            ) : (
              <div className="h-full flex items-center justify-center text-center text-slate-500 text-sm">
                Select a building to view and manage its floor levels.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Add Building Modal overlay */}
      {showAddBuilding && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl relative text-white">
            <button 
              onClick={() => setShowAddBuilding(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="font-extrabold text-lg text-white mb-4">Create Campus Block</h3>
            
            <form onSubmit={handleAddBuilding} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Building Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SEB"
                  value={bCode}
                  onChange={(e) => setBCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Building Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science & Engineering Block"
                  value={bName}
                  onChange={(e) => setBName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  placeholder="Details about departments, labs..."
                  value={bDesc}
                  onChange={(e) => setBDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white h-20 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold rounded-xl text-sm transition-colors"
              >
                Create Block
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Floor Modal overlay */}
      {showAddFloor && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl relative text-white">
            <button 
              onClick={() => setShowAddFloor(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="font-extrabold text-lg text-white mb-4">Add Floor Level</h3>
            
            <form onSubmit={handleAddFloor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Floor Number</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 0, 1, 2"
                  value={fNumber}
                  onChange={(e) => setFNumber(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Floor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. First Floor"
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold rounded-xl text-sm transition-colors"
              >
                Add Floor
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
