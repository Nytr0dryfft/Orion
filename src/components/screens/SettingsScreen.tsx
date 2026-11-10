import React, { useState } from 'react';
import { OrionSystemState } from '../../types/orion';

interface SettingsScreenProps {
  systemState: OrionSystemState;
  onUpdateSystem: (partial: Partial<OrionSystemState>) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  systemState,
  onUpdateSystem,
}) => {
  const [notification, setNotification] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full py-4 px-2 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-light font-sora text-[#F2F6FA] tracking-wide">
            Configurações & Diagnóstico do Sistema
          </h2>
          <p className="text-xs text-[#8795A6] tracking-wider font-sans mt-0.5">
            Parametrização neural, personalidade vocal e telemetria do ORION OS
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] subtle-border text-xs font-mono text-[#C7D0D9]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F2F6FA]" />
          <span>BUILD 4.2.0-QUANTUM • SEED STABLE</span>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-sans text-emerald-200 animate-fadeIn">
          {notification}
        </div>
      )}

      {/* Personality & Voice Matrix */}
      <div className="p-6 rounded-3xl bg-[#161C25]/40 subtle-border backdrop-blur-xl flex flex-col gap-4">
        <h3 className="text-xs font-mono text-[#F2F6FA] uppercase tracking-wider">
          PERSONALIDADE DA INTELIGÊNCIA ARTIFICIAL
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'minimal', title: 'Minimalista', desc: 'Respostas concisas, foco em silêncio e harmonia.' },
            { id: 'warm', title: 'Acolhedora', desc: 'Tom afetuoso e antecipação das necessidades do lar.' },
            { id: 'synth', title: 'Sintetizada', desc: 'Precisão orbital, cadência estelar futurista.' },
            { id: 'analytical', title: 'Analítica', desc: 'Métricas aprofundadas e dados biométricos detalhados.' },
          ].map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => {
                onUpdateSystem({ personality: persona.id as OrionSystemState['personality'] });
                showNotice(`Personalidade atualizada para "${persona.title}".`);
              }}
              className={`p-4 rounded-2xl text-left subtle-border transition-all flex flex-col justify-between gap-2 ${
                systemState.personality === persona.id
                  ? 'bg-white/10 border-white/30 shadow-md'
                  : 'bg-white/[0.02] hover:bg-white/[0.05]'
              }`}
            >
              <div>
                <span className="text-xs font-sora font-medium text-[#F2F6FA] block">
                  {persona.title}
                </span>
                <p className="text-[11px] text-[#8795A6] font-sans mt-1 leading-relaxed">
                  {persona.desc}
                </p>
              </div>
              <span className="text-[9px] font-mono text-[#687481] uppercase">
                {systemState.personality === persona.id ? '● ATIVA' : 'SELECIONAR'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Language & Neural Latency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language selector */}
        <div className="p-6 rounded-3xl bg-[#161C25]/40 subtle-border backdrop-blur-xl flex flex-col gap-3">
          <h3 className="text-xs font-mono text-[#F2F6FA] uppercase tracking-wider">
            IDIOMA DO AMBIENTE
          </h3>
          <p className="text-xs text-[#8795A6] font-sans">
            Sintaxe e síntese vocal para interação e respostas proativas.
          </p>
          <div className="flex gap-2 pt-2">
            {[
              { code: 'pt-BR', label: 'Português (BR)' },
              { code: 'en', label: 'English (US)' },
              { code: 'es', label: 'Español' },
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onUpdateSystem({ language: lang.code as OrionSystemState['language'] });
                  showNotice(`Idioma alterado para ${lang.label}.`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  systemState.language === lang.code
                    ? 'bg-white/15 text-[#F2F6FA] subtle-border'
                    : 'bg-white/[0.02] text-[#687481] hover:text-[#C7D0D9]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostics & Memory */}
        <div className="p-6 rounded-3xl bg-[#161C25]/40 subtle-border backdrop-blur-xl flex flex-col justify-between gap-3">
          <div>
            <h3 className="text-xs font-mono text-[#F2F6FA] uppercase tracking-wider">
              MEMÓRIA CONTEXTUAL & CALIBRAÇÃO
            </h3>
            <p className="text-xs text-[#8795A6] font-sans mt-1">
              Preferências acústicas, padrões de despertar e rotinas registradas localmente.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => showNotice('Memória contextual resetada com sucesso.')}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] subtle-border hover:bg-white/[0.08] text-xs font-mono text-[#C7D0D9] hover:text-white transition-all"
            >
              LIMPAR CACHE
            </button>
            <button
              type="button"
              onClick={() => showNotice('Sensores ópticos e acústicos calibrados a 0dB.')}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] subtle-border hover:bg-white/[0.08] text-xs font-mono text-[#C7D0D9] hover:text-white transition-all"
            >
              RECALIBRAR SENSORES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
