import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function NafileNamazlar() {
  const router = useRouter();

  const nafileNamazlar = [
    "Teravih Namazı",
    "Teheccüd Namazı",
    "Evvabin Namazı",
    "Kuşluk Namazı",
    "Hacet Namazı",
    "Tövbe Namazı",
    "İstihare Namazı",
    "Yolculuk Namazı",
    "Tahıyyetü’l Mescid Namazı",
  ];

  return (
    <LinearGradient colors={["#0e1a2b", "#1e2f47"]} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Geri</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🌿 Nafile Namazlar</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {nafileNamazlar.map((namaz, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <Text style={styles.cardText}>{namaz}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
    backgroundColor: "#326292",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  backText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: {
    color: "#f1c40f",
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 20,
  },
  scroll: {
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 7,
    alignItems: "center",
  },
  cardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
