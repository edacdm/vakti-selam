import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View, ActivityIndicator } from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const dualarData = [
  {
    type: "Dua",
    title: "Sübhaneke Duası",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ ۝ وَتَبَارَكَ اسْمُكَ ۝ وَتَعَالَى جَدُّكَ ۝ وَلَا إِلَهَ غَيْرُكَ",
    okunus: "Sübhânekellâhümme ve bi hamdik ve tebârakesmük ve teâlâ ceddük (ve celle senâük)* ve lâ ilâhe ğayruk.",
    anlam: "Allah'ım! Sen eksik sıfatlardan pak ve uzaksın. Seni daima böyle tenzih eder ve överim. Senin adın mübarektir. Varlığın her şeyden üstündür. Senden başka ilah yoktur. (*Ve celle senâük cümlesi sadece cenaze namazında eklenir.)",
    audioUrl: ""
  },
  {
    type: "Dua",
    title: "Ettehiyyatü Duası",
    arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ۝ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ۝ السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ ۝ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    okunus: "Ettehiyyâtü lillâhi ve's-salevâtü ve't-tayyibât. Es-selâmü aleyke eyyühe'n-nebiyyü ve rahmetüllâhi ve berakâtüh. Es-selâmü aleynâ ve alâ ıbâdillâhi's-sâlihîn. Eşhedü en lâ ilâhe illallâh ve eşhedü enne Muhammeden abdühû ve rasûlüh.",
    anlam: "Bütün dualar, senalar, bedeni ve mali ibadetler Allah'a mahsustur. Ey Peygamber! Sana selam olsun, Allah'ın rahmeti ve bereketi üzerine olsun. Selam bize ve Allah'ın salih kullarına olsun. Ben şehadet ederim ki, Allah'tan başka ilah yoktur ve yine şehadet ederim ki, Muhammed O'nun kulu ve elçisidir.",
    audioUrl: ""
  },
  {
    type: "Dua",
    title: "Allahümme Salli Duası",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ ۝ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ ۝ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    okunus: "Allâhümme salli alâ Muhammedin ve alâ âli Muhammed. Kemâ salleyte alâ İbrâhîme ve alâ âli İbrâhim. İnneke hamîdün mecîd.",
    anlam: "Allah'ım! Hz. Muhammed'e ve onun âline rahmet eyle, tıpkı Hz. İbrahim'e ve onun âline rahmet eylediğin gibi. Şüphesiz sen övülmeye layıksın, yücesin.",
    audioUrl: ""
  },
  {
    type: "Dua",
    title: "Allahümme Barik Duası",
    arabic: "اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ ۝ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ ۝ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    okunus: "Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed. Kemâ bârakte alâ İbrâhîme ve alâ âli İbrâhim. İnneke hamîdün mecîd.",
    anlam: "Allah'ım! Hz. Muhammed'i ve onun âlini mübarek kıl (bereketlendir), tıpkı Hz. İbrahim'i ve onun âlini mübarek kıldığın gibi. Şüphesiz sen övülmeye layıksın, yücesin.",
    audioUrl: ""
  },
  {
    type: "Dua",
    title: "Rabbenâ Âtinâ Duası",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    okunus: "Rabbenâ âtinâ fi'd-dünyâ haseneten ve fi'l-âhirati haseneten ve kınâ azâbe'n-nâr.",
    anlam: "Rabbimiz! Bize dünyada da iyilik ve güzellik ver, ahirette de iyilik ve güzellik ver. Ve bizi cehennem ateşinin azabından koru.",
    audioUrl: ""
  },
  {
    type: "Dua",
    title: "Kunut Duaları (Vitir)",
    arabic: "اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنَسْتَهْدِيكَ... اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي...",
    okunus: "Allâhümme innâ nesteînüke ve nestağfiruke ve nestehdîk... Allâhümme iyyâke na'büdü ve leke nüsallî...",
    anlam: "Allah'ım! Senden yardım dileriz, günahlarımızı bağışlamanı isteriz... Allah'ım! Biz ancak sana ibadet ederiz ve sadece senin için namaz kılarız...",
    audioUrl: ""
  },
  {
    type: "Sure",
    title: "Fatiha Suresi",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    okunus: "Bismillâhirrahmânirrahîm. Elhamdü lillâhi rabbil'alemin. Errahmânir'rahim. Mâliki yevmiddin. İyyâke na'budü ve iyyâke neste'în. İhdinessırâtel müstakîm. Sırâtellezine en'amte aleyhim ğayrilmağdûbi aleyhim ve leddâllîn.",
    anlam: "Rahman ve Rahim olan Allah'ın adıyla. Hamd, âlemlerin Rabbi, Rahman, Rahim ve hesap gününün sahibi olan Allah'a mahsustur. (Allahım!) Yalnız sana ibadet ederiz ve yalnız senden yardım dileriz. Bizi doğru yola, kendilerine nimet verdiklerinin yoluna ilet; gazaba uğrayanlarınkine ve sapkınlarınkine değil.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3"
  },
  {
    type: "Sure",
    title: "Âyet-el Kürsî",
    arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    okunus: "Allâhü lâ ilâhe illâ hüvel hayyül kayyûm, lâ te'huzühu sinetün velâ nevm, lehu mâ fissemâvâti ve ma fil'ard, men zellezi yeşfeu indehu illâ bi'iznih, ya'lemü mâ beyne eydiyhim vemâ halfehüm, velâ yühiytûne bişey'in min ilmihî illâ bima şâe vesia kürsiyyühüssemâvâti vel'ard, velâ yeûdühû hıfzuhümâ ve hüvel aliyyül azim.",
    anlam: "Allah kendisinden başka hiçbir ilah olmayandır. Diridir, kayyumdur. Onu ne bir uyuklama tutabilir, ne de bir uyku. Göklerdeki her şey, yerdeki her şey onundur. İzni olmaksızın onun katında şefaatte bulunacak kimdir?...",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002255.mp3"
  },
  {
    type: "Sure",
    title: "Asr Suresi",
    arabic: "وَالْعَصْرِ ۝ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    okunus: "Bismillâhirrahmânirrahîm. Vel'asr. İnnel'insâne lefî husr. İllellezîne âmenû ve amilüssâlihâti ve tevâsav bi'l-hakkı ve tevâsav bi's-sabr.",
    anlam: "Asra yemin olsun ki, şüphesiz insan ziyandadır. Ancak iman edip salih amel işleyenler, birbirlerine hakkı tavsiye edenler ve birbirlerine sabrı tavsiye edenler müstesnadır.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/103.mp3"
  },
  {
    type: "Sure",
    title: "Kevser Suresi",
    arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۝ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
    okunus: "Bismillâhirrahmânirrahîm. İnnâ a'taynâkel kevser. Fesalli lirabbike venhar. İnne şâni'eke hüvel'ebter.",
    anlam: "Şüphesiz biz sana Kevser'i verdik. O halde Rabbin için namaz kıl ve kurban kes. Doğrusu sana kin besleyen, soyu kesik olanın ta kendisidir.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/108.mp3"
  },
  {
    type: "Sure",
    title: "İhlas Suresi",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    okunus: "Bismillâhirrahmânirrahîm. Kul hüvellâhü ehad. Allâhüssamed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad.",
    anlam: "De ki: O, Allah birdir. Allah sameddir. (Her şey O'na muhtaçtır; O, hiçbir şeye muhtaç değildir.) O, doğurmamış ve doğmamıştır. Onun hiçbir dengi yoktur.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/112.mp3"
  },
  {
    type: "Sure",
    title: "Felak Suresi",
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    okunus: "Bismillâhirrahmânirrahîm. Kul eûzü birabbil felak. Min şerri mâ halak. Ve min şerri ğâsikın izâ vekab. Ve min şerrin neffâsâti fi'l ukad. Ve min şerri hâsidin izâ hased.",
    anlam: "De ki: Yarattığı şeylerin şerrinden, karanlığı çöktüğü zaman gecenin şerrinden, düğümlere üfleyen büyücülerin şerrinden ve haset ettiği zaman hasetçinin şerrinden, sabah aydınlığının Rabbine sığınırım.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/113.mp3"
  },
  {
    type: "Sure",
    title: "Nâs Suresi",
    arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    okunus: "Bismillâhirrahmânirrahîm. Kul eûzü birabbin-nâs. Melikin-nâs. İlâhin-nâs. Min şerril vesvâsil hannâs. Ellezî yüvesvisü fî sudûrin-nâs. Minel cinneti ven-nâs.",
    anlam: "De ki: Cinlerden ve insanlardan olup, insanların göğüslerine vesvese veren o sinsi vesvesecinin şerrinden insanların Rabbine, insanların Hükümdarına, insanların İlahına sığınırım.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/114.mp3"
  },
  {
    type: "Sure",
    title: "İnşirah Suresi",
    arabic: "اَلَمْ نَشْرَحْ لَكَ صَدْرَكَۙ ۝ وَوَضَعْنَا عَنْكَ وِزْرَكَۙ ۝ اَلَّذ۪يٓ اَنْقَضَ ظَهْرَكَۙ ۝ وَرَفَعْنَا لَكَ ذِكْرَكَۜ ۝ فَاِنَّ مَعَ الْعُسْرِ يُسْرًاۙ ۝ اِنَّ مَعَ الْعُسْرِ يُسْرًاۜ ۝ فَاِذَا فَرَغْتَ فَانْصَبْۙ ۝ وَاِلٰى رَبِّكَ فَارْغَبْ",
    okunus: "Bismillâhirrahmânirrahîm. Elem neşrah leke sadrek. Ve veda'nâ 'anke vizrek. Ellezî enkada zahrek. Ve rafa'nâ leke zikrek. Fe inne me'al'usri yüsran. İnne me'al'usri yüsran. Fe izâ ferağte fensab. Ve ilâ rabbike ferğab.",
    anlam: "Rahmân ve Rahîm olan Allah'ın adıyla. Biz senin göğsünü açıp genişletmedik mi? Belini büken yükünü üzerinden kaldırmadık mı? Senin şanını ve ününü yüceltmedik mi? Muhakkak ki zorlukla beraber bir kolaylık vardır. Evet, zorlukla beraber bir kolaylık vardır. Öyleyse, bir işi bitirince diğerine koyul. Ve ancak Rabbine yönel ve O'na yalvar.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/094.mp3"
  },
  {
    type: "Sure",
    title: "Kâfirûn Suresi",
    arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ ۝ لَا أَعْبُدُ مَا تَعْبُدُونَ ۝ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ ۝ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
    okunus: "Bismillâhirrahmânirrahîm. Kul yâ eyyühel kâfirûn. Lâ a'büdü mâ ta'büdûn. Ve lâ entüm âbidûne mâ a'büd. Ve lâ ene âbidün mâ abedtüm. Ve lâ entüm âbidûne mâ a'büd. Leküm dînüküm ve liye dîn.",
    anlam: "De ki: Ey kâfirler! Ben sizin taptıklarınıza tapmam. Siz de benim taptığıma tapanlar değilsiniz. Ben de sizin taptıklarınıza tapacak değilim. Siz de benim taptığıma tapacak değilsiniz. Sizin dininiz size, benim dinim bana.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/109.mp3"
  },
  {
    type: "Sure",
    title: "Fil Suresi",
    arabic: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ۝ أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ ۝ وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ ۝ تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ ۝ فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ",
    okunus: "Bismillâhirrahmânirrahîm. Elem tera keyfe fe'ale rabbüke bi'ashâbil fîl. Elem yec'al keydehüm fî tadlîl. Ve ersele aleyhim tayran ebâbîl. Termîhim bihicâratin min siccîl. Fece'alehüm ke'asfin me'kûl.",
    anlam: "Rabbin fil sahiplerine ne yaptı, görmedin mi? Onların tuzaklarını boşa çıkarmadı mı? Onların üzerine sürü sürü kuşlar gönderdi. Onlara balçıktan sertleştirilmiş taşlar atıyorlardı. Böylece Allah onları yenilmiş ekin yaprağı gibi kılıp parçaladı.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/105.mp3"
  },
  {
    type: "Sure",
    title: "Kureyş Suresi",
    arabic: "لِإِيلَافِ قُرَيْشٍ ۝ إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ ۝ فَلْيَعْبُدُوا رَبَّ هَذَا الْبَيْتِ ۝ الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ",
    okunus: "Bismillâhirrahmânirrahîm. Li'îlâfi kureyş. Îlâfihim rihleteşşitâi vessayf. Felya'büdû rabbe hâzelbeyt. Ellezî et'amehüm min cû'in ve âmenehüm min havf.",
    anlam: "Kureyş'in yurt edinmesi, kış ve yaz yolculuklarına alıştırılmaları için. O hâlde bu Kâbe'nin Rabbi olan Allah'a kulluk etsinler. O ki, onları açlıktan doyurmuş ve korkudan emin kılmıştır.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/106.mp3"
  },
  {
    type: "Sure",
    title: "Mâûn Suresi",
    arabic: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ۝ فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ ۝ وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ ۝ فَوَيْلٌ لِلْمُصَلِّينَ ۝ الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ ۝ الَّذِينَ هُمْ يُرَاءُونَ ۝ وَيَمْنَعُونَ الْمَاعُونَ",
    okunus: "Bismillâhirrahmânirrahîm. Era'eytelleziî yükezzibü biddîn. Fezâlikellezî yedü''ulyetîm. Ve lâ yehuddu 'alâ ta'âmilmiskîn. Feveylün lilmüsallîn. Ellezîne hüm 'an salâtihim sâhûn. Ellezîne hüm yürâûn. Ve yemne'ûnel mâ'ûn.",
    anlam: "Din gününü yalanlayanı gördün mü? İşte yetimi iten, kakıştıran o kimsedir. Yoksulun yiyeceği için teşvik etmez. Vay haline o namaz kılanların ki, onlar namazlarından gafildirler; onlar gösteriş yaparlar ve zekât vermezler.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/107.mp3"
  },
  {
    type: "Sure",
    title: "Tekâsür Suresi",
    arabic: "أَلْهَاكُمُ التَّكَاثُرُ ۝ حَتَّى زُرْتُمُ الْمَقَابِرَ ۝ كَلَّا سَوْفَ تَعْلَمُونَ ۝ ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ ۝ كَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ ۝ لَتَرَوُنَّ الْجَحِيمَ ۝ ثُمَّ لَتَرَوُنَّهَا عَيْنَ الْيَقِينِ ۝ ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ",
    okunus: "Bismillâhirrahmânirrahîm. Elhâkümmüttekâsür. Hattâ zürtümülmekâbir. Kellâ sevfe ta'lemûn. Sümme kellâ sevfe ta'lemûn. Kellâ lev ta'lemûne 'ilmelyakîn. Letarevünnel cahîm. Sümme letarevünnehâ 'aynelyakîn. Sümme letüs'elünne yevme'izin 'aninna'îm.",
    anlam: "Çokluğu ile öğünmek sizi oyaladı. Hatta mezarlıkları ziyaret edinceye kadar. Hayır! İleride bileceksiniz. Yine hayır! İleride bileceksiniz. Hayır! Kesin olarak bilseniz o cehennem ateşini mutlaka görürsünüz. Sonra onu gözün görmesiyle (kesin olarak) görürsünüz. Sonra o gün nimetlerden muhakkak hesaba çekileceksiniz.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/102.mp3"
  },
  {
    type: "Sure",
    title: "Zilzal Suresi",
    arabic: "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا ۝ وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا ۝ وَقَالَ الْإِنسَانُ مَا لَهَا ۝ يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا ۝ بِأَنَّ رَبَّكَ أَوْحَى لَهَا ۝ يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِيُرَوْا أَعْمَالَهُمْ ۝ فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ۝ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ",
    okunus: "Bismillâhirrahmânirrahîm. İzâ zülziletil'ardu zilzâlehâ. Ve ahrecetilardu eskâlehâ. Ve kâlelinsânü mâ lehâ. Yevme'izin tühaddisü ahbârehâ. Bienna rabbeke evhâ lehâ. Yevme'izin yasdürunn'nasü eştâten liyürev a'mâlehüm. Femey ya'mel miskâle zerretin hayreyyerah. Ve mey ya'mel miskâle zerretin şerreyyerah.",
    anlam: "Yer, o şiddetli sarsıntısıyla sarsıldığında; yer, ağırlıklarını (içindekilerini) dışarı çıkardığında; insan 'Bu (yer) ne oluyor?' dediğinde; işte o gün yer, haberlerini anlatır. Çünkü Rabbin ona vahyetmiştir. O gün insanlar, amellerinin karşılığını görmek üzere bölük bölük dönerler. Kim zerre ağırlığınca hayır işlerse onu görür. Kim de zerre ağırlığınca kötülük işlerse onu görür.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/099.mp3"
  }
];


