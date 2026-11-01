import React, { useState } from 'react';
import {
  ShieldCheck,
  Moon,
  Sun,
  Bell,
  CheckCircle2,
  AlertTriangle,
  User,
  SlidersHorizontal,
  ChevronDown,
  Info
} from 'lucide-react';
import { useTheme } from './ThemeContext';

interface HeaderProps {
  currentTab: 'home' | 'workflow' | 'reports';
  onSelectTab: (tab: 'home' | 'workflow' | 'reports') => void;
  activeStepIndex?: number;
  referenceId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  activeStepIndex = 0,
  referenceId
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Deepfake Model Updated',
      desc: 'ResNeXt-MesoNet v3.4.1 weights active. Detection sensitivity: 96.8%.',
      time: '12m ago',
      type: 'info'
    },
    {
      id: 2,
      title: 'High-Risk Incident Flagged',
      desc: 'Reference VL-KYC-2026-9019 detected face-swap boundary warping.',
      time: '1h ago',
      type: 'warning'
    },
    {
      id: 3,
      title: 'Daily KYC Audit Ready',
      desc: '142 verifications compiled. 86.4% automatic pass rate.',
      time: '3h ago',
      type: 'success'
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Abstract Security Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 focus:outline-none group text-left"
          >
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.2} />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base tracking-tight text-slate-900 dark:text-white">
                  VeriLoom
                </span>
                <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50">
                  Academic Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                AI Identity Verification
              </p>
            </div>
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-lg border border-slate-200/70 dark:border-slate-800/70">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentTab === 'home'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('workflow')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'workflow'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Verification Process</span>
            {currentTab === 'workflow' && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => onSelectTab('reports')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentTab === 'reports'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Reports
          </button>
        </nav>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2">
          {/* Active Reference Badge (if on workflow) */}
          {referenceId && currentTab === 'workflow' && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>{referenceId}</span>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              aria-label="View notifications"
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    System Security Log
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          {n.type === 'warning' ? (
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 text-blue-500" />
                          )}
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onSelectTab('reports');
                  }}
                  className="w-full mt-2 pt-2 text-center text-[11px] font-medium text-blue-500 hover:text-blue-400 border-t border-slate-100 dark:border-slate-800 block"
                >
                  View full audit log in Reports →
                </button>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 text-xs font-semibold">
                SV
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-none">
                  S. Vance
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                  Lead Risk Analyst
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-3 z-50 text-xs">
                <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Sarah Vance
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    s.vance@fincorp-risk.global
                  </p>
                  <span className="mt-1 inline-block text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                    Role: KYC Tier 2 Approver
                  </span>
                </div>
                <div className="space-y-1 text-slate-600 dark:text-slate-300">
                  <div className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-default">
                    <span>Audit Facility</span>
                    <span className="font-mono text-[10px] text-slate-400">US-EAST-01</span>
                  </div>
                  <div className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-default">
                    <span>Session Clearance</span>
                    <span className="font-mono text-[10px] text-blue-400">ISO-27001</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  Academic Environment Mode
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950 px-2 py-1.5 text-xs">
        <button
          onClick={() => onSelectTab('home')}
          className={`px-3 py-1 rounded ${
            currentTab === 'home'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onSelectTab('workflow')}
          className={`px-3 py-1 rounded ${
            currentTab === 'workflow'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Workflow ({activeStepIndex + 1}/5)
        </button>
        <button
          onClick={() => onSelectTab('reports')}
          className={`px-3 py-1 rounded ${
            currentTab === 'reports'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Reports
        </button>
      </div>
    </header>
  );
};
