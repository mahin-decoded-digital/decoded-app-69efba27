import { create } from 'zustand';

interface UIState {
  demoModalOpen: boolean;
  contactModalOpen: boolean;
  activeSection: string;
  openDemoModal: () => void;
  closeDemoModal: () => void;
  openContactModal: () => void;
  closeContactModal: () => void;
  setActiveSection: (section: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  demoModalOpen: false,
  contactModalOpen: false,
  activeSection: '',
  openDemoModal: () => set({ demoModalOpen: true }),
  closeDemoModal: () => set({ demoModalOpen: false }),
  openContactModal: () => set({ contactModalOpen: true }),
  closeContactModal: () => set({ contactModalOpen: false }),
  setActiveSection: (section) => set({ activeSection: section }),
}));
