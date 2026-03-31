import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from "react-native";
import { useTranslation } from "../../i18n";
import type { TranslationKeys } from "../../i18n";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface DuaItem {
  typeKey: "typeDua" | "typeSurah";
  titleKey: TranslationKeys;
  arabic: string;
  okunus: string;
  anlamKey: TranslationKeys;
  audioUrl: string;
}

const dualarData: DuaItem[] = [
  {
    typeKey: "typeDua",
    titleKey: "subhanakaDua",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ ۝ وَتَبَارَكَ اسْمُكَ ۝ وَتَعَالَى جَدُّكَ ۝ وَلَا إِلَهَ غَيْرُكَ",
    okunus: "Sübhânekellâhümme ve bi hamdik ve tebârakesmük ve teâlâ ceddük (ve celle senâük)* ve lâ ilâhe ğayruk.",
    anlamKey: "subhanakaMeaning",
    audioUrl: ""
  },
  {
    typeKey: "typeDua",
    titleKey: "ettehiyyatuDua",
    arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ۝ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ۝ السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ ۝ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنْ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    okunus: "Ettehiyyâtü lillâhi ve's-salevâtü ve't-tayyibât. Es-selâmü aleyke eyyühe'n-nebiyyü ve rahmetüllâhi ve berakâtüh. Es-selâmü aleynâ ve alâ ıbâdillâhi's-sâlihîn. Eşhedü en lâ ilâhe illallâh ve eşhedü enne Muhammeden abdühû ve rasûlüh.",
    anlamKey: "ettehiyyatuMeaning",
    audioUrl: ""
  },
  {
    typeKey: "typeDua",
    titleKey: "allahummaSalli",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ ۝ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ ۝ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    okunus: "Allâhümme salli alâ Muhammedin ve alâ âli Muhammed. Kemâ salleyte alâ İbrâhîme ve alâ âli İbrâhim. İnneke hamîdün mecîd.",
    anlamKey: "allahummaSalliMeaning",
    audioUrl: ""
  },
  {
    typeKey: "typeDua",
    titleKey: "allahummaBarik",
    arabic: "اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ ۝ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ ۝ إِنَّكَ hamîdün mecîd.",
    okunus: "Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed. Kemâ bârakte alâ İbrâhîme ve alâ âli İbrâhim. İnneke hamîdün mecîd.",
    anlamKey: "allahummaBarikMeaning",
    audioUrl: ""
  },
  {
    typeKey: "typeDua",
    titleKey: "rabbanaAtina",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    okunus: "Rabbenâ âtinâ fi'd-dünyâ haseneten ve fi'l-âhirati haseneten ve kınâ azâbe'n-nâr.",
    anlamKey: "rabbanaAtinaMeaning",
    audioUrl: ""
  },
  {
    typeKey: "typeDua",
    titleKey: "qunutDuas",
    arabic: "اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنَسْتَهْدِيكَ... اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي...",
    okunus: "Allâhümme innâ nesteînüke ve nestağfiruke ve nestehdîk... Allâhümme iyyâke na'büdü ve leke nüsallî...",
    anlamKey: "qunutMeaning",
    audioUrl: ""
  },
  {
    typeKey: "typeSurah",
    titleKey: "fatiha",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسＴＡＱİMİ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    okunus: "Bismillâhirrahmânirrahîm. Elhamdü lillâhi rabbil'alemin. Errahmânir'rahim. Mâliki yevmiddin. İyyâke na'budü ve iyyâke neste'în. İhdinessırâtel müstakîm. Sırâtellezine en'amte aleyhim ğayrilmağdûbi aleyhim ve leddâllîn.",
    anlamKey: "fatihaMeaning",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3"
  },
  {
    typeKey: "typeSurah",
    titleKey: "ayatulKursi",
    arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ hıfzuhümâ ve hüvel aliyyül azim.",
    okunus: "Allâhü lâ ilâhe illâ hüvel hayyül kayyûm, lâ te'huzühu sinetün velâ nevm, lehu mâ fissemâvâti ve ma fil'ard, men zellezi yeşfeu indehu illâ bi'iznih, ya'lemü mâ beyne eydiyhim vemâ halfehüm, velâ yühiytûne bişey'in min ilmihî illâ bima şâe vesia kürsiyyühüssemâvâti vel'ard, velâ yeûdühû hıfzuhümâ ve hüvel aliyyül azim.",
    anlamKey: "ayatulKursiMeaning",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002255.mp3"
  },
  {
    typeKey: "typeSurah",
    titleKey: "filSurah",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ۝ أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ ۝ وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ ۝ تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ ۝ فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ",
    okunus: "Bismillâhirrahmânirrahîm. Elem tera keyfe feale rabbüke biashâbil fîl. Elem yec'al keydehüm fî tadlîl. Ve ersele aleyhim tayran ebâbîl. Termîhim bihicâratin min siccîl. Fecealehüm keasfin me'kûl.",
    anlamKey: "filMeaning",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/105.mp3"
  },
  {
    typeKey: "typeSurah",
    titleKey: "quraishSurah",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ لِإِيلَافِ قُرَيْشٍ ۝ إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ ۝ فَلْيَعْبُدُوا رَبَّ هَذَا الْبَيْتِ ۝ الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ",
    okunus: "Bismillâhirrahmânirrahîm. Li'îlâfi kuraýş. Îlâfihim rihleteşşitâi vessayf. Felyebüdû rabbe hâzelbeyt. Ellezî at'amehüm min cûin ve âmenehüm min havf.",
    anlamKey: "quraishMeaning",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/106.mp3"
  },
  {
    typeKey: "typeSurah",
    titleKey: "maunSurah",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ۝ فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ ۝ وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ ۝ فَوَيْلٌ لِلْمُصَلِّينَ ۝ الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ ۝ الَّذِينَ هُمْ يُرَاءُونَ ۝ وَيَمْنَعُونَ الْمَاعُونَ",
    okunus: "Bismillâhirrahmânirrahîm. Era'eytellezî yükezzibü biddîn. Fezâlikellezî yedu'ul yetîm. Velâ yehuddu alâ taâmil miskîn. Feveylün lil musallîn. Ellezîne hüm an salâtihim sâhûn. Ellezîne hüm yürâûn. Ve yemneûnel mâûn.",
    anlamKey: "maunMeaning",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/107.mp3"
  },
  {
    typeKey: "typeSurah",
    titleKey: "kavtharSurah",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۝ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
    okunus: "Bismillâhirrahmânirrahîm. İnnâ a'taynâkel kevser. Fesalli lirabbike venhar. İnne şâni'eke hüvel'ebter.",
    anlamKey: "kavtharMeaning",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/108.mp3"
  },
  {
    typeKey: "typeSurah",
    titleKey: "kafirunSurah",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ قُلْ يَا أَيُّهَا الْكَافِرُونَ ۝ لَا أَعْبُدُ مَا تَعْبُدُونَ ۝ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ ۝ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
    okunus: "Bismillâhirrahmânirrahîm. Kul yâ eyyühel kâfirûn. Lâ a'büdü mâ ta'büdûn. Velâ entüm âbidûne mâ a'büd. Velâ ene âbidün mâ abedtüm. Velâ entüm âbidûne mâ a'büd. Leküm dînüküm veliye dîn.",
    anlamKey: "kafirunMeaning",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/109.mp3"
  },
  {
    typeKey: "typeSurah",
    titleKey: "inshirahSurah",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ وَوَضَعْنَا عَنْكَ وِزْرَكَ ۝ الَّذِي أَنْقَضَ ظَهْرَكَ ۝ وَرَفَعْنَا لَكَ ذِكْرَكَ ۝ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ فَإِذَا فَرَغْتَ فَانْصَبْ ۝ وَإِلَى رَبِّكَ فَارْغَبْ",
    okunus: "Bismillâhirrahmânirrahîm. Elem neşrah leke sadrak. Ve vada'nâ anke vizrak. Ellezî enkada zahrak. Ve rafa'nâ leke zikrak. Feinne meal usri yusrâ. İnne meal usri yusrâ. Feizâ ferağte fensab. Ve ilâ rabbike ferğab.",
    anlamKey: "inshirahMeaning",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/094.mp3"
  },
  {
    typeKey: "typeSurah",
    titleKey: "asrSurah",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ وَالْعَصْرِ ۝ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    okunus: "Bismillâhirrahmânirrahîm. Vel'asr. İnnel'insâne lefî husr. İllellezîne âmenû ve amilüssâlihâti ve tevâsav bi'l-hakkı ve tevâsav bi's-sabr.",
    anlamKey: "asrMeaning",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/103.mp3"
  },
  {
    typeKey: "typeSurah",
    titleKey: "ikhlasSurah",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَم_ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    okunus: "Bismillâhirrahmânirrahîm. Kul hüvellâhü ehad. Allâhüssamed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad.",
    anlamKey: "ikhlasMeaning",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/112.mp3"
  },
  {
    typeKey: "typeSurah",
    titleKey: "falaqSurah",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    okunus: "Bismillâhirrahmânirrahîm. Kul eûzü birabbil felak. Min şerri mâ halak. Ve min şerri ğâsikın izâ vekab. Ve min şerrin neffâsâti fi'l ukad. Ve min şerri hâsidin izâ hased.",
    anlamKey: "falaqMeaning",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/113.mp3"
  },
  {
    typeKey: "typeSurah",
    titleKey: "nasSurah",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    okunus: "Bismillâhirrahmânirrahîm. Kul eûzü birabbin-nâs. Melikin-nâs. İlâhin-nâs. Min şerril vesvâsil hannâs. Ellezî yüvesvisü fî sudûrin-nâs. Minel cinneti ven-nâs.",
    anlamKey: "nasMeaning",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/114.mp3"
  },
  {
    typeKey: "typeSurah",
    titleKey: "takathurSurah",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ أَلْهَاكُمُ التَّكَاثُرُ ۝ حَتَّى زُرْتُمُ الْمَقَابِرَ ۝ كَلَّا سَوْفَ تَعْلَمُونَ ۝ ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ ۝ كَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ ۝ لَتَرَوُنَّ الْجَحِيمَ ۝ ثُمَّ لَتَرَوُنَّهَا عَيْنَ الْيَقِينِ ۝ ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ",
    okunus: "Bismillâhirrahmânirrahîm. Elhâkümüt tekâsür. Hattâ zürtümül mekâbir. Kellâ sevfe ta'lemûn. Sümme kellâ sevfe ta'lemûn. Kellâ lev ta'lemûne ilmel yakîn. Leteravünnel cehîm. Sümme leteravünnehâ aynel yakîn. Sümme letüs'elünne yevmeizin anin naîm.",
    anlamKey: "takathurMeaning",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/102.mp3"
  },
  {
    typeKey: "typeSurah",
    titleKey: "zilzalSurah",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا ۝ وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا ۝ وَقَالَ الْإِنْسَانُ مَا لَهَا ۝ يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا ۝ بِأَنَّ رَبَّكَ أَوْحَى لَهَا ۝ يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِيُرَوْا أَعْمَالَهُمْ ۝ فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ۝ وَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ",
    okunus: "Bismillâhirrahmânirrahîm. İzâ zülziletil ardu zilzâlehâ. Ve ahrecetil ardu eskâlehâ. Ve kâlel insânü mâ lehâ. Yevmeizin tühaddisü ahbârahâ. Bienne rabbeke evhâ lehâ. Yevmeizin yasdürun nâsü eştâten liyürav a'mâlehüm. Femen ya'mel miskâle zerratin hayran yerah. Vemen ya'mel miskâle zerratin şerran yerah.",
    anlamKey: "zilzalMeaning",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/099.mp3"
  }
];

