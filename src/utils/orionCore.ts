import { AlarmItem, OrionMode } from '../types/orion';

const WEEKDAYS_PT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const MONTHS_PT = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
];

/**
 * Formats a Date instance into standard Orion Brazilian Portuguese time & date headers.
 * Example: time: "23:42", date: "TER, 24 OUT"
 */
export function formatTimeAndDate(date: Date): {
  timeStr: string;
  dateStr: string;
  hour: number;
  minute: number;
} {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

  const dayOfWeek = WEEKDAYS_PT[date.getDay()];
  const dayOfMonth = date.getDate().toString().padStart(2, '0');
  const month = MONTHS_PT[date.getMonth()];
  const dateStr = `${dayOfWeek}, ${dayOfMonth} ${month}`;

  return { timeStr, dateStr, hour, minute };
}

/**
 * Returns the contextual Portuguese greeting for the current time.
 */
export function getGreeting(date: Date): { heading: string; subheading: string } {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return {
      heading: 'Bom dia.',
      subheading: 'Ambiente pronto para o seu ciclo de foco.',
    };
  } else if (hour >= 12 && hour < 18) {
    return {
      heading: 'Boa tarde.',
      subheading: 'Mantendo sincronização com seu ritmo circadiano.',
    };
  } else if (hour >= 18 && hour < 24) {
    return {
      heading: 'Boa noite.',
      subheading: 'Estou aqui quando precisar.',
    };
  } else {
    return {
      heading: 'Boa madrugada.',
      subheading: 'Atmosfera em repouso profundo.',
    };
  }
}

/**
 * Finds the next closest active alarm formatted for the peripheral module.
 */
export function calculateNextAlarm(
  alarms: AlarmItem[],
  currentDate: Date = new Date()
): { formattedTime: string; label: string; activeAlarm: AlarmItem | null } {
  const activeAlarms = alarms.filter((a) => a.active);
  if (activeAlarms.length === 0) {
    return {
      formattedTime: '--:--',
      label: 'Nenhum alarme ativo',
      activeAlarm: null,
    };
  }

  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

  // Map alarms to minutes from midnight
  const sorted = [...activeAlarms].sort((a, b) => {
    const [hA, mA] = a.time.split(':').map(Number);
    const [hB, mB] = b.time.split(':').map(Number);
    const minA = hA * 60 + mA;
    const minB = hB * 60 + mB;

    // Relative difference
    const diffA = minA > currentMinutes ? minA - currentMinutes : minA + 24 * 60 - currentMinutes;
    const diffB = minB > currentMinutes ? minB - currentMinutes : minB + 24 * 60 - currentMinutes;
    return diffA - diffB;
  });

  const next = sorted[0];
  const [nextHour, nextMin] = next.time.split(':').map(Number);
  const nextAlarmMinutes = nextHour * 60 + nextMin;

  const isToday = nextAlarmMinutes > currentMinutes;
  const dayLabel = isToday ? 'HOJE' : 'AMANHÃ';

  return {
    formattedTime: `${next.time} ${dayLabel}`,
    label: next.gentleWake ? '• Despertar suave' : `• ${next.label}`,
    activeAlarm: next,
  };
}

/**
 * Formats milliseconds of network or neural latency.
 */
export function formatDeviceLatency(ms: number): string {
  if (ms <= 0) return '<1ms';
  return `${Math.round(ms)}ms`;
}

/**
 * Pure command dispatcher / natural responder for Orion Conversational Intelligence.
 */
export interface CommandResult {
  reply: string;
  action?: 'TOGGLE_PLAY' | 'NAVIGATE' | 'CHANGE_MODE' | 'SET_ALARM' | 'ADJUST_LIGHT';
  targetTab?: 'home' | 'music' | 'alarms' | 'devices' | 'settings';
  suggestions: string[];
}

export function processOrionCommand(
  input: string,
  mode: OrionMode = 'AUTO'
): CommandResult {
  const query = input.trim().toLowerCase();

  if (!query) {
    return {
      reply: 'Por favor, digite ou dite um comando para o Orion.',
      suggestions: ['Tocar música relaxante', 'Status do sistema', 'Ver alarmes'],
    };
  }

  // Music intents
  if (
    query.includes('tocar') ||
    query.includes('reproduzir') ||
    query.includes('reprodução') ||
    query.includes('play') ||
    query.includes('música') ||
    query.includes('som') ||
    query.includes('áudio') ||
    query.includes('audio') ||
    query.includes('pausar') ||
    query.includes('pause') ||
    query.includes('faixa')
  ) {
    if (query.includes('pausar') || query.includes('parar') || query.includes('stop') || query.includes('desligar')) {
      return {
        reply: 'Áudio espacial pausado. O ambiente está em silêncio harmônico.',
        action: 'TOGGLE_PLAY',
        suggestions: ['Continuar reprodução', 'Explorar biblioteca sonora', 'Definir timer de sono'],
      };
    }
    return {
      reply: 'Iniciando soundscape espacial "Echoes of Andromeda". Calibrando frequências binaurais para relaxamento neurológico.',
      action: 'TOGGLE_PLAY',
      targetTab: 'music',
      suggestions: ['Pausar áudio', 'Ver faixa completa', 'Ativar modo foco'],
    };
  }

  // Alarm intents
  if (query.includes('alarme') || query.includes('despert') || query.includes('acordar')) {
    return {
      reply: 'Alarme configurado para as 06:45 com Despertar Suave (iluminação progressiva de 15 min e estímulo auditivo gradual).',
      action: 'NAVIGATE',
      targetTab: 'alarms',
      suggestions: ['Ver rotina matinal', 'Ajustar para 07:00', 'Desativar alarme'],
    };
  }

  // Device & Lights intents
  if (
    query.includes('luz') ||
    query.includes('ilumina') ||
    query.includes('dispositivo') ||
    query.includes('clock') ||
    query.includes('temperatura')
  ) {
    return {
      reply: 'Iluminação circadiana ajustada para 2700K (âmbar quente, 35% intensidade). Orion Clock sincronizado a 2ms.',
      action: 'NAVIGATE',
      targetTab: 'devices',
      suggestions: ['Diminuir brilho', 'Ligar ruído rosa', 'Ver dispositivos conectados'],
    };
  }

  // System & status intents
  if (
    query.includes('status') ||
    query.includes('sistema') ||
    query.includes('versão') ||
    query.includes('diagnost')
  ) {
    return {
      reply: 'ORION OS V4.2 operacional. Latência neural média de 2ms. Quatro nós sensoriais sincronizados. Nenhum distúrbio detectado.',
      suggestions: ['Abrir configurações', 'Verificar telemetria', 'Ajustar modo de IA'],
    };
  }

  // Mode responses
  if (mode === 'CONCISO') {
    return {
      reply: `Comando compreendido. Sistema ajustado para atender sua preferência.`,
      suggestions: ['Status geral', 'Próxima faixa', 'Ciclo de sono'],
    };
  }

  if (mode === 'CRIATIVO') {
    return {
      reply: `Sintonizando as variáveis do ambiente sensorial. O silêncio estelar se harmoniza com suas intenções. Como posso enriquecer sua noite?`,
      suggestions: ['Tocar Lux Nova', 'Ajustar luz para 2200K', 'Iniciar meditação'],
    };
  }

  // Default intelligent assistant response
  return {
    reply: `Compreendido. Processei sua solicitação no núcleo neural do ORION. Todos os módulos sensoriais continuam em sincronia ativa.`,
    suggestions: ['Tocar Echoes of Andromeda', 'Ver alarmes', 'Status dos dispositivos'],
  };
}
