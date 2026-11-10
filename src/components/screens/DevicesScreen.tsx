import React from 'react';
import { DeviceItem, AmbientState } from '../../types/orion';
import { formatDeviceLatency } from '../../utils/orionCore';

interface DevicesScreenProps {
  devices: DeviceItem[];
  ambient: AmbientState;
  onUpdateAmbient: (partial: Partial<AmbientState>) => void;
  onToggleDevice: (id: string) => void;
}

export const DevicesScreen: React.FC<DevicesScreenProps> = ({
  devices,
  ambient,
  onUpdateAmbient,
  onToggleDevice,
}) => {
  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full py-4 px-2 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-light font-sora text-[#F2F6FA] tracking-wide">
            Dispositivos & Ambiente Sensorial
          </h2>
          <p className="text-xs text-[#8795A6] tracking-wider font-sans mt-0.5">
            Calibração de iluminação circadiana, ruído mascarador e telemetria dos nós
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>4 NÓS CONECTADOS • LATÊNCIA 2.1ms</span>
        </div>
      </div>

      {/* Atmospheric Sensory Ambiance Controller */}
      <div className="p-6 rounded-3xl bg-[#161C25]/40 subtle-border backdrop-blur-xl flex flex-col gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F2F6FA]" />
            <h3 className="text-xs font-mono text-[#F2F6FA] uppercase tracking-wider">
              CONTROLE DE AMBIÊNCIA SENSORIAL
            </h3>
          </div>
          <label className="flex items-center gap-2 text-xs font-sans text-[#C7D0D9] cursor-pointer">
            <span>Sincronia Circadiana Automática</span>
            <input
              type="checkbox"
              checked={ambient.circadianSync}
              onChange={(e) => onUpdateAmbient({ circadianSync: e.target.checked })}
              className="rounded bg-white/10 text-white focus:ring-0"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Temperature Kelvin */}
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] subtle-border">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#8795A6]">TEMPERATURA DA LUZ</span>
              <span className="text-[#F2F6FA]">{ambient.colorTempK}K</span>
            </div>
            <input
              type="range"
              min="2000"
              max="6500"
              step="100"
              value={ambient.colorTempK}
              onChange={(e) => onUpdateAmbient({ colorTempK: Number(e.target.value) })}
              className="w-full accent-amber-300 bg-white/10 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#687481]">
              <span>2000K (Âmbar)</span>
              <span>4500K (Neutro)</span>
              <span>6500K (Solar)</span>
            </div>
          </div>

          {/* Brightness */}
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] subtle-border">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#8795A6]">INTENSIDADE LUMINOSA</span>
              <span className="text-[#F2F6FA]">{ambient.brightnessPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ambient.brightnessPct}
              onChange={(e) => onUpdateAmbient({ brightnessPct: Number(e.target.value) })}
              className="w-full accent-[#F2F6FA] bg-white/10 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#687481]">
              <span>Repouso (0%)</span>
              <span>Leitura (50%)</span>
              <span>Plena (100%)</span>
            </div>
          </div>

          {/* Sound Masking */}
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] subtle-border">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#8795A6]">MASCARAMENTO SONORO</span>
              <span className="text-[#F2F6FA] uppercase">{ambient.soundMaskingType}</span>
            </div>
            <select
              value={ambient.soundMaskingType}
              onChange={(e) =>
                onUpdateAmbient({
                  soundMaskingType: e.target.value as AmbientState['soundMaskingType'],
                })
              }
              className="bg-[#161C25] subtle-border rounded-xl px-3 py-1.5 text-xs text-[#F2F6FA] focus:outline-none"
            >
              <option value="none">Desligado</option>
              <option value="pink_noise">Ruído Rosa (Harmônico)</option>
              <option value="cosmic_hum">Zumbido Cósmico Sub-grave</option>
              <option value="rain_drift">Chuva Suave em Vidro</option>
            </select>
            <span className="text-[10px] text-[#687481]">Isolamento acústico contra ruídos externos</span>
          </div>
        </div>
      </div>

      {/* Connected Devices Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono text-[#8795A6] tracking-wider uppercase">
          Nós do Ecossistema Orion
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`p-5 rounded-2xl subtle-border transition-all flex flex-col justify-between gap-4 ${
                device.connected
                  ? 'bg-[#161C25]/60 hover:bg-[#161C25]/80'
                  : 'bg-[#161C25]/20 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        device.connected ? 'bg-emerald-400' : 'bg-red-400'
                      }`}
                    />
                    <h5 className="text-sm font-sans font-medium text-[#F2F6FA]">
                      {device.name}
                    </h5>
                  </div>
                  <span className="text-[11px] text-[#687481] font-mono mt-0.5 block">
                    {device.room} • Latência: {formatDeviceLatency(device.latencyMs)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleDevice(device.id)}
                  aria-label={`Alternar conexão de ${device.name}`}
                  className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/[0.04] subtle-border hover:bg-white/10 text-[#C7D0D9] transition-colors"
                >
                  {device.connected ? 'CONECTADO' : 'DESCONECTADO'}
                </button>
              </div>

              {/* Sensor readings */}
              <div className="grid grid-cols-3 gap-2 border-t border-white/[0.05] pt-3 text-[11px] font-mono text-[#8795A6]">
                {device.tempCelsius !== undefined && (
                  <div>
                    <span className="text-[9px] text-[#687481] block">TEMPERATURA</span>
                    <span className="text-[#F2F6FA]">{device.tempCelsius}°C</span>
                  </div>
                )}
                {device.humidityPct !== undefined && (
                  <div>
                    <span className="text-[9px] text-[#687481] block">UMIDADE</span>
                    <span className="text-[#F2F6FA]">{device.humidityPct}%</span>
                  </div>
                )}
                {device.batteryPct !== undefined && (
                  <div>
                    <span className="text-[9px] text-[#687481] block">BATERIA</span>
                    <span className="text-[#F2F6FA]">{device.batteryPct}%</span>
                  </div>
                )}
                {device.lightBrightness !== undefined && (
                  <div>
                    <span className="text-[9px] text-[#687481] block">BRILHO AMBIENTE</span>
                    <span className="text-[#F2F6FA]">{device.lightBrightness}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
