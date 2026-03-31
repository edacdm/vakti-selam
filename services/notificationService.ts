import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { en } from '../i18n/locales/en';
import { id } from '../i18n/locales/id';
import { tr } from '../i18n/locales/tr';
import type { Language } from '../i18n';

const translations: Record<string, Record<string, string>> = { tr, en, id };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('prayer-times', {
      name: 'Prayer Times',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#D4AF37',
      sound: 'default',
    });
    await Notifications.setNotificationChannelAsync('daily-hadith', {
      name: 'Daily Hadith',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

async function getLanguage(): Promise<Language> {
  try {
    const lang = await AsyncStorage.getItem('@vakti_selam_language');
    if (lang === 'tr' || lang === 'en' || lang === 'id') return lang;
  } catch {}
  return 'tr';
}

function t(lang: Language, key: string): string {
  return translations[lang]?.[key] || translations['tr']?.[key] || key;
}

interface PrayerTimesInput {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

const PRAYER_KEYS: { apiKey: keyof PrayerTimesInput; nameKey: string }[] = [
  { apiKey: 'Fajr', nameKey: 'fajr' },
  { apiKey: 'Sunrise', nameKey: 'sunrise' },
  { apiKey: 'Dhuhr', nameKey: 'dhuhr' },
  { apiKey: 'Asr', nameKey: 'asr' },
  { apiKey: 'Maghrib', nameKey: 'maghrib' },
  { apiKey: 'Isha', nameKey: 'isha' },
];

export async function schedulePrayerNotifications(prayerTimes: PrayerTimesInput): Promise<void> {
  const lang = await getLanguage();

  // Cancel existing prayer notifications
  const existing = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of existing) {
    if (notif.content.data?.type === 'prayer') {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }

  const now = new Date();

  for (const prayer of PRAYER_KEYS) {
    const timeStr = prayerTimes[prayer.apiKey];
    if (!timeStr) continue;

    const [hours, minutes] = timeStr.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);

    // 5 minutes before
    const notifDate = new Date(prayerDate.getTime() - 5 * 60 * 1000);

    // Only schedule future notifications
    if (notifDate.getTime() > now.getTime()) {
      const prayerName = t(lang, prayer.nameKey);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🕌 ${t(lang, 'prayerNotifTitle')}`,
          body: `${prayerName} ${t(lang, 'prayerNotifBody')}`,
          sound: 'default',
          data: { type: 'prayer', prayer: prayer.apiKey },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notifDate,
        },
      });
    }
  }
}

const HADITH_KEYS = ['hadith1', 'hadith2', 'hadith3', 'hadith4', 'hadith5', 'hadith6', 'hadith7'];

export async function scheduleDailyHadith(): Promise<void> {
  const lang = await getLanguage();

  // Cancel existing hadith notifications
  const existing = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of existing) {
    if (notif.content.data?.type === 'hadith') {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }

  // Schedule for tomorrow 08:00
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);

  const randomHadith = HADITH_KEYS[Math.floor(Math.random() * HADITH_KEYS.length)];
  const hadithText = t(lang, randomHadith);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `📖 ${t(lang, 'hadithNotifTitle')}`,
      body: hadithText,
      sound: 'default',
      data: { type: 'hadith' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: tomorrow,
    },
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function cancelPrayerNotifications(): Promise<void> {
  const existing = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of existing) {
    if (notif.content.data?.type === 'prayer') {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

export async function cancelHadithNotifications(): Promise<void> {
  const existing = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of existing) {
    if (notif.content.data?.type === 'hadith') {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}
