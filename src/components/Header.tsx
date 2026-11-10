import React, { useState, useEffect } from 'react';
import { formatTimeAndDate } from '../utils/orionCore';

interface HeaderProps {
  osVersion?: string;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  osVersion = 'V4.2',
  onOpenSettings,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { timeStr, dateStr } = formatTimeAndDate(currentDate);

  return (
    <header className="flex items-start justify-between w-full" data-purpose="top-header">
      {/* Brand identity */}
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <span className="font-sora text-sm font-semibold tracking-[0.25em] text-[#F2F6FA] uppercase">
            ORION
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#687481] uppercase">
            Personal Intelligence
          </span>
        </div>
        <span className="text-[11px] text-[#687481]/80 tracking-wider mt-0.5 font-sans">
          Ambiente Sensorial Autônomo
        </span>
      </div>

      {/* Clock, Date and System Status */}
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={onOpenSettings}
          className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#161C25]/50 subtle-border hover:border-white/20 transition-all text-[10px] font-mono text-[#687481] hover:text-[#C7D0D9] tracking-wider uppercase cursor-pointer focus:outline-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#F2F6FA]/80 animate-pulse" />
          <span>ORION OS {osVersion} • SISTEMA ATIVO</span>
        </button>

        <div className="text-right">
          <div className="text-xl sm:text-2xl font-light font-sora tracking-widest text-[#F2F6FA]">
            {timeStr}
          </div>
          <div className="text-[10px] font-mono tracking-[0.2em] text-[#687481] uppercase">
            {dateStr}
          </div>
        </div>
      </div>
    </header>
  );
};
