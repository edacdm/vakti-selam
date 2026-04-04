import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Colors } from "../../../constants/Colors";
import { useTranslation } from "../../../i18n";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const STARDUST_COUNT = 15;
const Stardust = () => {
  const [particles] = useState(() => 
    Array.from({ length: STARDUST_COUNT }).map((_, i) => ({
      x: new Animated.Value(Math.random() * SCREEN_WIDTH),
      y: new Animated.Value(Math.random() * SCREEN_HEIGHT),
      opacity: new Animated.Value(Math.random() * 0.4),
      scale: new Animated.Value(Math.random() * 0.7 + 0.3),
      duration: 18000 + Math.random() * 15000,
      color: i % 2 === 0 ? Colors.luxury.gold : "#FFF",
    }))
  );

  useEffect(() => {
    particles.forEach(p => {
      const animate = () => {
        p.y.setValue(SCREEN_HEIGHT + 20);
        Animated.parallel([
          Animated.timing(p.y, { toValue: -50, duration: p.duration, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(p.opacity, { toValue: 0.7, duration: p.duration / 2, useNativeDriver: true }),
            Animated.timing(p.opacity, { toValue: 0, duration: p.duration / 2, useNativeDriver: true }),
          ])
        ]).start(() => animate());
      };
      animate();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: p.color,
            opacity: p.opacity,
            transform: [{ translateX: p.x }, { translateY: p.y }, { scale: p.scale }],
            shadowColor: p.color, shadowRadius: 4, shadowOpacity: 0.8,
          }}
        />
      ))}
    </View>
  );
};

export default function FarzNamazlar() {
  const router = useRouter();
  const { t } = useTranslation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const mandalaRotation = useRef(new Animated.Value(0)).current;
  const fadeAnims = useRef([new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(mandalaRotation, { toValue: 1, duration: 220000, useNativeDriver: true })
    ).start();

    Animated.stagger(150, 
      fadeAnims.map(anim => 
        Animated.spring(anim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true })
      )
    ).start();
  }, []);

  const renderPrayerCard = (title: string, desc: string, path: string, index: number, badge: string) => (
    <Animated.View style={{ 
      opacity: fadeAnims[index],
      transform: [
        { translateX: fadeAnims[index].interpolate({ inputRange: [0, 1], outputRange: [25, 0] }) },
        { scale: fadeAnims[index].interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) }
      ]
    }}>
      <TouchableOpacity style={styles.cardWrapper} onPress={() => router.push(path as any)}>
        <BlurView intensity={25} tint="dark" style={styles.card}>
          <LinearGradient colors={["rgba(212, 175, 55, 0.15)", "transparent"]} style={StyleSheet.absoluteFill} />
          <View style={styles.cardIcon}>
             <MaterialCommunityIcons name="star-outline" size={30} color={Colors.luxury.gold} />
          </View>
          <View style={styles.cardText}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>{title}</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>
            </View>
            <Text style={styles.cardDesc}>{desc}</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={Colors.luxury.gold} />
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );

  const headerOpacity = scrollY.interpolate({ inputRange: [50, 150], outputRange: [0, 1], extrapolate: "clamp" });
  const mandalaTranslateY = scrollY.interpolate({ inputRange: [0, SCREEN_HEIGHT], outputRange: [0, SCREEN_HEIGHT * 0.1] });

  return (
    <LinearGradient colors={[Colors.luxury.midnight, Colors.luxury.midnightDeep, "#050810"]} style={styles.container}>
      <Stardust />
      
      <Animated.View style={[styles.mandalaLayer, { transform: [{ translateY: mandalaTranslateY }, { rotate: mandalaRotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }] }]}>
        <ImageBackground source={require("../../../assets/images/mandala_bg.png")} style={styles.mandala} imageStyle={{ opacity: 0.04 }} resizeMode="contain" />
      </Animated.View>

      <Animated.View style={[styles.navHeader, { opacity: headerOpacity }]}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <Text style={styles.navTitle}>{t("fardPrayers")}</Text>
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })} scrollEventThrottle={16}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.luxury.gold} />
          </TouchableOpacity>

          <View style={styles.hero}>
            <Text style={styles.heroTitle}>{t("fardPrayers")}</Text>
            <Text style={styles.heroSub}>{t("menuFarzHeroSubtitle")}</Text>
            <View style={styles.heroDivider} />
          </View>

          <BlurView intensity={30} tint="light" style={styles.quoteCard}>
            <Text style={styles.quoteText}>{t("menuFarzQuote")}</Text>
          </BlurView>

          <View style={styles.grid}>
            {renderPrayerCard(t("namazCuma"), t("namazCumaDesc"), "/namazlar/FarzNamazlar/Cuma", 0, t("badgeFarzIAyn"))}
            {renderPrayerCard(t("namazCenaze"), t("namazCenazeDesc"), "/namazlar/FarzNamazlar/Cenaze", 1, t("badgeFarzIKifaye"))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  mandalaLayer: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" },
  mandala: { width: SCREEN_WIDTH * 1.5, height: SCREEN_WIDTH * 1.5 },
  navHeader: { position: "absolute", top: 0, left: 0, right: 0, height: 100, zIndex: 100, justifyContent: "flex-end", paddingBottom: 15, alignItems: "center" },
  navTitle: { color: Colors.luxury.gold, fontSize: 18, fontWeight: "600", letterSpacing: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(212, 175, 55, 0.08)", justifyContent: "center", alignItems: "center", marginBottom: 15, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.3)", shadowColor: Colors.luxury.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  hero: { marginBottom: 20 },
  heroTitle: { color: "#FFF", fontSize: 26, fontWeight: "300", letterSpacing: 0.5 },
  heroSub: { color: Colors.luxury.gold, fontSize: 13, marginTop: 4, letterSpacing: 0.4, opacity: 0.8 },
  heroDivider: { width: 40, height: 1.2, backgroundColor: Colors.luxury.gold, marginTop: 12, opacity: 0.5 },
  quoteCard: { borderRadius: 20, padding: 18, marginBottom: 24, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.3)", overflow: "hidden" },
  quoteText: { color: "rgba(255, 255, 255, 0.7)", fontSize: 14, fontStyle: "italic", textAlign: "center", lineHeight: 22 },
  grid: { gap: 14 },
  cardWrapper: { borderRadius: 20, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10 },
  card: { flexDirection: "row", alignItems: "center", padding: 18, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.15)" },
  cardIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: "rgba(212, 175, 55, 0.1)", justifyContent: "center", alignItems: "center", marginRight: 16 },
  cardText: { flex: 1 },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  cardTitle: { color: "#FFF", fontSize: 16, fontWeight: "600", marginRight: 10 },
  badge: { backgroundColor: "rgba(212, 175, 55, 0.15)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { color: Colors.luxury.gold, fontSize: 9, fontWeight: "bold" },
  cardDesc: { color: "rgba(255, 255, 255, 0.5)", fontSize: 12 },
});
