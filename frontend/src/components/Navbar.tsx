import React from 'react';
import { Activity, Bell, Shield, HeartPulse, UserCheck, Stethoscope, SlidersHorizontal } from 'lucide-react';
import { RiskLevel } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadAlertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, unreadAlertCount }) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <HeartPulse className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Vital<span className="text-teal-400">AI</span>
            </span>
            <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Early Warning Health Intelligence
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
              activeTab === 'landing' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('patient')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
              activeTab === 'patient' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Patient
          </button>
          <button
            onClick={() => setActiveTab('doctor')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
              activeTab === 'doctor' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Doctor
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
              activeTab === 'simulation' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold' : 'text-amber-400 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Live Demo
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
              activeTab === 'admin' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </button>
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <Bell className="w-5 h-5" />
            {unreadAlertCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadAlertCount}
              </span>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-teal-400">
              RC
            </div>
            <div className="text-left leading-tight">
              <div className="text-xs font-semibold text-white">Dr. R. Chen</div>
              <div className="text-[10px] text-slate-400">Cardiology</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
