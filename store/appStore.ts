import { create } from 'zustand';

interface AppState {
  location: { latitude: number; longitude: number } | null;
  setLocation: (lat: number, lng: number) => void;
  // İleride eklenebilecek ayarlar
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  location: null,
  setLocation: (lat, lng) => set({ location: { latitude: lat, longitude: lng } }),
  
  notificationsEnabled: true,
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
}));
