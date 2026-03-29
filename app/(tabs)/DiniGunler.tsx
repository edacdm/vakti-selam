import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

// 2026-2027 Resmi/Tahmini İslami Dini Günler (Miladi Karşılıkları)
const DINI_GUNLER = [
  { name: "Üç Ayların Başlangıcı", date: "2026-01-19" },
  { name: "Regaib Kandili", date: "2026-01-22" },
  { name: "Miraç Kandili", date: "2026-02-13" },
  { name: "Ramazan Başlangıcı", date: "2026-02-18" },
  { name: "Berat Kandili", date: "2026-03-03" },
  { name: "Kadir Gecesi", date: "2026-03-15" },
  { name: "Ramazan Bayramı", date: "2026-03-20" },
  { name: "Kurban Bayramı", date: "2026-05-27" },
  { name: "Hicri Yılbaşı", date: "2026-06-16" },
  { name: "Aşure Günü", date: "2026-06-25" },
  { name: "Mevlid Kandili", date: "2026-08-25" },

  // 2027
  { name: "Üç Ayların Başlangıcı", date: "2027-01-08" },
  { name: "Regaib Kandili", date: "2027-01-11" },
  { name: "Ramazan Başlangıcı", date: "2027-02-07" },
  { name: "Miraç Kandili", date: "2027-02-02" },
  { name: "Berat Kandili", date: "2027-02-20" },
  { name: "Kadir Gecesi", date: "2027-03-04" },
  { name: "Ramazan Bayramı", date: "2027-03-09" },
  { name: "Kurban Bayramı", date: "2027-05-16" },
  { name: "Hicri Yılbaşı", date: "2027-06-05" },
  { name: "Aşure Günü", date: "2027-06-14" },
  { name: "Mevlid Kandili", date: "2027-08-14" },
];

// Tarihe göre sırala
DINI_GUNLER.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

export default function DiniGunler() {
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [todayText, setTodayText] = useState("");

  useEffect(() => {
    // Bugünün tarihini düzeltme (Saat farklarını yok sayıp sadece günü almak için)
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let found = false;

    // Sıradaki günü bul (Bugün veya daha ileri bir güne denk gelen ilk tarih)
    for (const event of DINI_GUNLER) {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      if (eventDate.getTime() >= now.getTime()) {
        const diffTime = eventDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setNextEvent(event);
        setDaysLeft(diffDays);
        found = true;
        break;
      }
    }

    // Hicri Takvim Bugün
    try {
      const formatter = new Intl.DateTimeFormat("tr-TR-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      setTodayText(formatter.format(new Date()) + " (Hicri)");
    } catch {
      setTodayText("Mübarek Günler Rehberi"); // Desteklemeyen eski cihazlar için fallback
    }

  }, []);

  const renderEventItem = (event: any, index: number) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const isPast = eventDate.getTime() < now.getTime();
    const isToday = eventDate.getTime() === now.getTime();
    const isNext = nextEvent && nextEvent.name === event.name && nextEvent.date === event.date;

    // Tarihi TR formatında güzelleştir
    const dateStr = eventDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' });

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
            <Text style={[styles.eventName, isPast && styles.textPast]}>{event.name}</Text>
            <Text style={[styles.eventDate, isPast && styles.textPast]}>{dateStr} {eventDate.getFullYear()}</Text>
          </View>
        </View>

        {isToday ? (
          <View style={styles.badgeToday}>
            <Text style={styles.badgeTodayText}>Bugün!</Text>
          </View>
        ) : isPast ? (
          <Text style={styles.pastLabel}>Geride Kaldı</Text>
        ) : (
          <View style={styles.daysLeftPill}>
            {/* Eğer nextEvent ise üstteki büyük kartta gösterdiğimiz için burada sade yazıyoruz, diğerlerine ekstra gün yazdırabiliriz */}
            <Text style={styles.daysLeftText}>Yaklaşıyor</Text>
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
            <Text style={styles.headerTitle}>Dini Günler Takvimi</Text>
            <Text style={styles.headerSubtitle}>{todayText}</Text>
          </View>
          <MaterialCommunityIcons name="calendar-month-outline" size={36} color="#D4AF37" />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Sırada Yaklaşan Etkinlik Dev Kartı */}
          {nextEvent && (
            <View style={styles.heroCard}>
              <MaterialCommunityIcons name="moon-waning-crescent" size={40} color="rgba(212, 175, 55, 0.2)" style={styles.heroGlowIcon} />
              <Text style={styles.heroSubtitle}>SIRADAKİ MÜBAREK GÜN</Text>
              <Text style={styles.heroTitle}>{nextEvent.name}</Text>
              <View style={styles.heroDivider} />
              <View style={styles.heroFooter}>
                <View style={styles.countdownBox}>
                  <Text style={styles.countdownNumber}>{daysLeft}</Text>
                  <Text style={styles.countdownLabel}>GÜN KALDI</Text>
                </View>
                <View style={styles.heroDateInfo}>
                  <Ionicons name="calendar" size={16} color="#D4AF37" />
                  <Text style={styles.heroDateText}>
                    {new Date(nextEvent.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>2026 - 2027 Takvimi</Text>
          </View>

          {/* Tüm Tarihlerin Listesi */}
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
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.4)",
    overflow: "hidden",
    position: "relative",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
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
