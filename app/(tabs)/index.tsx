import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import type { TranslationKeys } from "../../i18n";
import { useTranslation } from "../../i18n";
import {
  requestNotificationPermissions,
  scheduleDailyHadith,
  schedulePrayerNotifications,
} from "../../services/notificationService";
import { useAppStore } from "../../store/appStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CIRCLE_SIZE = 200;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
const SUN_SIZE = 28;
const SUN_ORBIT = CIRCLE_RADIUS - SUN_SIZE / 2 - 1;

interface PrayerTimes {
  Fajr: string; Sunrise: string; Dhuhr: string;
  Asr: string; Maghrib: string; Isha: string;
  [key: string]: string;
}

const HADITH_KEYS: TranslationKeys[] = [
  "hadith1", "hadith2", "hadith3", "hadith4",
  "hadith5", "hadith6", "hadith7",
];

const PRAYER_NAMES: { nameKey: TranslationKeys; apiKey: keyof PrayerTimes; iconKey: string }[] = [
  { nameKey: "fajr", apiKey: "Fajr", iconKey: "weather-sunset-up" },
  { nameKey: "sunrise", apiKey: "Sunrise", iconKey: "white-balance-sunny" },
  { nameKey: "dhuhr", apiKey: "Dhuhr", iconKey: "weather-sunny" },
  { nameKey: "asr", apiKey: "Asr", iconKey: "weather-sunset-down" },
  { nameKey: "maghrib", apiKey: "Maghrib", iconKey: "weather-sunset" },
  { nameKey: "isha", apiKey: "Isha", iconKey: "moon-waning-crescent" },
];

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { prayerNotificationsEnabled, hadithNotificationsEnabled, loadNotificationSettings } = useAppStore();

  const [loading, setLoading] = useState<boolean>(true);
  const [hadisKey, setHadisKey] = useState<TranslationKeys>("hadith1");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayerKey, setNextPrayerKey] = useState<TranslationKeys | "">("");
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [hijriDate, setHijriDate] = useState<string>("");
  const [gregorianDate, setGregorianDate] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const getGreeting = (): TranslationKeys => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "greetingMorning";
    if (h >= 12 && h < 18) return "greetingDay";
    if (h >= 18 && h < 22) return "greetingEvening";
    return "greetingNight";
  };

  useEffect(() => {
    setHadisKey(HADITH_KEYS[Math.floor(Math.random() * HADITH_KEYS.length)]);
    loadNotificationSettings();
    getLocationAndTimes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => { if (prayerTimes) calculateNextPrayer(prayerTimes); }, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);


  useEffect(() => {
    if (prayerTimes) {
      (async () => {
        const granted = await requestNotificationPermissions();
        if (granted) {
          if (prayerNotificationsEnabled) {
            await schedulePrayerNotifications(prayerTimes);
          }
          if (hadithNotificationsEnabled) {
            await scheduleDailyHadith();
          }
        }
      })();
    }
  }, [prayerTimes, prayerNotificationsEnabled, hadithNotificationsEnabled]);

  const getLocationAndTimes = async (): Promise<void> => {
    try {
      const cached = await AsyncStorage.getItem("prayerTimesCache");
      if (cached) {
        const p = JSON.parse(cached);
        setPrayerTimes(p);
        calculateNextPrayer(p);
      }
      const cd = await AsyncStorage.getItem("hijriDateCache");
      if (cd) {
        const d = JSON.parse(cd);
        setHijriDate(d.hijri);
        setGregorianDate(d.gregorian);
      }
    } catch { }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") { setLoading(false); return; }
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${loc.coords.latitude}&longitude=${loc.coords.longitude}&method=13`);
      const data = await res.json();
      const times = data.data.timings;
      setPrayerTimes(times);
      calculateNextPrayer(times);
      try {
        const hij = data.data.date.hijri;
        const greg = data.data.date.gregorian;
        const hs = `${hij.day} ${hij.month.en} ${hij.year}`;
        const gs = `${greg.day} ${greg.month.en}`;
        setHijriDate(hs);
        setGregorianDate(gs);
        await AsyncStorage.setItem("hijriDateCache", JSON.stringify({ hijri: hs, gregorian: gs }));
        await AsyncStorage.setItem("prayerTimesCache", JSON.stringify(times));
      } catch { }
    } catch { } finally { setLoading(false); }
  };

  const updateCountdown = (nameKey: TranslationKeys, diff: number) => {
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    setNextPrayerKey(nameKey);
    setRemainingTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
  };

  const calculateNextPrayer = (timings: PrayerTimes) => {
    const now = new Date();
    const prayers = PRAYER_NAMES.map(p => {
      const [h, m] = timings[p.apiKey].split(":");
      const d = new Date();
      d.setHours(+h, +m, 0, 0);
      return { ...p, d };
    });

    let ni = -1, nextMs = 0, prevMs = 0;
    for (let i = 0; i < prayers.length; i++) {
      if (prayers[i].d > now) { ni = i; nextMs = prayers[i].d.getTime(); updateCountdown(prayers[i].nameKey, nextMs - now.getTime()); break; }
    }
    if (ni === -1) {
      const tf = new Date(prayers[0].d);
      tf.setDate(tf.getDate() + 1);
      nextMs = tf.getTime();
      updateCountdown(prayers[0].nameKey, nextMs - now.getTime());
      prevMs = prayers[5].d.getTime();
    }
    else if (ni === 0) {
      const yi = new Date(prayers[5].d);
      yi.setDate(yi.getDate() - 1);
      prevMs = yi.getTime();
    }
    else { prevMs = prayers[ni - 1].d.getTime(); }

    if (nextMs > prevMs) {
      let pct = (nextMs - prevMs) > 0 ? ((now.getTime() - prevMs) / (nextMs - prevMs)) * 100 : 0;
      setProgressPercent(Math.min(100, Math.max(0, isNaN(pct) ? 0 : pct)));
    }
  };

  const isNight = nextPrayerKey === "isha" || nextPrayerKey === "fajr";
  const orbitIcon = isNight ? "moon-waning-crescent" : "white-balance-sunny";
  const orbitBg = isNight ? "#3B5A7A" : "#D4AF37";
  const orbitGlow = isNight ? "rgba(150, 190, 230, 0.22)" : "rgba(212, 175, 55, 0.22)";
  const orbitIconColor = isNight ? "#E2E8F0" : "#0B101E";

  const sunAngle = Math.PI - (progressPercent / 100) * Math.PI;
  const sunCX = CIRCLE_RADIUS + SUN_ORBIT * Math.cos(sunAngle);
  const sunCY = CIRCLE_RADIUS - SUN_ORBIT * Math.sin(sunAngle);
  const sunLeft = sunCX - SUN_SIZE / 2;
  const sunTop = sunCY - SUN_SIZE / 2;

  const renderPrayerRow = (prayer: typeof PRAYER_NAMES[0], time: string, isNext: boolean) => (
    <View style={[styles.prayerRow, isNext && styles.prayerRowActive]} key={prayer.nameKey}>
      <View style={styles.prayerLeft}>
        <View style={[styles.prayerIconBox, isNext && styles.prayerIconBoxActive]}>
          <MaterialCommunityIcons name={prayer.iconKey as any} size={17} color={isNext ? "#0B101E" : "#64748B"} />
        </View>
        <Text style={[styles.prayerName, isNext && styles.prayerNameActive]}>{t(prayer.nameKey)}</Text>
        {isNext && <View style={styles.nextBadge}><Text style={styles.nextBadgeText}>{t("nextBadge")}</Text></View>}
      </View>
      <Text style={[styles.prayerTime, isNext && styles.prayerTimeActive]}>{time}</Text>
    </View>
  );

  return (
    <LinearGradient colors={["#080D1A", "#0E1C33"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <View>
              <Text style={styles.greetingSmall}>{t(getGreeting())} 👋</Text>
              <Text style={styles.appName}>{t("appName")}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push("/Ayarlar")}>
                <Ionicons name="settings-outline" size={22} color="#D4AF37" />
              </TouchableOpacity>
            </View>
          </View>

          <LinearGradient
            colors={["rgba(139, 97, 27, 0.18)", "rgba(11, 16, 30, 0.1)"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.hadisBanner}
          >
            <Text style={styles.hadisQuoteMark}>"</Text>
            <View style={styles.hadisBody}>
              <Text style={styles.hadisText}>{t(hadisKey)}</Text>
              <Text style={styles.hadisLabel}>{t("dailyHadithLabel")}</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["rgba(212, 175, 55, 0.14)", "rgba(8, 13, 26, 0.9)"]}
            style={styles.compassCard}
          >
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            <View style={styles.ringWrap}>
              <View style={styles.ringGlow} />
              <View style={styles.ringHorizon} />
              <View style={styles.ring}>
                <Text style={styles.ringInnerLabel}>{t("nextPrayerLabel")}</Text>
                <Text style={styles.ringInnerPrayer}>{nextPrayerKey ? t(nextPrayerKey as TranslationKeys) : "—"}</Text>
                <Text style={styles.ringInnerCountdown}>{remainingTime || "--:--:--"}</Text>
              </View>
              <View style={[styles.sunGlow, { left: sunLeft - 8, top: sunTop - 8, backgroundColor: orbitGlow }]} />
              <View style={[styles.sun, { left: sunLeft, top: sunTop, backgroundColor: orbitBg, shadowColor: isNight ? "#C0D8F0" : "#FFD700" }]}>
                <MaterialCommunityIcons name={orbitIcon as any} size={15} color={orbitIconColor} />
              </View>
            </View>

            <View style={styles.compassFooter}>
              <View style={styles.compassFooterItem}>
                <MaterialCommunityIcons name="weather-sunset-up" size={13} color="#475569" />
                <Text style={styles.compassFooterTxt}>{t("fajr")}</Text>
              </View>
              <View style={[styles.compassPctPill, isNight && styles.compassPctPillNight]}>
                <Text style={[styles.compassPct, isNight && styles.compassPctNight]}>{Math.floor(progressPercent)}%</Text>
              </View>
              <View style={[styles.compassFooterItem, { alignItems: "flex-end" }]}>
                <MaterialCommunityIcons name={isNight ? "moon-waning-crescent" : "weather-sunset"} size={13} color="#475569" />
                <Text style={styles.compassFooterTxt}>{t("isha")}</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="mosque" size={20} color="#D4AF37" />
              <Text style={styles.cardTitle}>{t("prayerTimesTitle")}</Text>
            </View>
            {loading ? <ActivityIndicator color="#D4AF37" /> : (
              prayerTimes && (
                <View>
                  {PRAYER_NAMES.map(p => renderPrayerRow(p, prayerTimes[p.apiKey], nextPrayerKey === p.nameKey))}
                </View>
              )
            )}
          </View>

          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickBtn} onPress={() => router.push("/(tabs)/Zikirmatik")}>
              <LinearGradient colors={["#D4AF37", "#B8860B"]} style={styles.quickBtnGrad}>
                <MaterialCommunityIcons name="counter" size={22} color="#0B101E" />
                <Text style={styles.quickBtnText}>{t("zikirmatikBtn")}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} onPress={() => router.push("/YakindakiCamiler")}>
              <View style={styles.quickBtnOutline}>
                <MaterialCommunityIcons name="map-marker-radius-outline" size={22} color="#D4AF37" />
                <Text style={styles.quickBtnOutlineText}>{t("mosquesBtn")}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: 25, paddingHorizontal: 20, paddingBottom: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 30 },
  headerRight: { flexDirection: "row", alignItems: "center" },
  settingsBtn: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: "rgba(212,175,55,0.08)",
    borderWidth: 1.5, borderColor: "rgba(212,175,55,0.25)",
    justifyContent: "center", alignItems: "center",
  },
  greetingSmall: { color: "#94A3B8", fontSize: 14, fontWeight: "500", marginBottom: 6, letterSpacing: 0.5 },
  appName: { color: "#E2E8F0", fontSize: 32, fontWeight: "900", letterSpacing: -0.5 },
  hadisBanner: { flexDirection: "row", borderRadius: 20, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: "rgba(212,175,55,0.2)", gap: 8 },
  hadisQuoteMark: { fontSize: 48, fontWeight: "900", opacity: 0.6 },
  hadisBody: { flex: 1 },
  hadisText: { color: "#E2E8F0", fontSize: 13, fontStyle: "italic" },
  hadisLabel: { color: "#64748B", fontSize: 10, marginTop: 6 },
  compassCard: { width: "100%", borderRadius: 28, paddingVertical: 22, paddingHorizontal: 24, marginBottom: 14, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.3)", alignItems: "center" },
  corner: { position: "absolute", width: 14, height: 14 },
  cornerTL: { top: 14, left: 14, borderTopWidth: 1.5, borderLeftWidth: 1.5, borderColor: "rgba(212,175,55,0.5)" },
  cornerTR: { top: 14, right: 14, borderTopWidth: 1.5, borderRightWidth: 1.5, borderColor: "rgba(212,175,55,0.5)" },
  cornerBL: { bottom: 14, left: 14, borderBottomWidth: 1.5, borderLeftWidth: 1.5, borderColor: "rgba(212,175,55,0.5)" },
  cornerBR: { bottom: 14, right: 14, borderBottomWidth: 1.5, borderRightWidth: 1.5, borderColor: "rgba(212,175,55,0.5)" },
  ringWrap: { position: "relative", width: CIRCLE_SIZE, height: CIRCLE_SIZE, marginBottom: 14 },
  ringGlow: { position: "absolute", top: -8, left: -8, width: CIRCLE_SIZE + 16, height: CIRCLE_SIZE + 16, borderRadius: (CIRCLE_SIZE + 16) / 2, backgroundColor: "rgba(212,175,55,0.06)" },
  ringHorizon: { position: "absolute", left: 0, right: 0, top: CIRCLE_RADIUS - 0.5, height: 1, backgroundColor: "rgba(212,175,55,0.1)" },
  ring: { width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_RADIUS, borderWidth: 1.5, borderColor: "rgba(212,175,55,0.3)", backgroundColor: "rgba(8,13,26,0.6)", justifyContent: "center", alignItems: "center" },
  ringInnerLabel: { color: "#D4AF37", fontSize: 8, fontWeight: "800", letterSpacing: 2.5, marginBottom: 5 },
  ringInnerPrayer: { color: "#94A3B8", fontSize: 13, fontWeight: "300", letterSpacing: 2, marginBottom: 8 },
  ringInnerCountdown: { color: "#FFFFFF", fontSize: 22, fontWeight: "300", letterSpacing: 3 },
  sunGlow: { position: "absolute", width: SUN_SIZE + 16, height: SUN_SIZE + 16, borderRadius: (SUN_SIZE + 16) / 2 },
  sun: { position: "absolute", width: SUN_SIZE, height: SUN_SIZE, borderRadius: SUN_SIZE / 2, justifyContent: "center", alignItems: "center", elevation: 10 },
  compassFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" },
  compassFooterItem: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1 },
  compassFooterTxt: { color: "#475569", fontSize: 11 },
  compassPctPill: { backgroundColor: "rgba(212,175,55,0.15)", borderWidth: 1, borderColor: "rgba(212,175,55,0.3)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  compassPct: { color: "#D4AF37", fontSize: 12, fontWeight: "700" },
  compassPctPillNight: { backgroundColor: "rgba(150, 190, 230, 0.15)", borderColor: "rgba(150, 190, 230, 0.35)" },
  compassPctNight: { color: "#C0D8F0" },
  card: { width: "100%", backgroundColor: "rgba(255,255,255,0.03)", padding: 20, borderRadius: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)", marginBottom: 14 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  prayerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.04)" },
  prayerRowActive: { backgroundColor: "rgba(212,175,55,0.1)", borderRadius: 13, paddingHorizontal: 10, marginVertical: 2, borderWidth: 1, borderColor: "rgba(212,175,55,0.3)" },
  prayerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  prayerIconBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.05)", justifyContent: "center", alignItems: "center" },
  prayerIconBoxActive: { backgroundColor: "#D4AF37" },
  prayerName: { color: "#CBD5E1", fontSize: 15 },
  prayerNameActive: { color: "#D4AF37", fontWeight: "700" },
  prayerTime: { color: "#64748B", fontSize: 16, fontWeight: "600" },
  prayerTimeActive: { color: "#FFFFFF", fontWeight: "800", fontSize: 17 },
  nextBadge: { backgroundColor: "rgba(212,175,55,0.2)", paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  nextBadgeText: { color: "#D4AF37", fontSize: 9, fontWeight: "800" },
  quickRow: { flexDirection: "row", gap: 12, marginBottom: 14, width: "100%" },
  quickBtn: { flex: 1, borderRadius: 18, overflow: "hidden" },
  quickBtnGrad: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14 },
  quickBtnText: { color: "#0B101E", fontWeight: "700", fontSize: 14 },
  quickBtnOutline: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 18, borderWidth: 1.5, borderColor: "#D4AF37", backgroundColor: "rgba(212,175,55,0.05)" },
  quickBtnOutlineText: { color: "#D4AF37", fontWeight: "700", fontSize: 14 }
});