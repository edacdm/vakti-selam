import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface AppState {
  location: { latitude: number; longitude: number } | null;
  setLocation: (lat: number, lng: number) => void;
  prayerNotificationsEnabled: boolean;
  setPrayerNotificationsEnabled: (enabled: boolean) => void;
  hadithNotificationsEnabled: boolean;
  setHadithNotificationsEnabled: (enabled: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  loadSettings: () => Promise<void>;
}

const PRAYER_NOTIF_KEY = '@vakti_selam_prayer_notif';
const HADITH_NOTIF_KEY = '@vakti_selam_hadith_notif';
const USER_NAME_KEY = '@vakti_selam_user_name';

export const useAppStore = create<AppState>((set) => ({
  location: null,
  setLocation: (lat, lng) => set({ location: { latitude: lat, longitude: lng } }),
  
  prayerNotificationsEnabled: true,
  setPrayerNotificationsEnabled: (enabled) => {
    set({ prayerNotificationsEnabled: enabled });
    AsyncStorage.setItem(PRAYER_NOTIF_KEY, JSON.stringify(enabled)).catch(() => {});
  },

  hadithNotificationsEnabled: true,
  setHadithNotificationsEnabled: (enabled) => {
    set({ hadithNotificationsEnabled: enabled });
    AsyncStorage.setItem(HADITH_NOTIF_KEY, JSON.stringify(enabled)).catch(() => {});
  },

  userName: '',
  setUserName: (name) => {
    set({ userName: name });
    AsyncStorage.setItem(USER_NAME_KEY, name).catch(() => {});
  },

  loadSettings: async () => {
    try {
      const prayer = await AsyncStorage.getItem(PRAYER_NOTIF_KEY);
      const hadith = await AsyncStorage.getItem(HADITH_NOTIF_KEY);
      const name = await AsyncStorage.getItem(USER_NAME_KEY);
      set({
        prayerNotificationsEnabled: prayer !== null ? JSON.parse(prayer) : true,
        hadithNotificationsEnabled: hadith !== null ? JSON.parse(hadith) : true,
        userName: name || '',
      });
    } catch {}
  },
}));
