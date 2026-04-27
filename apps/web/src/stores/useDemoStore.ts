import { create } from 'zustand';
import { apiUrl } from '@/lib/api';
import type { DemoBooking } from '@/types';

interface DemoInput {
  name: string;
  email: string;
  company: string;
  preferredDate: string;
  preferredTime: DemoBooking['preferredTime'];
  timezone: string;
}

interface DemoApiRecord {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  company: string;
  preferredDate: string;
  preferredTime: DemoBooking['preferredTime'];
  timezone: string;
  status: DemoBooking['status'];
}

interface ActionResult {
  ok: boolean;
  error?: string;
}

interface DemoState {
  bookings: DemoBooking[];
  lastBooking: DemoBooking | null;
  isSubmitting: boolean;
  submitError: string;
  loading: boolean;
  loaded: boolean;
  loadBookings: () => Promise<void>;
  bookDemo: (input: DemoInput) => Promise<ActionResult>;
  clearLastBooking: () => void;
}

function toBooking(record: DemoApiRecord): DemoBooking {
  return {
    ...record,
    createdAt: new Date(record.createdAt),
  };
}

export const useDemoStore = create<DemoState>()((set, get) => ({
  bookings: [],
  lastBooking: null,
  isSubmitting: false,
  submitError: '',
  loading: false,
  loaded: false,
  loadBookings: async () => {
    if (get().loading || get().loaded) return;
    set({ loading: true, submitError: '' });
    try {
      const res = await fetch(apiUrl('/api/demo-bookings'));
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const records = (await res.json()) as DemoApiRecord[];
      set({
        bookings: records.map(toBooking),
        loading: false,
        loaded: true,
        submitError: '',
      });
    } catch (err) {
      set({
        loading: false,
        submitError: err instanceof Error ? err.message : 'Failed to load bookings',
      });
    }
  },
  bookDemo: async (input) => {
    if (
      !input.name.trim() ||
      !input.email.trim() ||
      !input.company.trim() ||
      !input.preferredDate.trim() ||
      !input.preferredTime
    ) {
      const error = 'Please fill in all scheduling fields.';
      set({ submitError: error });
      return { ok: false, error };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email.trim())) {
      const error = 'Please enter a valid email address.';
      set({ submitError: error });
      return { ok: false, error };
    }

    set({ isSubmitting: true, submitError: '' });
    try {
      const res = await fetch(apiUrl('/api/demo-bookings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: input.name.trim(),
          email: input.email.trim(),
          company: input.company.trim(),
          preferredDate: input.preferredDate.trim(),
          preferredTime: input.preferredTime,
          timezone: input.timezone.trim() || 'UTC',
        }),
      });

      const data = (await res.json()) as DemoApiRecord | { error?: string };
      if (!res.ok) {
        const error = 'error' in data && typeof data.error === 'string' ? data.error : `HTTP ${res.status}`;
        throw new Error(error);
      }

      const created = toBooking(data as DemoApiRecord);
      set((state) => ({
        bookings: [...state.bookings, created],
        lastBooking: created,
        isSubmitting: false,
        submitError: '',
        loaded: true,
      }));
      return { ok: true };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to book demo';
      set({ isSubmitting: false, submitError: error });
      return { ok: false, error };
    }
  },
  clearLastBooking: () => set({ lastBooking: null, submitError: '' }),
}));