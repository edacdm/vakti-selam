import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ExploreScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [camiler, setCamiler] = useState<string[]>([]);
  const [namazVakitleri, setNamazVakitleri] = useState<string[]>([]);
  const [ayet, setAyet] = useState<string>(""); // Günün ayeti (Türkçe meal)
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // 1️⃣ Konum izni
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Konum izni verilmedi!");
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

      // 2️⃣ Namaz vakitleri
      const coordinates = new Coordinates(loc.coords.latitude, loc.coords.longitude);
      const params = CalculationMethod.MuslimWorldLeague();
      const prayerTimes = new PrayerTimes(coordinates, new Date(), params);

      setNamazVakitleri([
        `İmsak: ${prayerTimes.fajr.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`,
        `Güneş: ${prayerTimes.sunrise.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`,
        `Öğle: ${prayerTimes.dhuhr.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`,
        `İkindi: ${prayerTimes.asr.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`,
        `Akşam: ${prayerTimes.maghrib.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`,
        `Yatsı: ${prayerTimes.isha.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`,
      ]);

      // 3️⃣ Yakındaki camiler (Google Places API)
      const API_KEY = "BURAYA_API_KEY"; // kendi Google API key
      const radius = 5000; // 5 km
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${loc.coords.latitude},${loc.coords.longitude}&radius=${radius}&type=mosque&key=${API_KEY}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results) {
          setCamiler(data.results.map((m: any) => m.name));
        }
      } catch (err) {
        console.log("Camiler alınamadı", err);
      }

      // 4️⃣ Günün ayeti (Türkçe meal, tarihe bağlı)
      try {
        const totalAyat = 6236; // Kur'an'daki toplam ayet sayısı
        const today = new Date();
        const todayIndex = (today.getFullYear() * 365 + today.getMonth() * 30 + today.getDate()) % totalAyat + 1;

        // edition olarak Arapça ve Türkçe meal çağırıyoruz
        const ayetResponse = await fetch(
          `https://api.alquran.cloud/v1/ayah/${todayIndex}/editions/quran-uthmani,tr.diyanet`
        );
        const ayetData = await ayetResponse.json();
        const meal = ayetData.data.find((e: any) => e.edition.identifier === "tr.diyanet").text;
        setAyet(meal); // artık kesin Türkçe meal
      } catch (err) {
        console.log("Ayet alınamadı", err);
        setAyet("Günün ayeti alınamadı.");
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.plusButton} onPress={() => router.push("/Zikirmatik")}>
        <Text style={styles.plusText}>＋ Zikirmatik</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Günün Ayeti</Text>
        <Text style={styles.text}>{ayet}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Namaz Vakitleri</Text>
        {namazVakitleri.map((vakit, i) => (
          <Text key={i} style={styles.text}>• {vakit}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Yakındaki Camiler</Text>
        {camiler.length > 0 ? (
          camiler.map((cami, i) => <Text key={i} style={styles.text}>• {cami}</Text>)
        ) : (
          <Text style={styles.text}>Yakındaki cami bulunamadı.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#2c3e50",
  },
  plusButton: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  plusText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 3,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
