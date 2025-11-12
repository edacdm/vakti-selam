import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const zikirs = ["SubhanAllah", "Alhamdulillah", "Allahu Akbar", "La ilahe illallah"];

type CountsType = {
  [key: string]: number;
};

export default function Zikirmatik() {
  const router = useRouter();
  const [selectedZikir, setSelectedZikir] = useState<string>(zikirs[0]);
  const [counts, setCounts] = useState<CountsType>(
    zikirs.reduce((acc, zikir) => {
      acc[zikir] = 0;
      return acc;
    }, {} as CountsType)
  );

  const bgProgress = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  // 🔹 Yumuşak koyu mavi-mor arka plan geçişi
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const animatedColor = interpolateColor(
      bgProgress.value,
      [0, 1],
      ["#0e1a2b", "#1e2f47"]
    );
    return { backgroundColor: animatedColor };
  });

  useEffect(() => {
    bgProgress.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [bgProgress]);

  const handleIncrement = () => {
    Haptics.selectionAsync();

    setCounts((prev) => ({
      ...prev,
      [selectedZikir]: prev[selectedZikir] + 1,
    }));

    buttonScale.value = withSequence(
      withTiming(0.92, { duration: 120 }),
      withTiming(1, { duration: 140 })
    );
  };

  const handleReset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setCounts((prev) => ({
      ...prev,
      [selectedZikir]: 0,
    }));
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Geri Butonu */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Geri</Text>
      </TouchableOpacity>

      {/* Zikir Seçimi */}
      <FlatList
        horizontal
        data={zikirs}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.zikirButton,
              item === selectedZikir && styles.selectedZikir,
            ]}
            onPress={() => setSelectedZikir(item)}
          >
            <Text
              style={[
                styles.zikirText,
                item === selectedZikir && styles.selectedZikirText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginBottom: 30 }}
      />

      {/* Zikirmatik Gövdesi */}
      <LinearGradient
        colors={["#192841", "#101b2a"]}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 0.8, y: 0.9 }}
        style={styles.deviceBody}
      >
        {/* Dijital ekran */}
        <View style={styles.screen}>
          <Text style={styles.screenText}>{counts[selectedZikir]}</Text>
        </View>

        {/* +1 Butonu */}
        <Animated.View style={[buttonAnimatedStyle]}>
          <TouchableOpacity
            style={styles.incrementButton}
            onPress={handleIncrement}
            activeOpacity={0.8}
          >
            <Text style={styles.incrementText}>+1</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      {/* Alt Butonlar */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>Sıfırla</Text>
        </TouchableOpacity>
        <Text style={styles.zikirName}>{selectedZikir}</Text>
      </View>
    </Animated.View>
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
    marginBottom: 10,
    backgroundColor: "#326292ff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  backText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  zikirButton: {
    marginHorizontal: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  selectedZikir: {
    backgroundColor: "#f1c40f",
  },
  zikirText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedZikirText: {
    color: "#2c3e50",
  },
  deviceBody: {
    width: 260,
    height: 340,
    borderRadius: 130,
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
  },
  screen: {
    width: 180,
    height: 75,
    backgroundColor: "#0c151f",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3ddc97",
  },
  screenText: {
    color: "#3ddc97",
    fontSize: 46,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  incrementButton: {
    backgroundColor: "#f1c40f",
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f1c40f",
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  incrementText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginTop: 30,
  },
  resetButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  resetText: {
    color: "white",
    fontWeight: "bold",
  },
  zikirName: {
    fontSize: 18,
    color: "#f1c40f",
    fontWeight: "600",
  },
});