const AccordionItem = ({ item }: { item: typeof dualarData[0] }) => {
  const [expanded, setExpanded] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  // Bellek yönetimi: Unmount veya kapandığında sesi sustur
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
    if (!item.audioUrl) return; // Ses yüklenemediyse hiçbir şey yapma
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
      } else {
        setIsBuffering(true);
        const source = typeof item.audioUrl === "string" ? { uri: item.audioUrl } : item.audioUrl;
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
          <View style={[styles.typeBadge, item.type === "Sure" ? styles.badgeSure : styles.badgeDua]}>
            <Text style={styles.typeBadgeText}>{item.type}</Text>
          </View>
          <Text style={styles.cardTitle}>{item.title}</Text>
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
                     <Text style={styles.audioPlayText}>{isPlaying ? "Durdur" : "Dinle"}</Text>
                   </TouchableOpacity>
                ) : (
                   <View style={styles.audioDisabledBadge}>
                     <Ionicons name="volume-mute" size={16} color="#94A3B8" />
                     <Text style={styles.audioDisabledText}>Ses Yok</Text>
                   </View>
                )}
             </View>
            <Text style={styles.arabicText}>{item.arabic}</Text>
          </View>

          <Text style={styles.sectionLabel}>Okunuşu:</Text>
          <Text style={styles.contentText}>{item.okunus}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Anlamı:</Text>
          <Text style={styles.contentText}>{item.anlam}</Text>
        </View>
      )}
    </View>
  );
};

