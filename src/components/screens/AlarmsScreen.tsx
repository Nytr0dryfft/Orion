import React, { useState, useEffect } from 'react';
import { AlarmItem } from '../../types/orion';
import { audioSynth } from '../../utils/audioSynth';

interface AlarmsScreenProps {
  alarms: AlarmItem[];
  onToggleAlarm: (id: string) => void;
  onAddAlarm: (alarm: Omit<AlarmItem, 'id'>) => void;
  onDeleteAlarm: (id: string) => void;
}

export const AlarmsScreen: React.FC<AlarmsScreenProps> = ({
  alarms,
  onToggleAlarm,
  onAddAlarm,
  onDeleteAlarm,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTime, setNewTime] = useState('07:00');
  const [newLabel, setNewLabel] = useState('Despertar Criativo');
  const [newGentle, setNewGentle] = useState(true);
  const [newSound, setNewSound] = useState('Aurora Boreal');
  const [previewingWake, setPreviewingWake] = useState(false);

  // Stop gentle wake audio preview when leaving the screen or unmounting
  useEffect(() => {
    return () => {
      audioSynth.stopGentleAlarm();
    };
  }, []);

  const handleCreateAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAlarm({
      time: newTime,
      label: newLabel,
      days: ['SEG', 'TER', 'QUA', 'QUI', 'SEX'],
      active: true,
      gentleWake: newGentle,
      soundscape: newSound,
      fadeMinutes: 15,
    });
    setShowAddModal(false);
  };

  const startWakePreview = () => {
    setPreviewingWake(true);
    audioSynth.startGentleAlarm();
  };

  const stopWakePreview = () => {
    audioSynth.stopGentleAlarm();
    setPreviewingWake(false);
  };

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full py-4 px-2 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-light font-sora text-[#F2F6FA] tracking-wide">
            Despertador & Sincronia Circadiana
          </h2>
          <p className="text-xs text-[#8795A6] tracking-wider font-sans mt-0.5">
            Estímulos sensoriais progressivos alinhados aos ciclos naturais de melatonina
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!previewingWake ? (
            <button
              type="button"
              onClick={startWakePreview}
              aria-label="Testar despertar suave"
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-xs font-mono text-[#C7D0D9] hover:text-[#F2F6FA] subtle-border transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              TESTAR DESPERTAR SUAVE
            </button>
          ) : (
            <button
              type="button"
              onClick={stopWakePreview}
              aria-label="Parar teste de despertar"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs font-mono text-amber-200 border border-amber-500/40 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              PARAR TESTE
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-1.5 rounded-xl bg-[#F2F6FA] text-[#05070A] hover:bg-white text-xs font-mono font-medium shadow-[0_0_12px_rgba(242,246,250,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span> NOVO ALARME
          </button>
        </div>
      </div>

      {/* Teste de Despertar em Andamento Banner */}
      {previewingWake && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-xl animate-fadeIn"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            </span>
            <div>
              <p className="text-xs font-mono font-medium text-amber-200 uppercase tracking-wider">
                Teste de despertar em andamento
              </p>
              <p className="text-[11px] font-sans text-amber-200/70 mt-0.5">
                Simulação ativa: soundscape suave em reprodução com transição harmônica progressiva.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={stopWakePreview}
            aria-label="Parar teste de despertar"
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs font-mono text-amber-200 border border-amber-500/30 transition-all self-start sm:self-auto cursor-pointer"
          >
            PARAR TESTE
          </button>
        </div>
      )}

      {/* Circadian Rhythm Monitor Card */}
      <div className="p-6 rounded-3xl bg-[#161C25]/40 subtle-border backdrop-blur-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-xs font-mono tracking-wider text-[#F2F6FA] uppercase">
              RITMO CIRCADIANO ATUAL: FASE NOTURNA (94% EFICIÊNCIA)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#687481]">
            ORION BIOMETRIC SYNC
          </span>
        </div>

        {/* Phase timeline visual */}
        <div className="w-full flex flex-col gap-2">
          <div className="w-full h-3 rounded-full bg-white/[0.04] p-0.5 flex overflow-hidden">
            <div className="h-full bg-indigo-500/40 rounded-l-full w-[25%]" title="Transição para o sono" />
            <div className="h-full bg-blue-600/50 w-[35%]" title="Sono Profundo (Restaurador)" />
            <div className="h-full bg-purple-500/40 w-[25%]" title="Sono REM (Cognitivo)" />
            <div className="h-full bg-amber-400/50 rounded-r-full w-[15%]" title="Janela de despertar suave" />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#687481]">
            <span>22:30 PREPARAÇÃO</span>
            <span>01:30 SONO PROFUNDO</span>
            <span>04:45 REM ATIVO</span>
            <span className="text-[#F2F6FA]">06:45 DESPERTAR ÓTIMO</span>
          </div>
        </div>
      </div>

      {/* Alarms List */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono text-[#8795A6] tracking-wider uppercase">
          Alarmes Programados
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`p-5 rounded-2xl subtle-border transition-all flex flex-col justify-between gap-4 ${
                alarm.active
                  ? 'bg-[#161C25]/70 border-white/15 shadow-sm'
                  : 'bg-[#161C25]/25 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-light font-sora text-[#F2F6FA] tracking-tight">
                      {alarm.time}
                    </span>
                    <span className="text-[10px] font-mono text-[#8795A6] uppercase tracking-wider">
                      {alarm.gentleWake ? 'Despertar Suave' : 'Normal'}
                    </span>
                  </div>
                  <h5 className="text-xs font-sans text-[#C7D0D9] mt-0.5 font-medium">
                    {alarm.label}
                  </h5>
                  <p className="text-[11px] text-[#687481] font-sans mt-0.5">
                    Som: {alarm.soundscape} • Gradual {alarm.fadeMinutes} min
                  </p>
                </div>

                {/* Switch toggle */}
                <button
                  type="button"
                  onClick={() => onToggleAlarm(alarm.id)}
                  aria-label={alarm.active ? 'Desativar alarme' : 'Ativar alarme'}
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                    alarm.active ? 'bg-[#F2F6FA]' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full transition-transform ${
                      alarm.active
                        ? 'translate-x-6 bg-[#05070A]'
                        : 'translate-x-0 bg-[#687481]'
                    }`}
                  />
                </button>
              </div>

              {/* Days & Delete */}
              <div className="flex items-center justify-between border-t border-white/[0.04] pt-3 text-[10px] font-mono">
                <div className="flex gap-1">
                  {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map((day) => (
                    <span
                      key={day}
                      className={`px-1.5 py-0.5 rounded ${
                        alarm.days.includes(day)
                          ? 'bg-white/10 text-[#F2F6FA]'
                          : 'text-[#687481]/50'
                      }`}
                    >
                      {day[0]}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteAlarm(alarm.id)}
                  aria-label={`Excluir alarme ${alarm.label}`}
                  className="text-[#687481] hover:text-rose-400 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Alarm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#161C25] subtle-border shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-sora text-[#F2F6FA]">Novo Alarme Sensorial</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#687481] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAlarm} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-mono text-[#8795A6] block mb-1">
                  HORÁRIO DO ALARME
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] subtle-border rounded-xl px-3 py-2 text-xl font-sora text-[#F2F6FA] focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#8795A6] block mb-1">
                  RÓTULO / INTENÇÃO
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Ex: Despertar Matinal"
                  required
                  className="w-full bg-white/[0.04] subtle-border rounded-xl px-3 py-2 text-sm text-[#F2F6FA] focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#8795A6] block mb-1">
                  SOUNDSCAPE
                </label>
                <select
                  value={newSound}
                  onChange={(e) => setNewSound(e.target.value)}
                  className="w-full bg-[#161C25] subtle-border rounded-xl px-3 py-2 text-sm text-[#F2F6FA] focus:outline-none"
                >
                  <option value="Aurora Boreal">Aurora Boreal (Sinos Cósmicos)</option>
                  <option value="Nebula Reverie">Nebula Reverie (Pads Suaves)</option>
                  <option value="Campânulas Zen">Campânulas Zen (Acústico)</option>
                  <option value="Frequência Solar 528Hz">Frequência Solar 528Hz (Harmônica)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] subtle-border">
                <span className="text-xs text-[#C7D0D9]">Despertar Suave (Iluminação gradual 15m)</span>
                <input
                  type="checkbox"
                  checked={newGentle}
                  onChange={(e) => setNewGentle(e.target.checked)}
                  className="rounded bg-white/10 text-white focus:ring-0"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-mono text-[#8795A6] hover:text-white"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F2F6FA] text-[#05070A] hover:bg-white text-xs font-mono font-medium"
                >
                  SALVAR ALARME
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
