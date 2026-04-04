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
      scale: new Animated.Value(Math.random() * 0.6 + 0.4),
      duration: 15000 + Math.random() * 10000,
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
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: p.color,
            opacity: p.opacity,
            transform: [{ translateX: p.x }, { translateY: p.y }, { scale: p.scale }],
          }}
        />
      ))}
    </View>
  );
};

export default function SabahNamazi() {
  const router = useRouter();
  const { t } = useTranslation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const mandalaRotation = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Actual steps for Sabah Namazi (Simplified for UI alignment, usually has more steps)
  const steps = [
    { title: t("namazSabah") + " - 1. Rekat", action: "Niyet ve Tekbir", desc: "Niyet ettim Allah rızası için sabah namazının sünnetini kılmaya." },
    { title: "Kıyam ve Kıraat", action: "Sübhaneke, Fatiha ve Sure", desc: "Eller bağlanır, dualar okunur." },
    { title: "Rüku", action: "Sübhane Rabbiyel Azim", desc: "Eğilerek tesbihat yapılır." },
    { title: "Secde", action: "Sübhane Rabbiyel Ala", desc: "Yere kapanarak tesbihat yapılır." },
  ];

  useEffect(() => {
    Animated.loop(
      Animated.timing(mandalaRotation, {
        toValue: 1,
        duration: 250000,
        useNativeDriver: true,
      })
    ).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [50, 150],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const mandalaTranslateY = scrollY.interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [0, SCREEN_HEIGHT * 0.12],
  });

  return (
    <LinearGradient colors={[Colors.luxury.midnight, Colors.luxury.midnightDeep, "#03050a"]} style={styles.container}>
      <Stardust />
      
      <Animated.View style={[
        styles.mandalaLayer,
        {
          transform: [
            { translateY: mandalaTranslateY },
            { 
              rotate: mandalaRotation.interpolate({ 
                inputRange: [0, 1], 
                outputRange: ["0deg", "360deg"] 
              }) 
            }
          ]
        }
      ]}>
        <ImageBackground
          source={require("../../../assets/images/mandala_bg.png")}
          style={styles.mandala}
          imageStyle={{ opacity: 0.035 }}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={[styles.navHeader, { opacity: headerOpacity }]}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <Text style={styles.navTitle}>{t("namazSabah")}</Text>
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.luxury.gold} />
            </TouchableOpacity>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>SÜNNET</Text>
            </View>
          </View>

          <View style={styles.hero}>
            <Text style={styles.heroTitle}>{t("namazSabah")}</Text>
            <Text style={styles.heroSub}>2 Rekat Sünnet + 2 Rekat Farz</Text>
          </View>

          {steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepIndicator}>
                <View style={styles.stepLine} />
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
              </View>
              
              <TouchableOpacity activeOpacity={0.9} style={styles.stepCardWrapper}>
                <BlurView intensity={20} tint="light" style={styles.stepCard}>
                  <LinearGradient
                    colors={["rgba(212, 175, 55, 0.12)", "transparent"]}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <View style={styles.actionBox}>
                    <Text style={styles.actionText}>{step.action}</Text>
                  </View>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                  
                  <View style={styles.stepFooter}>
                    <MaterialCommunityIcons name="gesture-double-tap" size={16} color={Colors.luxury.gold} style={{opacity: 0.5}} />
                    <Text style={styles.footerText}>Detay için dokun</Text>
                  </View>
                </BlurView>
              </TouchableOpacity>
            </View>
          ))}

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
  mandala: { width: SCREEN_WIDTH * 1.6, height: SCREEN_WIDTH * 1.6 },
  navHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 100,
    justifyContent: "flex-end",
    paddingBottom: 15,
    alignItems: "center",
  },
  navTitle: { color: Colors.luxury.gold, fontSize: 18, fontWeight: "600", letterSpacing: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(212, 175, 55, 0.08)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.3)", shadowColor: Colors.luxury.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  badge: { backgroundColor: "rgba(212, 175, 55, 0.15)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.3)" },
  badgeText: { color: Colors.luxury.gold, fontSize: 11, fontWeight: "bold", letterSpacing: 1 },
  hero: { marginBottom: 30 },
  heroTitle: { color: "#FFF", fontSize: 32, fontWeight: "300", letterSpacing: 1 },
  heroSub: { color: Colors.luxury.gold, fontSize: 14, marginTop: 6, opacity: 0.8, letterSpacing: 0.5 },
  stepContainer: { flexDirection: "row", marginBottom: 24 },
  stepIndicator: { alignItems: "center", marginRight: 20, width: 30 },
  stepLine: { position: "absolute", top: 0, bottom: -24, width: 2, backgroundColor: "rgba(212, 175, 55, 0.2)" },
  stepCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.luxury.gold, justifyContent: "center", alignItems: "center", shadowColor: Colors.luxury.gold, shadowRadius: 8, shadowOpacity: 0.5 },
  stepNumber: { color: Colors.luxury.midnight, fontSize: 14, fontWeight: "bold" },
  stepCardWrapper: { flex: 1, borderRadius: 24, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 },
  stepCard: { padding: 22, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.2)" },
  stepTitle: { color: "rgba(255, 255, 255, 0.6)", fontSize: 13, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 },
  actionBox: { backgroundColor: "rgba(212, 175, 55, 0.1)", alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginBottom: 15, borderLeftWidth: 3, borderLeftColor: Colors.luxury.gold },
  actionText: { color: "#FFF", fontSize: 18, fontWeight: "700" },
  stepDesc: { color: "rgba(255, 255, 255, 0.5)", fontSize: 14, lineHeight: 22 },
  stepFooter: { flexDirection: "row", alignItems: "center", marginTop: 18, paddingTop: 15, borderTopWidth: 1, borderTopColor: "rgba(255, 255, 255, 0.05)" },
  footerText: { color: Colors.luxury.gold, fontSize: 12, marginLeft: 8, opacity: 0.6, fontWeight: "500" },
});