export default function DualarveSureler() {
  return (
    <LinearGradient colors={["#080C16", "#121E36"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dualar ve Sureler</Text>
          <Text style={styles.headerSubtitle}>Namazda okunan ezberler rehberi</Text>
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
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212, 175, 55, 0.15)",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "300",
    color: "#E2E8F0",
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#D4AF37",
    marginTop: 5,
    fontStyle: "italic",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cardContainer: {
    backgroundColor: "rgba(18, 30, 54, 0.7)",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  badgeDua: {
    backgroundColor: "rgba(45, 212, 191, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(45, 212, 191, 0.3)",
  },
  badgeSure: {
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#E2E8F0",
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#E2E8F0",
    flex: 1,
  },
  cardBody: {
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  arabicBox: {
    backgroundColor: "rgba(212, 175, 55, 0.05)",
    padding: 20,
    paddingTop: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  arabicHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212, 175, 55, 0.1)",
    paddingBottom: 10,
  },
  audioPlayButton: {
    flexDirection: "row",
    backgroundColor: "#D4AF37",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    gap: 6,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  audioPlayText: {
    color: "#0B101E",
    fontWeight: "bold",
    fontSize: 12,
  },
  audioDisabledBadge: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: "center",
    gap: 5,
  },
  audioDisabledText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "500",
  },
  arabicText: {
    fontSize: 24,
    color: "#D4AF37",
    textAlign: "right",
    lineHeight: 40,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  sectionLabel: {
    fontSize: 12,
    color: "#D4AF37",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 6,
    letterSpacing: 1,
  },
  contentText: {
    fontSize: 14,
    color: "#E2E8F0",
    lineHeight: 22,
    opacity: 0.9,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginVertical: 15,
  },
});
