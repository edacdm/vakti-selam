import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

// Android animasyonu aktif et
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function NamazHocasi() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === section ? null : section);
  };

  // 🌙 Parlama animasyonu
  const glow = useSharedValue(1);
  glow.value = withRepeat(withTiming(1.2, { duration: 2500, easing: Easing.inOut(Easing.sin) }), -1, true);

  const animatedGlow = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
    opacity: glow.value - 0.2,
  }));

  const sections = [
    {
      title: " Beş Vakit",
      color1: "#F9E79F",
      color2: "#D4AC0D",
      namazlar: ["Sabah Namazı", "Öğle Namazı", "İkindi Namazı", "Akşam Namazı", "Yatsı Namazı"],
    },
    {
      title: " Farz Namazlar",
      color1: "#A9C7FF",
      color2: "#4A6FA5",
      namazlar: ["Cuma Namazı", "Cenaze Namazı"],
    },
    {
      title: " Vacip Namazlar",
      color1: "#E2B0FF",
      color2: "#8E44AD",
      namazlar: ["Vitir Namazı", "Bayram Namazı"],
    },
    {
      title: " Nafile Namazlar",
      color1: "#9CE6B0",
      color2: "#16a085",
      namazlar: [
        "Teravih Namazı",
        "Teheccüd Namazı",
        "Evvabin Namazı",
        "Kuşluk Namazı",
        "Hacet Namazı",
        "Tövbe Namazı",
        "İstihare Namazı",
        "Yolculuk Namazı",
        "Tahıyyetü’l Mescid Namazı",
      ],
    },
  ];

  return (
    <LinearGradient colors={["#0b1423", "#1a2639", "#0b1423"]} style={styles.container}>
      {/* Geri Butonu */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Geri</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🕌 Namaz Hocası</Text>
      <Text style={styles.subtitle}>Hangi namazı öğrenmek istersin? </Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.grid}>
          {sections.map((section, index) => (
            <View key={index} style={styles.cardWrapper}>
              {/* Ana Kart */}
              <LinearGradient
                colors={[section.color1, section.color2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <TouchableOpacity onPress={() => toggleSection(section.title)} activeOpacity={0.85}>
                  <Animated.Text style={[styles.cardIcon, animatedGlow]}>
                    {section.title.split(" ")[0]}
                  </Animated.Text>
                  <Text style={styles.cardTitle}>{section.title.split(" ").slice(1).join(" ")}</Text>
                </TouchableOpacity>
              </LinearGradient>

              {/* Alt Liste */}
              {expanded === section.title && (
                <BlurView intensity={20} tint="dark" style={styles.dropdown}>
                  {section.namazlar.map((namaz, i) => (
                    <TouchableOpacity key={i} style={styles.namazButton}>
                      <Text style={styles.namazText}>{namaz}</Text>
                    </TouchableOpacity>
                  ))}
                </BlurView>
              )}
            </View>
          ))}
        </View>
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
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  backText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: {
    color: "#F9E79F",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
  },
  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 20,
  },
  scroll: {
    width: "90%",
    paddingBottom: 100,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 20,
  },
  card: {
    borderRadius: 18,
    paddingVertical: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  cardIcon: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 4,
  },
  cardTitle: {
    color: "#0b1423",
    fontWeight: "700",
    fontSize: 16,
  },
  dropdown: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  namazButton: {
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  namazText: {
    color: "#f8f8f8",
    fontSize: 15,
  },
});
