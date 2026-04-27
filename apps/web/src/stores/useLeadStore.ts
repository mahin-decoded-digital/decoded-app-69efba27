import { create } from 'zustand';
import { apiUrl } from '@/lib/api';
import type { Lead } from '@/types';

interface LeadInput {
  name: string;
  email: string;
  company: string;
  message: string;
  gdprConsent: boolean;
  source: 'contact-form' | 'demo-request';
}

interface LeadApiRecord {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  company: string;
  message: string;
  gdprConsent: boolean;
  source: 'contact-form' | 'demo-request';
}

interface ActionResult {
  ok: boolean;
  error?: string;
}

interface LeadState {
  leads: Lead[];
  lastSubmittedLead: Lead | null;
  isSubmitting: boolean;
  submitError: string;
  loading: boolean;
  loaded: boolean;
  loadLeads: () => Promise<void>;
  submitLead: (input: LeadInput) => Promise<ActionResult>;
  clearLastSubmitted: () => void;
}

function toLead(record: LeadApiRecord): Lead {
  return {
    ...record,
    createdAt: new Date(record.createdAt),
  };
}

export const useLeadStore = create<LeadState>()((set, get) => ({
  leads: [],
  lastSubmittedLead: null,
  isSubmitting: false,
  submitError: '',
  loading: false,
  loaded: false,
  loadLeads: async () => {
    if (get().loading || get().loaded) return;
    set({ loading: true, submitError: '' });
    try {
      const res = await fetch(apiUrl('/api/leads'));
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const records = (await res.json()) as LeadApiRecord[];
      set({
        leads: records.map(toLead),
        loading: false,
        loaded: true,
        submitError: '',
      });
    } catch (err) {
      set({
        loading: false,
        submitError: err instanceof Error ? err.message : 'Failed to load leads',
      });
    }
  },
  submitLead: async (input) => {
    if (
      !input.name.trim() ||
      !input.email.trim() ||
      !input.company.trim() ||
      !input.gdprConsent
    ) {
      const error = 'Please complete all required fields and accept the privacy policy.';
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
      const res = await fetch(apiUrl('/api/leads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: input.name.trim(),
          email: input.email.trim(),
          company: input.company.trim(),
          message: input.message.trim(),
          gdprConsent: input.gdprConsent,
          source: input.source,
        }),
      });

      const data = (await res.json()) as LeadApiRecord | { error?: string };
      if (!res.ok) {
        const error = 'error' in data && typeof data.error === 'string' ? data.error : `HTTP ${res.status}`;
        throw new Error(error);
      }

      const created = toLead(data as LeadApiRecord);
      set((state) => ({
        leads: [...state.leads, created],
        lastSubmittedLead: created,
        isSubmitting: false,
        submitError: '',
        loaded: true,
      }));
      return { ok: true };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to submit lead';
      set({ isSubmitting: false, submitError: error });
      return { ok: false, error };
    }
  },
  clearLastSubmitted: () => set({ lastSubmittedLead: null, submitError: '' }),
}));