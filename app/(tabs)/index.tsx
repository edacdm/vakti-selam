import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Colors } from "../../constants/Colors";
import { DUAS } from "../../constants/Duas";
import type { TranslationKeys } from "../../i18n";
import { useTranslation } from "../../i18n";
import { useAppStore } from "../../store/appStore";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const PRAYER_NAMES: { nameKey: TranslationKeys; apiKey: string; iconKey: string }[] = [
  { nameKey: "fajr", apiKey: "Fajr", iconKey: "weather-sunset-up" },
  { nameKey: "sunrise", apiKey: "Sunrise", iconKey: "white-balance-sunny" },
  { nameKey: "dhuhr", apiKey: "Dhuhr", iconKey: "weather-sunny" },
  { nameKey: "asr", apiKey: "Asr", iconKey: "weather-sunset-down" },
  { nameKey: "maghrib", apiKey: "Maghrib", iconKey: "weather-sunset" },
  { nameKey: "isha", apiKey: "Isha", iconKey: "moon-waning-crescent" },
];

const STARDUST_COUNT = 15;
const Stardust = () => {
  const [particles] = useState(() => 
    Array.from({ length: STARDUST_COUNT }).map(() => ({
      x: new Animated.Value(Math.random() * SCREEN_WIDTH),
      y: new Animated.Value(Math.random() * SCREEN_HEIGHT),
      opacity: new Animated.Value(Math.random()),
      size: Math.random() * 3 + 1,
    }))
  );

  useEffect(() => {
    particles.forEach(p => {
      const animate = () => {
        Animated.parallel([
          Animated.timing(p.y, {
            toValue: -50,
            duration: 15000 + Math.random() * 10000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(p.opacity, { toValue: 0.8, duration: 2000, useNativeDriver: true }),
            Animated.timing(p.opacity, { toValue: 0.2, duration: 2000, useNativeDriver: true }),
          ])
        ]).start(() => {
          p.y.setValue(SCREEN_HEIGHT + 50);
          p.x.setValue(Math.random() * SCREEN_WIDTH);
          animate();
        });
      };
      animate();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: Colors.luxury.gold,
            opacity: p.opacity,
            transform: [{ translateX: p.x }, { translateY: p.y }],
            shadowColor: Colors.luxury.gold,
            shadowRadius: 5,
            shadowOpacity: 0.5,
          }}
        />
      ))}
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { prayerNotificationsEnabled, hadithNotificationsEnabled, loadNotificationSettings } = useAppStore();

  const [loading, setLoading] = useState<boolean>(true);
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [nextPrayerKey, setNextPrayerKey] = useState<TranslationKeys | "">("");
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [hijriDate, setHijriDate] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const mandalaRotation = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadNotificationSettings();
    getLocationAndTimes();

    // Mandala Continuous Rotation
    Animated.loop(
      Animated.timing(mandalaRotation, {
        toValue: 1,
        duration: 120000,
        useNativeDriver: true,
      })
    ).start();

    // Golden Pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 3000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => { if (prayerTimes) calculateNextPrayer(prayerTimes); }, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const getLocationAndTimes = async (): Promise<void> => {
    try {
      const cached = await AsyncStorage.getItem("prayerTimesCache");
      if (cached) setPrayerTimes(JSON.parse(cached));
      const cd = await AsyncStorage.getItem("hijriDateCache");
      if (cd) setHijriDate(JSON.parse(cd).hijri);
    } catch { }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") { setLoading(false); return; }

    try {
      const loc = await Location.getCurrentPositionAsync({});
      const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${loc.coords.latitude}&longitude=${loc.coords.longitude}&method=13`);
      const data = await res.json();
      const times = data.data.timings;
      const hij = data.data.date.hijri;
      const hs = `${hij.day} ${hij.month.en} ${hij.year}`;

      setPrayerTimes(times);
      setHijriDate(hs);
      await AsyncStorage.setItem("prayerTimesCache", JSON.stringify(times));
      await AsyncStorage.setItem("hijriDateCache", JSON.stringify({ hijri: hs }));
    } catch { } finally { setLoading(false); }
  };

  const calculateNextPrayer = (timings: any) => {
    const now = new Date();
    const sortedPrayers = PRAYER_NAMES.map(p => {
      const [h, m] = timings[p.apiKey].split(":");
      const d = new Date();
      d.setHours(+h, +m, 0, 0);
      return { ...p, d };
    }).sort((a, b) => a.d.getTime() - b.d.getTime());

    let targetIdx = -1;
    for (let i = 0; i < sortedPrayers.length; i++) {
      if (sortedPrayers[i].d > now) {
        targetIdx = i;
        break;
      }
    }

    let prevD, nextD, targetKey;

    if (targetIdx === -1) {

      prevD = sortedPrayers[sortedPrayers.length - 1].d;
      nextD = new Date(sortedPrayers[0].d.getTime() + 86400000);
      targetKey = sortedPrayers[0].nameKey;
    } else if (targetIdx === 0) {

      prevD = new Date(sortedPrayers[sortedPrayers.length - 1].d.getTime() - 86400000);
      nextD = sortedPrayers[0].d;
      targetKey = sortedPrayers[0].nameKey;
    } else {

      prevD = sortedPrayers[targetIdx - 1].d;
      nextD = sortedPrayers[targetIdx].d;
      targetKey = sortedPrayers[targetIdx].nameKey;
    }

    const total = nextD.getTime() - prevD.getTime();
    const elapsed = now.getTime() - prevD.getTime();
    const progress = Math.max(0, Math.min(100, (elapsed / total) * 100));

    const diff = nextD.getTime() - now.getTime();
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    setNextPrayerKey(targetKey);
    setRemainingTime(`${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
    setProgressPercent(progress);
  };

  const LuxuryCard = ({ children, title, icon }: { children: React.ReactNode, title?: string, icon?: any }) => (
    <View style={styles.luxuryCardWrapper}>
      <LinearGradient colors={["rgba(212, 175, 55, 0.25)", "rgba(212, 175, 55, 0.05)"]} style={styles.goldBorder} />
      <BlurView intensity={25} tint="dark" style={styles.luxuryCardInner}>
        {title && (
          <View style={styles.cardHeader}>
            <View style={styles.headerDot} />
            <Text style={styles.cardTitle}>{title.toUpperCase()}</Text>
            {icon && <MaterialCommunityIcons name={icon} size={18} color={Colors.luxury.gold} />}
          </View>
        )}
        {children}
      </BlurView>
    </View>
  );

  return (
    <LinearGradient colors={[Colors.luxury.midnight, Colors.luxury.midnightDeep]} style={styles.container}>
      <Stardust />
      
      <Animated.View style={[
        StyleSheet.absoluteFill, 
        {
          transform: [{ 
            rotate: mandalaRotation.interpolate({ 
              inputRange: [0, 1], 
              outputRange: ["0deg", "360deg"] 
            }) 
          }]
        }
      ]}>
        <ImageBackground
          source={require("../../assets/images/mandala_bg.png")}
          style={StyleSheet.absoluteFill}
          imageStyle={styles.mandalaImage}
          resizeMode="contain"
        />
      </Animated.View>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <View>
              <Text style={styles.hijriHeader}>{hijriDate}</Text>
              <Text style={styles.appNameLuxury}>VAKTİ SELAM</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.push("/YakindakiCamiler")}>
                <MaterialCommunityIcons name="mosque" size={20} color={Colors.luxury.gold} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.push("/Ayarlar")}>
                <Ionicons name="settings-sharp" size={20} color={Colors.luxury.gold} />
              </TouchableOpacity>
            </View>
          </View>

          <LuxuryCard title={t("nextPrayerLabel") || "VAKİT KADRANI"} icon="compass-outline">
            <View style={styles.dialContainer}>
              <View style={styles.dialOuterRing}>
                <LinearGradient 
                  colors={["rgba(212, 175, 55, 0.4)", "transparent"]} 
                  style={styles.dialGlow}
                />
                
                <View style={styles.dialInner}>
                  <ImageBackground 
                    source={require("../../assets/images/mandala_bg.png")}
                    style={styles.dialMandala}
                    imageStyle={{ opacity: 0.15 }}
                  >
                    <Animated.View style={[styles.dialContent, { transform: [{ scale: pulseAnim }] }]}>
                      <Text style={styles.dialVakitName}>{nextPrayerKey ? t(nextPrayerKey).toUpperCase() : "—"}</Text>
                      <Text style={styles.dialTimeText}>{remainingTime}</Text>
                      <View style={styles.dialProgressWrapper}>
                        <Text style={styles.dialPercent}>{Math.round(progressPercent)}% ELAPSED</Text>
                      </View>
                    </Animated.View>
                  </ImageBackground>
                </View>

                <View style={[
                  styles.dialOrbitDot, 
                  { 
                    transform: [
                      { rotate: `${(progressPercent * 3.6) - 90}deg` }, 
                      { translateX: 105 } 
                    ] 
                  }
                ]} />
              </View>
            </View>
          </LuxuryCard>

          {(() => {
            const todayDua = DUAS[new Date().getDate() % DUAS.length];
            return (
              <LuxuryCard title={t("duaDayTitle") || "GÜNÜN DUASI"} icon="hands-pray">
                <View style={styles.duaContent}>
                  <Text style={styles.arabicDua}>{todayDua.arabic}</Text>
                  <Text style={styles.translationDua}>"{todayDua.translation}"</Text>
                  <Text style={styles.duaSource}>({todayDua.source})</Text>
                </View>
              </LuxuryCard>
            );
          })()}

          <LuxuryCard title={t("prayerTimesTitle") || "VAKİT GELİYOR"}>
            {loading ? <ActivityIndicator color={Colors.luxury.gold} /> : (
              <View style={styles.prayerList}>
                {PRAYER_NAMES.map((p) => {
                  const isNext = nextPrayerKey === p.nameKey;
                  return (
                    <BlurView 
                       key={p.apiKey} 
                       intensity={isNext ? 40 : 10} 
                       tint="light" 
                       style={[styles.prayerItem, isNext && styles.prayerItemActive]}
                    >
                      <View style={styles.prayerItemLeft}>
                        <MaterialCommunityIcons
                          name={p.iconKey as any}
                          size={18}
                          color={isNext ? Colors.luxury.midnight : Colors.luxury.gold}
                        />
                        <Text style={[styles.prayerItemName, isNext && styles.prayerItemNameActive]}>{t(p.nameKey as any)}</Text>
                      </View>
                      <Text style={[styles.prayerItemTime, isNext && styles.prayerItemTimeActive]}>
                        {prayerTimes ? prayerTimes[p.apiKey] : "--:--"}
                      </Text>
                    </BlurView>
                  );
                })}
              </View>
            )}
          </LuxuryCard>

          <TouchableOpacity
            style={styles.spiritualBanner}
            onPress={() => router.push("/YakindakiCamiler")}
          >
            <BlurView intensity={20} tint="dark" style={styles.spiritualBannerInner}>
              <LinearGradient
                colors={["rgba(212, 175, 55, 0.15)", "transparent"]}
                style={styles.bannerHalo}
              />

              <View style={styles.bannerContent}>
                <View style={styles.bannerIconBox}>
                  <MaterialCommunityIcons name="mosque" size={32} color={Colors.luxury.gold} />
                </View>
                <Text style={styles.bannerTitle}>{t("mosquesBtn") || "YAKINDAKİ CAMİLER"}</Text>
                <Text style={styles.bannerSubTitle}>{t("searchCompleted") || "Huzur veren minareleri keşfedin"}</Text>
                <View style={styles.bannerDivider} />
              </View>

              <View style={styles.cornerOrnamentTop} />
              <View style={styles.cornerOrnamentBottom} />
            </BlurView>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      <View style={styles.lanternLeft}>
        <FontAwesome5 name="fan" size={40} color="rgba(212, 175, 55, 0.1)" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mandalaImage: { opacity: 0.1, position: "absolute", top: 100, right: -150, transform: [{ scale: 1.5 }] },
  scroll: { paddingHorizontal: 20, paddingTop: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25, marginTop: 10 },
  hijriHeader: { color: Colors.luxury.gold, fontSize: 13, fontWeight: "600", letterSpacing: 1 },
  appNameLuxury: { color: "#FFFFFF", fontSize: 24, fontWeight: "900", letterSpacing: 2 },
  headerRight: { flexDirection: "row", gap: 10 },
  iconBtn: { padding: 10, borderRadius: 12, backgroundColor: "rgba(212, 175, 55, 0.1)", borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.2)" },

  spiritualBanner: {
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
    overflow: "hidden",
  },
  spiritualBannerInner: {
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  bannerHalo: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: "50%",
    left: "50%",
    marginTop: -100,
    marginLeft: -100
  },
  bannerContent: { alignItems: "center", zIndex: 2 },
  bannerIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    marginBottom: 15
  },
  bannerTitle: { color: "#FFF", fontSize: 16, fontWeight: "200", letterSpacing: 4 },
  bannerSubTitle: { color: Colors.luxury.gold, fontSize: 10, fontWeight: "700", marginTop: 5, opacity: 0.6, letterSpacing: 1 },
  bannerDivider: { width: 40, height: 2, backgroundColor: Colors.luxury.gold, marginTop: 15, borderRadius: 1, opacity: 0.3 },

  cornerOrnamentTop: { position: "absolute", top: 10, left: 10, width: 20, height: 20, borderTopWidth: 1, borderLeftWidth: 1, borderColor: "rgba(212, 175, 55, 0.2)" },
  cornerOrnamentBottom: { position: "absolute", bottom: 10, right: 10, width: 20, height: 20, borderBottomWidth: 1, borderRightWidth: 1, borderColor: "rgba(212, 175, 55, 0.2)" },

  luxuryCardWrapper: { marginBottom: 25, position: "relative" },
  goldBorder: { position: "absolute", top: -1, left: -1, right: -1, bottom: -1, borderRadius: 24 },
  luxuryCardInner: { backgroundColor: Colors.luxury.midnightDeep, borderRadius: 23, padding: 20, overflow: "hidden" },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 15 },
  headerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.luxury.gold },
  cardTitle: { color: Colors.luxury.textGold, fontSize: 11, fontWeight: "800", letterSpacing: 3, flex: 1 },

  dialContainer: { alignItems: "center", paddingVertical: 20 },
  dialOuterRing: {
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  dialGlow: { ...StyleSheet.absoluteFillObject, borderRadius: 105, opacity: 0.2 },
  dialInner: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(0,0,0,0.2)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.1)"
  },
  dialMandala: { flex: 1, justifyContent: "center", alignItems: "center" },
  dialContent: { alignItems: "center" },
  dialVakitName: { color: Colors.luxury.gold, fontSize: 12, fontWeight: "800", letterSpacing: 4, marginBottom: 10, opacity: 0.8 },
  dialTimeText: { color: "#FFF", fontSize: 34, fontWeight: "200", letterSpacing: 2 },
  dialProgressWrapper: { marginTop: 10, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: "rgba(212, 175, 55, 0.1)" },
  dialPercent: { color: Colors.luxury.gold, fontSize: 10, fontWeight: "900" },
  dialOrbitDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.luxury.gold,
    shadowColor: Colors.luxury.gold,
    shadowRadius: 10,
    shadowOpacity: 1,
    zIndex: 10
  },

  duaContent: {},
  arabicDua: { color: Colors.luxury.gold, fontSize: 20, textAlign: "right", marginBottom: 15, lineHeight: 32 },
  translationDua: { color: "#E2E8F0", fontSize: 14, fontStyle: "italic", lineHeight: 22, textAlign: "left" },
  duaSource: { color: "#64748B", fontSize: 11, marginTop: 10, textAlign: "right" },

  prayerList: { gap: 8 },
  prayerItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, paddingHorizontal: 15, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.02)" },
  prayerItemActive: { backgroundColor: Colors.luxury.gold, shadowColor: Colors.luxury.gold, shadowRadius: 10, shadowOpacity: 0.3, elevation: 5 },
  prayerItemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  prayerItemName: { color: "#94A3B8", fontSize: 15, fontWeight: "500" },
  prayerItemNameActive: { color: Colors.luxury.midnight, fontWeight: "700" },
  prayerItemTime: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  prayerItemTimeActive: { color: Colors.luxury.midnight, fontWeight: "800" },

  lanternLeft: { position: "absolute", top: -10, left: 20, opacity: 0.2 }
});
