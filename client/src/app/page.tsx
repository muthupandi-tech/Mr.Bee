'use client';

import { Map, MapPin, Building, Navigation2, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* Background Decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <header className="glass fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              <MapPin size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">Mr. Bee</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">How it Works</Link>
            <Link href="#colleges" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">For Colleges</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/dashboard" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
              Open Campus Map
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next-Gen Indoor Navigation
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mb-6">
          Never get lost on campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-600">ever again.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10">
          Mr. Bee provides smart 2D and 3D indoor routing. Search for any classroom, lab, or faculty office and get instant walking directions.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-xl">
            Start Navigating
            <ArrowRight size={20} />
          </Link>
          <Link href="/admin" className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 dark:bg-slate-900 dark:text-white dark:border-slate-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            Admin Portal
          </Link>
        </div>

        {/* Floating App Mockup */}
        <div className="mt-20 w-full max-w-5xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-transparent to-transparent z-10 bottom-0 h-1/3 mt-auto rounded-b-3xl" />
          <div className="glass-panel p-2 md:p-4 rounded-3xl relative overflow-hidden">
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center">
              {/* Mockup Map Content */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              <div className="flex flex-col items-center gap-4 z-10">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-bounce">
                  <Map className="w-8 h-8 text-primary" />
                </div>
                <div className="text-xl font-medium text-slate-500 dark:text-slate-400">Interactive Map Preview</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to navigate</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">Designed for students, built for scale. Manage your entire campus layout without writing a single line of code.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Search</h3>
              <p className="text-slate-600 dark:text-slate-400">Instantly find classrooms, labs, faculty offices, and ongoing events with smart autocomplete.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary-foreground dark:text-primary mb-6">
                <Navigation2 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Shortest Path Routing</h3>
              <p className="text-slate-600 dark:text-slate-400">Calculates the most efficient walking path across corridors, stairs, and elevators using graph algorithms.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                <Building size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Visual Blueprint Editor</h3>
              <p className="text-slate-600 dark:text-slate-400">Drag and drop visual editor for admins to map out buildings, floors, and rooms intuitively.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
