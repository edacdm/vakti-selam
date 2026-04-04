import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter, Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import { useTranslation } from "../i18n";

const { width, height } = Dimensions.get("window");

interface Mosque {
  id: string;
  name: string;
  lat: number;
  lon: number;
  distance: number;
}

const customMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0B101E" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0B101E" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#D4AF37" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#D4AF37" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#0F172A" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1E293B" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#080C14" }] },
];

const OVERPASS_MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://z.overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

export default function YakindakiCamiler() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [activeMosque, setActiveMosque] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const mandalaRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchMosquesData();
    Animated.loop(
      Animated.timing(mandalaRotation, {
        toValue: 1,
        duration: 120000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const fetchMosquesData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg(t("locationPermissionError"));
        setLoading(false);
        return;
      }

      let loc = await Location.getLastKnownPositionAsync({});
      if (!loc) {
        loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      }
      
      const lat = loc.coords.latitude;
      const lon = loc.coords.longitude;
      setUserLocation({ latitude: lat, longitude: lon });

      const query = `[out:json][timeout:30];(node["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lon});way["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lon}););out center;`;
      
      let data = null;
      let lastError: any = null;

      for (const mirror of OVERPASS_MIRRORS) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(`${mirror}?data=${encodeURIComponent(query)}`, {
            signal: controller.signal,
            headers: { 'Accept-Language': 'tr,en;q=0.9' }
          });
          clearTimeout(timeoutId);
          if (res.ok) {
            data = await res.json();
            break;
          }
        } catch (e) {
          lastError = e;
        }
      }

      if (!data) throw lastError || new Error("Connection error");

      let fetchedMosques: Mosque[] = [];
      data.elements.forEach((el: any) => {
        const itemLat = el.lat || el.center?.lat;
        const itemLon = el.lon || el.center?.lon;
        const name = el.tags?.name || t("unknownMosque");
        if (itemLat && itemLon) {
          const dist = getDistance(lat, lon, itemLat, itemLon);
          fetchedMosques.push({
            id: el.id.toString(),
            name: name,
            lat: itemLat,
            lon: itemLon,
            distance: dist,
          });
        }
      });

      fetchedMosques.sort((a, b) => a.distance - b.distance);
      const uniqueMosques = fetchedMosques.filter((val, idx, arr) => 
        idx === arr.findIndex((t) => t.name === val.name && Math.abs(t.distance - val.distance) < 50)
      );
      setMosques(uniqueMosques.slice(0, 35));
    } catch (error: any) {
      setErrorMsg(t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const rLat1 = (lat1 * Math.PI) / 180;
    const rLat2 = (lat2 * Math.PI) / 180;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return Math.floor(R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))));
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const centerOnMosque = (m: Mosque) => {
    setActiveMosque(m.id);
    mapRef.current?.animateToRegion({
      latitude: m.lat - 0.003,
      longitude: m.lon,
      latitudeDelta: 0.008,
      longitudeDelta: 0.008,
    }, 800);
  };

  const rotateInterpolate = mandalaRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <BlurView intensity={20} tint="dark" style={styles.headerOverflow}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="close" size={24} color={Colors.luxury.gold} />
            </TouchableOpacity>
            <View style={styles.titleWrapper}>
              <Text style={styles.pageSubHeader}>{t("nearbyMosques")?.toUpperCase()}</Text>
              <View style={styles.goldDot} />
              <Text style={styles.appNameLuxury}>VAKTİ SELAM</Text>
            </View>
            <TouchableOpacity onPress={fetchMosquesData} style={styles.refreshBtn}>
              <Ionicons name="refresh" size={20} color={Colors.luxury.gold} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </BlurView>

      {loading ? (
        <LinearGradient colors={[Colors.luxury.midnight, Colors.luxury.midnightDeep]} style={styles.absFill}>
          <Animated.Image
            source={require("../assets/images/mandala_bg.png")}
            style={[styles.mandalaBase, { transform: [{ rotate: rotateInterpolate }, { scale: 1.5 }] }]}
            resizeMode="contain"
          />
          <View style={styles.loadingInner}>
            <ActivityIndicator size="large" color={Colors.luxury.gold} />
            <Text style={styles.loadingText}>{t("searchingMosques")}</Text>
          </View>
        </LinearGradient>
      ) : errorMsg ? (
        <LinearGradient colors={[Colors.luxury.midnight, Colors.luxury.midnightDeep]} style={styles.absFill}>
          <View style={styles.loadingInner}>
            <Ionicons name="cloud-offline-outline" size={60} color={Colors.luxury.gold} style={{ opacity: 0.4 }} />
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchMosquesData}>
              <Text style={styles.retryBtnText}>{t("retry")}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      ) : (
        userLocation && (
          <MapView
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            customMapStyle={customMapStyle}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            showsUserLocation={true}
            mapPadding={{ top: 120, right: 0, bottom: height * 0.45, left: 0 }}
          >
            {mosques.map((mosque) => (
              <Marker
                key={mosque.id}
                coordinate={{ latitude: mosque.lat, longitude: mosque.lon }}
                onPress={() => setActiveMosque(mosque.id)}
                tracksViewChanges={true}
              >
                <View style={styles.markerContainer}>
                    <View style={[styles.markerCrystal, activeMosque === mosque.id && styles.markerCrystalActive]}>
                        <FontAwesome5 
                           name="mosque" 
                           size={18} 
                           color={activeMosque === mosque.id ? "#FFF" : "#000"} 
                        />
                    </View>
                    <View style={[styles.markerArrow, activeMosque === mosque.id && styles.markerArrowActive]} />
                </View>
              </Marker>
            ))}
          </MapView>
        )
      )}

      <View style={styles.bottomSheetContainer}>
        <BlurView intensity={Platform.OS === "ios" ? 40 : 90} tint="dark" style={styles.bottomSheetBlur}>
          <View style={styles.dragIndicator} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{t("nearbyMosquesSheet")}</Text>
            <Text style={styles.sheetSubtitle}>{mosques.length} {t("mosquesFound")}</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            {mosques.map((mosque, index) => (
              <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => centerOnMosque(mosque)} style={styles.luxuryCardWrapper}>
                <LinearGradient colors={["rgba(212, 175, 55, 0.25)", "rgba(212, 175, 55, 0.05)"]} style={styles.goldBorder} />
                <BlurView intensity={10} tint="light" style={styles.luxuryCardInner}>
                  <View style={styles.cardHeader}>
                    <View style={styles.listIconBox}><FontAwesome5 name="mosque" size={16} color={Colors.luxury.gold} /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.listName} numberOfLines={1}>{mosque.name}</Text>
                      <Text style={styles.listDistance}>
                         <Ionicons name="navigate-outline" size={10} color={Colors.luxury.gold} /> {formatDistance(mosque.distance)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={Colors.luxury.gold} style={{ opacity: 0.5 }} />
                  </View>
                  <View style={styles.cornerOrnamentTop} />
                  <View style={styles.cornerOrnamentBottom} />
                </BlurView>
              </TouchableOpacity>
            ))}
            <View style={{ height: 100 }} />
          </ScrollView>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.luxury.midnight },
  absFill: { ...StyleSheet.absoluteFillObject },
  map: { flex: 1 },
  headerOverflow: { position: "absolute", top: 0, width: "100%", zIndex: 100 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingVertical: 15 },
  titleWrapper: { alignItems: "center" },
  pageSubHeader: { color: Colors.luxury.gold, fontSize: 10, fontWeight: "800", letterSpacing: 3, marginBottom: 2 },
  goldDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.luxury.gold, marginBottom: 4 },
  appNameLuxury: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", letterSpacing: 2 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(212, 175, 55, 0.1)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.2)" },
  refreshBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.05)", justifyContent: "center", alignItems: "center" },
  loadingInner: { flex: 1, justifyContent: "center", alignItems: "center", zIndex: 10 },
  mandalaBase: { opacity: 0.1, position: "absolute", alignSelf: "center", top: 100 },
  loadingText: { marginTop: 20, color: Colors.luxury.gold, fontSize: 14, fontWeight: "600" },
  errorText: { marginTop: 20, color: "#E2E8F0", textAlign: "center", paddingHorizontal: 40, opacity: 0.6 },
  retryBtn: { marginTop: 20, backgroundColor: Colors.luxury.gold, paddingHorizontal: 25, paddingVertical: 10, borderRadius: 12 },
  retryBtnText: { color: "#000", fontWeight: "bold" },
  
  markerContainer: { alignItems: 'center', justifyContent: 'center', width: 44, height: 50 },
  markerCrystal: { 
    width: 38, 
    height: 38, 
    borderRadius: 19, 
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glassmorphic base
    justifyContent: "center", 
    alignItems: "center", 
    borderWidth: 2.5, 
    borderColor: Colors.luxury.gold, 
    shadowColor: Colors.luxury.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10
  },
  markerCrystalActive: { 
    backgroundColor: Colors.luxury.gold,
    borderColor: '#FFF',
    transform: [{ scale: 1.1 }]
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: Colors.luxury.gold,
    marginTop: -2
  },
  markerArrowActive: {
    borderTopColor: '#FFF'
  },

  bottomSheetContainer: { position: "absolute", bottom: 0, width: "100%", height: height * 0.45, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: "hidden" },
  bottomSheetBlur: { flex: 1, paddingTop: 12 },
  dragIndicator: { width: 40, height: 5, backgroundColor: "rgba(212, 175, 55, 0.2)", borderRadius: 3, alignSelf: "center", marginBottom: 15 },
  sheetHeader: { paddingHorizontal: 25, marginBottom: 15 },
  sheetTitle: { color: Colors.luxury.gold, fontSize: 22, fontWeight: "700" },
  sheetSubtitle: { color: "#94A3B8", fontSize: 13, marginTop: 4 },
  listContent: { paddingHorizontal: 20 },
  luxuryCardWrapper: { marginBottom: 12, position: "relative" },
  goldBorder: { position: "absolute", top: -1, left: -1, right: -1, bottom: -1, borderRadius: 20 },
  luxuryCardInner: { backgroundColor: "rgba(15, 23, 42, 0.6)", borderRadius: 19, padding: 15, overflow: "hidden" },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 15 },
  listIconBox: { width: 40, height: 40, backgroundColor: "rgba(212, 175, 55, 0.1)", borderRadius: 12, justifyContent: "center", alignItems: "center" },
  listName: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  listDistance: { color: "#94A3B8", fontSize: 12, marginTop: 2 },
  cornerOrnamentTop: { position: "absolute", top: 8, left: 8, width: 12, height: 12, borderTopWidth: 1, borderLeftWidth: 1, borderColor: "rgba(212, 175, 55, 0.2)" },
  cornerOrnamentBottom: { position: "absolute", bottom: 8, right: 8, width: 12, height: 12, borderBottomWidth: 1, borderRightWidth: 1, borderColor: "rgba(212, 175, 55, 0.2)" },
});
