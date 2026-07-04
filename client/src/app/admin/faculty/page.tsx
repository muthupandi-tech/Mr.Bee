'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Briefcase, Mail, Home, X } from 'lucide-react';
import api from '@/lib/api';

const API_BASE = 'http://localhost:3001/api';

interface FacultyData {
  id: string;
  name: string;
  designation: string;
  department: { name: string };
  room?: { roomName: string; roomNumber: string };
}

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState<FacultyData[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  
  // Form states
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [deptId, setDeptId] = useState('');
  const [roomId, setRoomId] = useState('');

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [facRes, deptRes, roomRes] = await Promise.all([
        api.get('/faculty'),
        api.get('/departments'),
        api.get('/rooms'),
      ]);
      setFaculty(facRes.data);
      setDepartments(deptRes.data);
      setRooms(roomRes.data);
      
      if (deptRes.data.length > 0) setDeptId(deptRes.data[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/faculty', {
        name,
        designation,
        departmentId: deptId,
        roomId: roomId || null,
      });
      setName('');
      setDesignation('');
      setRoomId('');
      setShowAdd(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error registering faculty');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this faculty member?')) return;
    try {
      await api.delete(`/faculty/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950 text-slate-100 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Faculty Directory</h1>
          <p className="text-slate-400 text-sm mt-1">Manage campus teaching staff, designations, and office assignments.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold shadow-lg shadow-amber-500/15 transition-all text-sm self-start"
        >
          <Plus size={16} />
          Register Staff
        </button>
      </div>

      {/* Directory Table Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-850 rounded-xl" />)}
          </div>
        ) : faculty.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-950/20">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Designation</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Office Room</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {faculty.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-950/20 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">{f.name}</td>
                    <td className="py-4 px-6 text-slate-350">{f.designation || 'Faculty'}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-400 font-medium">
                        {f.department.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-amber-500 font-semibold">
                      {f.room ? `${f.room.roomName} (${f.room.roomNumber})` : <span className="text-slate-600 font-normal italic">Not Assigned</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-all inline-flex items-center"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-sm flex flex-col items-center justify-center">
            <Users size={40} className="text-slate-650 mb-3 animate-pulse" />
            No faculty members registered in the campus directory yet.
          </div>
        )}
      </div>

      {/* Register Staff Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl relative text-white">
            <button 
              onClick={() => setShowAdd(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="font-extrabold text-lg text-white mb-4">Register Faculty Staff</h3>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ada Lovelace"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assistant Professor / HOD"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Department</label>
                <select
                  value={deptId}
                  onChange={(e) => setDeptId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Office Room (Optional)</label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white cursor-pointer"
                >
                  <option value="">-- Do Not Assign Yet --</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.roomName} ({r.roomNumber}) - {r.floor?.floorName || 'Unknown Floor'}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold rounded-xl text-sm transition-colors mt-2"
              >
                Register Staff
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
