import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
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
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useTranslation } from "../../i18n";
import type { TranslationKeys } from "../../i18n";
import { Colors } from "../../constants/Colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ZIKIR_KEYS: TranslationKeys[] = ["dhikrSubhanallah", "dhikrAlhamdulillah", "dhikrAllahuAkbar", "dhikrLaIlaha"];

const STARDUST_COUNT = 15;
const Stardust = () => {
  const [particles] = useState(() => 
    Array.from({ length: STARDUST_COUNT }).map(() => ({
      x: new Animated.Value(Math.random() * SCREEN_WIDTH),
      y: new Animated.Value(Math.random() * SCREEN_HEIGHT),
      opacity: new Animated.Value(Math.random()),
      size: Math.random() * 3 + 1,
    }))
  );

  useEffect(() => {
    particles.forEach(p => {
      const animate = () => {
        Animated.parallel([
          Animated.timing(p.y, {
            toValue: -50,
            duration: 15000 + Math.random() * 10000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(p.opacity, { toValue: 0.8, duration: 2000, useNativeDriver: true }),
            Animated.timing(p.opacity, { toValue: 0.2, duration: 2000, useNativeDriver: true }),
          ])
        ]).start(() => {
          p.y.setValue(SCREEN_HEIGHT + 50);
          p.x.setValue(Math.random() * SCREEN_WIDTH);
          animate();
        });
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
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: Colors.luxury.gold,
            opacity: p.opacity,
            transform: [{ translateX: p.x }, { translateY: p.y }],
            shadowColor: Colors.luxury.gold,
            shadowRadius: 5,
            shadowOpacity: 0.5,
          }}
        />
      ))}
    </View>
  );
};

