import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hadis, setHadis] = useState<string>("");

  // Günlük hadisler (Türkçe)
  const hadisler = [
    "Ameller niyetlere göredir. (Buhârî)",
    "Kolaylaştırın, zorlaştırmayın. (Buhârî)",
    "Komşusu açken tok yatan bizden değildir. (Tirmizî)",
    "Selâmı yayınız ki aranızda sevgi artsın. (Müslim)",
    "İyilik sadakadır. (Buhârî)",
  ];

  // Günlük hadis seçimi
  useEffect(() => {
    const randomHadis = hadisler[Math.floor(Math.random() * hadisler.length)];
    setHadis(randomHadis);
  }, []);

  // Konum alma (dummy verilerle)
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLoading(false);
    })();
  }, []);

  return (
    <LinearGradient colors={["#0e1a2b", "#1e2f47"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Vakt-i Selam 🌙</Text>

        {/* Günlük Hadis */}
        <View style={styles.hadisCard}>
          <Text style={styles.hadisTitle}>📜 Günün Hadisi</Text>
          <Text style={styles.hadisText}>{hadis}</Text>
        </View>

        {/* Namaz Vakitleri */}
        <View style={styles.vakitCard}>
          <Text style={styles.vakitTitle}>🕰️ Namaz Vakitleri</Text>
          {loading ? (
            <ActivityIndicator color="#f1c40f" size="large" />
          ) : (
            <View>
              <Text style={styles.vakitText}>İmsak: 06:10</Text>
              <Text style={styles.vakitText}>Güneş: 07:37</Text>
              <Text style={styles.vakitText}>Öğle: 12:56</Text>
              <Text style={styles.vakitText}>İkindi: 15:47</Text>
              <Text style={styles.vakitText}>Akşam: 18:13</Text>
              <Text style={styles.vakitText}>Yatsı: 19:35</Text>
            </View>
          )}
        </View>

        {/* Ana Butonlar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#f1c40f" }]}
            onPress={() => router.push("/(tabs)/Zikirmatik")}
          >
            <Text style={styles.buttonText}>Zikirmatik</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#f1c40f" }]}
            onPress={() => router.push("/(tabs)/NamazHocasi")}
          >
            <Text style={styles.buttonText}>Namaz Hocası</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingVertical: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f1c40f",
    marginBottom: 30,
  },
  hadisCard: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
  },
  hadisTitle: {
    fontSize: 18,
    color: "#f1c40f",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "600",
  },
  hadisText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  vakitCard: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  vakitTitle: {
    fontSize: 18,
    color: "#f1c40f",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "600",
  },
  vakitText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "80%",
    marginTop: 15,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  buttonText: {
    color: "#0e1a2b",
    fontWeight: "700",
    fontSize: 16,
  },
});
