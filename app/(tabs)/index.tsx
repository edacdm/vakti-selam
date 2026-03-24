import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

const HADISLER: string[] = [
  "Ameller niyetlere göredir. (Buhârî)",
  "Kolaylaştırın, zorlaştırmayın. (Buhârî)",
  "Komşusu açken tok yatan bizden değildir. (Tirmizî)",
  "Selâmı yayınız ki aranızda sevgi artsın. (Müslim)",
  "İyilik sadakadır. (Buhârî)",
];

export default function HomeScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [hadis, setHadis] = useState<string>("");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    const randomHadis = HADISLER[Math.floor(Math.random() * HADISLER.length)];
    setHadis(randomHadis);
    getLocationAndTimes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (prayerTimes) {
        calculateNextPrayer(prayerTimes);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  const getLocationAndTimes = async (): Promise<void> => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setLoading(false);
      return;
    }

    try {
      const loc = await Location.getCurrentPositionAsync({});
      const lat = loc.coords.latitude;
      const lon = loc.coords.longitude;

      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=13`
      );

      const data = await response.json();
      setPrayerTimes(data.data.timings);
      calculateNextPrayer(data.data.timings);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const updateCountdownState = (name: string, diff: number): void => {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setNextPrayer(name);
    setRemainingTime(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    );
  };

  const calculateNextPrayer = (timings: PrayerTimes): void => {
    const now = new Date();

    const prayers = [
      { id: "Fajr", name: "İmsak", time: timings.Fajr },
      { id: "Sunrise", name: "Güneş", time: timings.Sunrise },
      { id: "Dhuhr", name: "Öğle", time: timings.Dhuhr },
      { id: "Asr", name: "İkindi", time: timings.Asr },
      { id: "Maghrib", name: "Akşam", time: timings.Maghrib },
      { id: "Isha", name: "Yatsı", time: timings.Isha },
    ];

    let foundNext = false;

    for (let prayer of prayers) {
      if (prayer.id === "Sunrise") continue; 

      const [hour, minute] = prayer.time.split(":");
      const prayerTime = new Date();
      prayerTime.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);

      if (prayerTime > now) {
        const diff = prayerTime.getTime() - now.getTime();
        updateCountdownState(prayer.name, diff);
        foundNext = true;
        break;
      }
    }

    if (!foundNext) {
      const fajr = prayers[0];
      const [hour, minute] = fajr.time.split(":");
      const tomorrowFajr = new Date();
      tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
      tomorrowFajr.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);

      const diff = tomorrowFajr.getTime() - now.getTime();
      updateCountdownState(fajr.name, diff);
    }
  };

  const renderPrayerRow = (name: string, time: string, isNext: boolean) => (
    <View style={[styles.prayerRow, isNext && styles.prayerRowActive]} key={name}>
      <Text style={[styles.prayerName, isNext && styles.activeText]}>{name}</Text>
      <Text style={[styles.prayerTime, isNext && styles.activeText]}>{time}</Text>
    </View>
  );

  return (
    <LinearGradient colors={["#0B101E", "#15233E"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          
          <View style={styles.header}>
            <MaterialCommunityIcons name="moon-waning-crescent" size={32} color="#D4AF37" />
            <Text style={styles.title}>Vakt-i Selam</Text>
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroSubtitle}>VAKTİN ÇIKMASINA KALAN SÜRE</Text>
            <Text style={styles.heroTitle}>{nextPrayer}</Text>
            <Text style={styles.countdown}>{remainingTime || "--:--:--"}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="time-outline" size={20} color="#D4AF37" />
              <Text style={styles.cardTitle}>Namaz Vakitleri</Text>
            </View>

            {loading ? (
              <ActivityIndicator color="#D4AF37" size="large" style={{ marginVertical: 20 }} />
            ) : (
              prayerTimes && (
                <View style={styles.prayerList}>
                  {renderPrayerRow("İmsak", prayerTimes.Fajr, nextPrayer === "İmsak")}
                  {renderPrayerRow("Güneş", prayerTimes.Sunrise, false)}
                  {renderPrayerRow("Öğle", prayerTimes.Dhuhr, nextPrayer === "Öğle")}
                  {renderPrayerRow("İkindi", prayerTimes.Asr, nextPrayer === "İkindi")}
                  {renderPrayerRow("Akşam", prayerTimes.Maghrib, nextPrayer === "Akşam")}
                  {renderPrayerRow("Yatsı", prayerTimes.Isha, nextPrayer === "Yatsı")}
                </View>
              )
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="book-outline" size={20} color="#D4AF37" />
              <Text style={styles.cardTitle}>Günün Hadisi</Text>
            </View>
            <Text style={styles.hadisText}>"{hadis}"</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(tabs)/Zikirmatik")}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="counter" size={24} color="#0B101E" />
              <Text style={styles.buttonText}>Zikirmatik</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(tabs)/NamazHocasi")}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="book-open-page-variant" size={24} color="#0B101E" />
              <Text style={styles.buttonText}>Namaz Hocası</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "300",
    color: "#E2E8F0",
    letterSpacing: 1.5,
  },
  heroCard: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 35,
    backgroundColor: "rgba(212, 175, 55, 0.05)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    marginBottom: 25,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  heroSubtitle: {
    color: "#94A3B8",
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "600",
    marginBottom: 8,
  },
  heroTitle: {
    color: "#D4AF37",
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 5,
  },
  countdown: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "200",
    fontVariant: ["tabular-nums"],
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    color: "#D4AF37",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  prayerList: {
    width: "100%",
  },
  prayerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  prayerRowActive: {
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 0,
    marginVertical: 4,
  },
  prayerName: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "400",
  },
  prayerTime: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "600",
  },
  activeText: {
    color: "#D4AF37",
    fontWeight: "700",
  },
  hadisText: {
    color: "#CBD5E1",
    fontSize: 15,
    fontStyle: "italic",
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#D4AF37",
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#0B101E",
    fontWeight: "700",
    fontSize: 15,
  },
});