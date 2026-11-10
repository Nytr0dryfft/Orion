import React, { useState } from 'react';
import { NavTab, OrionMode, AlarmItem, AmbientState, DeviceItem, OrionSystemState } from './types/orion';
import { INITIAL_TRACKS, INITIAL_ALARMS, INITIAL_DEVICES, INITIAL_AMBIENT } from './utils/initialData';
import { NavigationSidebar } from './components/NavigationSidebar';
import { Header } from './components/Header';
import { SculpturalCore } from './components/SculpturalCore';
import { ConversationalInput } from './components/ConversationalInput';
import { BottomDeck } from './components/BottomDeck';
import { MusicScreen } from './components/screens/MusicScreen';
import { AlarmsScreen } from './components/screens/AlarmsScreen';
import { DevicesScreen } from './components/screens/DevicesScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { audioSynth } from './utils/audioSynth';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [tracks] = useState(INITIAL_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMode, setCurrentMode] = useState<OrionMode>('AUTO');
  const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);
  const [devices, setDevices] = useState<DeviceItem[]>(INITIAL_DEVICES);
  const [ambient, setAmbient] = useState<AmbientState>(INITIAL_AMBIENT);
  const [systemState, setSystemState] = useState<OrionSystemState>({
    version: 'V4.2',
    neuralLatencyMs: 2,
    personality: 'minimal',
    language: 'pt-BR',
    currentTrackIndex: 0,
    isPlaying: false,
    activeMode: 'AUTO',
  });

  const togglePlay = () => {
    if (isPlaying) {
      audioSynth.stop();
      setIsPlaying(false);
    } else {
      const presets: ('andromeda' | 'nebula' | 'alpha' | 'zen')[] = ['andromeda', 'nebula', 'alpha', 'zen'];
      const preset = presets[currentTrackIndex % presets.length];
      audioSynth.playTrack(preset);
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIdx);
    if (isPlaying) {
      const presets: ('andromeda' | 'nebula' | 'alpha' | 'zen')[] = ['andromeda', 'nebula', 'alpha', 'zen'];
      audioSynth.playTrack(presets[nextIdx % presets.length]);
    }
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIdx);
    if (isPlaying) {
      const presets: ('andromeda' | 'nebula' | 'alpha' | 'zen')[] = ['andromeda', 'nebula', 'alpha', 'zen'];
      audioSynth.playTrack(presets[prevIdx % presets.length]);
    }
  };

  const handleSelectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    const presets: ('andromeda' | 'nebula' | 'alpha' | 'zen')[] = ['andromeda', 'nebula', 'alpha', 'zen'];
    audioSynth.playTrack(presets[index % presets.length]);
    setIsPlaying(true);
  };

  const handleToggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const handleAddAlarm = (alarmData: Omit<AlarmItem, 'id'>) => {
    const newAlarm: AlarmItem = {
      ...alarmData,
      id: `alarm-${Date.now()}`,
    };
    setAlarms((prev) => [newAlarm, ...prev]);
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, connected: !d.connected } : d))
    );
  };

  const handleUpdateAmbient = (partial: Partial<AmbientState>) => {
    setAmbient((prev) => ({ ...prev, ...partial }));
  };

  const handleUpdateSystem = (partial: Partial<OrionSystemState>) => {
    setSystemState((prev) => ({ ...prev, ...partial }));
  };

  return (
    <div className="relative w-full min-h-screen flex ambient-atmosphere overflow-hidden">
      {/* Left Vertical Navigation Sidebar */}
      <NavigationSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Wrapper */}
      <div className="relative flex-1 flex flex-col justify-between min-h-screen px-4 sm:px-8 lg:px-12 py-7 z-20 overflow-y-auto">
        {/* Top Header */}
        <Header
          osVersion={systemState.version}
          onOpenSettings={() => setActiveTab('settings')}
        />

        {/* Screen Routing */}
        {activeTab === 'home' && (
          <>
            {/* Central Sculptural Core */}
            <SculpturalCore isPlaying={isPlaying} />

            {/* Bottom Interaction Layer */}
            <div
              className="w-full flex flex-col gap-6 pt-2"
              data-purpose="bottom-interaction-layer"
            >
              {/* Center-floating Conversational Pill */}
              <ConversationalInput
                currentMode={currentMode}
                onChangeMode={setCurrentMode}
                onNavigate={(tab) => setActiveTab(tab)}
                onTogglePlay={togglePlay}
              />

              {/* Lower Peripheral Info Modules */}
              <BottomDeck
                currentTrack={tracks[currentTrackIndex]}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onNextTrack={handleNextTrack}
                alarms={alarms}
                devices={devices}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            </div>
          </>
        )}

        {activeTab === 'music' && (
          <div className="flex-1 flex flex-col justify-between py-2">
            <MusicScreen
              tracks={tracks}
              currentTrackIndex={currentTrackIndex}
              isPlaying={isPlaying}
              onSelectTrack={handleSelectTrack}
              onTogglePlay={togglePlay}
              onNextTrack={handleNextTrack}
              onPrevTrack={handlePrevTrack}
            />
            <div className="pt-4">
              <BottomDeck
                currentTrack={tracks[currentTrackIndex]}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onNextTrack={handleNextTrack}
                alarms={alarms}
                devices={devices}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            </div>
          </div>
        )}

        {activeTab === 'alarms' && (
          <div className="flex-1 flex flex-col justify-between py-2">
            <AlarmsScreen
              alarms={alarms}
              onToggleAlarm={handleToggleAlarm}
              onAddAlarm={handleAddAlarm}
              onDeleteAlarm={handleDeleteAlarm}
            />
            <div className="pt-4">
              <BottomDeck
                currentTrack={tracks[currentTrackIndex]}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onNextTrack={handleNextTrack}
                alarms={alarms}
                devices={devices}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="flex-1 flex flex-col justify-between py-2">
            <DevicesScreen
              devices={devices}
              ambient={ambient}
              onUpdateAmbient={handleUpdateAmbient}
              onToggleDevice={handleToggleDevice}
            />
            <div className="pt-4">
              <BottomDeck
                currentTrack={tracks[currentTrackIndex]}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onNextTrack={handleNextTrack}
                alarms={alarms}
                devices={devices}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="flex-1 flex flex-col justify-between py-2">
            <SettingsScreen
              systemState={systemState}
              onUpdateSystem={handleUpdateSystem}
            />
            <div className="pt-4">
              <BottomDeck
                currentTrack={tracks[currentTrackIndex]}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onNextTrack={handleNextTrack}
                alarms={alarms}
                devices={devices}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
