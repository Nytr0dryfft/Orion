import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatTimeAndDate,
  getGreeting,
  calculateNextAlarm,
  formatDeviceLatency,
  processOrionCommand,
} from './orionCore';
import { AlarmItem } from '../types/orion';

test('formatTimeAndDate formats hours, minutes, day and month correctly', () => {
  // Test specific date: Tuesday Oct 24 2026 23:42
  const date = new Date(2026, 9, 24, 23, 42); // Oct is month index 9
  const res = formatTimeAndDate(date);

  assert.equal(res.timeStr, '23:42');
  assert.equal(res.hour, 23);
  assert.equal(res.minute, 42);
  assert.match(res.dateStr, /24 OUT/);
});

test('getGreeting provides contextual greetings based on time of day', () => {
  const morning = new Date(2026, 9, 24, 8, 30);
  assert.equal(getGreeting(morning).heading, 'Bom dia.');

  const afternoon = new Date(2026, 9, 24, 14, 15);
  assert.equal(getGreeting(afternoon).heading, 'Boa tarde.');

  const evening = new Date(2026, 9, 24, 20, 0);
  assert.equal(getGreeting(evening).heading, 'Boa noite.');

  const night = new Date(2026, 9, 24, 2, 10);
  assert.equal(getGreeting(night).heading, 'Boa madrugada.');
});

test('calculateNextAlarm finds the closest active alarm correctly', () => {
  const sampleAlarms: AlarmItem[] = [
    {
      id: 'alarm-1',
      time: '06:45',
      label: 'Despertar suave',
      days: ['SEG', 'TER', 'QUA', 'QUI', 'SEX'],
      active: true,
      gentleWake: true,
      soundscape: 'Aurora',
      fadeMinutes: 15,
    },
    {
      id: 'alarm-2',
      time: '14:30',
      label: 'Foco da Tarde',
      days: ['SEG', 'TER'],
      active: false, // inactive
      gentleWake: false,
      soundscape: 'Sino Zen',
      fadeMinutes: 5,
    },
  ];

  // At 23:42, next 06:45 alarm is AMANHÃ
  const nightTime = new Date(2026, 9, 24, 23, 42);
  const resultNight = calculateNextAlarm(sampleAlarms, nightTime);
  assert.equal(resultNight.formattedTime, '06:45 AMANHÃ');
  assert.equal(resultNight.label, '• Despertar suave');
  assert.equal(resultNight.activeAlarm?.id, 'alarm-1');

  // At 05:00, next 06:45 alarm is HOJE
  const morningTime = new Date(2026, 9, 24, 5, 0);
  const resultMorning = calculateNextAlarm(sampleAlarms, morningTime);
  assert.equal(resultMorning.formattedTime, '06:45 HOJE');
});

test('formatDeviceLatency formats ping values cleanly', () => {
  assert.equal(formatDeviceLatency(2.1), '2ms');
  assert.equal(formatDeviceLatency(0), '<1ms');
  assert.equal(formatDeviceLatency(15.8), '16ms');
});

test('processOrionCommand handles music, alarm, and device intents', () => {
  const musicCmd = processOrionCommand('orion, tocar uma música ambiente');
  assert.equal(musicCmd.action, 'TOGGLE_PLAY');
  assert.match(musicCmd.reply, /Echoes of Andromeda/);

  const pauseCmd = processOrionCommand('pausar a reprodução de áudio');
  assert.equal(pauseCmd.action, 'TOGGLE_PLAY');

  const alarmCmd = processOrionCommand('configurar alarme para amanha');
  assert.equal(alarmCmd.action, 'NAVIGATE');
  assert.equal(alarmCmd.targetTab, 'alarms');

  const deviceCmd = processOrionCommand('ajustar iluminação e verificar orion clock');
  assert.equal(deviceCmd.action, 'NAVIGATE');
  assert.equal(deviceCmd.targetTab, 'devices');

  const emptyCmd = processOrionCommand('');
  assert.match(emptyCmd.reply, /digite ou dite/);
});
