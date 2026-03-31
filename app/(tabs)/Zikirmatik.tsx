import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useTranslation } from "../../i18n";
import type { TranslationKeys } from "../../i18n";

const ZIKIR_KEYS: TranslationKeys[] = ["dhikrSubhanallah", "dhikrAlhamdulillah", "dhikrAllahuAkbar", "dhikrLaIlaha"];

export default function Zikirmatik() {
  const router = useRouter();
  const { t } = useTranslation();
  
  // Revised state: Holds an object where keys are tab indices and values are counts
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const scaleValue = useRef<Animated.Value>(new Animated.Value(1)).current;
  const translateYValue = useRef<Animated.Value>(new Animated.Value(0)).current;

  // Load individual counts and the last active tab on mount
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const savedCounts = await AsyncStorage.getItem("zikirCounts");
        const savedTab = await AsyncStorage.getItem("activeTabIdx");
        if (savedCounts !== null) setCounts(JSON.parse(savedCounts));
        if (savedTab !== null) setActiveTabIdx(parseInt(savedTab, 10));
      } catch (error) {}
    };
    loadData();
  }, []);

  // Save changes to storage whenever counts or active tab change
  useEffect(() => {
    const saveData = async (): Promise<void> => {
      try {
        await AsyncStorage.setItem("zikirCounts", JSON.stringify(counts));
        await AsyncStorage.setItem("activeTabIdx", activeTabIdx.toString());
      } catch (error) {}
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
    } catch (error) {}
  };

  const handlePressIn = (): void => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.85,
        useNativeDriver: true,
      }),
      Animated.spring(translateYValue, {
        toValue: 45,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePressOut = (): void => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(translateYValue, {
        toValue: 0,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleIncrement = async (): Promise<void> => {
    const currentCount = counts[activeTabIdx] || 0;
    const newCount = currentCount + 1;
    
    // Update only the count for the active dhikr
    setCounts(prev => ({ ...prev, [activeTabIdx]: newCount }));

    await playSound();

    if (newCount % 33 === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.selectionAsync();
    }
  };

  const handleReset = (): void => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    // Reset only the current dhikr's count
    setCounts(prev => ({ ...prev, [activeTabIdx]: 0 }));
  };

  const handleTabChange = (idx: number): void => {
    setActiveTabIdx(idx);
    // Removed setCount(0) to maintain persistence across tabs
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
  const progressPercentage: number = (currentCycle / 33) * 100;

  return (
    <LinearGradient colors={["#0B101E", "#15233E"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={28} color="#D4AF37" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("dhikrTitle")}</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.tabs}>
          {ZIKIR_KEYS.map((key, idx) => {
            const active = idx === activeTabIdx;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.tab, active && styles.activeTab]}
                onPress={() => handleTabChange(idx)}
              >
                <Text style={[styles.tabText, active && styles.activeTabText]}>
                  {t(key)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.centerArea}>
          <View style={styles.counterScreen}>
            <Text style={styles.counterText}>{currentCount}</Text>
          </View>

          <View style={styles.progressWrapper}>
            <Text style={styles.progressText}>{t("dhikrTarget")}: {currentCycle} / 33</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
            </View>
          </View>

          <View style={styles.beadContainer}>
            <View style={styles.thread} />
            
            <TouchableWithoutFeedback 
              onPressIn={handlePressIn} 
              onPressOut={handlePressOut} 
              onPress={handleIncrement}
            >
              <Animated.View 
                style={[
                  styles.beadButton, 
                  { transform: [{ scale: scaleValue }, { translateY: translateYValue }] }
                ]}
              >
                <View style={styles.innerBead}>
                  <Ionicons name="finger-print-outline" size={48} color="#0B101E" />
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity style={styles.iconButton} onPress={handleReset}>
            <Ionicons name="refresh" size={24} color="#E2E8F0" />
          </TouchableOpacity>

          <View style={styles.activeTabDisplay}>
            <Ionicons name="moon-outline" size={16} color="#D4AF37" />
            <Text style={styles.activeText}>{t(ZIKIR_KEYS[activeTabIdx])}</Text>
          </View>

          <View style={{ width: 44 }} />
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, justifyContent: "space-between", paddingVertical: 20 },
  header: { flexDirection: "row", paddingHorizontal: 20, alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  iconButton: { width: 44, height: 44, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.1)" },
  headerTitle: { color: "#E2E8F0", fontSize: 20, fontWeight: "300", letterSpacing: 1.5 },
  tabs: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", gap: 10, paddingHorizontal: 15 },
  tab: { backgroundColor: "rgba(255, 255, 255, 0.03)", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: "transparent" },
  activeTab: { backgroundColor: "rgba(212, 175, 55, 0.1)", borderColor: "rgba(212, 175, 55, 0.3)" },
  tabText: { color: "#94A3B8", fontWeight: "500", fontSize: 14 },
  activeTabText: { color: "#D4AF37", fontWeight: "700" },
  centerArea: { alignItems: "center", marginTop: 20 },
  counterScreen: { backgroundColor: "rgba(212, 175, 55, 0.03)", borderColor: "rgba(212, 175, 55, 0.3)", borderWidth: 1, borderRadius: 24, paddingVertical: 25, paddingHorizontal: 50, marginBottom: 25, shadowColor: "#D4AF37", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  counterText: { color: "#D4AF37", fontSize: 56, fontWeight: "200", fontVariant: ["tabular-nums"] },
  progressWrapper: { alignItems: "center", marginBottom: 30 },
  progressText: { color: "#94A3B8", fontSize: 12, fontWeight: "600", letterSpacing: 2, marginBottom: 10 },
  progressContainer: { width: 220, height: 8, backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: 4, overflow: "hidden" },
  progressBar: { height: "100%", backgroundColor: "#D4AF37", borderRadius: 4 },
  beadContainer: { alignItems: "center", justifyContent: "center", height: 200, width: 150 },
  thread: { position: "absolute", width: 4, height: "100%", backgroundColor: "rgba(212, 175, 55, 0.2)", borderRadius: 2 },
  beadButton: { width: 150, height: 150, borderRadius: 75, backgroundColor: "#C5A028", alignItems: "center", justifyContent: "center", shadowColor: "#D4AF37", shadowOpacity: 0.4, shadowOffset: { width: 0, height: 8 }, shadowRadius: 15, elevation: 10 },
  innerBead: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#D4AF37", alignItems: "center", justifyContent: "center" },
  bottom: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 25, alignItems: "center", marginTop: 20 },
  activeTabDisplay: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(212, 175, 55, 0.05)", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, gap: 8 },
  activeText: { color: "#E2E8F0", fontWeight: "500", fontSize: 16, letterSpacing: 0.5 },
});