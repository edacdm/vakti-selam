import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "../../../i18n";

export default function YatsiNamazi() {
  const router = useRouter();
  const { t } = useTranslation();

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
            <MaterialCommunityIcons name="moon-waning-crescent" size={56} color="#D4AF37" />
            <Text style={styles.heroTitle}>{t("namazYatsi")}</Text>
            
            <View style={styles.badgeContainer}>
              <View style={styles.badge}><Text style={styles.badgeText}>4 {t("sunnahLabel")}</Text></View>
              <View style={styles.badge}><Text style={styles.badgeText}>4 {t("fardLabel")}</Text></View>
              <View style={styles.badge}><Text style={styles.badgeText}>2 {t("sunnahLabel")}</Text></View>
              <View style={[styles.badge, styles.badgeHighlight]}><Text style={styles.badgeTextHighlight}>3 {t("prayWitrTitle").split(' ')[2]}</Text></View>
            </View>
            <View style={[styles.badge, styles.badgeHighlight, { marginTop: 10, paddingHorizontal: 30 }]}>
              <Text style={styles.badgeTextHighlight}>{t("totalLabel")} 13 {t("rekatLabel")}</Text>
            </View>
          </LinearGradient>

          <LinearGradient colors={["rgba(18, 30, 54, 0.9)", "rgba(8, 12, 22, 0.9)"]} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="book-outline" size={26} color="#D4AF37" />
              <Text style={styles.sectionTitle}>4 {t("rekatLabel")} {t("sunnahLabel")}</Text>
            </View>
            <Text style={styles.sectionSubtitle}>{t("prayYatsiSunnah1Title")}</Text>
            <View style={styles.niyetBox}>
              <MaterialCommunityIcons name="hands-pray" size={24} color="#D4AF37" />
              <Text style={styles.niyetText}>{t("prayYatsiSunnah1Niyet")}</Text>
            </View>
            <View style={styles.pathwayContainer}>
              {renderStep("1", t("namazStep2SittingTitle").split(' ')[0] + " 2 " + t("rekatLabel"), t("prayYatsiSunnah1Step4Content").split(' ')[0] + " 2 " + t("rekatLabel") + "...")}
              {renderStep("2", t("prayYatsiSunnah1Step2Title"), t("prayYatsiSunnah1Step2Content"))}
              {renderStep("4", t("completeLabel") || "Tamamlama", t("prayYatsiSunnah1Step4Content"), true)}
            </View>
          </LinearGradient>

          <LinearGradient colors={["rgba(18, 30, 54, 0.9)", "rgba(8, 12, 22, 0.9)"]} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={26} color="#D4AF37" />
              <Text style={styles.sectionTitle}>4 {t("rekatLabel")} {t("fardLabel")}</Text>
            </View>
            <Text style={styles.sectionSubtitle}>{t("prayYatsiFardTitle")}</Text>
            <View style={styles.niyetBox}>
              <MaterialCommunityIcons name="hands-pray" size={24} color="#D4AF37" />
              <Text style={styles.niyetText}>{t("prayYatsiFardNiyet")}</Text>
            </View>
            <View style={styles.pathwayContainer}>
              {renderStep("1", t("prayYatsiFardStep1Title"), t("prayYatsiFardStep1Content"))}
              {renderStep("3", t("prayIkindiFardStep3Content").split(' ')[0] + " 2 " + t("rekatLabel"), t("prayYatsiFardStep3Content"), true)}
            </View>
          </LinearGradient>

          <LinearGradient colors={["rgba(18, 30, 54, 0.9)", "rgba(8, 12, 22, 0.9)"]} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flash-outline" size={26} color="#D4AF37" />
              <Text style={styles.sectionTitle}>{t("prayYatsiWitrTitle")}</Text>
            </View>
            <View style={styles.niyetBox}>
              <MaterialCommunityIcons name="hands-pray" size={24} color="#D4AF37" />
              <Text style={styles.niyetText}>{t("prayYatsiWitrNiyet")}</Text>
            </View>
            <View style={styles.pathwayContainer}>
              {renderStep("1", t("namazStep2SittingTitle").split(' ')[0] + " 2 " + t("rekatLabel"), t("prayYatsiWitrStep1Content"))}
              {renderStep("3", t("prayYatsiWitrStep3Title"), t("prayYatsiWitrStep3Content"), true)}
            </View>
          </LinearGradient>

          <View style={styles.navigation}>
            <TouchableOpacity
              style={styles.navButtonSecondary}
              onPress={() => router.push("/namazlar/BesVakit/AksamNamazi" as any)}
            >
              <Ionicons name="chevron-back" size={18} color="#94A3B8" />
              <Text style={styles.navTextSecondary}>{t("namazAksam").split(' ')[0]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButtonPrimary}
              onPress={() => router.push("/namazlar/BesVakit" as any)}
            >
              <Text style={styles.navTextPrimary}>{t("returnToMenuLabel") || "Menüye Dön"}</Text>
              <Ionicons name="home-outline" size={18} color="#080C16" />
            </TouchableOpacity>
          </View>

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
  heroCard: { alignItems: "center", paddingVertical: 35, paddingHorizontal: 20, borderRadius: 24, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.4)", marginBottom: 20, elevation: 10 },
  heroTitle: { fontSize: 32, fontWeight: "300", color: "#E2E8F0", letterSpacing: 2, marginTop: 15, marginBottom: 20 },
  badgeContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 8 },
  badge: { backgroundColor: "rgba(11, 16, 30, 0.8)", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.3)" },
  badgeText: { color: "#CBD5E1", fontSize: 12, fontWeight: "600" },
  badgeHighlight: { backgroundColor: "rgba(212, 175, 55, 0.15)", borderColor: "#D4AF37" },
  badgeTextHighlight: { color: "#D4AF37", fontSize: 13, fontWeight: "700" },
  sectionCard: { borderRadius: 24, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.15)", elevation: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 25, gap: 12 },
  sectionTitle: { fontSize: 22, fontWeight: "600", color: "#D4AF37" },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#CBD5E1",
    marginBottom: 15,
    marginTop: -10,
  },
  niyetBox: { flexDirection: "row", backgroundColor: "rgba(212, 175, 55, 0.08)", padding: 18, borderRadius: 16, marginBottom: 25, borderLeftWidth: 4, borderLeftColor: "#D4AF37", alignItems: "center", gap: 15 },
  niyetText: { flex: 1, color: "#E2E8F0", fontStyle: "italic", fontSize: 14, lineHeight: 20 },
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
  navigation: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  navButtonSecondary: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.05)", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.1)", gap: 6 },
  navTextSecondary: { color: "#94A3B8", fontWeight: "600", fontSize: 15 },
  navButtonPrimary: { flexDirection: "row", alignItems: "center", backgroundColor: "#D4AF37", paddingVertical: 14, paddingHorizontal: 24, borderRadius: 16, gap: 6, elevation: 6 },
  navTextPrimary: { color: "#080C16", fontWeight: "700", fontSize: 15 },
});