import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useTranslation } from "../../i18n";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  translation: string;
}

const SURAH_LIST_URL = "https://api.alquran.cloud/v1/surah";

export default function KuranScreen() {
  const { t, language } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      const response = await fetch(SURAH_LIST_URL);
      const data = await response.json();
      setSurahs(data.data);
      setFilteredSurahs(data.data);
    } catch (error) {
      console.error("Sure listesi yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(text.toLowerCase()) ||
        s.number.toString().includes(text)
    );
    setFilteredSurahs(filtered);
  };

  const openSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setModalVisible(true);
    setLoadingAyahs(true);
    setAyahs([]);

    try {
      // Determine translation ID based on language
      // 77: TR (Diyanet), 22: EN (Saheeh Intl), 33: ID (Kemenag)
      const transId = language === "tr" ? 77 : language === "id" ? 33 : 22;
      
      const [arabicRes, transRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-simple-clean,id.indonesian,tr.diyanet,en.sahih`)
      ]);

      const arabicData = await arabicRes.json();
      const multiData = await transRes.json();

      const arabicText = multiData.data[0].ayahs;
      const idTrans = multiData.data[1].ayahs;
      const trTrans = multiData.data[2].ayahs;
      const enTrans = multiData.data[3].ayahs;

      const combinedAyahs = arabicText.map((a: any, index: number) => ({
        number: a.numberInSurah,
        text: a.text,
        translation: language === "id" ? idTrans[index].text : language === "tr" ? trTrans[index].text : enTrans[index].text
      }));

      setAyahs(combinedAyahs);
    } catch (error) {
      console.error("Ayetler yüklenemedi:", error);
    } finally {
      setLoadingAyahs(false);
    }
  };

  const renderSurahItem = ({ item }: { item: Surah }) => (
    <TouchableOpacity style={styles.surahCard} onPress={() => openSurah(item)}>
      <View style={styles.surahNumberBox}>
        <Text style={styles.surahNumberText}>{item.number}</Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={styles.surahName}>{item.englishName}</Text>
        <Text style={styles.surahSubtitle}>{item.revelationType === "Meccan" ? "Mekki" : "Medeni"} • {item.numberOfAyahs} Ayet</Text>
      </View>
      <Text style={styles.arabicName}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={18} color="#D4AF37" style={{ marginLeft: 10 }} />
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#080C16", "#121E36"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("tabQuran")}</Text>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Sure Ara..."
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#D4AF37" />
          </View>
        ) : (
          <FlatList
            data={filteredSurahs}
            keyExtractor={(item) => item.number.toString()}
            renderItem={renderSurahItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}

        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <LinearGradient colors={["#080C16", "#121E36"]} style={styles.modalScroll}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                  <Ionicons name="close" size={28} color="#D4AF37" />
                </TouchableOpacity>
                <View style={styles.modalTitleBox}>
                  <Text style={styles.modalTitle}>{selectedSurah?.englishName}</Text>
                  <Text style={styles.modalSubtitle}>{selectedSurah?.name}</Text>
                </View>
                <View style={{ width: 44 }} />
              </View>

              {loadingAyahs ? (
                <View style={styles.center}>
                  <ActivityIndicator size="large" color="#D4AF37" />
                </View>
              ) : (
                <FlatList
                  data={ayahs}
                  keyExtractor={(item) => item.number.toString()}
                  contentContainerStyle={styles.ayahList}
                  renderItem={({ item }) => (
                    <View style={styles.ayahContainer}>
                      <View style={styles.ayahHeader}>
                        <View style={styles.ayahNumberCircle}>
                          <Text style={styles.ayahNumberText}>{item.number}</Text>
                        </View>
                        <View style={styles.ayahLine} />
                      </View>
                      <Text style={styles.ayahArabic}>{item.text}</Text>
                      <Text style={styles.ayahTranslation}>{item.translation}</Text>
                    </View>
                  )}
                />
              )}
            </SafeAreaView>
          </LinearGradient>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { padding: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#E2E8F0", marginBottom: 15 },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  searchInput: { flex: 1, marginLeft: 10, color: "#E2E8F0", fontSize: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 20, paddingBottom: 100 },
  surahCard: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(18, 30, 54, 0.6)", padding: 15, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: "rgba(212,175,55,0.15)" },
  surahNumberBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(212,175,55,0.1)", justifyContent: "center", alignItems: "center", marginRight: 15 },
  surahNumberText: { color: "#D4AF37", fontWeight: "bold", fontSize: 16 },
  surahInfo: { flex: 1 },
  surahName: { color: "#E2E8F0", fontSize: 16, fontWeight: "600" },
  surahSubtitle: { color: "#94A3B8", fontSize: 12, marginTop: 2 },
  arabicName: { color: "#D4AF37", fontSize: 20, fontFamily: Platform.OS === "ios" ? "Georgia" : "serif" },
  
  modalScroll: { flex: 1 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, borderBottomWidth: 1, borderBottomColor: "rgba(212,175,55,0.2)" },
  closeBtn: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  modalTitleBox: { alignItems: "center" },
  modalTitle: { color: "#E2E8F0", fontSize: 20, fontWeight: "bold" },
  modalSubtitle: { color: "#D4AF37", fontSize: 18, marginTop: 4 },
  ayahList: { padding: 20, paddingBottom: 50 },
  ayahContainer: { marginBottom: 30 },
  ayahHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  ayahNumberCircle: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: "#D4AF37", justifyContent: "center", alignItems: "center", marginRight: 10 },
  ayahNumberText: { color: "#D4AF37", fontSize: 12, fontWeight: "bold" },
  ayahLine: { flex: 1, height: 1, backgroundColor: "rgba(212,175,55,0.1)" },
  ayahArabic: { color: "#E2E8F0", fontSize: 24, textAlign: "right", lineHeight: 45, marginBottom: 15, fontFamily: Platform.OS === "ios" ? "Georgia" : "serif" },
  ayahTranslation: { color: "#94A3B8", fontSize: 15, lineHeight: 22, fontStyle: "italic" },
});
