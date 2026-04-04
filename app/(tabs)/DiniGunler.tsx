import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useTranslation } from "../../i18n";
import type { TranslationKeys } from "../../i18n";
import { Colors } from "../../constants/Colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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

const DINI_GUNLER: { nameKey: TranslationKeys; date: string }[] = [
  { nameKey: "threeMonthsStart", date: "2026-01-19" },
  { nameKey: "regaibKandili", date: "2026-01-22" },
  { nameKey: "mirajKandili", date: "2026-02-13" },
  { nameKey: "ramadanStart", date: "2026-02-18" },
  { nameKey: "beratKandili", date: "2026-03-03" },
  { nameKey: "qadirNight", date: "2026-03-15" },
  { nameKey: "eidAlFitr", date: "2026-03-20" },
  { nameKey: "eidAlAdha", date: "2026-05-27" },
  { nameKey: "hijriNewYear", date: "2026-06-16" },
  { nameKey: "ashuraDay", date: "2026-06-25" },
  { nameKey: "mawlidKandili", date: "2026-08-25" },
  { nameKey: "threeMonthsStart", date: "2027-01-08" },
  { nameKey: "regaibKandili", date: "2027-01-11" },
  { nameKey: "ramadanStart", date: "2027-02-07" },
  { nameKey: "mirajKandili", date: "2027-02-02" },
  { nameKey: "beratKandili", date: "2027-02-20" },
  { nameKey: "qadirNight", date: "2027-03-04" },
  { nameKey: "eidAlFitr", date: "2027-03-09" },
  { nameKey: "eidAlAdha", date: "2027-05-16" },
  { nameKey: "hijriNewYear", date: "2027-06-05" },
  { nameKey: "ashuraDay", date: "2027-06-14" },
  { nameKey: "mawlidKandili", date: "2027-08-14" },
];

DINI_GUNLER.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

