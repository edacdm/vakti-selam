import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Animated, Dimensions, FlatList, Modal,
  SafeAreaView, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import { Colors } from "../../constants/Colors";
import { useTranslation } from "../../i18n";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Surah { number: number; name: string; englishName: string; englishNameTranslation: string; numberOfAyahs: number; revelationType: string; }
interface Ayah { number: number; text: string; translation: string; audio: string; }
interface DuaItem { typeKey: string; titleKey: string; arabic: string; okunus: string; anlamKey: string; audioSource?: any; }

const dualarData: DuaItem[] = [
  { typeKey: "typeDua", titleKey: "subhanakaDua", arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ", okunus: "Sübhânekellâhümme ve bi hamdik ve tebârekesmük ve teâlâ ceddük ve lâ ilâhe ğayruk.", anlamKey: "subhanakaMeaning", audioSource: require("../../assets/audio/subhaneke.mp3") },
  { typeKey: "typeDua", titleKey: "ettehiyyatuDua", arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ", okunus: "Ettehiyyâtü lillâhi vessalevâtü vettayyibât...", anlamKey: "ettehiyyatuMeaning", audioSource: require("../../assets/audio/ettehiyyatu.mp3") },
  { typeKey: "typeDua", titleKey: "allahummaSalli", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ", okunus: "Allâhümme salli alâ Muhammedin ve alâ âli Muhammed...", anlamKey: "allahummaSalliMeaning", audioSource: require("../../assets/audio/salli.mp3") },
  { typeKey: "typeDua", titleKey: "allahummaBarik", arabic: "اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ", okunus: "Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed...", anlamKey: "allahummaBarikMeaning", audioSource: require("../../assets/audio/barik.mp3") },
  { typeKey: "typeDua", titleKey: "rabbanaAtina", arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", okunus: "Rabbenâ âtinâ fi'd-dünyâ haseneten ve fi'l-âhireti haseneten ve qinâ azâbe'n-nâr.", anlamKey: "rabbanaAtinaMeaning", audioSource: require("../../assets/audio/rabbena.mp3") },
  { typeKey: "typeDua", titleKey: "qunutDuas", arabic: "اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنَسْتَهْدِيكَ وَنُؤْمِنُ بِكَ وَنَتُوبُ إِلَيْكَ...", okunus: "Allâhümme innâ nesteînüke ve nesteğfiruke ve nestehdîk...", anlamKey: "qunutMeaning", audioSource: require("../../assets/audio/kunut.mp3") },
  { typeKey: "typeSurah", titleKey: "fatiha", arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۞ الرَّحْمَنِ الرَّحِيمِ ۞ مَالِكِ يَوْمِ الدِّينِ ۞ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۞ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ...", okunus: "Elhamdü lillâhi rabbi'l-âlemîn. Errahmânirrahîm...", anlamKey: "fatihaMeaning", audioSource: require("../../assets/audio/001.mp3") },
  { typeKey: "typeSurah", titleKey: "ayatulKursi", arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ...", okunus: "Allâhü lâ ilâhe illâ hüvel hayyül kayyûm...", anlamKey: "ayatulKursiMeaning", audioSource: require("../../assets/audio/002255.mp3") },
  { typeKey: "typeSurah", titleKey: "inshirahSurah", arabic: "أَلَمْ نَشْرَح| لَكَ صَدْرَكَ ۞ وَوَضَعْنَا عَنكَ وِزْرَكَ...", okunus: "Elem neşrah leke sadrak. Ve veda'nâ anke vizrak...", anlamKey: "inshirahMeaning", audioSource: require("../../assets/audio/094.mp3") },
  { typeKey: "typeSurah", titleKey: "zilzalSurah", arabic: "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا ۞ وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا...", okunus: "İzâ zülziletil ardu zilzâlehâ. Ve ahrecetil ardu eskâlehâ...", anlamKey: "zilzalMeaning", audioSource: require("../../assets/audio/099.mp3") },
  { typeKey: "typeSurah", titleKey: "takathurSurah", arabic: "أَلْهَاكُمُ التَّكَاثُرُ ۞ حَتَّىٰ زُرْتُمُ الْمَقَابِرَ...", okunus: "Elhâkümüt tekasür. Hattâ zürtümül mekabir...", anlamKey: "takathurMeaning", audioSource: require("../../assets/audio/102.mp3") },
  { typeKey: "typeSurah", titleKey: "asrSurah", arabic: "وَالْعَصْرِ ۞ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ...", okunus: "Vel asr. İnnel insâne lefî husr...", anlamKey: "asrMeaning", audioSource: require("../../assets/audio/103.mp3") },
  { typeKey: "typeSurah", titleKey: "filSurah", arabic: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ...", okunus: "Elem tera keyfe feale rabbüke bi ashâbil fîl...", anlamKey: "filMeaning", audioSource: require("../../assets/audio/105.mp3") },
  { typeKey: "typeSurah", titleKey: "quraishSurah", arabic: "لِإِيْلَافِ قُرَيْشٍ ۞ إِيْلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ...", okunus: "Li îlâfi kurayş. Îlâfihim rihleteş şitâi ves sayf...", anlamKey: "quraishMeaning", audioSource: require("../../assets/audio/106.mp3") },
  { typeKey: "typeSurah", titleKey: "maunSurah", arabic: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ۞ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ...", okunus: "Eraeytellezî yükezzibü biddîn. Fezâlikellezî yedü'ul yetîm...", anlamKey: "maunMeaning", audioSource: require("../../assets/audio/107.mp3") },
  { typeKey: "typeSurah", titleKey: "kavtharSurah", arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۞ فَصَلِّ لِرَبِّكَ وَانْحَرْ...", okunus: "İnnâ a'taynâkel kevser. Fesalli li rabbike venhar...", anlamKey: "kavtharMeaning", audioSource: require("../../assets/audio/108.mp3") },
  { typeKey: "typeSurah", titleKey: "kafirunSurah", arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ ۞ لَا أَعْبُدُ مَا تَعْبُدُونَ...", okunus: "Kul yâ eyyühel kâfirûn. Lâ a'büdü mâ ta'büdûn...", anlamKey: "kafirunMeaning", audioSource: require("../../assets/audio/109.mp3") },
  { typeKey: "typeSurah", titleKey: "nasrSurah", arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ۞ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا...", okunus: "İzâ câe nasrullâhi vel feth. Ve raeytennâse yedhulûne fî dînillâhi efvâcâ...", anlamKey: "nasrMeaning", audioSource: { uri: "https://download.quranicaudio.com/quran/mishari_rashid_al_afasy/110.mp3" } },
  { typeKey: "typeSurah", titleKey: "tebbetSurah", arabic: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ ۞ مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ...", okunus: "Tebbet yedâ ebî lehebin ve tebb. Mâ ağnâ anhü mâlühü ve mâ keseb...", anlamKey: "tebbetMeaning", audioSource: { uri: "https://download.quranicaudio.com/quran/mishari_rashid_al_afasy/111.mp3" } },
  { typeKey: "typeSurah", titleKey: "ikhlasSurah", arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ...", okunus: "Kul hüvellâhü ehad. Allâhüssamed...", anlamKey: "ikhlasMeaning", audioSource: require("../../assets/audio/112.mp3") },
  { typeKey: "typeSurah", titleKey: "falaqSurah", arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِنْ شَرِّ مَا خَلَقَ...", okunus: "Kul eûzü birabbil felak. Min şerri mâ halak...", anlamKey: "falaqMeaning", audioSource: require("../../assets/audio/113.mp3") },
  { typeKey: "typeSurah", titleKey: "nasSurah", arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ...", okunus: "Kul eûzü birabbinnâs. Melikinnâs...", anlamKey: "nasMeaning", audioSource: require("../../assets/audio/114.mp3") },
];

const LOCAL_SURAH_AUDIO: Record<number, any> = {
  1: require("../../assets/audio/001.mp3"),
  94: require("../../assets/audio/094.mp3"),
  99: require("../../assets/audio/099.mp3"),
  102: require("../../assets/audio/102.mp3"),
  103: require("../../assets/audio/103.mp3"),
  105: require("../../assets/audio/105.mp3"),
  106: require("../../assets/audio/106.mp3"),
  107: require("../../assets/audio/107.mp3"),
  108: require("../../assets/audio/108.mp3"),
  109: require("../../assets/audio/109.mp3"),
  112: require("../../assets/audio/112.mp3"),
  113: require("../../assets/audio/113.mp3"),
  114: require("../../assets/audio/114.mp3"),
};

export default function KuranDualar() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"surah" | "dua">("surah");
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [loadingSurahs, setLoadingSurahs] = useState(true);
  const [quranSearch, setQuranSearch] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [quranSound, setQuranSound] = useState<Audio.Sound | null>(null);
  const [playingAyahIdx, setPlayingAyahIdx] = useState<number | null>(null);
  const [featuredSound, setFeaturedSound] = useState<Audio.Sound | null>(null);
  const [playingSource, setPlayingSource] = useState<string | null>(null);
  const [playback, setPlayback] = useState({ isPlaying: false, position: 0, duration: 0 });
  const [viewingDua, setViewingDua] = useState<DuaItem | null>(null);

  const mandalaRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://api.alquran.cloud/v1/surah");
        const d = await res.json();
        setSurahs(d.data);
        setFilteredSurahs(d.data);
      } catch (e) { } finally { setLoadingSurahs(false); }
    })();

    Animated.loop(
      Animated.timing(mandalaRotation, { toValue: 1, duration: 120000, useNativeDriver: true })
    ).start();

    return () => { quranSound?.unloadAsync(); featuredSound?.unloadAsync(); };
  }, []);

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPlayback({ isPlaying: status.isPlaying, position: status.positionMillis, duration: status.durationMillis || 0 });
      if (status.didJustFinish) setPlayingSource(null);
    }
  };

  const handleSearch = (text: string) => {
    setQuranSearch(text);
    const filtered = surahs.filter(s => s.englishName.toLowerCase().includes(text.toLowerCase()) || s.name.includes(text));
    setFilteredSurahs(filtered);
  };

  const playDua = async (dua: DuaItem) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setViewingDua(dua);

      if (featuredSound) {
        await featuredSound.unloadAsync();
        setFeaturedSound(null);
      }

      if (!dua.audioSource) return;

      if (playingSource === dua.titleKey) {
        setPlayingSource(null);
        return;
      }

      setPlayingSource(dua.titleKey);
      const { sound } = await Audio.Sound.createAsync(
        dua.audioSource,
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setFeaturedSound(sound);
    } catch (e) {
      console.log("Audio play error", e);
    }
  };

  const playSurahAudio = async (s: Surah) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const local = LOCAL_SURAH_AUDIO[s.number];
    const source = local ? local : { uri: `https://download.quranicaudio.com/quran/mishari_rashid_al_afasy/${String(s.number).padStart(3, '0')}.mp3` };
    try {
      if (quranSound) await quranSound.stopAsync();
      if (featuredSound) {
        if (playingSource === `surah_${s.number}`) {
          playback.isPlaying ? await featuredSound.pauseAsync() : await featuredSound.playAsync();
          return;
        } else await featuredSound.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true }, onPlaybackStatusUpdate);
      setFeaturedSound(sound);
      setPlayingSource(`surah_${s.number}`);
    } catch (e) { }
  };

  const playAyah = async (url: string, index: number) => {
    if (quranSound) await quranSound.unloadAsync();
    setPlayingAyahIdx(index);
    const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true }, s => { if (s.isLoaded && s.didJustFinish) setPlayingAyahIdx(null); });
    setQuranSound(sound);
  };

  const openSurah = async (surah: Surah) => {
    setSelectedSurah(surah); setModalVisible(true); setLoadingAyahs(true);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-simple-clean,tr.diyanet,ar.alafasy`);
      const data = await res.json();
      setAyahs(data.data[0].ayahs.map((a: any, i: number) => ({ number: a.numberInSurah, text: a.text, translation: data.data[1].ayahs[i].text, audio: data.data[2].ayahs[i].audio })));
    } catch (e) { } finally { setLoadingAyahs(false); }
  };

  return (
    <LinearGradient colors={[Colors.luxury.midnight, Colors.luxury.midnightDeep]} style={styles.container}>
      <Animated.Image
        source={require("../../assets/images/mandala_bg.png")}
        style={[styles.mandalaBase, { transform: [{ rotate: mandalaRotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }, { scale: 2 }] }]}
        resizeMode="contain"
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
          <View style={styles.header}>
            <View style={styles.titleWrapper}>
              <Text style={styles.pageSubHeader}>{t("tabQuran" as any)?.toUpperCase() || "KUR'AN"}</Text>
              <View style={styles.goldDot} />
              <Text style={styles.appNameLuxury}>VAKTİ SELAM</Text>
            </View>
          </View>

          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
              <TouchableOpacity style={[styles.categoryChip, activeTab === "surah" && styles.activeChip]} onPress={() => setActiveTab("surah")}>
                <Text style={[styles.chipText, activeTab === "surah" && styles.activeChipText]}>{t("typeSurah" as any)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.categoryChip, activeTab === "dua" && styles.activeChip]} onPress={() => setActiveTab("dua")}>
                <Text style={[styles.chipText, activeTab === "dua" && styles.activeChipText]}>{t("typeDua" as any)}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.searchContainer}>
            <BlurView intensity={30} tint="dark" style={styles.searchGlass}>
              <Ionicons name="search" size={18} color="rgba(212, 175, 55, 0.5)" style={styles.searchIcon} />
              <TextInput style={styles.searchBar} placeholder={t("searchSurah" as any) || "Ara..."} placeholderTextColor="rgba(255,255,255,0.3)" value={quranSearch} onChangeText={handleSearch} />
            </BlurView>
          </View>

          {activeTab === "dua" ? (
            <View style={styles.duaGrid}>
              {dualarData.map((d, index) => (
                <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => playDua(d)} style={styles.luxuryCardWrapper}>
                  <LinearGradient colors={["rgba(212, 175, 55, 0.25)", "rgba(212, 175, 55, 0.05)"]} style={styles.goldBorder} />
                  <BlurView intensity={25} tint="dark" style={styles.luxuryCardInner}>
                    <View style={styles.cardHeader}>
                      <View style={styles.headerDot} />
                      <Text style={styles.cardTitle}>{t("typeDua" as any).toUpperCase()}</Text>
                      <TouchableOpacity onPress={() => playDua(d)} style={[styles.surahPlaySmall, playingSource === `dua_${d.titleKey}` && playback.isPlaying && styles.surahPlaySmallActive]}>
                        <Ionicons name={playingSource === `dua_${d.titleKey}` && playback.isPlaying ? "pause" : "play"} size={12} color={playingSource === `dua_${d.titleKey}` && playback.isPlaying ? Colors.luxury.midnight : Colors.luxury.gold} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.duaMainContent}>
                      <Text style={styles.duaArabicSmall}>{d.arabic}</Text>
                      <Text style={styles.duaTitleSmall}>{t(d.titleKey as any)}</Text>
                      <Text style={styles.duaMeaningSmall} numberOfLines={2}>{t(d.anlamKey as any)}</Text>
                    </View>
                    <View style={styles.cornerOrnamentTop} />
                    <View style={styles.cornerOrnamentBottom} />
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.surahList}>
              {loadingSurahs ? <ActivityIndicator color={Colors.luxury.gold} style={{ marginTop: 40 }} /> : (
                filteredSurahs.map(s => (
                  <TouchableOpacity key={s.number} activeOpacity={0.8} onPress={() => openSurah(s)} style={styles.surahCardWrapper}>
                    <BlurView intensity={20} tint="dark" style={styles.surahCardInner}>
                      <View style={styles.surahCardLeft}>
                        <View style={styles.surahNumberCircle}><Text style={styles.surahNumberText}>{s.number}</Text></View>
                        <View>
                          <Text style={styles.surahTitleMain}>{s.englishName}</Text>
                          <Text style={styles.surahMetaSmall}>{s.revelationType === "Meccan" ? "Mekki" : "Medeni"} • {s.numberOfAyahs} {t("ayahCount" as any)}</Text>
                        </View>
                      </View>
                      <View style={styles.surahCardRight}>
                        <Text style={styles.arabicNameSmall}>{s.name}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                          <TouchableOpacity onPress={() => playSurahAudio(s)} style={[styles.surahPlaySmall, playingSource === `surah_${s.number}` && playback.isPlaying && styles.surahPlaySmallActive]}>
                            <Ionicons name={playingSource === `surah_${s.number}` && playback.isPlaying ? "pause" : "play"} size={12} color={playingSource === `surah_${s.number}` && playback.isPlaying ? Colors.luxury.midnight : Colors.luxury.gold} />
                          </TouchableOpacity>
                          <Ionicons name="chevron-forward" size={14} color="rgba(212, 175, 55, 0.4)" />
                        </View>
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <Modal visible={modalVisible} animationType="slide">
        <LinearGradient colors={[Colors.luxury.midnight, Colors.luxury.midnightDeep]} style={styles.container}>
          <Animated.Image
            source={require("../../assets/images/mandala_bg.png")}
            style={[styles.mandalaBase, { transform: [{ rotate: mandalaRotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }, { scale: 2 }] }]}
            resizeMode="contain"
          />
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}><Ionicons name="close" size={24} color={Colors.luxury.gold} /></TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedSurah?.englishName}</Text>
              <View style={{ width: 44 }} />
            </View>
            {loadingAyahs ? <ActivityIndicator size="large" color={Colors.luxury.gold} style={{ marginTop: 50 }} /> : (
              <FlatList data={ayahs} keyExtractor={(item) => item.number.toString()} contentContainerStyle={{ padding: 20 }} renderItem={({ item, index }) => (
                <BlurView intensity={10} tint="light" style={styles.ayahContainer}>
                  <Text style={styles.mushafArabicText}>{item.text}</Text>
                  <Text style={styles.mushafTranslationText}>{item.translation}</Text>
                  <View style={styles.ayahActionRow}>
                    <View style={styles.ayahNumberBadge}><Text style={styles.ayahNumberText}>{item.number}</Text></View>
                    <TouchableOpacity onPress={() => playAyah(item.audio, index)} style={[styles.mushafPlay, playingAyahIdx === index && styles.mushafPlayActive]}>
                      <Ionicons name={playingAyahIdx === index ? "pause" : "play"} size={16} color={playingAyahIdx === index ? Colors.luxury.midnight : Colors.luxury.gold} />
                    </TouchableOpacity>
                  </View>
                </BlurView>
              )} />
            )}
          </SafeAreaView>
        </LinearGradient>
      </Modal>
      
      <Modal visible={!!viewingDua} animationType="fade" transparent={true}>
        <BlurView intensity={90} tint="dark" style={styles.duaModalContainer}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setViewingDua(null)} style={styles.modalCloseBtn}><Ionicons name="close" size={24} color={Colors.luxury.gold} /></TouchableOpacity>
              <Text style={styles.modalTitle}>{viewingDua ? t(viewingDua.titleKey as any) : ""}</Text>
              <TouchableOpacity onPress={() => viewingDua && playDua(viewingDua)} style={[styles.modalPlayBtn, playingSource === viewingDua?.titleKey && styles.modalPlayBtnActive]}>
                <Ionicons name={playingSource === viewingDua?.titleKey ? "pause" : "play"} size={20} color={playingSource === viewingDua?.titleKey ? Colors.luxury.midnight : Colors.luxury.gold} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.duaModalContent}>
              <View style={styles.duaTextWrapper}>
                <Text style={styles.duaArabicLarge}>{viewingDua?.arabic}</Text>
                <View style={styles.dividerGold} />
                <Text style={styles.duaSectionLabel}>{t("pronunciation" as any)}</Text>
                <Text style={styles.duaOkunusText}>{viewingDua?.okunus}</Text>
                <View style={styles.dividerLight} />
                <Text style={styles.duaSectionLabel}>{t("meaning" as any)}</Text>
                <Text style={styles.duaMeaningText}>{viewingDua ? t(viewingDua.anlamKey as any) : ""}</Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </BlurView>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mandalaBase: { opacity: 0.1, position: "absolute", top: 100, right: -150 },
  scroll: { flex: 1 },
  header: { paddingHorizontal: 24, marginTop: 10, marginBottom: 25, alignItems: "center" },
  titleWrapper: { alignItems: "center" },
  pageSubHeader: { color: Colors.luxury.gold, fontSize: 11, fontWeight: "800", letterSpacing: 4, marginBottom: 4, opacity: 0.8 },
  goldDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.luxury.gold, marginBottom: 8 },
  appNameLuxury: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", letterSpacing: 2 },
  categoriesContainer: { marginBottom: 25 },
  chipsScroll: { paddingHorizontal: 24, gap: 12 },
  categoryChip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.03)", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  activeChip: { backgroundColor: "rgba(212, 175, 55, 0.1)", borderColor: "rgba(212, 175, 55, 0.3)" },
  chipText: { color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: "600", letterSpacing: 1 },
  activeChipText: { color: Colors.luxury.gold },
  searchContainer: { marginHorizontal: 24, marginBottom: 25 },
  searchGlass: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, borderRadius: 15, backgroundColor: "rgba(0,0,0,0.2)", borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.1)", height: 50 },
  searchIcon: { marginRight: 10 },
  searchBar: { flex: 1, color: "#FFF", fontSize: 14 },
  surahList: { paddingHorizontal: 24, gap: 12 },
  surahCardWrapper: { borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.1)" },
  surahCardInner: { padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  surahCardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  surahNumberCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(212, 175, 55, 0.1)", justifyContent: "center", alignItems: "center" },
  surahNumberText: { color: Colors.luxury.gold, fontSize: 11, fontWeight: "bold" },
  surahTitleMain: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  surahMetaSmall: { color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 2 },
  surahCardRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  arabicNameSmall: { color: Colors.luxury.gold, fontSize: 16, opacity: 0.8 },
  surahPlaySmall: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(212, 175, 55, 0.1)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.3)" },
  surahPlaySmallActive: { backgroundColor: Colors.luxury.gold },
  duaGrid: { paddingHorizontal: 24, gap: 15 },
  luxuryCardWrapper: { marginBottom: 15, position: "relative" },
  goldBorder: { position: "absolute", top: -1, left: -1, right: -1, bottom: -1, borderRadius: 24 },
  luxuryCardInner: { backgroundColor: "rgba(15, 23, 42, 0.6)", borderRadius: 23, padding: 20, overflow: "hidden" },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 },
  headerDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.luxury.gold },
  cardTitle: { color: Colors.luxury.gold, fontSize: 10, fontWeight: "800", letterSpacing: 2, flex: 1 },
  cornerOrnamentTop: { position: "absolute", top: 10, left: 10, width: 15, height: 15, borderTopWidth: 1, borderLeftWidth: 1, borderColor: "rgba(212, 175, 55, 0.2)" },
  cornerOrnamentBottom: { position: "absolute", bottom: 10, right: 10, width: 15, height: 15, borderBottomWidth: 1, borderRightWidth: 1, borderColor: "rgba(212, 175, 55, 0.2)" },
  duaMainContent: { gap: 8 },
  duaArabicSmall: { color: Colors.luxury.gold, fontSize: 20, textAlign: "right", lineHeight: 32 },
  duaTitleSmall: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  duaMeaningSmall: { color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 18 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingVertical: 20 },
  modalCloseBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.05)", justifyContent: "center", alignItems: "center" },
  modalTitle: { color: "#FFF", fontSize: 18, fontWeight: "600", letterSpacing: 1 },
  ayahContainer: { padding: 20, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.1)", backgroundColor: "rgba(255,255,255,0.02)" },
  mushafArabicText: { color: Colors.luxury.gold, fontSize: 24, textAlign: "right", marginBottom: 15, lineHeight: 45 },
  mushafTranslationText: { color: "#E2E8F0", fontSize: 15, marginBottom: 15, lineHeight: 24 },
  ayahActionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 15, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.05)" },
  ayahNumberBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: "rgba(212, 175, 55, 0.1)" },
  ayahNumberText: { color: Colors.luxury.gold, fontSize: 12, fontWeight: "bold" },
  mushafPlay: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.05)", justifyContent: "center", alignItems: "center" },
  mushafPlayActive: { backgroundColor: Colors.luxury.gold },
  duaModalContainer: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.8)" },
  duaModalContent: { padding: 24, paddingBottom: 60 },
  duaTextWrapper: { backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 30, padding: 30, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.1)" },
  duaArabicLarge: { color: Colors.luxury.gold, fontSize: 32, textAlign: "center", lineHeight: 55, marginBottom: 25 },
  dividerGold: { height: 1, backgroundColor: Colors.luxury.gold, opacity: 0.3, width: "60%", alignSelf: "center", marginBottom: 25 },
  dividerLight: { height: 1, backgroundColor: "rgba(255,255,255,0.05)", width: "100%", marginVertical: 20 },
  duaSectionLabel: { color: Colors.luxury.gold, fontSize: 10, fontWeight: "800", letterSpacing: 2, marginBottom: 10, textTransform: "uppercase", opacity: 0.7 },
  duaOkunusText: { color: "#FFF", fontSize: 16, lineHeight: 26, fontStyle: "italic" },
  duaMeaningText: { color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 24 },
  modalPlayBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(212, 175, 55, 0.1)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.3)" },
  modalPlayBtnActive: { backgroundColor: Colors.luxury.gold },
});