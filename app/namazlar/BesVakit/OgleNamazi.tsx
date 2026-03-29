import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OgleNamazi() {
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
            <MaterialCommunityIcons name="white-balance-sunny" size={56} color="#D4AF37" />
            <Text style={styles.heroTitle}>Öğle Namazı</Text>
            
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>4 İlk Sünnet</Text>
              </View>
              <MaterialCommunityIcons name="plus" size={16} color="#D4AF37" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>4 Farz</Text>
              </View>
              <MaterialCommunityIcons name="plus" size={16} color="#D4AF37" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2 Son Sünnet</Text>
              </View>
            </View>
            <View style={[styles.badge, styles.badgeHighlight, { marginTop: 10 }]}>
              <Text style={styles.badgeTextHighlight}>Toplam 10 Rekat</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["rgba(18, 30, 54, 0.9)", "rgba(8, 12, 22, 0.9)"]}
            style={styles.sectionCard}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="book-outline" size={26} color="#D4AF37" />
              <Text style={styles.sectionTitle}>4 Rekat İlk Sünnet</Text>
            </View>

            <View style={styles.niyetBox}>
              <MaterialCommunityIcons name="hands-pray" size={24} color="#D4AF37" />
              <Text style={styles.niyetText}>
                “Niyet ettim Allah rızası için bugünkü öğle namazının ilk sünnetini kılmaya.”
              </Text>
            </View>

            <View style={styles.pathwayContainer}>
              {renderStep(
                "1",
                "Birinci Rekat",
                "Tekbir alınır. Sübhaneke okunur. Eûzü Besmele çekilir, Fâtiha ve zamm-ı sure okunur. Rükû ve secdeler yapılır."
              )}
              {renderStep(
                "2",
                "İkinci Rekat ve İlk Oturuş",
                "Besmele, Fâtiha ve zamm-ı sure okunur. Rükû ve secdelerden sonra oturulur (İlk Oturuş). Sadece 'Ettehiyyatü' okunur ve 3. rekata kalkılır."
              )}
              {renderStep(
                "3",
                "Üçüncü Rekat",
                "Besmele çekilir, Fâtiha ve zamm-ı sure okunur. Rükû ve secdeler yapılır."
              )}
              {renderStep(
                "4",
                "Dördüncü Rekat ve Selam",
                "Besmele, Fâtiha ve zamm-ı sure okunur. Rükû, secde ve son oturuşa geçilir. Ettehiyyatü, Salli-Barik ve Rabbena duaları okunup selam verilir.",
                true
              )}
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["rgba(18, 30, 54, 0.9)", "rgba(8, 12, 22, 0.9)"]}
            style={styles.sectionCard}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={26} color="#D4AF37" />
              <Text style={styles.sectionTitle}>4 Rekat Farz</Text>
            </View>

            <View style={styles.niyetBox}>
              <MaterialCommunityIcons name="hands-pray" size={24} color="#D4AF37" />
              <Text style={styles.niyetText}>
                “Niyet ettim Allah rızası için bugünkü öğle namazının farzını kılmaya.”
              </Text>
            </View>

            <View style={styles.pathwayContainer}>
              {renderStep(
                "1",
                "Kamet ve İlk 2 Rekat",
                "Erkekler kamet getirir. İlk iki rekat, sünnetteki gibi kılınır (Sübhaneke, Fâtiha, sure). İkinci rekatın sonunda sadece Ettehiyyatü okunup kalkılır."
              )}
              {renderStep(
                "3",
                "Üçüncü ve Dördüncü Rekat",
                "Ayağa kalkılınca sadece Besmele ve Fâtiha okunur (Zamm-ı sure okunmaz). Rükû ve secdeler yapılır. 4. rekatın sonunda oturulur.",
                false
              )}
              {renderStep(
                "S",
                "Son Oturuş ve Selam",
                "Ettehiyyatü, Salli-Barik ve Rabbena duaları okunur. Önce sağa, sonra sola selam verilerek farz bitirilir.",
                true
              )}
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={20} color="#94A3B8" />
              <Text style={styles.infoRowText}>Farzın 3. ve 4. rekatlarında Fâtiha'dan sonra sure okunmaz.</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["rgba(18, 30, 54, 0.9)", "rgba(8, 12, 22, 0.9)"]}
            style={styles.sectionCard}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="book-outline" size={26} color="#D4AF37" />
              <Text style={styles.sectionTitle}>2 Rekat Son Sünnet</Text>
            </View>

            <View style={styles.niyetBox}>
              <MaterialCommunityIcons name="hands-pray" size={24} color="#D4AF37" />
              <Text style={styles.niyetText}>
                “Niyet ettim Allah rızası için bugünkü öğle namazının son sünnetini kılmaya.”
              </Text>
            </View>

            <View style={styles.pathwayContainer}>
              {renderStep(
                "1",
                "Birinci Rekat",
                "Tekbir alınır. Sübhaneke, Eûzü Besmele, Fâtiha ve zamm-ı sure okunur. Rükû ve secdeler yapılır."
              )}
              {renderStep(
                "2",
                "İkinci Rekat ve Selam",
                "Besmele, Fâtiha ve zamm-ı sure okunur. Rükû, secde ve son oturuşa geçilir. Ettehiyyatü, Salli-Barik ve Rabbena duaları okunup selam verilir.",
                true
              )}
            </View>
          </LinearGradient>

          <View style={styles.navigation}>
            <TouchableOpacity
              style={styles.navButtonSecondary}
              onPress={() => router.push("/namazlar/BesVakit/SabahNamazi" as any)}
            >
              <Ionicons name="chevron-back" size={18} color="#94A3B8" />
              <Text style={styles.navTextSecondary}>Sabah</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButtonPrimary}
              onPress={() => router.push("/namazlar/BesVakit/IkindiNamazi" as any)}
            >
              <Text style={styles.navTextPrimary}>İkindi Namazı</Text>
              <Ionicons name="chevron-forward" size={18} color="#080C16" />
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    alignItems: "flex-start",
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 10,
  },
  heroCard: {
    alignItems: "center",
    paddingVertical: 35,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.4)",
    marginBottom: 20,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "300",
    color: "#E2E8F0",
    letterSpacing: 2,
    marginTop: 15,
    marginBottom: 20,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    backgroundColor: "rgba(11, 16, 30, 0.8)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  badgeText: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: "600",
  },
  badgeHighlight: {
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    borderColor: "#D4AF37",
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  badgeTextHighlight: {
    color: "#D4AF37",
    fontSize: 14,
    fontWeight: "700",
  },
  sectionCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#D4AF37",
    letterSpacing: 0.5,
  },
  niyetBox: {
    flexDirection: "row",
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    padding: 18,
    borderRadius: 16,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: "#D4AF37",
    alignItems: "center",
    gap: 15,
  },
  niyetText: {
    flex: 1,
    color: "#E2E8F0",
    fontStyle: "italic",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  pathwayContainer: {
    paddingLeft: 5,
  },
  stepRow: {
    flexDirection: "row",
  },
  stepIndicator: {
    alignItems: "center",
    marginRight: 20,
    width: 28,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#121E36",
    borderWidth: 2,
    borderColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  stepDotText: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "bold",
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: "rgba(212, 175, 55, 0.3)",
    marginVertical: -2,
    zIndex: 1,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 35,
  },
  stepContentLast: {
    paddingBottom: 0,
  },
  stepTitle: {
    color: "#E2E8F0",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 2,
  },
  stepText: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    gap: 10,
  },
  infoRowText: {
    flex: 1,
    color: "#94A3B8",
    fontSize: 13,
    fontStyle: "italic",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  navButtonSecondary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 6,
  },
  navTextSecondary: {
    color: "#94A3B8",
    fontWeight: "600",
    fontSize: 15,
  },
  navButtonPrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D4AF37",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 6,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  navTextPrimary: {
    color: "#080C16",
    fontWeight: "700",
    fontSize: 15,
  },
});