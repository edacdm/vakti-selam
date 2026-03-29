import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NafileNamazlar() {
  const router = useRouter();

  const renderListItem = (
    path: string,
    iconName: any,
    title: string,
    desc: string,
    badgeText?: string
  ) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => router.push(path as any)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.01)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.listItemInner}
      >
        <View style={styles.listIconBox}>
          <MaterialCommunityIcons name={iconName} size={26} color="#0B101E" />
        </View>
        <View style={styles.listTextContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.listTitle}>{title}</Text>
            {badgeText && (
              <View style={styles.badgeBox}>
                 <Text style={styles.badgeText}>{badgeText}</Text>
              </View>
            )}
          </View>
          <Text style={styles.listDesc}>{desc}</Text>
        </View>
        <View style={styles.chevronBox}>
           <Ionicons name="chevron-forward" size={18} color="#D4AF37" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#0B101E", "#15233E"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#D4AF37" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nafile Namazlar</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <LinearGradient
            colors={["rgba(212, 175, 55, 0.15)", "rgba(212, 175, 55, 0.02)"]}
            style={styles.heroCard}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroIconBg}>
                <Ionicons name="moon-outline" size={38} color="#D4AF37" />
              </View>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>Gönüllü İbadetler</Text>
                <Text style={styles.heroSubtitle}>Teheccüd, Kuşluk ve Fazlası</Text>
              </View>
            </View>
            <View style={styles.separator} />
            <Text style={styles.heroQuote}>
              Farzların dışında sevap kazanmak amacıyla kılınan namazlardır.
            </Text>
          </LinearGradient>

          <View style={styles.listContainer}>
            {renderListItem(
              "/namazlar/NafileNamazlar/Teheccud",
              "weather-night",
              "Teheccüd",
              "Gecenin üçte birinde kılınan namaz",
              "Gece"
            )}
            {renderListItem(
              "/namazlar/NafileNamazlar/Kusluk",
              "weather-sunny",
              "Kuşluk (Duha)",
              "Güneş doğduktan sonra",
              "Gündüz"
            )}
            {renderListItem(
              "/namazlar/NafileNamazlar/Evvabin",
              "weather-sunset",
              "Evvabin",
              "Akşam namazından hemen sonra",
              "Akşam"
            )}
            {renderListItem(
              "/namazlar/NafileNamazlar/TahiyyetulMescid",
              "arch",
              "Tahiyyetü'l Mescid",
              "Camiye girildiğinde kılınır",
              "Cami"
            )}
            {renderListItem(
              "/namazlar/NafileNamazlar/Hacet",
              "hand-heart-outline",
              "Hacet Namazı",
              "Bir dilek için kılınan namaz",
              "Dilek"
            )}
            {renderListItem(
              "/namazlar/NafileNamazlar/Sukur",
              "heart-outline",
              "Şükür Namazı",
              "Gelen bir nimete karşılık olarak",
              "Şükür"
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
        
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    color: "#D4AF37",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  heroCard: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    elevation: 5,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroIconBg: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "rgba(11, 16, 30, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  heroTextContainer: { flex: 1 },
  heroTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E2E8F0",
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#D4AF37",
    marginTop: 4,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(212, 175, 55, 0.2)",
    marginVertical: 18,
  },
  heroQuote: {
    color: "#94A3B8",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 22,
    textAlign: "center",
  },
  listContainer: { gap: 15 },
  listItem: {
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 3,
  },
  listItemInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  listIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#D4AF37",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  listTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E2E8F0",
    marginRight: 8,
  },
  badgeBox: {
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  badgeText: {
    fontSize: 9,
    color: "#D4AF37",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  listDesc: {
    fontSize: 12,
    color: "#94A3B8",
    lineHeight: 18,
    paddingRight: 10,
  },
  chevronBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(11, 16, 30, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
