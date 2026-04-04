import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, ImageBackground, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/Colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function VipSplash({ onFinish }: { onFinish: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current; // Start small for zoom
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start Sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1, // Smooth elegant zoom
        duration: 6000,
        useNativeDriver: true,
      }),
    ]).start();

    // Delay text for a more dramatic effect
    setTimeout(() => {
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }).start();
    }, 1200);

    // Finish sequence
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 5500);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* VIP Masked Wrapper to clip white edges */}
        <View style={styles.compassMask}>
          <ImageBackground
            source={require("../assets/images/splash_compass.png")}
            style={styles.mandala}
            imageStyle={{ 
              opacity: 1,
              transform: [{ scale: 1.05 }] // Slightly oversized to ensure clipping
            }}
            resizeMode="contain"
          />
        </View>

        <Animated.View style={[styles.textBox, { opacity: textFadeAnim }]}>
          <View style={styles.appNameWrapper}>
            <View style={styles.ornamentLine} />
            <Text style={styles.appName}>VAKTİ SELAM</Text>
            <View style={styles.ornamentLine} />
          </View>
          <View style={styles.logoDivider} />
          <Text style={styles.subtitle}>İbadetinde Asalet, Kalbinde Huzur</Text>
        </Animated.View>
      </Animated.View>

      <View style={styles.cornerTL} />
      <View style={styles.cornerBR} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#050811", // DEEP NIGHT SOLID
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  compassMask: {
    width: SCREEN_WIDTH * 0.62,
    height: SCREEN_WIDTH * 0.62,
    borderRadius: (SCREEN_WIDTH * 0.62) / 2,
    backgroundColor: "#050811",
    overflow: "hidden", // THIS CLIPS THE WHITE EDGES
    justifyContent: "center",
    alignItems: "center",
  },
  mandala: {
    width: SCREEN_WIDTH * 0.68, // Image is slightly larger than the mask
    height: SCREEN_WIDTH * 0.68,
  },
  textBox: {
    alignItems: "center",
    marginTop: 50,
  },
  appNameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  ornamentLine: {
    width: 20,
    height: 1,
    backgroundColor: "rgba(212, 175, 55, 0.4)",
  },
  appName: {
    color: "#D4AF37", // VIP GOLD
    fontSize: 28,
    fontWeight: "200", 
    letterSpacing: 14, 
    textShadowColor: "rgba(212, 175, 55, 0.5)",
    textShadowRadius: 15,
    textAlign: "center",
  },
  logoDivider: {
    width: 40,
    height: 2,
    backgroundColor: "#D4AF37",
    marginVertical: 20,
    borderRadius: 1,
    opacity: 0.4,
  },
  subtitle: {
    color: "#D4AF37",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 4,
    opacity: 0.6,
    textTransform: "uppercase",
  },
  cornerTL: {
    position: "absolute",
    top: 50,
    left: 40,
    width: 30,
    height: 30,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  cornerBR: {
    position: "absolute",
    bottom: 50,
    right: 40,
    width: 30,
    height: 30,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
});
