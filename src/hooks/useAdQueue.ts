import { useState, useEffect, useCallback } from 'react';
import { SponsoredAd, DEFAULT_AD } from '../components/modals/AdOrderModal';
import { toPersianDigits } from '../utils/formatters';

const STORAGE_ACTIVE_AD = 'payvand_active_ad';
const STORAGE_AD_QUEUE = 'payvand_ad_queue';
const AD_UPDATE_EVENT = 'payvand_ad_queue_updated';

function getStoredActiveAd(): SponsoredAd {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_AD);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.expiresAt && parsed.expiresAt > Date.now()) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading active ad from localStorage', e);
  }
  
  // Default fallback with 1 hour expiry
  const now = Date.now();
  const def: SponsoredAd = {
    ...DEFAULT_AD,
    createdAt: now,
    expiresAt: now + 3600 * 1000,
    status: 'active',
  };
  localStorage.setItem(STORAGE_ACTIVE_AD, JSON.stringify(def));
  return def;
}

function getStoredQueue(): SponsoredAd[] {
  try {
    const raw = localStorage.getItem(STORAGE_AD_QUEUE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading ad queue from localStorage', e);
  }
  return [];
}

export interface EnqueueResult {
  ad: SponsoredAd;
  isQueued: boolean;
  queuePosition: number;
  estimatedStartTime: number;
}

export function useAdQueue() {
  const [activeAd, setActiveAd] = useState<SponsoredAd>(getStoredActiveAd);
  const [adQueue, setAdQueue] = useState<SponsoredAd[]>(getStoredQueue);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // Sync state from storage
  const syncFromStorage = useCallback(() => {
    const active = getStoredActiveAd();
    const queue = getStoredQueue();
    setActiveAd(active);
    setAdQueue(queue);
  }, []);

  // Listen for storage events across tabs or components
  useEffect(() => {
    const handleCustomEvent = () => syncFromStorage();
    window.addEventListener(AD_UPDATE_EVENT, handleCustomEvent);
    window.addEventListener('storage', handleCustomEvent);
    return () => {
      window.removeEventListener(AD_UPDATE_EVENT, handleCustomEvent);
      window.removeEventListener('storage', handleCustomEvent);
    };
  }, [syncFromStorage]);

  // Main countdown and queue processor loop (every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const currentActive = getStoredActiveAd();
      const currentQueue = getStoredQueue();

      // Check if current active ad has expired
      if (currentActive.expiresAt && now >= currentActive.expiresAt) {
        if (currentQueue.length > 0) {
          // Promote next queued ad to active!
          const [nextAd, ...remainingQueue] = currentQueue;
          const durationMs = (nextAd.durationHours || 1) * 3600 * 1000;
          const promotedAd: SponsoredAd = {
            ...nextAd,
            status: 'active',
            createdAt: now,
            expiresAt: now + durationMs,
          };

          localStorage.setItem(STORAGE_ACTIVE_AD, JSON.stringify(promotedAd));
          localStorage.setItem(STORAGE_AD_QUEUE, JSON.stringify(remainingQueue));

          setActiveAd(promotedAd);
          setAdQueue(remainingQueue);
          window.dispatchEvent(new Event(AD_UPDATE_EVENT));
          return;
        } else {
          // Fallback to default sponsor ad renewed for 1 hour
          const renewedDefault: SponsoredAd = {
            ...DEFAULT_AD,
            createdAt: now,
            expiresAt: now + 3600 * 1000,
            status: 'active',
          };
          localStorage.setItem(STORAGE_ACTIVE_AD, JSON.stringify(renewedDefault));
          setActiveAd(renewedDefault);
          setRemainingSeconds(3600);
          return;
        }
      }

      // Calculate remaining seconds
      if (currentActive.expiresAt) {
        const diff = Math.max(0, Math.floor((currentActive.expiresAt - now) / 1000));
        setRemainingSeconds(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Add new ad: either start immediately if no active ad, or enqueue if an ad is currently playing
  const enqueueAd = useCallback((adData: Omit<SponsoredAd, 'id' | 'createdAt' | 'expiresAt' | 'status'>): EnqueueResult => {
    const now = Date.now();
    const currentActive = getStoredActiveAd();
    const currentQueue = getStoredQueue();

    const durationMs = (adData.durationHours || 1) * 3600 * 1000;

    // Check if an actual user ad is currently running (not expired)
    const isCurrentlyActiveUserAd = currentActive.expiresAt && currentActive.expiresAt > now;

    if (isCurrentlyActiveUserAd) {
      // Calculate estimated start time based on end of active ad + all prior queued ads
      let estimatedStart = currentActive.expiresAt || now;
      for (const item of currentQueue) {
        estimatedStart += (item.durationHours || 1) * 3600 * 1000;
      }

      const newQueuedAd: SponsoredAd = {
        ...adData,
        id: `ad-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: now,
        status: 'queued',
      };

      const updatedQueue = [...currentQueue, newQueuedAd];
      localStorage.setItem(STORAGE_AD_QUEUE, JSON.stringify(updatedQueue));
      setAdQueue(updatedQueue);
      window.dispatchEvent(new Event(AD_UPDATE_EVENT));

      return {
        ad: newQueuedAd,
        isQueued: true,
        queuePosition: updatedQueue.length,
        estimatedStartTime: estimatedStart,
      };
    } else {
      // Start immediately
      const newActiveAd: SponsoredAd = {
        ...adData,
        id: `ad-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: now,
        expiresAt: now + durationMs,
        status: 'active',
      };

      localStorage.setItem(STORAGE_ACTIVE_AD, JSON.stringify(newActiveAd));
      setActiveAd(newActiveAd);
      setRemainingSeconds(Math.floor(durationMs / 1000));
      window.dispatchEvent(new Event(AD_UPDATE_EVENT));

      return {
        ad: newActiveAd,
        isQueued: false,
        queuePosition: 0,
        estimatedStartTime: now,
      };
    }
  }, []);

  // Format remaining time nicely in Persian
  const formatRemainingTime = useCallback((totalSecs: number): string => {
    if (totalSecs <= 0) return 'به اتمام رسیده';
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    if (hours > 0) {
      return `${toPersianDigits(hours)} ساعت و ${toPersianDigits(minutes)} دقیقه`;
    }
    if (minutes > 0) {
      return `${toPersianDigits(minutes)} دقیقه و ${toPersianDigits(seconds)} ثانیه`;
    }
    return `${toPersianDigits(seconds)} ثانیه`;
  }, []);

  return {
    activeAd,
    adQueue,
    queueCount: adQueue.length,
    remainingSeconds,
    formattedRemainingTime: formatRemainingTime(remainingSeconds),
    enqueueAd,
  };
}
