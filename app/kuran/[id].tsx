import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AyetItem {
  number: number;
  numberInSurah: number;
  arabic: string;
  turkish: string;
}

const SURE_NAMES: Record<number, string> = {
  1: "Fatiha", 2: "Bakara", 3: "Âl-i İmrân", 4: "Nisâ", 5: "Mâide",
  6: "En'âm", 7: "A'râf", 18: "Kehf", 36: "Yâsîn", 55: "Rahmân",
  56: "Vâkı'a", 67: "Mülk", 78: "Nebe'", 87: "A'lâ", 93: "Duhâ",
  94: "İnşirâh", 97: "Kadr", 99: "Zilzâl", 103: "Asr", 105: "Fîl",
  106: "Kureyş", 107: "Mâûn", 108: "Kevser", 109: "Kâfirûn",
  112: "İhlâs", 113: "Felak", 114: "Nâs",
};

export default function SureOkuma() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const parsedId = parseInt(idParam ?? "1", 10);
  const sureId = isNaN(parsedId) ? 1 : parsedId;
  const sureName = SURE_NAMES[sureId] ?? `${sureId}. Sure`;

  const [ayetler, setAyetler] = useState<AyetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [activeAyet, setActiveAyet] = useState<number | null>(null);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadSure();
    return () => { sound?.unloadAsync(); };
  }, [sureId]);

  const loadSure = async () => {
    try {
      setLoading(true);
      setError("");

      const arabicRes = await fetch(`https://api.alquran.cloud/v1/surah/${sureId}`);
      const arabicData = await arabicRes.json();

      const turkishRes = await fetch(`https://api.alquran.cloud/v1/surah/${sureId}/tr.diyanet`);
      const turkishData = await turkishRes.json();

      if (arabicData.code !== 200 || !arabicData.data || !arabicData.data.ayahs) {
        throw new Error("Sure verisi alınamadı.");
      }

      const ayets: AyetItem[] = arabicData.data.ayahs.map((a: any, i: number) => ({
        number: a.number,
        numberInSurah: a.numberInSurah,
        arabic: a.text,
        turkish: turkishData.data?.ayahs?.[i]?.text ?? "",
      }));

      setAyetler(ayets);
    } catch (e) {
      setError("Sureler yüklenirken bir hata oluştu. İnternet bağlantınızı kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFullAudio = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const paddedId = sureId.toString().padStart(3, "0");
    const audioUrl = `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${paddedId}.mp3`;

    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
        return;
      }

      setIsAudioLoading(true);
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setActiveAyet(null);
            }
          }
        }
      );
      setSound(newSound);
      setIsPlaying(true);
    } catch (e) {
    } finally {
      setIsAudioLoading(false);
    }
  };

  const stopAudio = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setActiveAyet(null);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    stopAudio();
    router.back();
  };

  const renderAyet = ({ item }: { item: AyetItem }) => (
    <View style={[styles.ayetContainer, activeAyet === item.numberInSurah && styles.ayetContainerActive]}>
      <View style={styles.ayetNumBadge}>
        <Text style={styles.ayetNumText}>{item.numberInSurah}</Text>
      </View>
      <View style={styles.ayetContent}>
        <Text style={styles.ayetArabic}>{item.arabic}</Text>
        <View style={styles.ayetDivider} />
        <Text style={styles.ayetTurkish}>{item.turkish}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#0B101E", "#15233E"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#D4AF37" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{sureName}</Text>
            <Text style={styles.headerSub}>{sureId}. Sure · {ayetler.length > 0 ? `${ayetler.length} Ayet` : ""}</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        {!loading && !error && (
          <BlurView intensity={20} tint="dark" style={styles.audioPlayer}>
            <View style={styles.audioPlayerLeft}>
              <MaterialCommunityIcons name="music-note" size={20} color="#D4AF37" />
              <Text style={styles.audioPlayerText}>Mishary Alafasy</Text>
            </View>
            <View style={styles.audioPlayerRight}>
              {isPlaying && (
                <TouchableOpacity style={styles.audioStopBtn} onPress={stopAudio}>
                  <Ionicons name="stop" size={16} color="#EF4444" />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.audioPlayBtn} onPress={toggleFullAudio}>
                {isAudioLoading ? (
                  <ActivityIndicator size="small" color="#0B101E" />
                ) : (
                  <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="#0B101E" />
                )}
                <Text style={styles.audioPlayText}>
                  {isAudioLoading ? "Yükleniyor" : isPlaying ? "Duraklat" : "Dinle"}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        )}

        {!loading && !error && sureId !== 9 && (
          <View style={styles.besmeleBox}>
            <Text style={styles.besmeleText}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
          </View>
        )}

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#D4AF37" />
            <Text style={styles.loadingText}>Sure yükleniyor...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerBox}>
            <Ionicons name="wifi-outline" size={48} color="#64748B" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={loadSure}>
              <Text style={styles.retryText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={ayetler}
            keyExtractor={(item) => item.number.toString()}
            renderItem={renderAyet}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 44, height: 44,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.3)",
  },
  headerCenter: { alignItems: "center" },
  headerTitle: { color: "#E2E8F0", fontSize: 18, fontWeight: "700", letterSpacing: 1 },
  headerSub: { color: "#D4AF37", fontSize: 12, marginTop: 4, fontWeight: "600" },
  audioPlayer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.2)",
    overflow: "hidden"
  },
  audioPlayerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  audioPlayerText: { color: "#D4AF37", fontSize: 13, fontWeight: "600" },
  audioPlayerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  audioPlayBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#D4AF37",
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 12,
  },
  audioPlayText: { color: "#0B101E", fontWeight: "800", fontSize: 12, letterSpacing: 1 },
  audioStopBtn: {
    width: 36, height: 36,
    backgroundColor: "rgba(239,68,68,0.1)",
    borderRadius: 10, borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    justifyContent: "center", alignItems: "center",
  },
  besmeleBox: {
    alignItems: "center",
    paddingVertical: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 18,
    backgroundColor: "rgba(212,175,55,0.06)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.15)",
  },
  besmeleText: {
    color: "#D4AF37",
    fontSize: 26,
    fontWeight: "400",
    writingDirection: "rtl",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  ayetContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212,175,55,0.1)",
  },
  ayetContainerActive: {
    backgroundColor: "rgba(212,175,55,0.06)",
    borderRadius: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 0,
    marginVertical: 2,
  },
  ayetNumBadge: {
    width: 34, height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(212,175,55,0.15)",
    borderWidth: 1, borderColor: "rgba(212,175,55,0.3)",
    justifyContent: "center", alignItems: "center",
    marginRight: 14,
    marginTop: 4,
    flexShrink: 0,
  },
  ayetNumText: { color: "#D4AF37", fontSize: 12, fontWeight: "700" },
  ayetContent: { flex: 1 },
  ayetArabic: {
    color: "#D4AF37",
    fontSize: 26,
    textAlign: "right",
    lineHeight: 45,
    writingDirection: "rtl",
    fontWeight: "400",
  },
  ayetDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginVertical: 15,
  },
  ayetTurkish: {
    color: "#E2E8F0",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "left",
  },
  centerBox: {
    flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 30,
  },
  loadingText: { color: "#D4AF37", marginTop: 15, fontSize: 15 },
  errorText: { color: "#E2E8F0", textAlign: "center", marginTop: 15, lineHeight: 22 },
  retryBtn: {
    marginTop: 20, backgroundColor: "#D4AF37",
    paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12,
  },
  retryText: { color: "#0B101E", fontWeight: "bold" },
});