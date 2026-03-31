import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "../../i18n";
import type { TranslationKeys } from "../../i18n";

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
  const [todayText, setTodayText] = useState("");

  useEffect(() => {
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
      setTodayText(formatter.format(new Date()) + (language === 'id' ? " (Hijriah)" : language === 'en' ? " (Hijri)" : " (Hicri)"));
    } catch {
      setTodayText(t("religiousDaysTitle"));
    }
  }, [language]);

  const getDateLocale = () => language === 'id' ? 'id-ID' : language === 'en' ? 'en-US' : 'tr-TR';

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
      <View
        key={index}
        style={[
          styles.listItem,
          isPast && styles.listItemPast,
          isToday && styles.listItemToday,
          isNext && styles.listItemNext
        ]}
      >
        <View style={styles.listLeft}>
          <View style={[styles.dateDot, isPast ? styles.dateDotPast : isNext ? styles.dateDotNext : null]} />
          <View>
            <Text style={[styles.eventName, isPast && styles.textPast]}>{t(event.nameKey)}</Text>
            <Text style={[styles.eventDate, isPast && styles.textPast]}>{dateStr} {eventDate.getFullYear()}</Text>
          </View>
        </View>

        {isToday ? (
          <View style={styles.badgeToday}>
            <Text style={styles.badgeTodayText}>{t("today")}</Text>
          </View>
        ) : isPast ? (
          <Text style={styles.pastLabel}>{t("passed")}</Text>
        ) : (
          <View style={styles.daysLeftPill}>
            <Text style={styles.daysLeftText}>{t("upcoming")}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient colors={["#080C16", "#121E36"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{t("religiousDaysTitle")}</Text>
            <Text style={styles.headerSubtitle}>{todayText}</Text>
          </View>
          <MaterialCommunityIcons name="calendar-month-outline" size={36} color="#D4AF37" />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {nextEvent && (
            <View style={styles.heroCard}>
              <MaterialCommunityIcons name="moon-waning-crescent" size={40} color="rgba(212, 175, 55, 0.2)" style={styles.heroGlowIcon} />
              <Text style={styles.heroSubtitle}>{t("nextHolyDay")}</Text>
              <Text style={styles.heroTitle}>{t(nextEvent.nameKey)}</Text>
              <View style={styles.heroDivider} />
              <View style={styles.heroFooter}>
                <View style={styles.countdownBox}>
                  <Text style={styles.countdownNumber}>{daysLeft}</Text>
                  <Text style={styles.countdownLabel}>{t("daysLeft")}</Text>
                </View>
                <View style={styles.heroDateInfo}>
                  <Ionicons name="calendar" size={16} color="#D4AF37" />
                  <Text style={styles.heroDateText}>
                    {new Date(nextEvent.date).toLocaleDateString(getDateLocale(), { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>{t("calendarRange")}</Text>
          </View>

          <View style={styles.listContainer}>
            {DINI_GUNLER.map((item, index) => renderEventItem(item, index))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === "android" ? 40 : 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#E2E8F0", letterSpacing: 1 },
  headerSubtitle: { fontSize: 13, color: "#D4AF37", marginTop: 4, fontStyle: "italic", opacity: 0.9 },
  scroll: { paddingHorizontal: 16, paddingBottom: 20 },

  heroCard: {
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    borderRadius: 24, padding: 24, marginBottom: 30,
    borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.4)",
    overflow: "hidden", position: "relative",
    shadowColor: "#D4AF37", shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15, shadowRadius: 25, elevation: 8,
  },
  heroGlowIcon: { position: "absolute", right: -10, top: -10, transform: [{ scale: 4 }] },
  heroSubtitle: { color: "#94A3B8", fontSize: 11, fontWeight: "700", letterSpacing: 2, marginBottom: 8 },
  heroTitle: { color: "#E2E8F0", fontSize: 26, fontWeight: "bold", letterSpacing: 0.5 },
  heroDivider: { height: 1, backgroundColor: "rgba(212, 175, 55, 0.2)", marginVertical: 18 },
  heroFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  countdownBox: { flexDirection: "row", alignItems: "flex-end", gap: 6 },
  countdownNumber: { color: "#D4AF37", fontSize: 44, fontWeight: "300", lineHeight: 48 },
  countdownLabel: { color: "#D4AF37", fontSize: 12, fontWeight: "700", letterSpacing: 1, paddingBottom: 6 },
  heroDateInfo: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(11, 16, 30, 0.5)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  heroDateText: { color: "#E2E8F0", fontSize: 13, fontWeight: "500" },

  listHeader: { marginBottom: 15, paddingHorizontal: 5 },
  listTitle: { color: "#D4AF37", fontSize: 16, fontWeight: "600", letterSpacing: 1 },
  listContainer: { backgroundColor: "rgba(11, 16, 30, 0.6)", borderRadius: 20, padding: 5, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.05)" },

  listItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: "rgba(255, 255, 255, 0.03)" },
  listItemPast: { opacity: 0.4 },
  listItemToday: { backgroundColor: "rgba(45, 212, 191, 0.08)", borderRadius: 12 },
  listItemNext: { backgroundColor: "rgba(212, 175, 55, 0.05)", borderRadius: 12 },

  listLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  dateDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#64748B" },
  dateDotPast: { backgroundColor: "#334155" },
  dateDotNext: { backgroundColor: "#D4AF37", width: 10, height: 10, borderRadius: 5, shadowColor: "#D4AF37", shadowOpacity: 0.8, shadowRadius: 6, elevation: 4 },

  eventName: { color: "#E2E8F0", fontSize: 15, fontWeight: "500", marginBottom: 4 },
  eventDate: { color: "#94A3B8", fontSize: 13 },
  textPast: { textDecorationLine: "line-through" },

  pastLabel: { color: "#64748B", fontSize: 11, fontStyle: "italic" },
  badgeToday: { backgroundColor: "#2DD4BF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeTodayText: { color: "#0B101E", fontSize: 11, fontWeight: "bold", textTransform: "uppercase" },
  daysLeftPill: { backgroundColor: "rgba(255,255,255,0.05)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  daysLeftText: { color: "#94A3B8", fontSize: 11, fontWeight: "600" },
});
