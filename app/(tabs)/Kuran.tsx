import { Audio } from "expo-av";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Dua / Sure Verileri (Mevcut) ───────────────────────────────────────────
const dualarData = [
  {
    type: "Dua",
    title: "Sübhaneke Duası",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ ۝ وَتَبَارَكَ اسْمُكَ ۝ وَتَعَالَى جَدُّكَ ۝ وَلَا إِلَهَ غَيْرُكَ",
    okunus: "Sübhânekellâhümme ve bi hamdik ve tebârakesmük ve teâlâ ceddük ve lâ ilâhe ğayruk.",
    anlam: "Allah'ım! Sen eksik sıfatlardan pak ve uzaksın. Seni daima böyle tenzih eder ve överim. Senin adın mübarektir. Varlığın her şeyden üstündür. Senden başka ilah yoktur.",
    audioUrl: "",
  },
  {
    type: "Dua",
    title: "Ettehiyyatü Duası",
    arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ۝ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
    okunus: "Ettehiyyâtü lillâhi ve's-salevâtü ve't-tayyibât. Es-selâmü aleyke eyyühe'n-nebiyyü ve rahmetüllâhi ve berakâtüh...",
    anlam: "Bütün dualar, senalar, bedeni ve mali ibadetler Allah'a mahsustur. Ey Peygamber, sana selam olsun, Allah'ın rahmeti ve bereketi üzerine olsun...",
    audioUrl: "",
  },
  {
    type: "Dua",
    title: "Allahümme Salli Duası",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ ۝ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ",
    okunus: "Allâhümme salli alâ Muhammedin ve alâ âli Muhammed. Kemâ salleyte alâ İbrâhîme ve alâ âli İbrâhim. İnneke hamîdün mecîd.",
    anlam: "Allah'ım! Hz. Muhammed'e ve onun âline rahmet eyle, tıpkı Hz. İbrahim'e ve onun âline rahmet eylediğin gibi.",
    audioUrl: "",
  },
  {
    type: "Dua",
    title: "Rabbenâ Âtinâ Duası",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    okunus: "Rabbenâ âtinâ fi'd-dünyâ haseneten ve fi'l-âhirati haseneten ve kınâ azâbe'n-nâr.",
    anlam: "Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver. Ve bizi cehennem ateşinin azabından koru.",
    audioUrl: "",
  },
  {
    type: "Sure",
    title: "Fatiha Suresi",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    okunus: "Bismillâhirrahmânirrahîm. Elhamdü lillâhi rabbil'alemin. Errahmânir'rahim. Mâliki yevmiddin...",
    anlam: "Rahman ve Rahim olan Allah'ın adıyla. Hamd, âlemlerin Rabbi olan Allah'a mahsustur. Yalnız sana ibadet ederiz ve yalnız senden yardım dileriz...",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3",
  },
  {
    type: "Sure",
    title: "Âyet-el Kürsî",
    arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...",
    okunus: "Allâhü lâ ilâhe illâ hüvel hayyül kayyûm, lâ te'huzühu sinetün velâ nevm...",
    anlam: "Allah kendisinden başka hiçbir ilah olmayandır. Diridir, kayyumdur...",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002255.mp3",
  },
  {
    type: "Sure",
    title: "İhlas Suresi",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    okunus: "Kul hüvellâhü ehad. Allâhüssamed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad.",
    anlam: "De ki: O, Allah birdir. Allah sameddir. O, doğurmamış ve doğmamıştır. Onun hiçbir dengi yoktur.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/112.mp3",
  },
  {
    type: "Sure",
    title: "Felak Suresi",
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ...",
    okunus: "Kul eûzü birabbil felak. Min şerri mâ halak...",
    anlam: "De ki: Yarattığı şeylerin şerrinden... sabah aydınlığının Rabbine sığınırım.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/113.mp3",
  },
  {
    type: "Sure",
    title: "Nâs Suresi",
    arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَهِ النَّاسِ...",
    okunus: "Kul eûzü birabbin-nâs. Melikin-nâs. İlâhin-nâs...",
    anlam: "De ki: İnsanların Rabbine, insanların Hükümdarına, insanların İlahına sığınırım...",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/114.mp3",
  },
  {
    type: "Sure",
    title: "İnşirah Suresi",
    arabic: "اَلَمْ نَشْرَحْ لَكَ صَدْرَكَۙ ۝ وَوَضَعْنَا عَنْكَ وِزْرَكَۙ...",
    okunus: "Elem neşrah leke sadrek. Ve veda'nâ 'anke vizrek...",
    anlam: "Biz senin göğsünü açıp genişletmedik mi?.. Zorlukla beraber kolaylık vardır.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/094.mp3",
  },
  {
    type: "Sure",
    title: "Kâfirûn Suresi",
    arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ ۝ لَا أَعْبُدُ مَا تَعْبُدُونَ...",
    okunus: "Kul yâ eyyühel kâfirûn. Lâ a'büdü mâ ta'büdûn...",
    anlam: "De ki: Ey kâfirler! Ben sizin taptıklarınıza tapmam... Sizin dininiz size, benim dinim bana.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/109.mp3",
  },
  {
    type: "Sure",
    title: "Zilzal Suresi",
    arabic: "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا...",
    okunus: "İzâ zülziletil'ardu zilzâlehâ...",
    anlam: "Yer, o şiddetli sarsıntısıyla sarsıldığında... Kim zerre ağırlığınca hayır işlerse onu görür.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/099.mp3",
  },
];

