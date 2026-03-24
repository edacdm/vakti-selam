import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

export default function FarzNamazlar() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#0e1a2b", "#182c45", "#0e1a2b"]} style={styles.container}>

      {/* 🔹 Geri Butonu */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push("/NamazHocasi")}>
              <Text style={styles.backText}>← Geri</Text>
            </TouchableOpacity>

      {/* Başlık */}
      <Text style={styles.title}>🌟 Farz Namazlar</Text>
      <Text style={styles.subtitle}>Cuma ve Cenaze namazları</Text>

      {/* Kartların yan yana olduğu grid */}
      <View style={styles.grid}>
        
        {/* Cuma Namazı */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/namazlar/FarzNamazlar/Cuma")}
        >
          <LinearGradient
            colors={["#192841", "#0e1a2b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardInner}
          >
            <Text style={styles.icon}>🕌</Text>
            <Text style={styles.cardTitle}>Cuma Namazı</Text>
            <Text style={styles.cardDesc}>Hutbeli farz namaz</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Cenaze Namazı */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/namazlar/FarzNamazlar/Cenaze")}
        >
          <LinearGradient
            colors={["#192841", "#0e1a2b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardInner}
          >
            <Text style={styles.icon}>🕊</Text>
            <Text style={styles.cardTitle}>Cenaze Namazı</Text>
            <Text style={styles.cardDesc}>Farz-ı kifaye</Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },

  /* Geri butonu */
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
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
    fontSize: 26,
    color: "#f1c40f",
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    color: "#d1d8e0",
    fontSize: 14,
    marginBottom: 25,
    marginTop: 6,
  },

  /* Kart düzeni — yanında yan */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },

  card: {
    width: width * 0.42,
    height: 150,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#101b2a",
    elevation: 5,
  },

  cardInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#f1c40f",
  },

  icon: {
    fontSize: 30,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f1c40f",
  },
  cardDesc: {
    fontSize: 12,
    color: "#dfe6e9",
    marginTop: 5,
  },
});
