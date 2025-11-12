import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function IkindiNamazi() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"sünnet" | "farz">("sünnet");

  return (
    <LinearGradient colors={["#0e1a2b", "#182c45", "#0e1a2b"]} style={styles.container}>
      
      {/* 🔹 Geri Butonu */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/namazlar/BesVakit")}>
        <Text style={styles.backText}>← Geri</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🌇 İkindi Namazı</Text>
        <Text style={styles.subtitle}>Toplam 8 Rekat — 4 Sünnet + 4 Farz</Text>

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
            <Text style={styles.sectionTitle}>🕌 4 Rekat Sünnet</Text>
            <Text style={styles.dua}>
              “Niyet ettim Allah rızası için bugünkü ikindi namazının sünnetini kılmaya.”
            </Text>
            <Text style={styles.text}>
              1️⃣ **Birinci Rekat:** Niyet edilir, iftitah tekbiri alınır,{" "}
              Sübhaneke okunur, ardından Fâtiha ve bir sure okunur.{"\n"}
              Rükû ve secdeler yapılır.{"\n\n"}
              2️⃣ **İkinci Rekat:** Fâtiha ve bir sure okunur, oturulur ve “Ettehiyyatü” okunur.{"\n"}
              Sonra üçüncü rekata kalkılır.{"\n\n"}
              3️⃣ ve 4️⃣ **Rekatlar:** Fâtiha ve bir sure okunur.{"\n"}
              Son oturuşta “Ettehiyyatü, Salli, Barik, Rabbena âtinâ” okunur, selam verilir.{"\n\n"}
              🌿 Bu sünnet, kuvvetli sünnettir; terk edilmemesi tavsiye edilir.
            </Text>
          </View>
        )}

        {/* 🔸 Farz Bölümü */}
        {selectedTab === "farz" && (
          <View style={styles.contentBox}>
            <Text style={styles.sectionTitle}>🕋 4 Rekat Farz</Text>
            <Text style={styles.dua}>
              “Niyet ettim Allah rızası için bugünkü ikindi namazının farzını kılmaya.”
            </Text>
            <Text style={styles.text}>
              1️⃣ ve 2️⃣ **Rekatlar:** Fâtiha ve bir sure okunur.{"\n"}
              3️⃣ ve 4️⃣ **Rekatlarda:** yalnızca Fâtiha okunur.{"\n"}
              Her rekatta rükû ve secde yapılır.{"\n\n"}
              Son oturuşta “Ettehiyyatü, Salli, Barik, Rabbena âtinâ” duaları okunur.{"\n"}
              Sağ ve sola selam verilerek namaz tamamlanır.{"\n\n"}
              🌤️ İkindi namazı sessiz (gizli) olarak kılınır.
            </Text>
          </View>
        )}

        {/* 🔹 Geçiş Butonları */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#34495e" }]}
            onPress={() => router.push("/namazlar/BesVakit/OgleNamazi")}
          >
            <Text style={styles.navText}>← Öğle Namazı</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#f1c40f" }]}
            onPress={() => router.push("/namazlar/BesVakit/AksamNamazi")}
          >
            <Text style={[styles.navText, { color: "#000" }]}>Akşam Namazı →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { alignItems: "center", paddingVertical: 40, paddingHorizontal: 25 },

  // 🔹 Geri Butonu Stilleri
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
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginTop: 30,
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  navText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
