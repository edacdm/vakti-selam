import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OgleNamazi() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"sünnet" | "farz">("sünnet");

  return (
    <LinearGradient colors={["#0e1a2b", "#182c45", "#0e1a2b"]} style={styles.container}>
      {/* 🔹 Geri Butonu */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/namazlar/BesVakit")}>
        <Text style={styles.backText}>← Geri</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>☀️ Öğle Namazı</Text>
        <Text style={styles.subtitle}>Toplam 10 Rekat — 4 Sünnet + 4 Farz + 2 Sünnet</Text>

        {/* 🔹 Sekmeler */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "sünnet" && styles.activeTab]}
            onPress={() => setSelectedTab("sünnet")}
          >
            <Text style={styles.tabText}>🟢 Sünnet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "farz" && styles.activeTab]}
            onPress={() => setSelectedTab("farz")}
          >
            <Text style={styles.tabText}>🟡 Farz</Text>
          </TouchableOpacity>
        </View>

        {/* 🔸 Sünnet Bölümü */}
        {selectedTab === "sünnet" && (
          <View style={styles.contentBox}>
            <Text style={styles.sectionTitle}>🕌 4 Rekat İlk Sünnet</Text>
            <Text style={styles.dua}>
              “Niyet ettim Allah rızası için bugünkü öğle namazının ilk sünnetini kılmaya.”
            </Text>
            <Text style={styles.text}>
              1️⃣ **Birinci Rekat:** Niyet edilir, tekbir alınır, Sübhaneke, Fâtiha ve bir sure okunur, rükû ve iki secde yapılır.{"\n\n"}
              2️⃣ **İkinci Rekat:** Fâtiha ve bir sure okunur, oturulur, Ettehiyyatü okunur.{"\n\n"}
              3️⃣ ve 4️⃣ **Rekatlar:** Aynı şekilde kılınır, son oturuşta Salli, Barik ve Rabbena duaları okunur.{"\n"}
              Sağ ve sola selam verilerek sünnet tamamlanır.
            </Text>
            <Text style={styles.footer}>🌸 Sünnet, farza hazırlık ve kulluğun adabıdır.</Text>
          </View>
        )}

        {/* 🔸 Farz Bölümü */}
        {selectedTab === "farz" && (
          <View style={styles.contentBox}>
            <Text style={styles.sectionTitle}>🕋 4 Rekat Farz</Text>
            <Text style={styles.dua}>
              “Niyet ettim Allah rızası için bugünkü öğle namazının farzını kılmaya.”
            </Text>
            <Text style={styles.text}>
              1️⃣ ve 2️⃣ **Rekatlar:** Fâtiha ve bir sure okunur.{"\n"}
              3️⃣ ve 4️⃣ **Rekatlar:** Sadece Fâtiha okunur.{"\n\n"}
              Her rekatta rükû, iki secde yapılır.{"\n"}
              Son oturuşta “Ettehiyyatü, Allahumme Salli, Allahumme Barik ve Rabbena âtinâ” duaları okunur.{"\n"}
              Selam verilerek farz tamamlanır.
            </Text>
            <Text style={styles.footer}>☀️ Farz, Allah’ın emri olan asıl namazdır.</Text>
          </View>
        )}

        {/* 🔹 Geçiş Butonları */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#34495e" }]}
            onPress={() => router.push("/namazlar/BesVakit/SabahNamazi")}
          >
            <Text style={styles.navText}>← Sabah Namazı</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#f1c40f" }]}
            onPress={() => router.push("/namazlar/BesVakit/IkindiNamazi")}
          >
            <Text style={[styles.navText, { color: "#000" }]}>İkindi Namazı →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { alignItems: "center", paddingVertical: 40, paddingHorizontal: 25 },
  
  // 🔹 Geri Butonunun Stilleri
  backButton: {
    position: "absolute",
    top: 45,
    left: 20,
    backgroundColor: "rgba(241, 196, 15, 0.15)",
    borderWidth: 1,
    borderColor: "#f1c40f",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  backText: {
    color: "#f1c40f",
    fontSize: 16,
    fontWeight: "bold",
  },

  title: {
    color: "#f1c40f",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: "#3ddc97",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    marginBottom: 25,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#f1c40f",
    borderRadius: 15,
  },
  tabText: {
    color: "white",
    fontWeight: "bold",
  },
  contentBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#f1c40f",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
    lineHeight: 26,
    textAlign: "center",
  },
  dua: {
    color: "#f1c40f",
    fontStyle: "italic",
    fontSize: 17,
    textAlign: "center",
    marginBottom: 15,
  },
  footer: {
    color: "#ccc",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 15,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginTop: 30,
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  navText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
