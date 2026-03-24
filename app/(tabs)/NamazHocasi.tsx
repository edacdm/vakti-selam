import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

  useEffect(() => {
    bgProgress.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const animatedBg = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      bgProgress.value,
      [0, 1],
      ["#0B101E", "#15233E"]
    );
    return { backgroundColor: bgColor };
  });

  const goTo = (path: string): void => {
    router.push(path as any);
  };

  const renderCard = (
    path: string, 
    IconComponent: any, 
    iconName: string, 
    title: string, 
    desc: string
  ) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => goTo(path)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={["rgba(212, 175, 55, 0.1)", "rgba(212, 175, 55, 0.02)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardInner}
      >
        <IconComponent name={iconName} size={30} color="#D4AF37" style={styles.icon} />
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[styles.container, animatedBg]}>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.replace("/" as any)}>
            <Ionicons name="chevron-back" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="book-open-page-variant-outline" size={40} color="#D4AF37" />
          <Text style={styles.title}>Namaz Hocası</Text>
          <Text style={styles.subtitle}>Namazın her adımını öğrenmek için rehberiniz</Text>
        </View>

        <View style={styles.grid}>
          {renderCard(
            "/namazlar/BesVakit",
            MaterialCommunityIcons,
            "clock-time-four-outline",
            "Beş Vakit Namazlar",
            "Farz namazların ayrıntılı kılınışı"
          )}
          {renderCard(
            "/namazlar/FarzNamazlar",
            Ionicons,
            "star-outline",
            "Farz Namazlar",
            "İslam’ın direği olan namazlar"
          )}
          {renderCard(
            "/namazlar/VacipNamazlar",
            MaterialCommunityIcons,
            "star-shooting-outline",
            "Vacip Namazlar",
            "Bayram ve vitr namazlarıyla"
          )}
          {renderCard(
            "/namazlar/NafileNamazlar",
            Ionicons,
            "moon-outline",
            "Nafile Namazlar",
            "Teheccüd, kuşluk ve fazlası"
          )}
        </View>
        
      </SafeAreaView>
    </Animated.View>
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