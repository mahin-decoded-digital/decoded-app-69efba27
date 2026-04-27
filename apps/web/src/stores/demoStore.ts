import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DemoBooking } from '@/types';

interface DemoState {
  bookings: DemoBooking[];
  lastBooking: DemoBooking | null;
  isSubmitting: boolean;
  submitError: string;
  bookDemo: (input: Omit<DemoBooking, 'id' | 'createdAt' | 'status'>) => { ok: boolean; error?: string };
  clearLastBooking: () => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      bookings: [],
      lastBooking: null,
      isSubmitting: false,
      submitError: '',
      bookDemo: (input) => {
        if (
          !input.name.trim() ||
          !input.email.trim() ||
          !input.company.trim() ||
          !input.preferredDate.trim() ||
          !input.preferredTime
        ) {
          return { ok: false, error: 'Please fill in all scheduling fields.' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.email.trim())) {
          return { ok: false, error: 'Please enter a valid email address.' };
        }
        const booking: DemoBooking = {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          status: 'confirmed',
          ...input,
        };
        set((s) => ({ bookings: [...s.bookings, booking], lastBooking: booking }));
        return { ok: true };
      },
      clearLastBooking: () => set({ lastBooking: null }),
    }),
    { name: 'demo-storage' }
  )
);
