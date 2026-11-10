import React from 'react';
import { AudioTrack, AlarmItem, DeviceItem, NavTab } from '../types/orion';
import { calculateNextAlarm, formatDeviceLatency } from '../utils/orionCore';

interface BottomDeckProps {
  currentTrack: AudioTrack;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  alarms: AlarmItem[];
  devices: DeviceItem[];
  onNavigate: (tab: NavTab) => void;
}

export const BottomDeck: React.FC<BottomDeckProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  alarms,
  devices,
  onNavigate,
}) => {
  const nextAlarm = calculateNextAlarm(alarms);
  const primaryDevice = devices.find((d) => d.type === 'clock') || devices[0];

  return (
    <footer
      className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono"
      data-purpose="peripheral-modules"
    >
      {/* Music Card (Bottom-Left) */}
      <div
        className="w-full md:w-auto flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-[#161C25]/40 backdrop-blur-md subtle-border hover:bg-[#161C25]/60 transition-all cursor-pointer group"
        data-purpose="current-media"
      >
        {/* Micro Animated Soundwave Equalizer */}
        <div
          aria-hidden="true"
          className="flex items-end gap-[3px] h-4 w-4 text-[#C7D0D9] flex-shrink-0"
          onClick={onTogglePlay}
        >
          <span
            className={`w-[2px] bg-[#C7D0D9] rounded-full ${
              isPlaying ? 'eq-bar-1' : 'h-1'
            }`}
          />
          <span
            className={`w-[2px] bg-[#C7D0D9] rounded-full ${
              isPlaying ? 'eq-bar-2' : 'h-2'
            }`}
          />
          <span
            className={`w-[2px] bg-[#C7D0D9] rounded-full ${
              isPlaying ? 'eq-bar-3' : 'h-1.5'
            }`}
          />
          <span
            className={`w-[2px] bg-[#C7D0D9] rounded-full ${
              isPlaying ? 'eq-bar-4' : 'h-1'
            }`}
          />
        </div>

        {/* Track Metadata (Clickable to open music screen) */}
        <div
          className="flex flex-col min-w-0"
          onClick={() => onNavigate('music')}
        >
          <span className="text-xs font-sans text-[#F2F6FA] truncate font-medium group-hover:text-white transition-colors">
            {currentTrack.title}
          </span>
          <span className="text-[10px] text-[#687481] tracking-wider truncate font-sans">
            {currentTrack.subtitle}
          </span>
        </div>

        {/* Subtle Media Controls */}
        <div className="flex items-center gap-1.5 ml-2 border-l border-white/5 pl-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
            aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
            className="p-1 text-[#687481] hover:text-[#F2F6FA] transition-colors focus:outline-none"
          >
            {isPlaying ? (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <rect height="16" rx="1" width="4" x="6" y="4" />
                <rect height="16" rx="1" width="4" x="14" y="4" />
              </svg>
            ) : (
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <polygon points="5 4 19 12 5 20 5 4" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNextTrack();
            }}
            aria-label="Próxima faixa"
            className="p-1 text-[#687481] hover:text-[#F2F6FA] transition-colors focus:outline-none"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" x2="19" y1="5" y2="19" />
            </svg>
          </button>
        </div>
      </div>

      {/* Environmental & Device Status (Bottom-Right) */}
      <div
        className="w-full md:w-auto flex flex-wrap items-center justify-end gap-3"
        data-purpose="peripheral-devices"
      >
        {/* Alarm Module */}
        <button
          type="button"
          onClick={() => onNavigate('alarms')}
          aria-label="Abrir alarmes e rotinas circadianas"
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#161C25]/40 backdrop-blur-md subtle-border hover:bg-[#161C25]/70 hover:border-white/15 transition-all text-[11px] text-[#8795A6] cursor-pointer focus:outline-none"
        >
          <svg
            className="w-3.5 h-3.5 text-[#C7D0D9]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2 2" />
          </svg>
          <span className="font-sans text-[#F2F6FA] tracking-wide">
            {nextAlarm.formattedTime}
          </span>
          <span className="text-[#687481] font-sans text-[10px]">
            {nextAlarm.label}
          </span>
        </button>

        {/* Device Connection Module */}
        <button
          type="button"
          onClick={() => onNavigate('devices')}
          aria-label="Abrir painel de dispositivos conectados"
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#161C25]/40 backdrop-blur-md subtle-border hover:bg-[#161C25]/70 hover:border-white/15 transition-all text-[11px] cursor-pointer focus:outline-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
          <span className="text-[#C7D0D9] font-sans">
            {primaryDevice?.name || 'Orion Clock'} conectado
          </span>
          <span className="text-[10px] font-mono text-[#687481]">
            {formatDeviceLatency(primaryDevice?.latencyMs ?? 2)}
          </span>
        </button>
      </div>
    </footer>
  );
};