const AccordionItem = ({ item }: { item: DuaItem }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (!expanded && sound && isPlaying) {
      sound.stopAsync();
      setIsPlaying(false);
    }
  }, [expanded, sound]);

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    }
  };

  const toggleAudio = async () => {
    if (!item.audioUrl) return;
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
      } else {
        setIsBuffering(true);
        const source = { uri: item.audioUrl };
        const { sound: newSound } = await Audio.Sound.createAsync(
          source,
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        setSound(newSound);
      }
    } catch (e) {
      setIsBuffering(false);
      console.log("Ses çalma hatası:", e);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.cardHeader}
        activeOpacity={0.7}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.typeBadge, item.typeKey === "typeSurah" ? styles.badgeSure : styles.badgeDua]}>
            <Text style={styles.typeBadgeText}>{t(item.typeKey)}</Text>
          </View>
          <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={24} color="#D4AF37" />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.cardBody}>
          <View style={styles.arabicBox}>
            <View style={styles.arabicHeader}>
              {item.audioUrl ? (
                <TouchableOpacity style={styles.audioPlayButton} onPress={toggleAudio}>
                  {isBuffering ? (
                    <ActivityIndicator size="small" color="#0B101E" />
                  ) : (
                    <Ionicons name={isPlaying ? "pause" : "play"} size={18} color="#0B101E" style={{ marginLeft: isPlaying ? 0 : 2 }} />
                  )}
                  <Text style={styles.audioPlayText}>{isPlaying ? t("stop") : t("listen")}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.audioDisabledBadge}>
                  <Ionicons name="volume-mute" size={16} color="#94A3B8" />
                  <Text style={styles.audioDisabledText}>{t("noAudio")}</Text>
                </View>
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

export default function DualarveSureler() {
  const { t } = useTranslation();
  return (
    <LinearGradient colors={["#080C16", "#121E36"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("prayersAndSurahs")}</Text>
          <Text style={styles.headerSubtitle}>{t("prayersSubtitle")}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {dualarData.map((item, index) => (
            <AccordionItem key={index} item={item} />
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === "android" ? 40 : 0 },
  header: { paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "rgba(212, 175, 55, 0.15)", marginBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: "300", color: "#E2E8F0", letterSpacing: 1 },
  headerSubtitle: { fontSize: 14, color: "#D4AF37", marginTop: 5, fontStyle: "italic" },
  scroll: { paddingHorizontal: 16, paddingBottom: 20 },
  cardContainer: { backgroundColor: "rgba(18, 30, 54, 0.7)", borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.2)", overflow: "hidden" },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 18 },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 12 },
  badgeDua: { backgroundColor: "rgba(45, 212, 191, 0.15)", borderWidth: 1, borderColor: "rgba(45, 212, 191, 0.3)" },
  badgeSure: { backgroundColor: "rgba(212, 175, 55, 0.15)", borderWidth: 1, borderColor: "rgba(212, 175, 55, 0.3)" },
  typeBadgeText: { fontSize: 10, fontWeight: "bold", color: "#E2E8F0", textTransform: "uppercase" },
  cardTitle: { fontSize: 17, fontWeight: "600", color: "#E2E8F0", flex: 1 },
  cardBody: { paddingHorizontal: 18, paddingBottom: 20 },
  arabicBox: { backgroundColor: "rgba(212, 175, 55, 0.05)", padding: 20, paddingTop: 15, borderRadius: 12, marginBottom: 15 },
  arabicHeader: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "rgba(212, 175, 55, 0.1)", paddingBottom: 10 },
  audioPlayButton: { flexDirection: "row", backgroundColor: "#D4AF37", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, alignItems: "center", gap: 6, shadowColor: "#D4AF37", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  audioPlayText: { color: "#0B101E", fontWeight: "bold", fontSize: 12 },
  audioDisabledBadge: { flexDirection: "row", backgroundColor: "rgba(255, 255, 255, 0.05)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, alignItems: "center", gap: 5 },
  audioDisabledText: { color: "#94A3B8", fontSize: 11, fontWeight: "500" },
  arabicText: { fontSize: 24, color: "#D4AF37", textAlign: "right", lineHeight: 40, fontWeight: "600", fontFamily: Platform.OS === "ios" ? "Georgia" : "serif" },
  sectionLabel: { fontSize: 12, color: "#D4AF37", textTransform: "uppercase", fontWeight: "bold", marginBottom: 6, letterSpacing: 1 },
  contentText: { fontSize: 14, color: "#E2E8F0", lineHeight: 22, opacity: 0.9 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.05)", marginVertical: 15 },
});