// ─── 114 Sure Listesi ────────────────────────────────────────────────────────
const SURELER = [
  { id: 1, turkce: "Fatiha", arapca: "الفاتحة", ayet: 7, yer: "Mekki" },
  { id: 2, turkce: "Bakara", arapca: "البقرة", ayet: 286, yer: "Medeni" },
  { id: 3, turkce: "Âl-i İmrân", arapca: "آل عمران", ayet: 200, yer: "Medeni" },
  { id: 4, turkce: "Nisâ", arapca: "النساء", ayet: 176, yer: "Medeni" },
  { id: 5, turkce: "Mâide", arapca: "المائدة", ayet: 120, yer: "Medeni" },
  { id: 6, turkce: "En'âm", arapca: "الأنعام", ayet: 165, yer: "Mekki" },
  { id: 7, turkce: "A'râf", arapca: "الأعراف", ayet: 206, yer: "Mekki" },
  { id: 8, turkce: "Enfâl", arapca: "الأنفال", ayet: 75, yer: "Medeni" },
  { id: 9, turkce: "Tevbe", arapca: "التوبة", ayet: 129, yer: "Medeni" },
  { id: 10, turkce: "Yûnus", arapca: "يونس", ayet: 109, yer: "Mekki" },
  { id: 11, turkce: "Hûd", arapca: "هود", ayet: 123, yer: "Mekki" },
  { id: 12, turkce: "Yûsuf", arapca: "يوسف", ayet: 111, yer: "Mekki" },
  { id: 13, turkce: "Ra'd", arapca: "الرعد", ayet: 43, yer: "Medeni" },
  { id: 14, turkce: "İbrâhim", arapca: "إبراهيم", ayet: 52, yer: "Mekki" },
  { id: 15, turkce: "Hicr", arapca: "الحجر", ayet: 99, yer: "Mekki" },
  { id: 16, turkce: "Nahl", arapca: "النحل", ayet: 128, yer: "Mekki" },
  { id: 17, turkce: "İsrâ", arapca: "الإسراء", ayet: 111, yer: "Mekki" },
  { id: 18, turkce: "Kehf", arapca: "الكهف", ayet: 110, yer: "Mekki" },
  { id: 19, turkce: "Meryem", arapca: "مريم", ayet: 98, yer: "Mekki" },
  { id: 20, turkce: "Tâhâ", arapca: "طه", ayet: 135, yer: "Mekki" },
  { id: 21, turkce: "Enbiyâ", arapca: "الأنبياء", ayet: 112, yer: "Mekki" },
  { id: 22, turkce: "Hac", arapca: "الحج", ayet: 78, yer: "Medeni" },
  { id: 23, turkce: "Mü'minûn", arapca: "المؤمنون", ayet: 118, yer: "Mekki" },
  { id: 24, turkce: "Nûr", arapca: "النور", ayet: 64, yer: "Medeni" },
  { id: 25, turkce: "Furkân", arapca: "الفرقان", ayet: 77, yer: "Mekki" },
  { id: 26, turkce: "Şuarâ", arapca: "الشعراء", ayet: 227, yer: "Mekki" },
  { id: 27, turkce: "Neml", arapca: "النمل", ayet: 93, yer: "Mekki" },
  { id: 28, turkce: "Kasas", arapca: "القصص", ayet: 88, yer: "Mekki" },
  { id: 29, turkce: "Ankebût", arapca: "العنكبوت", ayet: 69, yer: "Mekki" },
  { id: 30, turkce: "Rûm", arapca: "الروم", ayet: 60, yer: "Mekki" },
  { id: 31, turkce: "Lokmân", arapca: "لقمان", ayet: 34, yer: "Mekki" },
  { id: 32, turkce: "Secde", arapca: "السجدة", ayet: 30, yer: "Mekki" },
  { id: 33, turkce: "Ahzâb", arapca: "الأحزاب", ayet: 73, yer: "Medeni" },
  { id: 34, turkce: "Sebe'", arapca: "سبأ", ayet: 54, yer: "Mekki" },
  { id: 35, turkce: "Fâtır", arapca: "فاطر", ayet: 45, yer: "Mekki" },
  { id: 36, turkce: "Yâsîn", arapca: "يس", ayet: 83, yer: "Mekki" },
  { id: 37, turkce: "Sâffât", arapca: "الصافات", ayet: 182, yer: "Mekki" },
  { id: 38, turkce: "Sâd", arapca: "ص", ayet: 88, yer: "Mekki" },
  { id: 39, turkce: "Zümer", arapca: "الزمر", ayet: 75, yer: "Mekki" },
  { id: 40, turkce: "Mü'min", arapca: "غافر", ayet: 85, yer: "Mekki" },
  { id: 41, turkce: "Fussilet", arapca: "فصلت", ayet: 54, yer: "Mekki" },
  { id: 42, turkce: "Şûrâ", arapca: "الشورى", ayet: 53, yer: "Mekki" },
  { id: 43, turkce: "Zuhruf", arapca: "الزخرف", ayet: 89, yer: "Mekki" },
  { id: 44, turkce: "Duhân", arapca: "الدخان", ayet: 59, yer: "Mekki" },
  { id: 45, turkce: "Câsiye", arapca: "الجاثية", ayet: 37, yer: "Mekki" },
  { id: 46, turkce: "Ahkâf", arapca: "الأحقاف", ayet: 35, yer: "Mekki" },
  { id: 47, turkce: "Muhammed", arapca: "محمد", ayet: 38, yer: "Medeni" },
  { id: 48, turkce: "Fetih", arapca: "الفتح", ayet: 29, yer: "Medeni" },
  { id: 49, turkce: "Hucurât", arapca: "الحجرات", ayet: 18, yer: "Medeni" },
  { id: 50, turkce: "Kâf", arapca: "ق", ayet: 45, yer: "Mekki" },
  { id: 51, turkce: "Zâriyât", arapca: "الذاريات", ayet: 60, yer: "Mekki" },
  { id: 52, turkce: "Tûr", arapca: "الطور", ayet: 49, yer: "Mekki" },
  { id: 53, turkce: "Necm", arapca: "النجم", ayet: 62, yer: "Mekki" },
  { id: 54, turkce: "Kamer", arapca: "القمر", ayet: 55, yer: "Mekki" },
  { id: 55, turkce: "Rahmân", arapca: "الرحمن", ayet: 78, yer: "Medeni" },
  { id: 56, turkce: "Vâkı'a", arapca: "الواقعة", ayet: 96, yer: "Mekki" },
  { id: 57, turkce: "Hadîd", arapca: "الحديد", ayet: 29, yer: "Medeni" },
  { id: 58, turkce: "Mücâdele", arapca: "المجادلة", ayet: 22, yer: "Medeni" },
  { id: 59, turkce: "Haşr", arapca: "الحشر", ayet: 24, yer: "Medeni" },
  { id: 60, turkce: "Mümtehine", arapca: "الممتحنة", ayet: 13, yer: "Medeni" },
  { id: 61, turkce: "Saff", arapca: "الصف", ayet: 14, yer: "Medeni" },
  { id: 62, turkce: "Cum'a", arapca: "الجمعة", ayet: 11, yer: "Medeni" },
  { id: 63, turkce: "Münâfikûn", arapca: "المنافقون", ayet: 11, yer: "Medeni" },
  { id: 64, turkce: "Teğâbün", arapca: "التغابن", ayet: 18, yer: "Medeni" },
  { id: 65, turkce: "Talâk", arapca: "الطلاق", ayet: 12, yer: "Medeni" },
  { id: 66, turkce: "Tahrîm", arapca: "التحريم", ayet: 12, yer: "Medeni" },
  { id: 67, turkce: "Mülk", arapca: "الملك", ayet: 30, yer: "Mekki" },
  { id: 68, turkce: "Kalem", arapca: "القلم", ayet: 52, yer: "Mekki" },
  { id: 69, turkce: "Hâkka", arapca: "الحاقة", ayet: 52, yer: "Mekki" },
  { id: 70, turkce: "Meâric", arapca: "المعارج", ayet: 44, yer: "Mekki" },
  { id: 71, turkce: "Nûh", arapca: "نوح", ayet: 28, yer: "Mekki" },
  { id: 72, turkce: "Cin", arapca: "الجن", ayet: 28, yer: "Mekki" },
  { id: 73, turkce: "Müzzemmil", arapca: "المزمل", ayet: 20, yer: "Mekki" },
  { id: 74, turkce: "Müddessir", arapca: "المدثر", ayet: 56, yer: "Mekki" },
  { id: 75, turkce: "Kıyâme", arapca: "القيامة", ayet: 40, yer: "Mekki" },
  { id: 76, turkce: "İnsân", arapca: "الإنسان", ayet: 31, yer: "Medeni" },
  { id: 77, turkce: "Mürselât", arapca: "المرسلات", ayet: 50, yer: "Mekki" },
  { id: 78, turkce: "Nebe'", arapca: "النبأ", ayet: 40, yer: "Mekki" },
  { id: 79, turkce: "Nâziât", arapca: "النازعات", ayet: 46, yer: "Mekki" },
  { id: 80, turkce: "Abese", arapca: "عبس", ayet: 42, yer: "Mekki" },
  { id: 81, turkce: "Tekvîr", arapca: "التكوير", ayet: 29, yer: "Mekki" },
  { id: 82, turkce: "İnfitâr", arapca: "الانفطار", ayet: 19, yer: "Mekki" },
  { id: 83, turkce: "Mutaffifîn", arapca: "المطففين", ayet: 36, yer: "Mekki" },
  { id: 84, turkce: "İnşikâk", arapca: "الانشقاق", ayet: 25, yer: "Mekki" },
  { id: 85, turkce: "Burûc", arapca: "البروج", ayet: 22, yer: "Mekki" },
  { id: 86, turkce: "Târık", arapca: "الطارق", ayet: 17, yer: "Mekki" },
  { id: 87, turkce: "A'lâ", arapca: "الأعلى", ayet: 19, yer: "Mekki" },
  { id: 88, turkce: "Gâşiye", arapca: "الغاشية", ayet: 26, yer: "Mekki" },
  { id: 89, turkce: "Fecr", arapca: "الفجر", ayet: 30, yer: "Mekki" },
  { id: 90, turkce: "Beled", arapca: "البلد", ayet: 20, yer: "Mekki" },
  { id: 91, turkce: "Şems", arapca: "الشمس", ayet: 15, yer: "Mekki" },
  { id: 92, turkce: "Leyl", arapca: "الليل", ayet: 21, yer: "Mekki" },
  { id: 93, turkce: "Duhâ", arapca: "الضحى", ayet: 11, yer: "Mekki" },
  { id: 94, turkce: "İnşirâh", arapca: "الشرح", ayet: 8, yer: "Mekki" },
  { id: 95, turkce: "Tîn", arapca: "التين", ayet: 8, yer: "Mekki" },
  { id: 96, turkce: "Alak", arapca: "العلق", ayet: 19, yer: "Mekki" },
  { id: 97, turkce: "Kadr", arapca: "القدر", ayet: 5, yer: "Mekki" },
  { id: 98, turkce: "Beyyine", arapca: "البينة", ayet: 8, yer: "Medeni" },
  { id: 99, turkce: "Zilzâl", arapca: "الزلزلة", ayet: 8, yer: "Medeni" },
  { id: 100, turkce: "Âdiyât", arapca: "العاديات", ayet: 11, yer: "Mekki" },
  { id: 101, turkce: "Kâria", arapca: "القارعة", ayet: 11, yer: "Mekki" },
  { id: 102, turkce: "Tekâsür", arapca: "التكاثر", ayet: 8, yer: "Mekki" },
  { id: 103, turkce: "Asr", arapca: "العصر", ayet: 3, yer: "Mekki" },
  { id: 104, turkce: "Hümeze", arapca: "الهمزة", ayet: 9, yer: "Mekki" },
  { id: 105, turkce: "Fîl", arapca: "الفيل", ayet: 5, yer: "Mekki" },
  { id: 106, turkce: "Kureyş", arapca: "قريش", ayet: 4, yer: "Mekki" },
  { id: 107, turkce: "Mâûn", arapca: "الماعون", ayet: 7, yer: "Mekki" },
  { id: 108, turkce: "Kevser", arapca: "الكوثر", ayet: 3, yer: "Mekki" },
  { id: 109, turkce: "Kâfirûn", arapca: "الكافرون", ayet: 6, yer: "Mekki" },
  { id: 110, turkce: "Nasr", arapca: "النصر", ayet: 3, yer: "Medeni" },
  { id: 111, turkce: "Tebbet", arapca: "المسد", ayet: 5, yer: "Mekki" },
  { id: 112, turkce: "İhlâs", arapca: "الإخلاص", ayet: 4, yer: "Mekki" },
  { id: 113, turkce: "Felak", arapca: "الفلق", ayet: 5, yer: "Mekki" },
  { id: 114, turkce: "Nâs", arapca: "الناس", ayet: 6, yer: "Mekki" },
];

