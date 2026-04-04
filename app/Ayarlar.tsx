import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { LANGUAGE_OPTIONS, useTranslation } from "../i18n";
import type { Language } from "../i18n";
import {
  cancelHadithNotifications,
  cancelPrayerNotifications,
  requestNotificationPermissions,
  scheduleDailyHadith,
} from "../services/notificationService";
import { useAppStore } from "../store/appStore";

export default function Ayarlar() {
  const router = useRouter();
  const { language, setLanguage, t } = useTranslation();
  const {
    prayerNotificationsEnabled,
    setPrayerNotificationsEnabled,
    hadithNotificationsEnabled,
    setHadithNotificationsEnabled,
    userName,
    setUserName,
    loadSettings,
  } = useAppStore();

  const [tempName, setTempName] = useState(userName);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    setTempName(userName);
  }, [userName]);

  const handleLanguageChange = async (lang: Language) => {
    await setLanguage(lang);
  };

  const handleNameChange = (val: string) => {
    setTempName(val);
    setUserName(val);
  };

  const handlePrayerToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) return;
    } else {
      await cancelPrayerNotifications();
    }
    setPrayerNotificationsEnabled(value);
  };

  const handleHadithToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) return;
      await scheduleDailyHadith();
    } else {
      await cancelHadithNotifications();
    }
    setHadithNotificationsEnabled(value);
  };

  return (
    <LinearGradient colors={["#080D1A", "#0E1C33"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#D4AF37" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("settingsTitle" as any)}</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          {/* Profile Section */}
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={20} color="#D4AF37" />
            <Text style={styles.sectionTitle}>{t("profileSection" as any)}</Text>
          </View>
          <View style={styles.profileCard}>
            <Text style={styles.labelSmall}>{t("userNameLabel" as any)}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.nameInput}
                value={tempName}
                onChangeText={handleNameChange}
                placeholder={t("userNamePlaceholder" as any)}
                placeholderTextColor="rgba(255,255,255,0.2)"
              />
              <Ionicons name="pencil-outline" size={16} color="rgba(212,175,55,0.4)" />
            </View>
          </View>

          {/* Language Section */}
          <View style={[styles.sectionHeader, { marginTop: 25 }]}>
            <MaterialCommunityIcons name="translate" size={20} color="#D4AF37" />
            <Text style={styles.sectionTitle}>{t("languageSection" as any)}</Text>
          </View>
          <Text style={styles.sectionDesc}>{t("languageDesc" as any)}</Text>

          <View style={styles.languageGrid}>
            {LANGUAGE_OPTIONS.map((opt) => {
              const active = language === opt.code;
              return (
                <TouchableOpacity
                  key={opt.code}
                  style={[styles.langCard, active && styles.langCardActive]}
                  onPress={() => handleLanguageChange(opt.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.langFlag}>{opt.flag}</Text>
                  <Text style={[styles.langLabel, active && styles.langLabelActive]}>
                    {opt.label}
                  </Text>
                  {active && (
                    <View style={styles.langCheck}>
                      <Ionicons name="checkmark" size={14} color="#0B101E" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Notification Section */}
          <View style={[styles.sectionHeader, { marginTop: 30 }]}>
            <Ionicons name="notifications-outline" size={20} color="#D4AF37" />
            <Text style={styles.sectionTitle}>{t("notificationSection" as any)}</Text>
          </View>

          {/* Prayer Notification */}
          <View style={styles.notifCard}>
            <View style={styles.notifIconBox}>
              <MaterialCommunityIcons name="mosque" size={22} color="#0B101E" />
            </View>
            <View style={styles.notifTextBox}>
              <Text style={styles.notifTitle}>{t("prayerNotification" as any)}</Text>
              <Text style={styles.notifDesc}>{t("prayerNotificationDesc" as any)}</Text>
            </View>
            <Switch
              value={prayerNotificationsEnabled}
              onValueChange={handlePrayerToggle}
              trackColor={{ false: "rgba(255,255,255,0.1)", true: "rgba(212,175,55,0.4)" }}
              thumbColor={prayerNotificationsEnabled ? "#D4AF37" : "#64748B"}
            />
          </View>

          {/* Hadith Notification */}
          <View style={styles.notifCard}>
            <View style={styles.notifIconBox}>
              <MaterialCommunityIcons name="book-open-page-variant" size={22} color="#0B101E" />
            </View>
            <View style={styles.notifTextBox}>
              <Text style={styles.notifTitle}>{t("hadithNotification" as any)}</Text>
              <Text style={styles.notifDesc}>{t("hadithNotificationDesc" as any)}</Text>
            </View>
            <Switch
              value={hadithNotificationsEnabled}
              onValueChange={handleHadithToggle}
              trackColor={{ false: "rgba(255,255,255,0.1)", true: "rgba(212,175,55,0.4)" }}
              thumbColor={hadithNotificationsEnabled ? "#D4AF37" : "#64748B"}
            />
          </View>

          <View style={{ height: 50 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === "android" ? 40 : 0 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 10 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#E2E8F0",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  sectionDesc: {
    color: "#94A3B8",
    fontSize: 13,
    marginBottom: 16,
    marginLeft: 30,
  },

  profileCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  labelSmall: {
    color: "#D4AF37",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: "uppercase",
    opacity: 0.8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.1)",
  },
  nameInput: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },

  languageGrid: { gap: 12 },
  langCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    gap: 14,
  },
  langCardActive: {
    backgroundColor: "rgba(212,175,55,0.1)",
    borderColor: "rgba(212,175,55,0.4)",
  },
  langFlag: { fontSize: 28 },
  langLabel: {
    flex: 1,
    color: "#CBD5E1",
    fontSize: 16,
    fontWeight: "500",
  },
  langLabelActive: {
    color: "#D4AF37",
    fontWeight: "700",
  },
  langCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
  },

  notifCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 12,
    gap: 14,
  },
  notifIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
  },
  notifTextBox: { flex: 1 },
  notifTitle: {
    color: "#E2E8F0",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 3,
  },
  notifDesc: {
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 17,
  },
});
