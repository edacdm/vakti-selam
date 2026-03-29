import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "#D4AF37",
        tabBarInactiveTintColor: "#64748B",
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          Platform.select({
            ios: { position: "absolute" },
            default: {},
          }),
        ],
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Vakitler",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Kuran"
        options={{
          title: "Kur'an",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-page-variant" size={size} color={color} />
          ),
        }}
      />

      {/* Eski Dualar tabını gizle */}
      <Tabs.Screen
        name="Dualar"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="NamazHocasi"
        options={{
          title: "Rehber",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="hands-pray" size={size} color={color} />
          ),
        }}
      />

      {/* Kible tab'i kullanım dışı */}
      <Tabs.Screen
        name="Kible"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="Zikirmatik"
        options={{
          title: "Zikir",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="counter" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="DiniGunler"
        options={{
          title: "Takvim",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-month-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Explore tab'i layouttan gizliyoruz (Kullanım dışı) */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#0B101E",
    borderTopWidth: 1,
    borderTopColor: "rgba(212, 175, 55, 0.2)",
    height: Platform.OS === "ios" ? 85 : 70,
    paddingBottom: Platform.OS === "ios" ? 25 : 10,
    paddingTop: 10,
  },
});
