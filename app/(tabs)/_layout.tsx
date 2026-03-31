import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "../../i18n";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#D4AF37",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          backgroundColor: "#0B101E",
          borderTopColor: "rgba(212, 175, 55, 0.2)",
          height: Platform.OS === "ios" ? 88 : 65,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabPrayerTimes"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clock-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="KuranDualar"
        options={{
          title: t("tabQuran"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-page-variant" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="NamazHocasi"
        options={{
          title: t("tabGuide"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="mosque" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Zikirmatik"
        options={{
          title: t("tabDhikr"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="DiniGunler"
        options={{
          title: t("tabCalendar"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-month-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Hidden Screens but reachable via router */}
      <Tabs.Screen name="Kuran" options={{ href: null }} />
      <Tabs.Screen name="Dualar" options={{ href: null }} />
    </Tabs>
  );
}