// ─── Akordeon Bileşeni (Dualar / Kısa Sureler) ───────────────────────────────
const AccordionItem = ({ item }: { item: typeof dualarData[0] }) => {
  const [expanded, setExpanded] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
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
      if (status.didJustFinish) setIsPlaying(false);
    }
  };

  const toggleAudio = async () => {
    if (!item.audioUrl) return;
    try {
      if (sound) {
        isPlaying ? await sound.pauseAsync() : await sound.playAsync();
      } else {
        setIsBuffering(true);
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: item.audioUrl }, { shouldPlay: true }, onPlaybackStatusUpdate
        );
        setSound(newSound);
      }
    } catch (e) {
      setIsBuffering(false);
    }
  };

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity style={styles.accordionHeader} onPress={() => setExpanded(!expanded)} activeOpacity={0.8}>
        <View style={styles.accordionLeft}>
          <View style={[styles.typeBadge, item.type === "Sure" ? styles.sureBadge : styles.duaBadge]}>
            <Text style={styles.typeBadgeText}>{item.type}</Text>
          </View>
          <Text style={styles.accordionTitle}>{item.title}</Text>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#D4AF37" />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.accordionContent}>
          <Text style={styles.arabicText}>{item.arabic}</Text>
          <View style={styles.divider} />
          <Text style={styles.okunusText}>{item.okunus}</Text>
          <View style={styles.divider} />
          <Text style={styles.anlamText}>{item.anlam}</Text>
          {item.audioUrl ? (
            <TouchableOpacity style={styles.audioButton} onPress={toggleAudio} activeOpacity={0.8}>
              {isBuffering ? (
                <ActivityIndicator size="small" color="#0B101E" />
              ) : (
                <Ionicons name={isPlaying ? "pause" : "play"} size={18} color="#0B101E" />
              )}
              <Text style={styles.audioButtonText}>
                {isBuffering ? "Yükleniyor..." : isPlaying ? "Duraklat" : "Dinle (Alafasy)"}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
};

// ─── Ana Ekran ────────────────────────────────────────────────────────────────
export default function KuranScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dualar" | "kuran">("dualar");
  const [searchText, setSearchText] = useState("");

  const filteredSureler = SURELER.filter(
    (s) =>
      s.turkce.toLowerCase().includes(searchText.toLowerCase()) ||
      s.arapca.includes(searchText) ||
      s.id.toString().includes(searchText)
  );

  const renderSure = ({ item }: { item: typeof SURELER[0] }) => (
    <TouchableOpacity
      style={styles.sureItem}
      onPress={() => router.push(`/kuran/${item.id}` as any)}
      activeOpacity={0.8}
    >
      <View style={styles.sureNumBadge}>
        <Text style={styles.sureNumText}>{item.id}</Text>
      </View>
      <View style={styles.sureInfo}>
        <Text style={styles.sureTurkce}>{item.turkce}</Text>
        <Text style={styles.sureMeta}>{item.ayet} Ayet · {item.yer}</Text>
      </View>
      <Text style={styles.sureArapca}>{item.arapca}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#0B101E", "#15233E"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="book-open-page-variant" size={26} color="#D4AF37" />
          <Text style={styles.headerTitle}>Kur'an & Dualar</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Sekme Değiştirici */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "dualar" && styles.tabBtnActive]}
            onPress={() => setActiveTab("dualar")}
          >
            <Text style={[styles.tabBtnText, activeTab === "dualar" && styles.tabBtnTextActive]}>
              Dualar & Sureler
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "kuran" && styles.tabBtnActive]}
            onPress={() => setActiveTab("kuran")}
          >
            <Text style={[styles.tabBtnText, activeTab === "kuran" && styles.tabBtnTextActive]}>
              Kur'an-ı Kerim
            </Text>
          </TouchableOpacity>
        </View>

        {/* İçerik */}
        {activeTab === "dualar" ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {dualarData.map((item, idx) => (
              <AccordionItem key={idx} item={item} />
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>
            {/* Arama */}
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Sure ara... (isim, numara)"
                placeholderTextColor="#64748B"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Ionicons name="close-circle" size={18} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredSureler}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderSure}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.sureItemSeparator} />}
            />
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Stiller ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  tabSwitcher: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  tabBtnActive: {
    backgroundColor: "#D4AF37",
  },
  tabBtnText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
  tabBtnTextActive: {
    color: "#0B101E",
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  // Akordeon
  accordionItem: {
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  accordionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 10,
  },
  duaBadge: { backgroundColor: "rgba(99, 102, 241, 0.2)", borderWidth: 1, borderColor: "rgba(99,102,241,0.4)" },
  sureBadge: { backgroundColor: "rgba(212, 175, 55, 0.15)", borderWidth: 1, borderColor: "rgba(212,175,55,0.4)" },
  typeBadgeText: { fontSize: 10, fontWeight: "700", color: "#D4AF37" },
  accordionTitle: { color: "#E2E8F0", fontSize: 15, fontWeight: "500", flex: 1 },
  accordionContent: { paddingHorizontal: 16, paddingBottom: 16 },
  arabicText: {
    color: "#E2E8F0",
    fontSize: 22,
    textAlign: "right",
    lineHeight: 38,
    fontWeight: "400",
    marginBottom: 12,
    writingDirection: "rtl",
  },
  okunusText: { color: "#94A3B8", fontSize: 14, fontStyle: "italic", lineHeight: 22, marginBottom: 8 },
  anlamText: { color: "#CBD5E1", fontSize: 14, lineHeight: 22 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.06)", marginVertical: 10 },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D4AF37",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 12,
    gap: 6,
  },
  audioButtonText: { color: "#0B101E", fontWeight: "700", fontSize: 13 },
  // Kuran Sure Listesi
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  searchInput: {
    flex: 1,
    color: "#E2E8F0",
    fontSize: 14,
  },
  sureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  sureNumBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  sureNumText: {
    color: "#D4AF37",
    fontWeight: "700",
    fontSize: 13,
  },
  sureInfo: { flex: 1 },
  sureTurkce: { color: "#E2E8F0", fontSize: 15, fontWeight: "600" },
  sureMeta: { color: "#64748B", fontSize: 12, marginTop: 2 },
  sureArapca: { color: "#D4AF37", fontSize: 18, fontWeight: "400" },
  sureItemSeparator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
});
