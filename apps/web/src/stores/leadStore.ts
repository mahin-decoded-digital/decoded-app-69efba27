import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lead } from '@/types';

interface LeadState {
  leads: Lead[];
  lastSubmittedLead: Lead | null;
  isSubmitting: boolean;
  submitError: string;
  submitLead: (input: Omit<Lead, 'id' | 'createdAt'>) => { ok: boolean; error?: string };
  clearLastSubmitted: () => void;
}

export const useLeadStore = create<LeadState>()(
  persist(
    (set, get) => ({
      leads: [],
      lastSubmittedLead: null,
      isSubmitting: false,
      submitError: '',
      submitLead: (input) => {
        if (
          !input.name.trim() ||
          !input.email.trim() ||
          !input.company.trim() ||
          !input.gdprConsent
        ) {
          return { ok: false, error: 'Please complete all required fields and accept the privacy policy.' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.email.trim())) {
          return { ok: false, error: 'Please enter a valid email address.' };
        }
        const lead: Lead = {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          ...input,
        };
        set((s) => ({ leads: [...s.leads, lead], lastSubmittedLead: lead }));
        return { ok: true };
      },
      clearLastSubmitted: () => set({ lastSubmittedLead: null }),
    }),
    { name: 'lead-storage' }
  )
);
