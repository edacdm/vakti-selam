const tts = require('google-tts-api');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets', 'audio');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const dualar = {
    subhaneke: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ",
    ettehiyyatu: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    salli: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    barik: "اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    rabbena: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    kunut: "اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنَسْتَهْدِيكَ اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي"
};

const main = async () => {
    for (const [name, text] of Object.entries(dualar)) {
        try {
            console.log(`Downloading ${name}...`);
            const results = await tts.getAllAudioBase64(text, {
                lang: 'ar',
                slow: false,
                host: 'https://translate.google.com',
                splitPunct: ' '
            });
            const buffers = results.map(res => Buffer.from(res.base64, 'base64'));
            const finalBuffer = Buffer.concat(buffers);
            fs.writeFileSync(path.join(dir, `${name}.mp3`), finalBuffer);
            console.log(`Saved ${name}.mp3`);
        } catch (e) {
            console.error(`Error on ${name}:`, e);
        }
    }
};

main();
