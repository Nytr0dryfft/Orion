export type NavTab = 'home' | 'music' | 'alarms' | 'devices' | 'settings';

export type OrionMode = 'AUTO' | 'CONCISO' | 'CRIATIVO' | 'SISTEMA';

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  subtitle: string;
  durationSeconds: number;
  category: 'espacial' | 'binaural' | 'circadiano' | 'foco';
  description: string;
}

export interface AlarmItem {
  id: string;
  time: string; // "06:45"
  label: string;
  days: string[]; // ["SEG", "TER", "QUA", "QUI", "SEX"]
  active: boolean;
  gentleWake: boolean;
  soundscape: string;
  fadeMinutes: number;
}

export interface DeviceItem {
  id: string;
  name: string;
  type: 'clock' | 'sphere' | 'hub' | 'audio' | 'light';
  room: string;
  connected: boolean;
  latencyMs: number;
  batteryPct?: number;
  tempCelsius?: number;
  humidityPct?: number;
  lightBrightness?: number;
  lastActive: string;
}

export interface AmbientState {
  colorTempK: number; // e.g. 2400 to 6500
  brightnessPct: number; // 0 to 100
  circadianSync: boolean;
  soundMaskingType: 'none' | 'cosmic_hum' | 'pink_noise' | 'rain_drift';
  volumePct: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'orion';
  text: string;
  timestamp: string;
  suggestions?: string[];
  actionNote?: string;
}

export interface OrionSystemState {
  version: string;
  neuralLatencyMs: number;
  personality: 'minimal' | 'warm' | 'synth' | 'analytical';
  language: 'pt-BR' | 'en' | 'es';
  currentTrackIndex: number;
  isPlaying: boolean;
  activeMode: OrionMode;
}
