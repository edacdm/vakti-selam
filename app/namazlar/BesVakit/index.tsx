import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

export default function BesVakit() {
  const router = useRouter();

  const renderCard = (
    path: string,
    iconName: any,
    title: string,
    desc: string
  ) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(path as any)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={["rgba(212, 175, 55, 0.1)", "rgba(212, 175, 55, 0.02)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardInner}
      >
        <MaterialCommunityIcons name={iconName} size={30} color="#D4AF37" style={styles.icon} />
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#0B101E", "#15233E"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="clock-time-four-outline" size={40} color="#D4AF37" />
          <Text style={styles.title}>Beş Vakit Namaz</Text>
          <Text style={styles.subtitle}>Farz namazların kılınış rehberi</Text>
        </View>

        <View style={styles.grid}>
          {renderCard(
            "/namazlar/BesVakit/SabahNamazi",
            "weather-sunset-up",
            "Sabah Namazı",
            "2 sünnet + 2 farz"
          )}
          {renderCard(
            "/namazlar/BesVakit/OgleNamazi",
            "white-balance-sunny",
            "Öğle Namazı",
            "4 sünnet + 4 farz + 2 sünnet"
          )}
          {renderCard(
            "/namazlar/BesVakit/IkindiNamazi",
            "weather-sunset-down",
            "İkindi Namazı",
            "4 sünnet + 4 farz"
          )}
          {renderCard(
            "/namazlar/BesVakit/AksamNamazi",
            "weather-sunset",
            "Akşam Namazı",
            "3 farz + 2 sünnet"
          )}
          {renderCard(
            "/namazlar/BesVakit/YatsiNamazi",
            "moon-waning-crescent",
            "Yatsı Namazı",
            "4 sünnet + 4 farz + 2 sünnet + 3 vitr"
          )}
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "flex-start",
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "300",
    color: "#E2E8F0",
    letterSpacing: 1.5,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 13,
    textAlign: "center",
    letterSpacing: 0.5,
    fontWeight: "400",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
  card: {
    width: width * 0.43,
    height: 125,
    borderRadius: 20,
    backgroundColor: "rgba(11, 16, 30, 0.8)",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
  },
  cardInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    padding: 12,
  },
  icon: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: "#D4AF37",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cardDesc: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 14,
  },
});