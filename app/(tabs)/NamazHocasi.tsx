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
import { Colors } from "../../constants/Colors";
import { useTranslation } from "../../i18n";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const STARDUST_COUNT = 20;
const Stardust = () => {
  const [particles] = useState(() => 
    Array.from({ length: STARDUST_COUNT }).map((_, i) => ({
      x: new Animated.Value(Math.random() * SCREEN_WIDTH),
      y: new Animated.Value(Math.random() * SCREEN_HEIGHT),
      opacity: new Animated.Value(Math.random() * 0.5),
      scale: new Animated.Value(Math.random() * 0.8 + 0.2),
      duration: 15000 + Math.random() * 20000,
      color: i % 2 === 0 ? Colors.luxury.gold : "#FFF",
    }))
  );

  useEffect(() => {
    particles.forEach(p => {
      const animate = () => {
        p.y.setValue(SCREEN_HEIGHT + 20);
        Animated.parallel([
          Animated.timing(p.y, {
            toValue: -50,
            duration: p.duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(p.opacity, { toValue: 0.8, duration: p.duration / 2, useNativeDriver: true }),
            Animated.timing(p.opacity, { toValue: 0, duration: p.duration / 2, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(p.scale, { toValue: 1.2, duration: p.duration / 2, useNativeDriver: true }),
            Animated.timing(p.scale, { toValue: 0.4, duration: p.duration / 2, useNativeDriver: true }),
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
            transform: [
              { translateX: p.x },
              { translateY: p.y },
              { scale: p.scale }
            ],
            shadowColor: p.color,
            shadowRadius: 6,
            shadowOpacity: 0.9,
          }}
        />
      ))}
    </View>
  );
};

export default function NamazHocasi() {
  const router = useRouter();
  const { t } = useTranslation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const mandalaRotation = useRef(new Animated.Value(0)).current;
  const heroPulse = useRef(new Animated.Value(1)).current;
  const fadeAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(mandalaRotation, {
        toValue: 1,
        duration: 200000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.spring(heroPulse, { toValue: 1.02, friction: 5, tension: 20, useNativeDriver: true }),
        Animated.spring(heroPulse, { toValue: 1, friction: 5, tension: 20, useNativeDriver: true }),
      ])
    ).start();

    Animated.stagger(120, 
      fadeAnims.map(anim => 
        Animated.spring(anim, { toValue: 1, friction: 7, tension: 35, useNativeDriver: true })
      )
    ).start();
  }, []);

  const renderCard = (icon: any, title: string, desc: string, path: string, index: number) => (
    <Animated.View style={[
      styles.cardContainer,
      { 
        opacity: fadeAnims[index],
        transform: [
          { translateY: fadeAnims[index].interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
          { scale: fadeAnims[index].interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }
        ]
      }
    ]}>
      <TouchableOpacity 
        style={styles.cardWrapper} 
        onPress={() => router.push(path as any)}
        activeOpacity={0.85}
      >
        <BlurView intensity={25} tint="dark" style={styles.card}>
          <LinearGradient
            colors={["rgba(212, 175, 55, 0.2)", "transparent", "rgba(11, 16, 30, 0.4)"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.cardIconBox}>
             <MaterialCommunityIcons name={icon} size={34} color={Colors.luxury.gold} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{desc}</Text>
          </View>
          <View style={styles.cardAction}>
             <Ionicons name="chevron-forward" size={22} color={Colors.luxury.gold} />
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [50, 150],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const mandalaTranslateY = scrollY.interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [0, SCREEN_HEIGHT * 0.15],
  });

  return (
    <LinearGradient 
      colors={[Colors.luxury.midnight, Colors.luxury.midnightDeep, "#04060b"]} 
      style={styles.container}
    >
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
          source={require("../../assets/images/mandala_bg.png")}
          style={styles.mandalaImage}
          imageStyle={{ opacity: 0.05 }}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={[styles.navHeader, { opacity: headerOpacity }]}>
        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
        <Text style={styles.navTitle}>{t("prayerTeacher")}</Text>
      </Animated.View>

      <SafeAreaView style={styles.mainContainer}>
        <ScrollView 
          contentContainerStyle={styles.scrollItems}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.heroSection}>
            <Text style={styles.supTitle}>{t("worshipGuide")}</Text>
            <Text style={styles.titleMain}>{t("prayerTeacher")}</Text>
          </View>

          <Animated.View style={{ transform: [{ scale: heroPulse }] }}>
            <BlurView intensity={35} tint="light" style={styles.heroBox}>
              <View style={styles.auraGlow} />
              <View style={styles.heroTopRow}>
                <View style={styles.heroIconWrapper}>
                  <MaterialCommunityIcons name="mosque" size={48} color={Colors.luxury.gold} />
                  <View style={styles.iconGlow} />
                </View>
                <View style={styles.heroTextRow}>
                  <Text style={styles.heroLabelText}>{t("prayerTeacher")}</Text>
                  <Text style={styles.heroSubText}>{t("stepByStep")}</Text>
                </View>
              </View>
              <View style={styles.goldenSeparator} />
              <Text style={styles.quoteText}>{t("prayerTeacherQuote")}</Text>
            </BlurView>
          </Animated.View>

          <View style={styles.cardsGrid}>
            {renderCard("clock-outline", t("fiveDailyPrayers"), t("fiveDailyPrayersDesc"), "/namazlar/BesVakit", 0)}
            {renderCard("book-open-variant", t("fardPrayers"), t("fardPrayersDesc"), "/namazlar/FarzNamazlar", 1)}
            {renderCard("star-outline", t("wajibPrayers"), t("wajibPrayersDesc"), "/namazlar/VacipNamazlar", 2)}
            {renderCard("heart-outline", t("nafilPrayers"), t("nafilPrayersDesc"), "/namazlar/NafileNamazlar", 3)}
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContainer: { flex: 1 },
  mandalaLayer: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center", zIndex: 0 },
  mandalaImage: { width: SCREEN_WIDTH * 1.6, height: SCREEN_WIDTH * 1.6 },
  navHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    zIndex: 100,
    justifyContent: "flex-end",
    paddingBottom: 15,
    alignItems: "center",
  },
  navTitle: { color: Colors.luxury.gold, fontSize: 19, fontWeight: "600", letterSpacing: 1.5, textTransform: "uppercase" },
  scrollItems: { paddingHorizontal: 24, paddingTop: 40 },
  heroSection: { marginBottom: 25 },
  supTitle: { color: Colors.luxury.gold, fontSize: 12, fontWeight: "700", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8, opacity: 0.8 },
  titleMain: { color: "#FFF", fontSize: 30, fontWeight: "200", letterSpacing: 1 },
  heroBox: { 
    borderRadius: 28, 
    padding: 20, 
    marginBottom: 30, 
    borderWidth: 1.2, 
    borderColor: "rgba(212, 175, 55, 0.4)", 
    overflow: "hidden",
    shadowColor: Colors.luxury.gold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  auraGlow: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.luxury.gold,
    opacity: 0.06,
  },
  heroTopRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  heroIconWrapper: { 
    width: 72, 
    height: 72, 
    borderRadius: 22, 
    backgroundColor: "rgba(11, 16, 30, 0.85)", 
    justifyContent: "center", 
    alignItems: "center", 
    borderWidth: 1, 
    borderColor: "rgba(212, 175, 55, 0.35)",
    marginRight: 20 
  },
  iconGlow: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.luxury.gold,
    opacity: 0.08,
    zIndex: -1,
  },
  heroTextRow: { flex: 1 },
  heroLabelText: { color: "#FFF", fontSize: 20, fontWeight: "700", marginBottom: 4 },
  heroSubText: { color: Colors.luxury.gold, fontSize: 13, fontWeight: "500", letterSpacing: 0.4 },
  goldenSeparator: { height: 1.2, backgroundColor: "rgba(212, 175, 55, 0.25)", width: "100%", marginVertical: 18 },
  quoteText: { color: "rgba(255, 255, 255, 0.7)", fontSize: 14, fontStyle: "italic", lineHeight: 22, textAlign: "center", fontWeight: "300" },
  cardsGrid: { gap: 20 },
  cardContainer: { width: "100%" },
  cardWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  card: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 18, 
    borderWidth: 1, 
    borderColor: "rgba(212, 175, 55, 0.15)",
  },
  cardIconBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    backgroundColor: "rgba(212, 175, 55, 0.1)", 
    justifyContent: "center", 
    alignItems: "center",
    marginRight: 16,
    shadowColor: Colors.luxury.gold,
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  cardContent: { flex: 1 },
  cardTitle: { color: "#FFF", fontSize: 16, fontWeight: "600", marginBottom: 2, letterSpacing: 0.5 },
  cardDesc: { color: "rgba(255, 255, 255, 0.5)", fontSize: 12, lineHeight: 16, fontWeight: "400" },
  cardAction: { paddingLeft: 12 },
});