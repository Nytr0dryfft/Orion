import React from 'react';
import { NavTab } from '../types/orion';

interface NavigationSidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <aside
      className="w-16 flex-shrink-0 flex flex-col justify-between items-center py-6 border-r border-white/[0.05] bg-[#05070A]/80 backdrop-blur-xl z-30"
      data-purpose="vertical-navigation"
    >
      {/* Logo Mark / Top Icon */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          aria-label="ORION Home"
          className="group relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/[0.03] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-white/20"
        >
          <svg
            className="w-6 h-6 text-[#F2F6FA] opacity-90 group-hover:opacity-100 transition-opacity"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            viewBox="0 0 24 24"
          >
            {/* Minimal Orbital Geometric Mark */}
            <circle cx="12" cy="12" r="8" strokeDasharray="3 2" />
            <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Primary Vertical Action Icons */}
      <nav className="flex flex-col gap-6 items-center" data-purpose="nav-items">
        {/* Home */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          aria-label="Início"
          className={`group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 focus:outline-none ${
            activeTab === 'home'
              ? 'text-[#F2F6FA] bg-white/[0.04]'
              : 'text-[#687481] hover:text-[#C7D0D9] hover:bg-white/[0.02]'
          }`}
        >
          {activeTab === 'home' && (
            <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#F2F6FA] rounded-r-full shadow-[0_0_8px_rgba(242,246,250,0.8)]" />
          )}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.3"
            viewBox="0 0 24 24"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>

        {/* Music */}
        <button
          type="button"
          onClick={() => onSelectTab('music')}
          aria-label="Música"
          className={`group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 focus:outline-none ${
            activeTab === 'music'
              ? 'text-[#F2F6FA] bg-white/[0.04]'
              : 'text-[#687481] hover:text-[#C7D0D9] hover:bg-white/[0.02]'
          }`}
        >
          {activeTab === 'music' && (
            <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#F2F6FA] rounded-r-full shadow-[0_0_8px_rgba(242,246,250,0.8)]" />
          )}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.3"
            viewBox="0 0 24 24"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </button>

        {/* Alarm / Clock */}
        <button
          type="button"
          onClick={() => onSelectTab('alarms')}
          aria-label="Despertador"
          className={`group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 focus:outline-none ${
            activeTab === 'alarms'
              ? 'text-[#F2F6FA] bg-white/[0.04]'
              : 'text-[#687481] hover:text-[#C7D0D9] hover:bg-white/[0.02]'
          }`}
        >
          {activeTab === 'alarms' && (
            <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#F2F6FA] rounded-r-full shadow-[0_0_8px_rgba(242,246,250,0.8)]" />
          )}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.3"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2 2" />
            <path d="M5 3 2 6" />
            <path d="m22 6-3-3" />
            <path d="M6.38 18.7 4 21" />
            <path d="M17.64 18.67 20 21" />
          </svg>
        </button>

        {/* Devices */}
        <button
          type="button"
          onClick={() => onSelectTab('devices')}
          aria-label="Dispositivos"
          className={`group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 focus:outline-none ${
            activeTab === 'devices'
              ? 'text-[#F2F6FA] bg-white/[0.04]'
              : 'text-[#687481] hover:text-[#C7D0D9] hover:bg-white/[0.02]'
          }`}
        >
          {activeTab === 'devices' && (
            <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#F2F6FA] rounded-r-full shadow-[0_0_8px_rgba(242,246,250,0.8)]" />
          )}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.3"
            viewBox="0 0 24 24"
          >
            <rect height="20" rx="2" ry="2" width="16" x="4" y="2" />
            <line x1="12" x2="12.01" y1="18" y2="18" />
          </svg>
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={() => onSelectTab('settings')}
          aria-label="Configurações"
          className={`group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 focus:outline-none ${
            activeTab === 'settings'
              ? 'text-[#F2F6FA] bg-white/[0.04]'
              : 'text-[#687481] hover:text-[#C7D0D9] hover:bg-white/[0.02]'
          }`}
        >
          {activeTab === 'settings' && (
            <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#F2F6FA] rounded-r-full shadow-[0_0_8px_rgba(242,246,250,0.8)]" />
          )}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.3"
            viewBox="0 0 24 24"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </nav>

      {/* Bottom Presence / Status Indicator */}
      <div
        className="flex flex-col items-center gap-1.5 cursor-pointer"
        data-purpose="presence-status"
        title="Conexão neural ativa: 2ms"
        onClick={() => onSelectTab('settings')}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F2F6FA]" />
        </span>
      </div>
    </aside>
  );
};