export default function DiniGunler() {
  const { t, language } = useTranslation();
  const [nextEvent, setNextEvent] = useState<typeof DINI_GUNLER[0] | null>(null);
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [todayHijriText, setTodayHijriText] = useState("");

  const mandalaRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Mandala Continuous Rotation
    Animated.loop(
      Animated.timing(mandalaRotation, {
        toValue: 1,
        duration: 200000,
        useNativeDriver: true,
      })
    ).start();

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (const event of DINI_GUNLER) {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      if (eventDate.getTime() >= now.getTime()) {
        const diffTime = eventDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNextEvent(event);
        setDaysLeft(diffDays);
        break;
      }
    }

    try {
      const locale = language === 'id' ? 'id-ID' : language === 'en' ? 'en-US' : 'tr-TR';
      const formatter = new Intl.DateTimeFormat(`${locale}-u-ca-islamic`, {
        day: "numeric", month: "long", year: "numeric"
      });
      setTodayHijriText(formatter.format(new Date()));
    } catch {
      setTodayHijriText("");
    }
  }, [language]);

  const getDateLocale = () => language === 'id' ? 'id-ID' : language === 'en' ? 'en-US' : 'tr-TR';

  const LuxuryCard = ({ children, title, supLabel }: { children: React.ReactNode, title?: string, supLabel?: string }) => (
    <View style={styles.luxuryCardWrapper}>
      <LinearGradient colors={["rgba(212, 175, 55, 0.25)", "rgba(212, 175, 55, 0.05)"]} style={styles.goldBorder} />
      <BlurView intensity={25} tint="dark" style={styles.luxuryCardInner}>
        {supLabel && <Text style={styles.cardSupLabel}>{supLabel.toUpperCase()}</Text>}
        {title && (
          <View style={styles.cardHeader}>
            <View style={styles.headerDot} />
            <Text style={styles.cardTitle}>{title.toUpperCase()}</Text>
          </View>
        )}
        {children}
      </BlurView>
    </View>
  );

  const renderEventItem = (event: typeof DINI_GUNLER[0], index: number) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const isPast = eventDate.getTime() < now.getTime();
    const isToday = eventDate.getTime() === now.getTime();
    const isNext = nextEvent && nextEvent.nameKey === event.nameKey && nextEvent.date === event.date;

    const dateStr = eventDate.toLocaleDateString(getDateLocale(), { day: 'numeric', month: 'long', weekday: 'short' });

    return (
      <View key={index} style={[styles.listItem, isPast && styles.listItemPast]}>
        <BlurView intensity={isPast ? 5 : 15} tint="dark" style={styles.listItemInner}>
          <View style={styles.listLeft}>
            <View style={[styles.dateDot, isPast ? styles.dateDotPast : isNext ? styles.dateDotNext : null]} />
            <View>
              <Text style={[styles.eventName, isPast && styles.textPast, isNext && styles.textNext]}>{t(event.nameKey)}</Text>
              <Text style={styles.eventDate}>{dateStr} {eventDate.getFullYear()}</Text>
            </View>
          </View>

          {isToday ? (
            <View style={styles.badgeToday}>
              <Text style={styles.badgeTodayText}>{t("today")}</Text>
            </View>
          ) : isPast ? (
            <MaterialCommunityIcons name="check-circle-outline" size={16} color="rgba(255,255,255,0.2)" />
          ) : (
            <View style={styles.upcomingPill}>
              {isNext && <View style={styles.glowDot} />}
              <Text style={[styles.upcomingText, isNext && styles.activeUpcomingText]}>
                {isNext ? t("upcoming") : ""}
              </Text>
            </View>
          )}
        </BlurView>
      </View>
    );
  };

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
        <View style={styles.header}>
          <View style={styles.titleWrapper}>
            <Text style={styles.supTitle}>{t("tabCalendar")}</Text>
            <Text style={styles.mainTitle}>{t("religiousDaysTitle").toUpperCase()}</Text>
            <View style={styles.goldDot} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {nextEvent && (
            <LuxuryCard supLabel={t("nextHolyDay")}>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{t(nextEvent.nameKey)}</Text>
                <View style={styles.heroInfoRow}>
                  <View style={styles.heroStat}>
                    <Text style={styles.heroStatValue}>{daysLeft}</Text>
                    <Text style={styles.heroStatLabel}>{t("daysLeft").toUpperCase()}</Text>
                  </View>
                  <View style={styles.heroDivider} />
                  <View style={styles.heroDateInfo}>
                    <Text style={styles.heroDateText}>
                      {new Date(nextEvent.date).toLocaleDateString(getDateLocale(), { day: 'numeric', month: 'long', year: 'numeric' })}
                    </Text>
                    <Text style={styles.hijriDateText}>{todayHijriText}</Text>
                  </View>
                </View>
              </View>
            </LuxuryCard>
          )}

          <View style={styles.listHeader}>
            <Text style={styles.listSectionTitle}>{t("calendarRange").toUpperCase()}</Text>
            <View style={styles.sectionLine} />
          </View>

          <View style={styles.listContainer}>
            {DINI_GUNLER.filter(event => {
              const eventDate = new Date(event.date);
              eventDate.setHours(0, 0, 0, 0);
              const now = new Date();
              now.setHours(0, 0, 0, 0);
              // Only return events that are today or in the future
              return eventDate.getTime() >= now.getTime();
            }).map((item, index) => renderEventItem(item, index))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mandalaImage: { opacity: 0.08, position: "absolute", top: 100, left: -150, transform: [{ scale: 1.5 }] },
  header: { paddingHorizontal: 24, paddingVertical: 15, alignItems: "center" },
  titleWrapper: { alignItems: "center" },
  supTitle: { color: Colors.luxury.gold, fontSize: 12, fontWeight: "700", letterSpacing: 4, marginBottom: 4 },
  mainTitle: { color: "#FFF", fontSize: 24, fontWeight: "200", letterSpacing: 2 },
  goldDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.luxury.gold, marginTop: 8 },
  scroll: { paddingHorizontal: 20 },

  luxuryCardWrapper: { width: "100%", marginBottom: 30, position: "relative" },
  goldBorder: { position: "absolute", top: -1, left: -1, right: -1, bottom: -1, borderRadius: 24 },
  luxuryCardInner: { backgroundColor: "rgba(11, 16, 30, 0.8)", borderRadius: 23, padding: 25, overflow: "hidden" },
  cardSupLabel: { color: Colors.luxury.gold, fontSize: 10, fontWeight: "800", letterSpacing: 2, marginBottom: 12, opacity: 0.8 },
  cardTitle: { color: "#FFF", fontSize: 14, fontWeight: "800", letterSpacing: 2 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 15 },
  headerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.luxury.gold },

  heroContent: { marginTop: 5 },
  heroTitle: { color: "#FFF", fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  heroInfoRow: { flexDirection: "row", alignItems: "center" },
  heroStat: { alignItems: "center" },
  heroStatValue: { color: Colors.luxury.gold, fontSize: 42, fontWeight: "200", lineHeight: 46 },
  heroStatLabel: { color: Colors.luxury.gold, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  heroDivider: { width: 1, height: 40, backgroundColor: "rgba(212, 175, 55, 0.2)", marginHorizontal: 25 },
  heroDateInfo: { flex: 1 },
  heroDateText: { color: "#FFF", fontSize: 16, fontWeight: "500", marginBottom: 4 },
  hijriDateText: { color: "rgba(255,255,255,0.4)", fontSize: 12, fontStyle: "italic" },

  listHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 15, paddingHorizontal: 5 },
  listSectionTitle: { color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: "800", letterSpacing: 3 },
  sectionLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.05)" },

  listContainer: { gap: 12 },
  listItem: { borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.05)" },
  listItemInner: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 18 },
  listItemPast: { opacity: 0.4 },
  listLeft: { flexDirection: "row", alignItems: "center", gap: 15 },
  dateDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.1)" },
  dateDotPast: { backgroundColor: "transparent", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  dateDotNext: { backgroundColor: Colors.luxury.gold, shadowColor: Colors.luxury.gold, shadowRadius: 5, shadowOpacity: 0.8 },
  eventName: { color: "#FFF", fontSize: 15, fontWeight: "600", marginBottom: 4 },
  eventDate: { color: "rgba(255,255,255,0.4)", fontSize: 13 },
  textPast: { color: "rgba(255,255,255,0.3)", textDecorationLine: "line-through" },
  textNext: { color: Colors.luxury.gold },

  badgeToday: { backgroundColor: "#2DD4BF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeTodayText: { color: "#0B101E", fontSize: 10, fontWeight: "800" },
  upcomingPill: { flexDirection: "row", alignItems: "center", gap: 6 },
  glowDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.luxury.gold },
  upcomingText: { color: "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: "800", textTransform: "uppercase" },
  activeUpcomingText: { color: Colors.luxury.gold },
});
