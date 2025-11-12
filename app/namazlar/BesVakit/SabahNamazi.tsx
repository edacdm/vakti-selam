import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SabahNamazi() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"sünnet" | "farz">("sünnet");

  return (
    <LinearGradient colors={["#0e1a2b", "#182c45", "#0e1a2b"]} style={styles.container}>
      {/* 🔹 Geri Butonu */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/namazlar/BesVakit")}>
        <Text style={styles.backText}>← Geri</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🌅 Sabah Namazı</Text>
        <Text style={styles.subtitle}>Toplam 4 Rekat — 2 Sünnet + 2 Farz</Text>

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
            <Text style={styles.sectionTitle}>🕌 2 Rekat Sünnet</Text>
            <Text style={styles.dua}>
              “Niyet ettim Allah rızası için bugünkü sabah namazının sünnetini kılmaya.”
            </Text>
            <Text style={styles.text}>
              Sabah namazının sünneti, farzdan önce kılınır ve **çok faziletli** kabul edilir.{"\n\n"}
              1️⃣ **Birinci Rekat:** Niyet edilir, iftitah tekbiri alınır, Sübhaneke okunur, ardından
              Fâtiha ve bir sure (örneğin Kâfirun) okunur.{"\n\n"}
              Rükû ve secdeler yapılır.{"\n\n"}
              2️⃣ **İkinci Rekat:** Fâtiha ve bir sure (örneğin İhlâs) okunur.{"\n"}
              Son oturuşta “Ettehiyyatü, Allahumme Salli, Allahumme Barik ve Rabbena âtinâ” duaları okunur.{"\n"}
              Sağ ve sola selam verilerek sünnet tamamlanır.
            </Text>
            <Text style={styles.footer}>🌸 Bu sünnet, Peygamber Efendimizin hiç terk etmediği bir sünnettir.</Text>
          </View>
        )}

        {/* 🔸 Farz Bölümü */}
        {selectedTab === "farz" && (
          <View style={styles.contentBox}>
            <Text style={styles.sectionTitle}>🕋 2 Rekat Farz</Text>
            <Text style={styles.dua}>
              “Niyet ettim Allah rızası için bugünkü sabah namazının farzını kılmaya.”
            </Text>
            <Text style={styles.text}>
              1️⃣ **Birinci Rekat:** Niyet edilir, Sübhaneke, Fâtiha ve bir sure okunur.{"\n"}
              Rükû, secde yapılır.{"\n\n"}
              2️⃣ **İkinci Rekat:** Fâtiha ve bir sure okunur.{"\n"}
              Son oturuşta dualar okunur: “Ettehiyyatü, Allahumme Salli, Allahumme Barik, Rabbena âtinâ.”{"\n"}
              Sağ ve sola selam verilerek namaz tamamlanır.{"\n\n"}
              Cemaatle kılınıyorsa imam sesli okur, cemaat dinler.
            </Text>
            <Text style={styles.footer}>☀️ Sabah namazı, günün başlangıcında kulluğu tazeleyen bir ibadettir.</Text>
          </View>
        )}

        {/* 🔹 Geçiş Butonları */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#34495e" }]}
            onPress={() => router.push("/namazlar/BesVakit/YatsiNamazi")}
          >
            <Text style={[styles.navText, { color: "#ffffffff" }]}>← Yatsı Namazı</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#f1c40f" }]}
            onPress={() => router.push("/namazlar/BesVakit/OgleNamazi")}
          >
            <Text style={[styles.navText, { color: "#000" }]}>Öğle Namazı →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { alignItems: "center", paddingVertical: 40, paddingHorizontal: 25 },
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
    width: "90%",
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
