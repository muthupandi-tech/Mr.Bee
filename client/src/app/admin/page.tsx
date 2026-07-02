'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, Map, Users, Calendar, Megaphone, ArrowUpRight, Plus, MapPin } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

interface Stats {
  buildings: number;
  floors: number;
  rooms: number;
  faculty: number;
  events: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    buildings: 0,
    floors: 0,
    rooms: 0,
    faculty: 0,
    events: 0
  });
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, fRes, rRes, facRes, eRes, annRes] = await Promise.all([
          axios.get(`${API_BASE}/buildings`),
          axios.get(`${API_BASE}/floors`),
          axios.get(`${API_BASE}/rooms`),
          axios.get(`${API_BASE}/faculty`),
          axios.get(`${API_BASE}/events`),
          axios.get(`${API_BASE}/announcements`),
        ]);

        setStats({
          buildings: bRes.data.length,
          floors: fRes.data.length,
          rooms: rRes.data.length,
          faculty: facRes.data.length,
          events: eRes.data.length
        });

        setAnnouncements(annRes.data.slice(0, 4));
      } catch (err) {
        console.error("Error loading admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { name: 'Total Buildings', value: stats.buildings, icon: Building, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { name: 'Total Floors', value: stats.floors, icon: MapPin, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Mapped Rooms', value: stats.rooms, icon: Map, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { name: 'Faculty Staff', value: stats.faculty, icon: Users, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
    { name: 'Campus Events', value: stats.events, icon: Calendar, color: 'text-pink-500 bg-pink-500/10 border-pink-500/20' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Campus layout, faculty directory, and mapping statistics.</p>
        </div>
        <Link
          href="/admin/editor"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold shadow-lg shadow-amber-500/15 transition-all text-sm"
        >
          <Map size={16} />
          Open Blueprint Editor
        </Link>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.name}</span>
                <div className={`p-2.5 rounded-xl border ${card.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="text-3xl font-black text-white mt-6">{loading ? '...' : card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Main Sections Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md md:col-span-1">
          <h3 className="font-extrabold text-white text-lg mb-5 flex items-center gap-2">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Edit Floor Blueprints', desc: 'Visual Room/Grid editor', href: '/admin/editor' },
              { label: 'Manage Buildings', desc: 'Add new blocks and floors', href: '/admin/buildings' },
              { label: 'Register Faculty', desc: 'Add staff and assign offices', href: '/admin/faculty' },
              { label: 'Schedule Event Venue', desc: 'Coordinate room timetables', href: '/admin/events' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800/40 hover:border-amber-500/40 hover:bg-slate-850 transition-all text-left"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-200 group-hover:text-amber-500 transition-colors">
                    {action.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{action.desc}</div>
                </div>
                <ArrowUpRight size={16} className="text-slate-500 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column: Announcements */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md md:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
              <Megaphone size={18} className="text-amber-500" />
              System Announcements
            </h3>
          </div>
          
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-slate-800 rounded-2xl" />
              ))}
            </div>
          ) : announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/40">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-bold text-slate-200">{ann.title}</h4>
                    <span className="text-[10px] text-slate-500 font-semibold bg-slate-900 px-2 py-0.5 rounded-full">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {ann.description && (
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{ann.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl">
              No recent announcements. Use the seeder to reset default system notifications.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