export default function Zikirmatik() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const mandalaRotation = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const savedCounts = await AsyncStorage.getItem("zikirCounts");
        const savedTab = await AsyncStorage.getItem("activeTabIdx");
        if (savedCounts !== null) setCounts(JSON.parse(savedCounts));
        if (savedTab !== null) setActiveTabIdx(parseInt(savedTab, 10));
      } catch (error) { }
    };
    loadData();

    // Mandala Continuous Rotation
    Animated.loop(
      Animated.timing(mandalaRotation, {
        toValue: 1,
        duration: 120000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  useEffect(() => {
    const saveData = async (): Promise<void> => {
      try {
        await AsyncStorage.setItem("zikirCounts", JSON.stringify(counts));
        await AsyncStorage.setItem("activeTabIdx", activeTabIdx.toString());
      } catch (error) { }
    };
    saveData();
  }, [counts, activeTabIdx]);

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  const playSound = async (): Promise<void> => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("../../assets/click.mp3.mp3")
      );
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) { }
  };

  const handleIncrement = async (): Promise<void> => {
    const currentCount = counts[activeTabIdx] || 0;
    const newCount = currentCount + 1;
    
    setCounts(prev => ({ ...prev, [activeTabIdx]: newCount }));

    // Interaction Animation
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 0.9, duration: 50, useNativeDriver: true }),
      Animated.spring(scaleValue, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ])
    ]).start();

    await playSound();

    if (newCount % 33 === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleReset = (): void => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setCounts(prev => ({ ...prev, [activeTabIdx]: 0 }));
  };

  const handleGoBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const currentCount = counts[activeTabIdx] || 0;
  const currentCycle: number = currentCount > 0 && currentCount % 33 === 0 ? 33 : currentCount % 33;
  const progressPercent: number = (currentCycle / 33) * 100;

  const LuxuryCard = ({ children, title, icon }: { children: React.ReactNode, title?: string, icon?: any }) => (
    <View style={styles.luxuryCardWrapper}>
      <LinearGradient colors={["rgba(212, 175, 55, 0.25)", "rgba(212, 175, 55, 0.05)"]} style={styles.goldBorder} />
      <BlurView intensity={25} tint="dark" style={styles.luxuryCardInner}>
        {title && (
          <View style={styles.cardHeader}>
            <View style={styles.headerDot} />
            <Text style={styles.cardTitle}>{title.toUpperCase()}</Text>
            {icon && <MaterialCommunityIcons name={icon} size={18} color={Colors.luxury.gold} />}
          </View>
        )}
        {children}
      </BlurView>
    </View>
  );

  return (
    <LinearGradient colors={[Colors.luxury.midnight, Colors.luxury.midnightDeep]} style={styles.container}>
      <Stardust />
      
      <Animated.View style={[
        StyleSheet.absoluteFill, 
        {
          transform: [{ 
            rotate: mandalaRotation.interpolate({ 
              inputRange: [0, 1], 
              outputRange: ["0deg", "360deg"] 
            }) 
          }]
        }
      ]}>
        <ImageBackground
          source={require("../../assets/images/mandala_bg.png")}
          style={StyleSheet.absoluteFill}
          imageStyle={styles.mandalaImage}
          resizeMode="contain"
        />
      </Animated.View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={24} color={Colors.luxury.gold} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.supTitle}>{t("dhikrTitle")}</Text>
            <View style={styles.goldDot} />
          </View>
          <TouchableOpacity style={styles.iconBtn} onPress={handleReset}>
            <Ionicons name="refresh" size={20} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {ZIKIR_KEYS.map((key, idx) => {
              const active = idx === activeTabIdx;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setActiveTabIdx(idx)}
                  style={[styles.tabChip, active && styles.activeTabChip]}
                >
                  <Text style={[styles.tabChipText, active && styles.activeTabChipText]}>
                    {t(key)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.content}>
          <LuxuryCard title={t(ZIKIR_KEYS[activeTabIdx])} icon="finger-print">
            <View style={styles.counterArea}>
              <Text style={styles.counterValue}>{currentCount}</Text>
              <View style={styles.targetRow}>
                <Ionicons name="repeat" size={14} color={Colors.luxury.gold} style={{marginRight: 6}} />
                <Text style={styles.targetText}>{currentCycle} / 33</Text>
              </View>
            </View>
          </LuxuryCard>

          <View style={styles.dialContainer}>
            <View style={styles.dialOuterRing}>
              <LinearGradient 
                colors={["rgba(212, 175, 55, 0.4)", "transparent"]} 
                style={styles.dialGlow}
              />
              
              <View style={styles.dialInner}>
                <ImageBackground 
                  source={require("../../assets/images/mandala_bg.png")}
                  style={styles.dialMandala}
                  imageStyle={{ opacity: 0.15 }}
                >
                  <TouchableWithoutFeedback onPress={handleIncrement}>
                    <Animated.View style={[styles.beadButton, { transform: [{ scale: scaleValue }] }]}>
                      <BlurView intensity={30} tint="dark" style={styles.innerBead}>
                        <LinearGradient
                          colors={["#D4AF37", "#996515"]}
                          style={StyleSheet.absoluteFill}
                        />
                        <Ionicons name="finger-print" size={52} color="rgba(11, 16, 30, 0.9)" />
                      </BlurView>
                    </Animated.View>
                  </TouchableWithoutFeedback>
                </ImageBackground>
              </View>

              <View style={[
                styles.dialOrbitDot, 
                { 
                  transform: [
                    { rotate: `${(progressPercent * 3.6) - 90}deg` }, 
                    { translateX: 110 } 
                  ] 
                }
              ]} />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
           <Text style={styles.footerText}>{t("dhikrTarget")}: 33</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mandalaImage: { opacity: 0.08, position: "absolute", top: 100, right: -150, transform: [{ scale: 1.5 }] },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 10, marginBottom: 20 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(212, 175, 55, 0.1)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.2)" },
  titleWrapper: { alignItems: "center" },
  supTitle: { color: "#FFF", fontSize: 16, fontWeight: "300", letterSpacing: 3, textTransform: "uppercase" },
  goldDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.luxury.gold, marginTop: 4 },
  tabsContainer: { marginBottom: 30 },
  tabsScroll: { paddingHorizontal: 24, gap: 12 },
  tabChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: "rgba(255, 255, 255, 0.03)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.05)" },
  activeTabChip: { backgroundColor: "rgba(212, 175, 55, 0.12)", borderColor: "rgba(212, 175, 55, 0.4)" },
  tabChipText: { color: "rgba(255, 255, 255, 0.5)", fontSize: 13, fontWeight: "500" },
  activeTabChipText: { color: Colors.luxury.gold, fontWeight: "700" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  luxuryCardWrapper: { width: "100%", marginBottom: 40, position: "relative" },
  goldBorder: { position: "absolute", top: -1, left: -1, right: -1, bottom: -1, borderRadius: 24 },
  luxuryCardInner: { backgroundColor: Colors.luxury.midnightDeep, borderRadius: 23, padding: 25, overflow: "hidden" },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 15 },
  headerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.luxury.gold },
  cardTitle: { color: Colors.luxury.textGold, fontSize: 11, fontWeight: "800", letterSpacing: 3, flex: 1 },
  counterArea: { alignItems: "center" },
  counterValue: { color: "#FFF", fontSize: 64, fontWeight: "200", letterSpacing: -2, fontVariant: ["tabular-nums"] },
  targetRow: { flexDirection: "row", alignItems: "center", marginTop: 10, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: "rgba(212, 175, 55, 0.1)" },
  targetText: { color: Colors.luxury.gold, fontSize: 13, fontWeight: "600", letterSpacing: 1 },
  dialContainer: { alignItems: "center" },
  dialOuterRing: { width: 220, height: 220, borderRadius: 110, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.2)", justifyContent: "center", alignItems: "center", position: "relative" },
  dialGlow: { ...StyleSheet.absoluteFillObject, borderRadius: 110, opacity: 0.2 },
  dialInner: { width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(0,0,0,0.2)", overflow: "hidden", borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.1)" },
  dialMandala: { flex: 1, justifyContent: "center", alignItems: "center" },
  beadButton: { width: 140, height: 140, borderRadius: 70, overflow: "hidden" },
  innerBead: { flex: 1, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.2)" },
  dialOrbitDot: { position: "absolute", width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.luxury.gold, shadowColor: Colors.luxury.gold, shadowRadius: 10, shadowOpacity: 1, zIndex: 10 },
  footer: { paddingBottom: 20, alignItems: "center" },
  footerText: { color: "rgba(255, 255, 255, 0.2)", fontSize: 12, fontWeight: "700", letterSpacing: 2 },
});