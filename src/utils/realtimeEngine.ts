import { LiveActivityEvent, LiveTickerItem } from '../types';

export const initialTickerItems: LiveTickerItem[] = [];

export const initialLiveEvents: LiveActivityEvent[] = [];

const mockEventPool: Omit<LiveActivityEvent, 'id' | 'timestamp'>[] = [];

// Audio chime using Web Audio API (gentle high-frequency bell)
export function playSubtleChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch {
    // AudioContext blocked or not allowed - ignore silently
  }
}

// Helper to generate a new live event (safe for empty pool)
export function generateNextLiveEvent(): LiveActivityEvent | null {
  if (!mockEventPool || mockEventPool.length === 0) return null;
  const template = mockEventPool[Math.floor(Math.random() * mockEventPool.length)];
  return {
    ...template,
    id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: 'لحظاتی پیش',
  };
}

// Helper to jitter ticker prices slightly for live reality feel
export function updateTickerItems(prevItems: LiveTickerItem[]): LiveTickerItem[] {
  if (!prevItems || prevItems.length === 0) return [];
  return prevItems.map((item) => {
    if (Math.random() > 0.4) {
      const deltaPercent = (Math.random() * 0.6 - 0.3);
      const newPrice = Math.round(item.price * (1 + deltaPercent / 100));
      const roundedDelta = Number((item.changePercent + deltaPercent * 0.5).toFixed(1));
      return {
        ...item,
        price: newPrice,
        changePercent: Math.max(-5, Math.min(5, roundedDelta)),
      };
    }
    return item;
  });
}
