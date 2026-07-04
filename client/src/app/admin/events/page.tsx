'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, MapPin, Clock, X } from 'lucide-react';
import api from '@/lib/api';

const API_BASE = 'http://localhost:3001/api';

interface EventData {
  id: string;
  title: string;
  room: { roomName: string; roomNumber: string };
  startTime: string;
  endTime: string;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  
  // Form states
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [roomId, setRoomId] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [eRes, rRes] = await Promise.all([
        api.get('/events'),
        api.get('/rooms'),
      ]);
      setEvents(eRes.data);
      setRooms(rRes.data);
      if (rRes.data.length > 0) setRoomId(rRes.data[0].id);
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
      await api.post('/events', {
        title,
        roomId,
        startTime: new Date(start).toISOString(),
        endTime: new Date(end).toISOString(),
      });
      setTitle('');
      setStart('');
      setEnd('');
      setShowAdd(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error scheduling event');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this event?')) return;
    try {
      await api.delete(`/events/${id}`);
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
          <h1 className="text-3xl font-black tracking-tight text-white">Campus Events</h1>
          <p className="text-slate-400 text-sm mt-1">Schedule lectures, hackathons, seminars, and map them to rooms.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold shadow-lg shadow-amber-500/15 transition-all text-sm self-start"
        >
          <Plus size={16} />
          Schedule Event
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2].map(i => <div key={i} className="h-44 bg-slate-900 border border-slate-800 rounded-3xl animate-pulse" />)
        ) : events.length > 0 ? (
          events.map((event) => {
            const startStr = new Date(event.startTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
            const endStr = new Date(event.endTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
            return (
              <div 
                key={event.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-md flex flex-col justify-between h-48 hover:border-slate-700 transition-colors relative group"
              >
                <button
                  onClick={() => handleDelete(event.id)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800"
                >
                  <Trash2 size={13} />
                </button>
                
                <div>
                  <h3 className="font-extrabold text-white text-base truncate pr-6">{event.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold mt-2.5">
                    <MapPin size={12} />
                    <span>{event.room.roomName} ({event.room.roomNumber})</span>
                  </div>
                </div>

                <div className="border-t border-slate-800/60 pt-3 flex flex-col gap-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-slate-500" />
                    <span>Start: {startStr}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-slate-500" />
                    <span>End: {endStr}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="sm:col-span-2 lg:col-span-3 p-12 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center bg-slate-900/10">
            <Calendar size={40} className="text-slate-650 mb-3 animate-pulse" />
            No campus events scheduled at this time.
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl relative text-white">
            <button 
              onClick={() => setShowAdd(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="font-extrabold text-lg text-white mb-4">Schedule College Event</h3>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hackathon 2026 / Guest Lecture"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location Room</label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white cursor-pointer"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.roomName} ({r.roomNumber}) - {r.floor?.floorName || 'Unknown Floor'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold rounded-xl text-sm transition-colors mt-2"
              >
                Schedule Event
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
