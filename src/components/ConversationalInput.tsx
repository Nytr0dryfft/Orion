import React, { useState } from 'react';
import { OrionMode, NavTab } from '../types/orion';
import { processOrionCommand, CommandResult } from '../utils/orionCore';

interface ConversationalInputProps {
  currentMode: OrionMode;
  onChangeMode: (mode: OrionMode) => void;
  onNavigate: (tab: NavTab) => void;
  onTogglePlay: () => void;
}

export const ConversationalInput: React.FC<ConversationalInputProps> = ({
  currentMode,
  onChangeMode,
  onNavigate,
  onTogglePlay,
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [lastResponse, setLastResponse] = useState<CommandResult | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const cycleMode = () => {
    const modes: OrionMode[] = ['AUTO', 'CONCISO', 'CRIATIVO', 'SISTEMA'];
    const nextIdx = (modes.indexOf(currentMode) + 1) % modes.length;
    onChangeMode(modes[nextIdx]);
  };

  const handleMicClick = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate speech detection
      const samplePrompts = [
        'Tocar som ambiente e verificar iluminação',
        'Qual o status do Orion Clock e ciclo de sono?',
        'Definir alarme para amanhã cedo',
      ];
      const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
      setTimeout(() => {
        setQuery(randomPrompt);
        setIsListening(false);
      }, 1400);
    } else {
      setIsListening(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const result = processOrionCommand(query, currentMode);
    setLastResponse(result);

    // Execute instant system triggers if matched
    if (result.action === 'TOGGLE_PLAY') {
      onTogglePlay();
    }
    if (result.targetTab) {
      // Optional subtle delay so user can read the response before navigating
      // if they prefer, or click a suggestion
    }

    setQuery('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    const result = processOrionCommand(suggestion, currentMode);
    setLastResponse(result);
    if (result.action === 'TOGGLE_PLAY') {
      onTogglePlay();
    }
    if (result.targetTab) {
      onNavigate(result.targetTab);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Orion Conversational Response Overlay */}
      {lastResponse && (
        <div className="w-full max-w-2xl px-5 py-3.5 rounded-2xl bg-[#161C25]/90 subtle-border backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex flex-col gap-2.5 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8795A6]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2F6FA]" />
              <span className="uppercase tracking-widest text-[#C7D0D9]">ORION INTELLIGENCE</span>
            </div>
            <button
              type="button"
              onClick={() => setLastResponse(null)}
              className="text-[#687481] hover:text-[#F2F6FA] text-xs px-1.5 py-0.5 rounded transition-colors"
              aria-label="Fechar resposta"
            >
              ✕
            </button>
          </div>

          <p className="text-sm font-sans text-[#F2F6FA] leading-relaxed">
            {lastResponse.reply}
          </p>

          {/* Action Chips */}
          {lastResponse.suggestions && lastResponse.suggestions.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {lastResponse.suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestionClick(sug)}
                  className="text-[11px] font-sans px-2.5 py-1 rounded-full bg-white/[0.04] subtle-border hover:bg-white/[0.08] hover:text-[#F2F6FA] text-[#C7D0D9] transition-all"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Center Pill */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex justify-center items-center"
      >
        <div
          className={`w-full max-w-2xl backdrop-blur-2xl bg-[#161C25]/70 subtle-border transition-all duration-300 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.6)] px-3 py-2 flex items-center gap-3 ${
            isFocused ? 'border-white/30 bg-[#161C25]/90' : 'hover:border-white/20'
          }`}
        >
          {/* Voice Input Trigger */}
          <button
            type="button"
            onClick={handleMicClick}
            aria-label="Ativar microfone"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
              isListening
                ? 'text-white bg-white/20 animate-pulse'
                : 'text-[#C7D0D9] hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isListening ? 'Ouvindo comando de voz...' : 'Converse com Orion ou faça uma solicitação...'}
            aria-label="Entrada de comando ou conversa"
            className="w-full bg-transparent border-0 focus:ring-0 text-sm text-[#F2F6FA] placeholder-[#687481] tracking-wide py-1 px-1 font-sans focus:outline-none"
          />

          {/* Operational Mode Badge */}
          <button
            type="button"
            onClick={cycleMode}
            title="Clique para alternar o modo de resposta"
            className="hidden sm:inline-flex items-center text-[10px] font-mono tracking-widest text-[#687481] hover:text-[#C7D0D9] px-2 py-0.5 rounded border border-white/5 hover:border-white/20 bg-white/[0.02] cursor-pointer transition-colors"
          >
            {currentMode}
          </button>

          {/* Submit Action Button */}
          <button
            type="submit"
            aria-label="Enviar comando"
            className="w-9 h-9 rounded-full bg-[#F2F6FA] text-[#05070A] hover:bg-white flex items-center justify-center transition-all duration-200 flex-shrink-0 shadow-[0_0_12px_rgba(242,246,250,0.3)] active:scale-95"
          >
            <svg
              className="w-4 h-4 transform -rotate-45"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="12" x2="12" y1="19" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
