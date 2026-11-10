import React, { useState, useEffect } from 'react';
import { AudioTrack } from '../../types/orion';
import { audioSynth } from '../../utils/audioSynth';

interface MusicScreenProps {
  tracks: AudioTrack[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onSelectTrack: (index: number) => void;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
}

export const MusicScreen: React.FC<MusicScreenProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
}) => {
  const currentTrack = tracks[currentTrackIndex];
  const [volume, setVolume] = useState(70);
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [spatialMode, setSpatialMode] = useState<'binaural' | 'stereo' | 'orbita'>('orbita');

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    audioSynth.setVolume(val / 100);
  };

  const filteredTracks = tracks.filter((t) => {
    if (selectedFilter === 'todos') return true;
    return t.category === selectedFilter;
  });

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full py-4 px-2 space-y-6 overflow-y-auto">
      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-light font-sora text-[#F2F6FA] tracking-wide">
            Estúdio de Áudio Espacial
          </h2>
          <p className="text-xs text-[#8795A6] tracking-wider font-sans mt-0.5">
            Soundscapes adaptativos e frequências de ressonância neurológica
          </p>
        </div>

        {/* Spatial audio mode pill */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#161C25]/60 subtle-border text-xs font-mono">
          <button
            type="button"
            onClick={() => setSpatialMode('orbita')}
            className={`px-3 py-1 rounded-lg transition-all ${
              spatialMode === 'orbita'
                ? 'bg-white/10 text-[#F2F6FA] shadow-sm'
                : 'text-[#687481] hover:text-[#C7D0D9]'
            }`}
          >
            ÓRBITA 3D
          </button>
          <button
            type="button"
            onClick={() => setSpatialMode('binaural')}
            className={`px-3 py-1 rounded-lg transition-all ${
              spatialMode === 'binaural'
                ? 'bg-white/10 text-[#F2F6FA] shadow-sm'
                : 'text-[#687481] hover:text-[#C7D0D9]'
            }`}
          >
            BINAURAL 10Hz
          </button>
          <button
            type="button"
            onClick={() => setSpatialMode('stereo')}
            className={`px-3 py-1 rounded-lg transition-all ${
              spatialMode === 'stereo'
                ? 'bg-white/10 text-[#F2F6FA] shadow-sm'
                : 'text-[#687481] hover:text-[#C7D0D9]'
            }`}
          >
            PURO
          </button>
        </div>
      </div>

      {/* Main Player Visualizer Card */}
      <div className="p-6 rounded-3xl bg-[#161C25]/40 subtle-border backdrop-blur-xl flex flex-col md:flex-row items-center gap-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        {/* Orbital Sound Core Graphic */}
        <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full border border-white/10 transition-all duration-700 ${
              isPlaying ? 'scale-110 border-white/20' : 'scale-95'
            }`}
          />
          <div
            className={`absolute inset-3 rounded-full border border-dashed border-white/15 transition-all duration-1000 ${
              isPlaying ? 'rotate-180 border-white/30' : ''
            }`}
          />
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#161C25] to-[#252E3B] border border-white/15 flex items-center justify-center shadow-[0_0_30px_rgba(242,246,250,0.15)]">
            <div className="flex items-end gap-1 h-8">
              <span className={`w-1 bg-[#F2F6FA] rounded-full ${isPlaying ? 'eq-bar-1' : 'h-2'}`} />
              <span className={`w-1 bg-[#F2F6FA] rounded-full ${isPlaying ? 'eq-bar-2' : 'h-4'}`} />
              <span className={`w-1 bg-[#F2F6FA] rounded-full ${isPlaying ? 'eq-bar-3' : 'h-3'}`} />
              <span className={`w-1 bg-[#F2F6FA] rounded-full ${isPlaying ? 'eq-bar-4' : 'h-2'}`} />
            </div>
          </div>
        </div>

        {/* Player Controls & Meta */}
        <div className="flex-1 w-full flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#687481] uppercase px-2 py-0.5 rounded bg-white/[0.03] subtle-border">
              {currentTrack.category.toUpperCase()} • REPRODUÇÃO CONTÍNUA
            </span>
            <h3 className="text-xl sm:text-2xl font-sora font-medium text-[#F2F6FA] mt-1.5">
              {currentTrack.title}
            </h3>
            <p className="text-xs text-[#8795A6] font-sans mt-0.5">
              {currentTrack.subtitle} — {currentTrack.description}
            </p>
          </div>

          {/* Equalizer Frequency simulation bars */}
          <div className="w-full flex items-end gap-1 h-10 py-1 border-b border-white/5">
            {Array.from({ length: 32 }).map((_, i) => {
              const h = isPlaying ? Math.sin(i * 0.4 + Date.now() * 0.002) * 12 + 16 : 4;
              return (
                <div
                  key={i}
                  className="flex-1 bg-white/20 hover:bg-white/40 transition-all rounded-t-sm"
                  style={{ height: `${Math.max(3, h)}px` }}
                />
              );
            })}
          </div>

          {/* Playback Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onPrevTrack}
                aria-label="Faixa anterior"
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#C7D0D9] hover:text-white hover:bg-white/[0.05] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="19 20 9 12 19 4 19 20" />
                  <line x1="5" x2="5" y1="19" y2="5" />
                </svg>
              </button>

              <button
                type="button"
                onClick={onTogglePlay}
                aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
                className="w-12 h-12 rounded-full bg-[#F2F6FA] text-[#05070A] hover:bg-white flex items-center justify-center transition-all shadow-[0_0_16px_rgba(242,246,250,0.3)] active:scale-95"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect height="16" rx="1" width="4" x="6" y="4" />
                    <rect height="16" rx="1" width="4" x="14" y="4" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5 4 19 12 5 20 5 4" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={onNextTrack}
                aria-label="Próxima faixa"
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#C7D0D9] hover:text-white hover:bg-white/[0.05] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="5 4 15 12 5 20 5 4" />
                  <line x1="19" x2="19" y1="5" y2="19" />
                </svg>
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2.5 w-44">
              <span className="text-[11px] font-mono text-[#687481]">VOL</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Volume do áudio"
                className="w-full accent-[#F2F6FA] bg-white/10 h-1 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] font-mono text-[#8795A6] w-7 text-right">{volume}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Track Library */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono text-[#8795A6] tracking-wider uppercase">
            Biblioteca de Soundscapes Espaciais
          </h4>
          <div className="flex gap-2">
            {['todos', 'espacial', 'binaural', 'circadiano'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-md uppercase transition-all ${
                  selectedFilter === cat
                    ? 'bg-white/10 text-[#F2F6FA] subtle-border'
                    : 'text-[#687481] hover:text-[#C7D0D9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredTracks.map((track) => {
            const isCurrent = tracks[currentTrackIndex].id === track.id;
            const actualIndex = tracks.findIndex((t) => t.id === track.id);
            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(actualIndex)}
                className={`p-3.5 rounded-2xl subtle-border transition-all cursor-pointer flex items-center justify-between group ${
                  isCurrent
                    ? 'bg-[#161C25]/80 border-white/20 shadow-md'
                    : 'bg-[#161C25]/30 hover:bg-[#161C25]/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono transition-colors ${
                      isCurrent
                        ? 'bg-white text-[#05070A] font-bold'
                        : 'bg-white/[0.03] text-[#8795A6] group-hover:text-white'
                    }`}
                  >
                    {isCurrent && isPlaying ? '▶' : actualIndex + 1}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-sans text-[#F2F6FA] font-medium truncate group-hover:text-white">
                      {track.title}
                    </span>
                    <span className="text-[10px] text-[#687481] truncate">
                      {track.artist} • {track.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-[#687481]">
                  <span>
                    {Math.floor(track.durationSeconds / 60)}:
                    {(track.durationSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
