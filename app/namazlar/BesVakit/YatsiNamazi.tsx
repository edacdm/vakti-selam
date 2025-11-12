import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function YatsiNamazi() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"sünnet" | "farz" | "vitr">("sünnet");

  return (
    <LinearGradient colors={["#0e1a2b", "#182c45", "#0e1a2b"]} style={styles.container}>
        {/* 🔹 Geri Butonu */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/namazlar/BesVakit")}>
        <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🌌 Yatsı Namazı</Text>
        <Text style={styles.subtitle}>Toplam 11 Rekat — 4 Sünnet + 4 Farz + 3 Vitr Vacip</Text>

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
          <TouchableOpacity
            style={[styles.tab, selectedTab === "vitr" && styles.activeTab]}
            onPress={() => setSelectedTab("vitr")}
          >
            <Text style={styles.tabText}>🔵 Vitr Vacip</Text>
          </TouchableOpacity>
        </View>

        {/* 🔸 4 Rekat Sünnet */}
        {selectedTab === "sünnet" && (
          <View style={styles.contentBox}>
            <Text style={styles.sectionTitle}>🕌 4 Rekat Sünnet</Text>
            <Text style={styles.dua}>
              “Niyet ettim Allah rızası için bugünkü yatsı namazının ilk sünnetini kılmaya.”
            </Text>
            <Text style={styles.text}>
              1️⃣ **Birinci Rekat:** Niyet edilir, iftitah tekbiri alınır.{" "}
              Sübhaneke, Fâtiha ve bir sure okunur. Rükû, secde yapılır.{"\n\n"}
              2️⃣ **İkinci Rekat:** Fâtiha ve bir sure okunur, rükû ve secdelerden sonra oturulur,{" "}
              “Ettehiyyatü” okunur ve üçüncü rekata kalkılır.{"\n\n"}
              3️⃣ ve 4️⃣ **Rekatlar:** Fâtiha ve bir sure okunur.{" "}
              Son oturuşta “Ettehiyyatü, Salli, Barik, Rabbena âtinâ” okunur.{"\n"}
              Sağ ve sola selam verilerek sünnet tamamlanır.{"\n\n"}
              🌙 Bu sünnet, farzdan önce kılınır.
            </Text>
          </View>
        )}

        {/* 🔸 4 Rekat Farz */}
        {selectedTab === "farz" && (
          <View style={styles.contentBox}>
            <Text style={styles.sectionTitle}>🕋 4 Rekat Farz</Text>
            <Text style={styles.dua}>
              “Niyet ettim Allah rızası için bugünkü yatsı namazının farzını kılmaya.”
            </Text>
            <Text style={styles.text}>
              Yatsı namazının farzı **sesli (cehri)** olarak kılınır.{"\n\n"}
              1️⃣ ve 2️⃣ **Rekatlar:** Sübhaneke, Fâtiha ve bir sure okunur.{"\n"}
              3️⃣ ve 4️⃣ **Rekatlar:** Yalnızca Fâtiha okunur.{"\n\n"}
              Her rekatta rükû ve secdeler yapılır.{"\n"}
              Son oturuşta “Ettehiyyatü, Salli, Barik, Rabbena âtinâ” okunur.{"\n"}
              Sağ ve sola selam verilerek farz tamamlanır.{"\n\n"}
              🌠 Farzdan sonra vitir vacip namazı kılınır.
            </Text>
          </View>
        )}

        {/* 🔸 3 Rekat Vitr Vacip */}
        {selectedTab === "vitr" && (
          <View style={styles.contentBox}>
            <Text style={styles.sectionTitle}>🔵 3 Rekat Vitr Vacip</Text>
            <Text style={styles.dua}>
              “Niyet ettim Allah rızası için bugünkü vitir vacip namazını kılmaya.”
            </Text>
            <Text style={styles.text}>
              Vitr vacip namazı **gizli (sessiz)** kılınır ve sonunda kunut duaları okunur.{"\n\n"}
              1️⃣ ve 2️⃣ **Rekatlar:** Fâtiha ve bir sure okunur.{"\n"}
              2. rekatın sonunda oturulur, “Ettehiyyatü” okunur.{"\n\n"}
              3️⃣ **Rekat:** Fâtiha ve bir sure okunduktan sonra rükûya gitmeden eller kaldırılır,{" "}
              tekbir alınır ve kunut duaları okunur:{"\n"}
              “Allahümme innâ nesteînüke...” ve diğer kunut duaları.{"\n"}
              Ardından rükû ve secdeler yapılır.{"\n\n"}
              Son oturuşta dualar okunup selam verilerek tamamlanır.{"\n\n"}
              🌌 Vitr vacip namazı, yatsıdan sonra **gece namazlarının sonu olarak** kılınır.
            </Text>
            <Text style={styles.footer}>🌙 Peygamber Efendimiz (s.a.v.) vitir namazını hiç terk etmemiştir.</Text>
          </View>
        )}

        {/* 🔹 Geçiş Butonları */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#34495e" }]}
            onPress={() => router.push("/namazlar/BesVakit/AksamNamazi")}
          >
            <Text style={styles.navText}>← Akşam Namazı</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { alignItems: "center", paddingVertical: 40, paddingHorizontal: 25 },
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

  navText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
