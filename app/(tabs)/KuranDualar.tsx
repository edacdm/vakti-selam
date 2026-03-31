import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
import type { TranslationKeys } from "../../i18n";
import { useTranslation } from "../../i18n";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


interface DuaItem {
  typeKey: "typeDua" | "typeSurah";
  titleKey: TranslationKeys;
  arabic: string;
  okunus: string;
  anlamKey: TranslationKeys;
  audioSource?: any;
}

const dualarData: DuaItem[] = [
  { typeKey: "typeDua", titleKey: "subhanakaDua", arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ ۝ وَتَبَارَكَ اسْمُكَ ۝ وَتَعَالَى جَدُّكَ ۝ وَلَا إِلَهَ غَيْرُكَ", okunus: "Sübhânekellâhümme ve bi hamdik ve tebârakesmük ve teâlâ ceddük (ve celle senâük)* ve lâ ilâhe ğayruk.", anlamKey: "subhanakaMeaning", audioSource: require("../../assets/audio/subhaneke.mp3") },
  { typeKey: "typeDua", titleKey: "ettehiyyatuDua", arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَاوَاتُ وَالطَّيِّبَاتُ ۝ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ۝ السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ ۝ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنْ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ", okunus: "Ettehiyyâtü lillâhi ve's-salevâtü ve't-tayyibât. Es-selâmü aleyke eyyühe'n-nebiyyü ve rahmetüllâhi ve berakâtüh. Es-selâmü aleynâ ve alâ ıbâdillâhi's-sâlihîn. Eşhedü en lâ ilâhe illallâh ve eşhedü enne Muhammeden abdühû ve rasûlüh.", anlamKey: "ettehiyyatuMeaning", audioSource: require("../../assets/audio/ettehiyyatu.mp3") },
  { typeKey: "typeDua", titleKey: "allahummaSalli", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ ۝ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ ۝ إِنَّكَ حَمِيدٌ مَجِيدٌ", okunus: "Allâhümme salli alâ Muhammedin ve alâ âli Muhammed. Kemâ salleyte alâ İbrâhîme ve alâ âli İbrâhim. İnneke hamîdün mecîd.", anlamKey: "allahummaSalliMeaning", audioSource: require("../../assets/audio/salli.mp3") },
  { typeKey: "typeDua", titleKey: "allahummaBarik", arabic: "اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ ۝ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ ۝ إِنَّكَ hamîdün mecîd.", okunus: "Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed. Kemâ bârakte alâ İbrâhîme ve alâ âli İbrâhim. İnneke hamîdün mecîd.", anlamKey: "allahummaBarikMeaning", audioSource: require("../../assets/audio/barik.mp3") },
  { typeKey: "typeDua", titleKey: "rabbanaAtina", arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", okunus: "Rabbenâ âtinâ fi'd-dünyâ haseneten ve fi'l-âhirati haseneten ve kınâ azâbe'n-nâr.", anlamKey: "rabbanaAtinaMeaning", audioSource: require("../../assets/audio/rabbena.mp3") },
  { typeKey: "typeDua", titleKey: "qunutDuas", arabic: "اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنَسْتَهْدِيكَ... اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي...", okunus: "Allâhümme innâ nesteînüke ve nestağfiruke ve nestehdîk... Allâhümme iyyâke na'büdü ve leke nüsallî...", anlamKey: "qunutMeaning", audioSource: require("../../assets/audio/kunut.mp3") },
  { typeKey: "typeSurah", titleKey: "fatiha", arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعEMْTE ALEYHİÌM ĞAYRİL MAĞDÛBİ ALEYHİM VE LED-DÂLLÎN", okunus: "Bismillâhirrahmânirrahîm. Elhamdü lillâhi rabbil'alemin. Errahmânir'rahim. Mâliki yevmiddin. İyyâke na'budü ve iyyâke neste'în. İhdinessırâtel müstakîm. Sırâtellezine en'amte aleyhim ğayrilmağdûbi aleyhim ve leddâllîn.", anlamKey: "fatihaMeaning", audioSource: require("../../assets/audio/001.mp3") },
  { typeKey: "typeSurah", titleKey: "ayatulKursi", arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ", okunus: "Allâhü lâ ilâhe illâ hüvel hayyül kayyûm, lâ te'huzühu sinetün velâ nevm, lehu mâ fissemâvâti ve ma fil'ard, men zellezi yeşfeu indehu illâ bi'iznih, ya'lemü mâ beyne eydiyhim vemâ halfehüm, velâ yühiytûne bişey'in min ilmihî illâ bima şâe vesia kürsiyyühüssemâvâti vel'ard, velâ yeûdühû hıfzuhümâ ve hüvel aliyyül azim.", anlamKey: "ayatulKursiMeaning", audioSource: require("../../assets/audio/002255.mp3") },
  { typeKey: "typeSurah", titleKey: "filSurah", arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ۝ أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ ۝ وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ ۝ تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ ۝ فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ", okunus: "Bismillâhirrahmânirrahîm. Elem tera keyfe feale rabbüke biashâbil fîl. Elem yec'al keydehüm fî tadlîl. Ve ersele aleyhim tayran ebâbîl. Termîhim bihicâratin min siccîl. Fecealehüm keasfin me'kûl.", anlamKey: "filMeaning", audioSource: require("../../assets/audio/105.mp3") },
  { typeKey: "typeSurah", titleKey: "quraishSurah", arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ لِإِيلَافِ قُرَيْشٍ ۝ إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ ۝ felyeb'udû rabbe hâzelbeyt. Ellezi at'amehüm min cûin ve âmenehüm min havf.", okunus: "Bismillâhirrahmânirrahîm. Li'îlâfi kuraýš. Îlâfihim rihleteššitâi vessayf. Felyeba'dû rabbe hâzelbeyt. Ellezi at'amehüm min cûin ve âmenehüm min havf.", anlamKey: "quraishMeaning", audioSource: require("../../assets/audio/106.mp3") },
  { typeKey: "typeSurah", titleKey: "maunSurah", arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ۝ فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ ۝ وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ ۝ فَوَيْلٌ لِلْمُصَلِّينَ ۝ الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ ۝ الَّذِينَ هُمْ yürâûn. Ve yemneûnel mâûn.", okunus: "Bismillâhirrahmânirrahîm. Era'eytellezî yükezzibü biddîn. Fezâlikellezî yedu'ul yetîm. Velâ yehuddu alâ taâmil miskîn. Feveylün lil musallîn. Ellezîne hüm an salâtihim sâhûn. Ellezîne hüm yürâûn. Ve yemneûnel mâûn.", anlamKey: "maunMeaning", audioSource: require("../../assets/audio/107.mp3") },
  { typeKey: "typeSurah", titleKey: "kavtharSurah", arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۝ إِنَّ şâni'eke hüvel'ebter.", okunus: "Bismillâhirrahmânirrahîm. İnnâ a'taynâkel kevser. Fesalli lirabbike venhar. İnne şâni'eke hüvel'ebter.", anlamKey: "kavtharMeaning", audioSource: require("../../assets/audio/108.mp3") },
  { typeKey: "typeSurah", titleKey: "kafirunSurah", arabic: "بِسْم. اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ قُلْ يَا أَيُّهَا الْكَAFİRÛN ۝ لَا أَعْبُدُ مَا تَعْبُدُونَ ۝ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ ۝ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ لَكُمْ دِينُكُمْ وَلِيَ دِينِ", okunus: "Bismillâhirrahmânirrahîm. Kul yâ eyyühel kâfirûn. Lâ a'büdü mâ ta'büdûn. Velâ entüm âbidûne mâ a'büd. Velâ ene âbidün mâ abedtüm. Velâ entüm âbidûne mâ a'büd. Leküm dînüküm veliye dîn.", anlamKey: "kafirunMeaning", audioSource: require("../../assets/audio/109.mp3") },
  { typeKey: "typeSurah", titleKey: "inshirahSurah", arabic: "بِسْمِ اللَّهِ الرَّحْمَن. الرَّحِيمِ ۝ أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ وَوَضَعْنَا عَنْكَ وِزْرَكَ ۝ الَّذِي أَنْقَضَ ظَهْرَكَ ۝ وَرَعْلَنَا لَكَ ذِكْرَكَ ۝ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ فَإِذَا فَرَغْتَ فَانْصَبْ ۝ وَإِلَى رَبِّكَ فَارْغَبْ", okunus: "Bismillâhirrahmânirrahîm. Elem neşrah leke sadrak. Ve vada'nâ anke vizrak. Ellezî enkada zahrak. Ve rafa'nâ leke zikrak. Feinne meal usri yusrâ. İnne meal usri yusrâ. Feizâ ferağte fensab. Ve ilâ rabbike ferğab.", anlamKey: "inshirahMeaning", audioSource: require("../../assets/audio/094.mp3") },
  { typeKey: "typeSurah", titleKey: "asrSurah", arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ وَالْعَصْرِ ۝ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِيلة الصَّALİHÂTİ VE TAVÂSAV BİL-HAKKI VE TAVÂSAV BİS-SABR.", okunus: "Bismillâhirrahmânirrahîm. Vel'asr. İnnel'insâne lefî husr. İllellezîne âmenû ve amilüssâlihâti ve tevâsav bi'l-hakkı ve tevâsav bi's-sabr.", anlamKey: "asrMeaning", audioSource: require("../../assets/audio/103.mp3") },
  { typeKey: "typeSurah", titleKey: "ikhlasSurah", arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَم_ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كüfûven ehad.", okunus: "Bismillâhirrahmânirrahîm. Kul hüvellâhü ehad. Allâhüssamed. Lem yelid ve len yûled. Ve len yekün lehû küfüven ehad.", anlamKey: "ikhlasMeaning", audioSource: require("../../assets/audio/112.mp3") },
  { typeKey: "typeSurah", titleKey: "falaqSurah", arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ şerri mâ halak. Ve min şerri ğâsikın izâ vekab. Ve min şerrin neffâsâti fi'l ukad. Ve min şerri hâsidin izâ hased.", okunus: "Bismillâhirrahmânirrahîm. Kul eûzü birabbil felak. Min şerri mâ halak. Ve min şerri ğâsikın izâ vekab. Ve min şerrin neffâsâti fi'l ukad. Ve min şerri hâsidin izâ hased.", anlamKey: "falaqMeaning", audioSource: require("../../assets/audio/113.mp3") },
  { typeKey: "typeSurah", titleKey: "nasSurah", arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَهِ النَّاسِ ۝ مِنْ şerril vesvâsil hannâs. Ellezî yüvesvisü fî sudûrin-nâs. Minel cinneti ven-nâs.", okunus: "Bismillâhirrahmânirrahîm. Kul eûzü birabbin-nâs. Melikin-nâs. İlâhin-nâs. Min şerril vesvâsil hannâs. Ellezî yüvesvisü fî sudûrin-nâs. Minel cinneti ven-nâs.", anlamKey: "nasMeaning", audioSource: require("../../assets/audio/114.mp3") },
  { typeKey: "typeSurah", titleKey: "takathurSurah", arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ أَلْهَاكُمُ التَّكَاثُرُ ۝ حَتَّى زُرْتُمُ الْمَقَابِرَ ۝ كَلَّا سَوْفَ تَعَلَمُونَ ۝ sümme kellâ sevfe ta'lemûn. Kellâ lev ta'lemûne ilmel yakîn. Leteravünnel cehîm. Sümme leteravünnehâ aynel yakîn. Sümme letüs'elünne yevmeizin anin naîm.", okunus: "Bismillâhirrahmânirrahîm. Elhâkümüt tekâsür. Hattâ zürtümül mekâbir. Kellâ sevfe ta'lemûn. Sümme kellâ sevfe ta'lemûn. Kellâ lev ta'lemûne ilmel yakîn. Leteravünnel cehîm. Sümme leteravünnehâ aynel yakîn. Sümme letüs'elünne yevmeizin anin naîm.", anlamKey: "takathurMeaning", audioSource: require("../../assets/audio/102.mp3") },
  { typeKey: "typeSurah", titleKey: "zilzalSurah", arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم. ۝ إِذَا زُلْزِلَتِ الْأَرْضُ زِلْズâlEHÂ ۝ VE AHRECETİL ARDU ESKÂLEHÂ ۝ VE KÂLEL İNSÂNÜ MÂ LEHÂ ۝ YEVMEİZİN TÜHADDİSÜ AHBÂRAHÂ ۝ BİENNE RABBEKE EVHÂ LEHÂ ۝ YEVMEİZİN YASDÜRUN NÂSÜ EŞTÂTEN LİYÜRAV A'MÂLEHÜM ۝ FEMEN YA'MEL MİSKÂLE ZERRATİN HAYRAN YERAH ۝ VE MEN YA'MEL MİSKÂLE ZERRATİN ŞERRAN YERAH", okunus: "Bismillâhirrahmânirrahîm. İzâ zülziletil ardu zilzâlehâ. Ve ahrecetil ardu eskâlehâ. Ve kâlel insânü mâ lehâ. Yevmeizin tühaddisü ahbârahâ. Bienne rabbeke evhâ lehâ. Yevmeizin yasdürun nâsü eştâten liyürav a'mâlehüm. Femen ya'mel miskâle zerratin hayran yerah. Vemen ya'mel miskâle zerratin şerran yerah.", anlamKey: "zilzalMeaning", audioSource: require("../../assets/audio/099.mp3") }
];


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
  audio: string;
}

const DuaAccordionItem = ({ item }: { item: DuaItem }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  useEffect(() => { return sound ? () => { sound.unloadAsync(); } : undefined; }, [sound]);

  const toggleAudio = async () => {
    if (!item.audioSource) return;
    try {
      if (sound) { isPlaying ? await sound.pauseAsync() : await sound.playAsync(); }
      else {
        setIsBuffering(true);
        const { sound: newSound } = await Audio.Sound.createAsync(
          typeof item.audioSource === "string" ? { uri: item.audioSource } : item.audioSource,
          { shouldPlay: true },
          (s) => { if (s.isLoaded) { setIsPlaying(s.isPlaying); setIsBuffering(s.isBuffering); if (s.didJustFinish) setIsPlaying(false); } }
        );
        setSound(newSound);
      }
    } catch (e) { setIsBuffering(false); }
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.cardHeader} activeOpacity={0.7} onPress={() => setExpanded(!expanded)}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.typeBadge, item.typeKey === "typeSurah" ? styles.badgeSure : styles.badgeDua]}>
            <Text style={styles.typeBadgeText}>{t(item.typeKey)}</Text>
          </View>
          <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={22} color="#D4AF37" />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.cardBody}>
          <View style={styles.arabicBox}>
            <View style={styles.arabicHeader}>
              {item.audioSource ? (
                <TouchableOpacity style={styles.audioPlayButton} onPress={toggleAudio}>
                  {isBuffering ? <ActivityIndicator size="small" color="#0B101E" /> : <Ionicons name={isPlaying ? "pause" : "play"} size={16} color="#0B101E" />}
                  <Text style={styles.audioPlayText}>{isPlaying ? t("stop") : t("listen")}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.audioDisabledBadge}><Ionicons name="volume-mute" size={16} color="#94A3B8" /><Text style={styles.audioDisabledText}>{t("noAudio")}</Text></View>
              )}
            </View>
            <Text style={styles.arabicText}>{item.arabic}</Text>
          </View>
          <Text style={styles.sectionLabel}>{t("pronunciation")}</Text>
          <Text style={styles.contentText}>{item.okunus}</Text>
          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>{t("meaning")}</Text>
          <Text style={styles.contentText}>{t(item.anlamKey)}</Text>
        </View>
      )}
    </View>
  );
};

export default function KuranDualar() {
  const { t, language } = useTranslation();
  const flatListRef = useRef<FlatList>(null);
  const detailListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
  const [modalKey, setModalKey] = useState(0);

  useEffect(() => {
    fetchSurahs();
    return () => { if (quranSound) quranSound.unloadAsync(); };
  }, []);

  const fetchSurahs = async () => {
    try {
      const response = await fetch("https://api.alquran.cloud/v1/surah");
      const data = await response.json();
      const sorted = data.data.sort((a: Surah, b: Surah) => a.number - b.number);
      setSurahs(sorted);
      setFilteredSurahs(sorted);
    } catch (e) { console.error(e); } finally { setLoadingSurahs(false); }
  };

  const handleQuranSearch = (text: string) => {
    setQuranSearch(text);
    setFilteredSurahs(surahs.filter(s => s.englishName.toLowerCase().includes(text.toLowerCase()) || s.number.toString().includes(text)));
  };

  const playAyah = async (url: string, index: number) => {
    try {
      if (quranSound) { await quranSound.unloadAsync(); if (playingAyahIdx === index) { setPlayingAyahIdx(null); return; } }
      setPlayingAyahIdx(index);
      const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true }, (s) => { if (s.isLoaded && s.didJustFinish) setPlayingAyahIdx(null); });
      setQuranSound(sound);
    } catch (e) { }
  };

  const openSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setModalVisible(true);
    setLoadingAyahs(true);
    setPlayingAyahIdx(null);
    setModalKey(prev => prev + 1);
    if (quranSound) { await quranSound.unloadAsync(); setQuranSound(null); }

    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-simple-clean,id.indonesian,tr.diyanet,en.sahih,ar.alafasy`);
      const data = await res.json();
      if (data.data && data.data.length >= 5) {
        const arabic = data.data[0].ayahs;
        const idTrans = data.data[1].ayahs;
        const trTrans = data.data[2].ayahs;
        const enTrans = data.data[3].ayahs;
        const audioData = data.data[4].ayahs;
        const combined = arabic.map((a: any, idx: number) => {
          const vNum = a.numberInSurah;
          const findIn = (list: any[]) => list.find(x => x.numberInSurah === vNum) || list[idx];
          return {
            number: vNum,
            text: a.text,
            translation: language === "id" ? findIn(idTrans).text : language === "tr" ? findIn(trTrans).text : findIn(enTrans).text,
            audio: findIn(audioData).audio
          };
        });
        setAyahs(combined.sort((a: Ayah, b: Ayah) => a.number - b.number));
      }
    } catch (e) { } finally { setLoadingAyahs(false); }
  };

  return (
    <LinearGradient colors={["#080C16", "#121E36"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topTabs}>
          <TouchableOpacity onPress={() => { flatListRef.current?.scrollToIndex({ index: 0 }); setActiveIndex(0); }} style={[styles.tabBtn, activeIndex === 0 && styles.tabBtnActive]}>
            <Text style={[styles.tabBtnText, activeIndex === 0 && styles.tabBtnTextActive]}>{t("tabQuran").toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { flatListRef.current?.scrollToIndex({ index: 1 }); setActiveIndex(1); }} style={[styles.tabBtn, activeIndex === 1 && styles.tabBtnActive]}>
            <Text style={[styles.tabBtnText, activeIndex === 1 && styles.tabBtnTextActive]}>{t("tabDualar").toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={[0, 1]}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH))}
          keyExtractor={(it) => it.toString()}
          renderItem={({ item }) => (
            <View style={{ width: SCREEN_WIDTH }}>
              {item === 0 ? (
                <View style={{ flex: 1 }}>
                  <View style={styles.searchBarContainer}>
                    <Ionicons name="search" size={18} color="#94A3B8" />
                    <TextInput style={styles.searchInput} placeholder={t("quranSearchPlaceholder")} placeholderTextColor="#64748B" value={quranSearch} onChangeText={handleQuranSearch} />
                  </View>
                  {loadingSurahs ? <View style={styles.center}><ActivityIndicator color="#D4AF37" /></View> : (
                    <FlatList data={filteredSurahs} contentContainerStyle={{ padding: 20, paddingBottom: 100 }} keyExtractor={(s) => s.number.toString()}
                      renderItem={({ item: s }) => (
                        <TouchableOpacity style={styles.surahCard} onPress={() => openSurah(s)}>
                          <View style={styles.surahNumberBox}><Text style={styles.surahNumberText}>{s.number}</Text></View>
                          <View style={styles.surahInfo}><Text style={styles.surahName}>{s.englishName}</Text><Text style={styles.surahSubtitle}>{s.revelationType === "Meccan" ? t("revelationMeccan") : t("revelationMedinan")} • {s.numberOfAyahs} {t("ayahCountLabel")}</Text></View>
                          <Text style={styles.arabicSmall}>{s.name}</Text>
                        </TouchableOpacity>
                      )} />
                  )}
                </View>
              ) : (
                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                  {dualarData.map((d, index) => <DuaAccordionItem key={index} item={d} />)}
                </ScrollView>
              )}
            </View>
          )}
        />

        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => { if (quranSound) quranSound.stopAsync(); setModalVisible(false); }}>
          <View style={styles.mushafContainer}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.mushafHeader}>
                <TouchableOpacity style={styles.mushafBack} onPress={() => { if (quranSound) quranSound.stopAsync(); setModalVisible(false); }}>
                  <Ionicons name="close" size={28} color="#D4AF37" />
                </TouchableOpacity>
                <View style={styles.mushafTitleArea}>
                  <Text style={styles.mushafTitleEn}>{selectedSurah?.englishName}</Text>
                  <Text style={styles.mushafTitleAr}>{selectedSurah?.name}</Text>
                </View>
                <TouchableOpacity style={styles.mushafSettings}><Ionicons name="ellipsis-vertical" size={24} color="#D4AF37" /></TouchableOpacity>
              </View>

              {loadingAyahs ? <View style={styles.center}><ActivityIndicator size="large" color="#D4AF37" /></View> : (
                <FlatList
                  key={modalKey}
                  ref={detailListRef}
                  data={ayahs}
                  keyExtractor={(a) => a.number.toString()}
                  contentContainerStyle={{ paddingBottom: 80 }}
                  ListHeaderComponent={() => (
                    selectedSurah?.number !== 9 && (
                      <View style={styles.mushafBismillah}>
                        <Text style={styles.bismillahArabic}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
                      </View>
                    )
                  )}
                  renderItem={({ item: a, index: ai }) => (
                    <View style={styles.mushafAyahRow}>
                      <View style={styles.mushafAyahTop}>
                        <View style={styles.mushafVerseMarker}>
                          <Text style={styles.mushafVerseNum}>{a.number}</Text>
                        </View>
                        <View style={styles.mushafLine} />
                        <TouchableOpacity
                          style={[styles.mushafPlay, playingAyahIdx === ai && styles.mushafPlayActive]}
                          onPress={() => playAyah(a.audio, ai)}
                        >
                          <Ionicons name={playingAyahIdx === ai ? "pause" : "play"} size={14} color={playingAyahIdx === ai ? "#0B101E" : "#D4AF37"} />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.mushafArabicText}>{a.text}</Text>
                      <Text style={styles.mushafTranslationText}>{a.translation}</Text>
                      <View style={styles.mushafAyahSeparator} />
                    </View>
                  )} />
              )}
            </SafeAreaView>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topTabs: { flexDirection: "row", backgroundColor: "rgba(11, 16, 30, 0.8)", padding: 6, borderRadius: 16, margin: 20, marginBottom: 10, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.2)" },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 12 },
  tabBtnActive: { backgroundColor: "#D4AF37" },
  tabBtnText: { color: "#94A3B8", fontWeight: "600", fontSize: 14 },
  tabBtnTextActive: { color: "#0B101E", fontWeight: "bold" },
  searchBarContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", margin: 20, marginTop: 10, paddingHorizontal: 16, height: 50, borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  searchInput: { flex: 1, marginLeft: 12, color: "#E2E8F0" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  surahCard: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(30, 41, 59, 0.5)", padding: 18, borderRadius: 20, marginBottom: 14, borderWidth: 1, borderColor: "rgba(212,175,55,0.15)" },
  surahNumberBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(212,175,55,0.12)", justifyContent: "center", alignItems: "center", marginRight: 18 },
  surahNumberText: { color: "#D4AF37", fontWeight: "bold", fontSize: 16 },
  surahInfo: { flex: 1 },
  surahName: { color: "#E2E8F0", fontSize: 18, fontWeight: "600" },
  surahSubtitle: { color: "#94A3B8", fontSize: 13, marginTop: 4 },
  arabicSmall: { color: "#D4AF37", fontSize: 22 },
  cardContainer: { backgroundColor: "rgba(30, 41, 59, 0.4)", borderRadius: 18, marginBottom: 14, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.05)", overflow: "hidden" },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 18 },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 12 },
  badgeDua: { backgroundColor: "rgba(45, 212, 191, 0.12)" },
  badgeSure: { backgroundColor: "rgba(212, 175, 55, 0.12)" },
  typeBadgeText: { fontSize: 10, fontWeight: "bold", color: "#E2E8F0" },
  cardTitle: { fontSize: 17, fontWeight: "600", color: "#E2E8F0", flex: 1 },
  cardBody: { paddingHorizontal: 18, paddingBottom: 18 },
  arabicBox: { backgroundColor: "rgba(11, 16, 30, 0.4)", padding: 20, borderRadius: 16, marginBottom: 15 },
  arabicHeader: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 15 },
  audioPlayButton: { flexDirection: "row", backgroundColor: "#D4AF37", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, alignItems: "center", gap: 6 },
  audioPlayText: { color: "#0B101E", fontWeight: "bold", fontSize: 12 },
  arabicText: { fontSize: 26, color: "#D4AF37", textAlign: "right", lineHeight: 45 },
  sectionLabel: { fontSize: 12, color: "#D4AF37", fontWeight: "bold", marginBottom: 6 },
  contentText: { fontSize: 15, color: "#cbd5e1", lineHeight: 24 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.06)", marginVertical: 18 },

  // MUSHAF STYLE (New)
  mushafContainer: { flex: 1, backgroundColor: "#080C16" }, // Original dark theme preserved
  mushafHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "rgba(212,175,55,0.15)" },
  mushafBack: { width: 40 },
  mushafTitleArea: { flex: 1, alignItems: "center" },
  mushafTitleEn: { color: "#E2E8F0", fontSize: 18, fontWeight: "bold", letterSpacing: 1 },
  mushafTitleAr: { color: "#D4AF37", fontSize: 16, marginTop: 2 },
  mushafSettings: { width: 40, alignItems: "flex-end" },
  mushafBismillah: { paddingVertical: 40, alignItems: "center" },
  bismillahArabic: { fontSize: 32, color: "#D4AF37", fontWeight: "400" },
  mushafAyahRow: { paddingHorizontal: 25, paddingTop: 10 },
  mushafAyahTop: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  mushafVerseMarker: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: "#D4AF37", justifyContent: "center", alignItems: "center" },
  mushafVerseNum: { color: "#D4AF37", fontSize: 10, fontWeight: "bold" },
  mushafLine: { flex: 1, height: 1, backgroundColor: "rgba(212,175,55,0.08)", marginHorizontal: 15 },
  mushafPlay: { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(212,175,55,0.08)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(212,175,55,0.2)" },
  mushafPlayActive: { backgroundColor: "#D4AF37" },
  mushafArabicText: { fontSize: 28, color: "#E2E8F0", textAlign: "right", lineHeight: 52, marginBottom: 15, fontFamily: Platform.OS === "ios" ? "Georgia" : "serif" },
  mushafTranslationText: { fontSize: 16, color: "#94A3B8", lineHeight: 24, fontStyle: "italic", textAlign: "right", marginBottom: 20 },
  mushafAyahSeparator: { height: 1, width: "100%", backgroundColor: "rgba(255,255,255,0.03)", marginBottom: 10 },
  audioDisabledBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
  audioDisabledText: { color: "#64748B", fontSize: 11 },
});
