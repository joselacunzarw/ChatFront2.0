import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DevState {
  isVisible: boolean;
  useMock: boolean;
  showPanel: boolean;
  toggleVisibility: () => void;
  toggleMock: () => void;
  togglePanel: () => void;
}

export const useDevStore = create<DevState>()(
  persist(
    (set) => ({
      isVisible: true,
      useMock: false, // Cambiado a false para usar la API real por defecto
      showPanel: true,
      toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
      toggleMock: () => set((state) => ({ useMock: !state.useMock })),
      togglePanel: () => set((state) => ({ showPanel: !state.showPanel })),
    }),
    {
      name: 'dev-storage',
    }
  )
);