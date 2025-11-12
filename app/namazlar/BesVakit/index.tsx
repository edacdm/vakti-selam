import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BesVakit() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#0e1a2b", "#182c45", "#0e1a2b"]} style={styles.container}>
      {/* 🔹 Geri Butonu */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/NamazHocasi")}>
        <Text style={styles.backText}>← Geri</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🕌 Beş Vakit Namaz</Text>
      <Text style={styles.subtitle}>Farz namazların kılınış rehberi</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/namazlar/BesVakit/SabahNamazi")}
        >
          <Text style={styles.icon}>🌅</Text>
          <Text style={styles.cardTitle}>Sabah Namazı</Text>
          <Text style={styles.cardText}>2 sünnet + 2 farz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/namazlar/BesVakit/OgleNamazi")}
        >
          <Text style={styles.icon}>☀️</Text>
          <Text style={styles.cardTitle}>Öğle Namazı</Text>
          <Text style={styles.cardText}>4 sünnet + 4 farz + 2 sünnet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/namazlar/BesVakit/IkindiNamazi")}
        >
          <Text style={styles.icon}>🌇</Text>
          <Text style={styles.cardTitle}>İkindi Namazı</Text>
          <Text style={styles.cardText}>4 sünnet + 4 farz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/namazlar/BesVakit/AksamNamazi")}
        >
          <Text style={styles.icon}>🌆</Text>
          <Text style={styles.cardTitle}>Akşam Namazı</Text>
          <Text style={styles.cardText}>3 farz + 2 sünnet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/namazlar/BesVakit/YatsiNamazi")}
        >
          <Text style={styles.icon}>🌙</Text>
          <Text style={styles.cardTitle}>Yatsı Namazı</Text>
          <Text style={styles.cardText}>4 sünnet + 4 farz + 2 sünnet + 3 vitr</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  title: {
    color: "#f1c40f",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 25,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "90%",
  },
  card: {
    backgroundColor: "rgba(20, 30, 50, 0.85)",
    borderColor: "#f1c40f",
    borderWidth: 1.2,
    borderRadius: 16,
    width: "42%",
    height: 130,
    margin: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 28,
    marginBottom: 4,
  },
  cardTitle: {
    color: "#f1c40f",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardText: {
    color: "#dcdcdc",
    fontSize: 11,
    textAlign: "center",
    marginTop: 3,
  },
  backButton: {
    backgroundColor: "#2b3d55",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    position: "absolute",
    left: 20,
    top: 40,
  },
  backText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
