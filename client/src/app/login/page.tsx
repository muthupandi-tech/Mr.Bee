'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Mail, Lock, User, ShieldAlert, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('STUDENT');
  
  // UI states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        // Registration
        await axios.post(`${API_BASE}/auth/register`, {
          email,
          password,
          fullName,
          role
        });
        
        // Auto login after registration
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
          email,
          password
        });
        
        const { access_token, user } = loginRes.data;
        localStorage.setItem('mr_bee_token', access_token);
        localStorage.setItem('mr_bee_user', JSON.stringify(user));
        
        if (user.role === 'SUPER_ADMIN' || user.role === 'COLLEGE_ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Login
        const res = await axios.post(`${API_BASE}/auth/login`, {
          email,
          password
        });

        const { access_token, user } = res.data;
        localStorage.setItem('mr_bee_token', access_token);
        localStorage.setItem('mr_bee_user', JSON.stringify(user));

        if (user.role === 'SUPER_ADMIN' || user.role === 'COLLEGE_ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden relative flex items-center justify-center px-4 font-sans">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-amber-500/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 text-white">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-amber-950 shadow-lg mb-3">
            <Compass size={32} className="animate-spin-slow" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-1.5">
            Mr. Bee
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isRegister ? 'Create your campus account' : 'Sign in to navigate your campus'}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-800/40 text-red-400 text-sm flex items-start gap-2.5">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Role Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-white cursor-pointer"
              >
                <option value="STUDENT" className="bg-slate-950">Student</option>
                <option value="FACULTY" className="bg-slate-950">Faculty</option>
                <option value="COLLEGE_ADMIN" className="bg-slate-950">College Admin</option>
                <option value="SUPER_ADMIN" className="bg-slate-950">Super Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-amber-950 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 mt-6 shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-8 text-center text-xs text-slate-400 border-t border-white/5 pt-5">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-amber-500 font-bold hover:underline ml-1"
          >
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

      </div>
    </div>
  );
}
