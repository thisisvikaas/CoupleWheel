import { create } from 'zustand';
import { AuthState } from '@/types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  partner: null,
  loading: true,
  setUser: (user) => set({ user }),
  setPartner: (partner) => set({ partner }),
  setLoading: (loading) => set({ loading }),
}));

