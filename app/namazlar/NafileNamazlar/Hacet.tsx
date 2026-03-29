import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Hacet() {
  const router = useRouter();

  const renderStep = (
    stepNumber: string,
    title: string,
    content: string,
    isLast: boolean = false
  ) => (
    <View style={styles.stepRow}>
      <View style={styles.stepIndicator}>
        <View style={styles.stepDot}>
          <Text style={styles.stepDotText}>{stepNumber}</Text>
        </View>
        {!isLast && <View style={styles.stepLine} />}
      </View>
      <View style={[styles.stepContent, isLast && styles.stepContentLast]}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepText}>{content}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#080C16", "#121E36"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          <LinearGradient
            colors={["rgba(212, 175, 55, 0.15)", "rgba(212, 175, 55, 0.02)"]}
            style={styles.heroCard}
          >
            <MaterialCommunityIcons name="hands-pray" size={56} color="#D4AF37" />
            <Text style={styles.heroTitle}>Hacet Namazı</Text>
            
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, styles.badgeHighlight]}>
                <Text style={styles.badgeTextHighlight}>2 veya 4 Rekat</Text>
              </View>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["rgba(18, 30, 54, 0.9)", "rgba(8, 12, 22, 0.9)"]}
            style={styles.sectionCard}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="moon" size={26} color="#D4AF37" />
              <Text style={styles.sectionTitle}>Hacet Namazı Kılınışı</Text>
            </View>

            <View style={styles.niyetBox}>
              <MaterialCommunityIcons name="hands-pray" size={24} color="#D4AF37" />
              <Text style={styles.niyetText}>
                “Niyet ettim Allah rızası için hacet namazı kılmaya.”
              </Text>
            </View>

            <View style={styles.pathwayContainer}>
              {renderStep(
                "1",
                "Birinci Rekat",
                "Sübhaneke okunur, Fatiha ve zamm-ı sure serbest olarak okunursa 2 rekat bitirilir. Ancak sünnet olarak; 1. rekatta 3 kere Ayetel Kürsi okunması tavsiye edilir."
              )}
              {renderStep(
                "2",
                "İkinci Rekat ve Selam",
                "Fatiha ve zamm-ı sure okunur (Sünnete göre burda İhlas, Felak ve Nas sureleri okunur). Rükû ve secdeler tamamlanıp selam verilir.",
                true
              )}
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={20} color="#94A3B8" />
              <Text style={styles.infoRowText}>Namazdan sonra Allah'tan ihtiyaç ve dilekler duayla istenir.</Text>
            </View>
          </LinearGradient>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 15, alignItems: "flex-start" },
  iconButton: { width: 44, height: 44, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.1)" },
  scroll: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 10 },
  heroCard: { alignItems: "center", paddingVertical: 35, paddingHorizontal: 20, borderRadius: 24, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.4)", marginBottom: 20, shadowColor: "#D4AF37", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  heroTitle: { fontSize: 26, fontWeight: "300", color: "#E2E8F0", letterSpacing: 2, marginTop: 15, marginBottom: 20 },
  badgeContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 8 },
  badge: { backgroundColor: "rgba(11, 16, 30, 0.8)", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.3)" },
  badgeHighlight: { backgroundColor: "rgba(212, 175, 55, 0.15)", borderColor: "#D4AF37" },
  badgeTextHighlight: { color: "#D4AF37", fontSize: 13, fontWeight: "700" },
  sectionCard: { borderRadius: 24, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.15)", shadowColor: "#000", shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.4, shadowRadius: 25, elevation: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 25, gap: 12 },
  sectionTitle: { fontSize: 22, fontWeight: "600", color: "#D4AF37", letterSpacing: 0.5 },
  niyetBox: { flexDirection: "row", backgroundColor: "rgba(212, 175, 55, 0.08)", padding: 18, borderRadius: 16, marginBottom: 25, borderLeftWidth: 4, borderLeftColor: "#D4AF37", alignItems: "center", gap: 15 },
  niyetText: { flex: 1, color: "#E2E8F0", fontStyle: "italic", fontSize: 15, lineHeight: 22, fontWeight: "500" },
  pathwayContainer: { paddingLeft: 5 },
  stepRow: { flexDirection: "row" },
  stepIndicator: { alignItems: "center", marginRight: 20, width: 28 },
  stepDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#121E36", borderWidth: 2, borderColor: "#D4AF37", justifyContent: "center", alignItems: "center", zIndex: 2 },
  stepDotText: { color: "#D4AF37", fontSize: 13, fontWeight: "bold" },
  stepLine: { width: 2, flex: 1, backgroundColor: "rgba(212, 175, 55, 0.3)", marginVertical: -2, zIndex: 1 },
  stepContent: { flex: 1, paddingBottom: 35 },
  stepContentLast: { paddingBottom: 0 },
  stepTitle: { color: "#E2E8F0", fontSize: 17, fontWeight: "700", marginBottom: 8, marginTop: 2 },
  stepText: { color: "#94A3B8", fontSize: 14, lineHeight: 24 },
  infoRow: { flexDirection: "row", marginTop: 25, paddingTop: 15, borderTopWidth: 1, borderTopColor: "rgba(255, 255, 255, 0.05)", alignItems: "center", gap: 10 },
  infoRowText: { flex: 1, color: "#94A3B8", fontSize: 13, fontStyle: "italic" }
});
