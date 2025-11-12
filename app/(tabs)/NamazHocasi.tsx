import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    Easing,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function NamazHocasi() {
  const router = useRouter();
  const bgProgress = useSharedValue(0);

  React.useEffect(() => {
    bgProgress.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const animatedBg = useAnimatedStyle(() => {
    const bgColor = interpolateColor(bgProgress.value, [0, 1], ["#0e1a2b", "#1e2f47"]);
    return { backgroundColor: bgColor };
  });

  const goTo = (path: string) => {
    router.push(path as any);
  };

  return (
    <Animated.View style={[styles.container, animatedBg]}>
      {/* 🔙 Geri Butonu */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Geri</Text>
      </TouchableOpacity>

      {/* Başlık */}
      <Text style={styles.title}>🕌 Namaz Hocası</Text>
      <Text style={styles.subtitle}>Namazın her adımını öğrenmek için rehberiniz.</Text>

      {/* Buton Alanı */}
      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => goTo("/namazlar/BesVakit")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#192841", "#0e1a2b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardInner}
          >
            <Text style={styles.icon}>🕋</Text>
            <Text style={styles.cardTitle}>Beş Vakit Namazlar</Text>
            <Text style={styles.cardDesc}>Farz namazların ayrıntılı kılınışı</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => goTo("/namazlar/FarzNamazlar")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#192841", "#0e1a2b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardInner}
          >
            <Text style={styles.icon}>🌟</Text>
            <Text style={styles.cardTitle}>Farz Namazlar</Text>
            <Text style={styles.cardDesc}>İslam’ın direği olan namazlar</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => goTo("/namazlar/VacipNamazlar")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#192841", "#0e1a2b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardInner}
          >
            <Text style={styles.icon}>💫</Text>
            <Text style={styles.cardTitle}>Vacip Namazlar</Text>
            <Text style={styles.cardDesc}>Bayram ve vitr namazlarıyla birlikte</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => goTo("/namazlar/NafileNamazlar")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#192841", "#0e1a2b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardInner}
          >
            <Text style={styles.icon}>🌙</Text>
            <Text style={styles.cardTitle}>Nafile Namazlar</Text>
            <Text style={styles.cardDesc}>Teheccüd, kuşluk, evvabin ve daha fazlası</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#f1c40f",
    marginBottom: 8,
  },
  subtitle: {
    color: "#d1d8e0",
    fontSize: 15,
    marginBottom: 28,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  card: {
    width: width * 0.4,
    height: 170,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#101b2a",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
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
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: "#f1c40f",
    fontWeight: "bold",
    textAlign: "center",
  },
  cardDesc: {
    fontSize: 12,
    color: "#dfe6e9",
    textAlign: "center",
    marginTop: 6,
  },
});
