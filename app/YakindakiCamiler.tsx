import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

export default function YakindakiCamiler() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mosques, setMosques] = useState<Mosque[]>([]);

  useEffect(() => {
    fetchMosquesData();
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

      const loc = await Location.getCurrentPositionAsync({});
      const lat = loc.coords.latitude;
      const lon = loc.coords.longitude;
      setUserLocation({ latitude: lat, longitude: lon });

      const query = `[out:json][timeout:25];(node["amenity"="place_of_worship"]["religion"="muslim"](around:3000,${lat},${lon});way["amenity"="place_of_worship"]["religion"="muslim"](around:3000,${lat},${lon}););out center;`;
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

      const response = await fetch(overpassUrl);
      const data = await response.json();

      let fetchedMosques: Mosque[] = [];

      data.elements.forEach((el: any) => {
        const itemLat = el.lat || el.center?.lat;
        const itemLon = el.lon || el.center?.lon;
        
        let name = el.tags?.name || t("unknownMosque");
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

      setMosques(uniqueMosques.slice(0, 30));
    } catch (error) {
      console.log(error);
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

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.floor(R * c);
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#D4AF37" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("nearbyMosques")}</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>{t("searchingMosques")}</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="location-outline" size={48} color="#94A3B8" />
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchMosquesData}>
            <Text style={styles.retryBtnText}>{t("retry")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        userLocation && (
          <MapView
            key={`map-${Platform.OS}`}
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
            showsMyLocationButton={false}
            pitchEnabled={true}
            mapPadding={{ top: 80, right: 0, bottom: height * 0.4, left: 0 }}
          >
            {mosques.map((mosque) => (
              <Marker
                key={mosque.id}
                coordinate={{ latitude: mosque.lat, longitude: mosque.lon }}
                title={mosque.name}
                description={`${formatDistance(mosque.distance)} ${t("distanceAway")}`}
              >
                <View style={styles.markerContainer}>
                  <View style={styles.markerBadge}>
                    <FontAwesome5 name="mosque" size={12} color="#0B101E" />
                  </View>
                  <View style={styles.markerTriangle} />
                </View>
              </Marker>
            ))}
          </MapView>
        )
      )}

      <View style={styles.bottomSheet}>
        <LinearGradient
          colors={["#0B101E", "#15233E"]}
          style={styles.bottomSheetGradient}
        >
          <View style={styles.dragIndicator} />
          
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{t("nearbyMosquesSheet")}</Text>
            <Text style={styles.sheetSubtitle}>
              {!loading && mosques.length > 0 
                ? `${mosques.length} ${t("mosquesFound")}` 
                : t("searchCompleted")}
            </Text>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          >
            {mosques.length === 0 && !loading && !errorMsg ? (
              <Text style={styles.emptyText}>{t("noMosquesFound")}</Text>
            ) : (
              mosques.map((mosque, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.listIconBox}>
                    <FontAwesome5 name="mosque" size={16} color="#0B101E" />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={styles.listName} numberOfLines={1}>{mosque.name}</Text>
                    <Text style={styles.listDistance}>{formatDistance(mosque.distance)} {t("distanceLabel")}</Text>
                  </View>
                  <Ionicons name="location-sharp" size={20} color="#D4AF37" />
                </View>
              ))
            )}
            
            <View style={{height: 40}}/>
          </ScrollView>

        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B101E" },
  headerSafeArea: { position: "absolute", top: 0, width: "100%", zIndex: 10 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 15, backgroundColor: "rgba(11, 16, 30, 0.8)" },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(212, 175, 55, 0.1)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.3)" },
  headerTitle: { fontSize: 20, fontWeight: "500", color: "#E2E8F0", letterSpacing: 1 },
  map: { width: "100%", height: "100%" },
  markerContainer: { alignItems: "center" },
  markerBadge: { backgroundColor: "#D4AF37", padding: 8, borderRadius: 16, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#0B101E", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 3, elevation: 5 },
  markerTriangle: { width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderStyle: "solid", backgroundColor: "transparent", borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "#0B101E", marginTop: -2 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 15, color: "#D4AF37", fontSize: 16, letterSpacing: 1 },
  errorText: { marginTop: 15, color: "#E2E8F0", fontSize: 15, textAlign: "center", lineHeight: 22 },
  retryBtn: { marginTop: 20, backgroundColor: "#D4AF37", paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12 },
  retryBtnText: { color: "#0B101E", fontWeight: "bold", fontSize: 15 },
  bottomSheet: { position: "absolute", bottom: 0, width: "100%", height: height * 0.45, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 20 },
  bottomSheetGradient: { flex: 1, paddingTop: 12 },
  dragIndicator: { width: 40, height: 5, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 3, alignSelf: "center", marginBottom: 15 },
  sheetHeader: { paddingHorizontal: 25, marginBottom: 15 },
  sheetTitle: { color: "#D4AF37", fontSize: 22, fontWeight: "600" },
  sheetSubtitle: { color: "#94A3B8", fontSize: 13, marginTop: 4 },
  listContainer: { paddingHorizontal: 20 },
  listItem: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.03)", padding: 15, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.05)" },
  listIconBox: { width: 40, height: 40, backgroundColor: "#D4AF37", borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 15 },
  listInfo: { flex: 1 },
  listName: { color: "#E2E8F0", fontSize: 16, fontWeight: "500" },
  listDistance: { color: "#94A3B8", fontSize: 12, marginTop: 4 },
  emptyText: { color: "#94A3B8", textAlign: "center", marginTop: 20, fontSize: 14 },
});
