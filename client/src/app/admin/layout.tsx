'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Compass, Building, Calendar, Users, Map, LayoutDashboard, LogOut, Navigation } from 'lucide-react';

interface UserInfo {
  fullName: string;
  email: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mr_bee_token');
    const storedUser = localStorage.getItem('mr_bee_user');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'SUPER_ADMIN' && parsedUser.role !== 'COLLEGE_ADMIN') {
        router.push('/dashboard');
        return;
      }
      setUser(parsedUser);
    } catch (e) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('mr_bee_token');
    localStorage.removeItem('mr_bee_user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white">
        <Compass className="animate-spin h-10 w-10 text-amber-500 mb-3" />
        <span className="text-sm font-semibold tracking-wide text-slate-400">Verifying Admin Access...</span>
      </div>
    );
  }

  const sidebarLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Buildings & Floors', href: '/admin/buildings', icon: Building },
    { name: 'Blueprint Editor', href: '/admin/editor', icon: Map },
    { name: 'Faculty Directory', href: '/admin/faculty', icon: Users },
    { name: 'Campus Events', href: '/admin/events', icon: Calendar },
  ];

  return (
    <div className="h-screen w-full flex bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Admin Sidebar */}
      <aside className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Header Logo */}
        <div className="p-6 border-b border-slate-800/60">
          <div className="flex items-center gap-2 text-amber-500 font-extrabold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-amber-950 shadow-md">
              <Compass size={18} />
            </div>
            Mr. Bee Admin
          </div>
        </div>

        {/* User Info card */}
        <div className="px-6 py-4 border-b border-slate-800/40 bg-slate-900/30">
          <div className="text-sm font-bold truncate text-slate-200">{user?.fullName}</div>
          <div className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">
            {user?.role?.replace('_', ' ')}
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-amber-950 shadow-md shadow-amber-500/10 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800/60 flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <Navigation size={12} />
            Student View
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold bg-red-950/20 hover:bg-red-950/40 border border-red-900/20 rounded-xl text-red-400 hover:text-red-300 transition-all"
          >
            <LogOut size={12} />
            Sign Out
          </button>
        </div>

      </aside>

      {/* Main viewport */}
      <main className="flex-1 h-full flex flex-col overflow-hidden bg-slate-950">
        {children}
      </main>

    </div>
  );
}
