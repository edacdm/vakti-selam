import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "../../../i18n";

export default function CumaNamazi() {
  const router = useRouter();
  const { t } = useTranslation();

  const renderStep = (stepNumber: string, title: string, content: string, isLast: boolean = false) => (
    <View style={styles.stepRow}>
      <View style={styles.stepIndicator}>
        <View style={styles.stepDot}><Text style={styles.stepDotText}>{stepNumber}</Text></View>
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
          <LinearGradient colors={["rgba(212, 175, 55, 0.15)", "rgba(212, 175, 55, 0.02)"]} style={styles.heroCard}>
            <MaterialCommunityIcons name="mosque" size={56} color="#D4AF37" />
            <Text style={styles.heroTitle}>{t("namazCuma")}</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}><Text style={styles.badgeText}>4 {t("sunnahLabel")}</Text></View>
              <View style={styles.badge}><Text style={styles.badgeText}>2 {t("fardLabel")}</Text></View>
              <View style={styles.badge}><Text style={styles.badgeText}>4 {t("sunnahLabel")}</Text></View>
            </View>
            <View style={[styles.badge, styles.badgeHighlight, { marginTop: 10 }]}><Text style={styles.badgeTextHighlight}>{t("badgeCongregation")}</Text></View>
          </LinearGradient>

          <View style={styles.infoRowMain}>
            <Ionicons name="megaphone-outline" size={24} color="#D4AF37" />
            <Text style={styles.infoRowTextMain}>{t("prayCumaInfo")}</Text>
          </View>

          <LinearGradient colors={["rgba(18, 30, 54, 0.9)", "rgba(8, 12, 22, 0.9)"]} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="book-outline" size={26} color="#D4AF37" />
              <Text style={styles.sectionTitle}>4 {t("rekatLabel")} {t("sunnahLabel")}</Text>
            </View>
            <Text style={styles.sectionSubtitle}>{t("prayCumaSunnah1Title")}</Text>
            <View style={styles.niyetBox}>
              <Text style={styles.niyetText}>{t("prayCumaSunnah1Niyet")}</Text>
            </View>
            <View style={styles.pathwayContainer}>
              {renderStep("1", t("sunnahLabel"), t("prayCumaSunnah1Step1Content"), true)}
            </View>
          </LinearGradient>

          <LinearGradient colors={["rgba(18, 30, 54, 0.9)", "rgba(8, 12, 22, 0.9)"]} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={26} color="#D4AF37" />
              <Text style={styles.sectionTitle}>2 {t("rekatLabel")} {t("fardLabel")}</Text>
            </View>
            <Text style={styles.sectionSubtitle}>{t("prayCumaFardTitle")}</Text>
            <View style={styles.niyetBox}>
              <Text style={styles.niyetText}>{t("prayCumaFardNiyet")}</Text>
            </View>
            <View style={styles.pathwayContainer}>
              {renderStep("1", t("prayCumaFardStep1Title"), t("prayCumaFardStep1Content"))}
              {renderStep("2", t("completeLabel"), t("prayCumaFardStep2Content"), true)}
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
  header: { paddingHorizontal: 20, paddingTop: 15 },
  iconButton: { width: 44, height: 44, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.1)" },
  scroll: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 10 },
  heroCard: { alignItems: "center", paddingVertical: 35, borderRadius: 24, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.4)", marginBottom: 20 },
  heroTitle: { fontSize: 32, fontWeight: "300", color: "#E2E8F0", letterSpacing: 2, marginTop: 15, marginBottom: 20 },
  badgeContainer: { flexDirection: "row", gap: 8 },
  badge: { backgroundColor: "rgba(11, 16, 30, 0.8)", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.3)" },
  badgeText: { color: "#CBD5E1", fontSize: 12, fontWeight: "600" },
  badgeHighlight: { backgroundColor: "rgba(212, 175, 55, 0.15)", borderColor: "#D4AF37" },
  badgeTextHighlight: { color: "#D4AF37", fontSize: 13, fontWeight: "700" },
  infoRowMain: { flexDirection: "row", backgroundColor: "rgba(212, 175, 55, 0.1)", padding: 16, borderRadius: 16, marginBottom: 20, alignItems: "center", gap: 12 },
  infoRowTextMain: { flex: 1, color: "#E2E8F0", fontSize: 13, lineHeight: 18, fontStyle: "italic" },
  sectionCard: { borderRadius: 24, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.15)" },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 12 },
  sectionTitle: { fontSize: 22, fontWeight: "600", color: "#D4AF37" },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#CBD5E1",
    marginBottom: 15,
    marginTop: -10,
  },
  niyetBox: { backgroundColor: "rgba(212, 175, 55, 0.08)", padding: 18, borderRadius: 16, marginBottom: 25, borderLeftWidth: 4, borderLeftColor: "#D4AF37" },
  niyetText: { color: "#E2E8F0", fontStyle: "italic", fontSize: 14, lineHeight: 20 },
  pathwayContainer: { paddingLeft: 5 },
  stepRow: { flexDirection: "row" },
  stepIndicator: { alignItems: "center", marginRight: 20, width: 28 },
  stepDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#121E36", borderWidth: 2, borderColor: "#D4AF37", justifyContent: "center", alignItems: "center", zIndex: 2 },
  stepDotText: { color: "#D4AF37", fontSize: 12, fontWeight: "bold" },
  stepLine: { width: 2, flex: 1, backgroundColor: "rgba(212, 175, 55, 0.3)", marginVertical: -2 },
  stepContent: { flex: 1, paddingBottom: 35 },
  stepContentLast: { paddingBottom: 0 },
  stepTitle: { color: "#E2E8F0", fontSize: 17, fontWeight: "700", marginBottom: 8 },
  stepText: { color: "#94A3B8", fontSize: 14, lineHeight: 22 },
});