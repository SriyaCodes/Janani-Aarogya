import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Player } from '@lottiefiles/react-lottie-player';
import { FaRegClock, FaChild } from 'react-icons/fa';
import yogaPageTranslations from './PostYogaTranslations'; // adjust path as needed


const PostYogaPage = () => {
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState('en-IN');
  const auth = getAuth();
  const { title, subtitle, tipTitle, tipText } =
  yogaPageTranslations[language] || yogaPageTranslations['en-IN'];

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setLanguage(docSnap.data().language || 'en-IN');
        }
      }
    };
    fetchUserData();
  }, [auth.currentUser]);

  const yogaData = {
    'en-IN': [
      {
        id: 1,
        title: 'Gentle Pelvic Tilts',
        benefits: [
          'Strengthens abdominal muscles',
          'Improves pelvic alignment',
          'Reduces lower back pain'
        ],
        duration: '5 mins',
        level: 'Beginner',
        steps: [
          'Lie on your back with knees bent',
          'Flatten lower back against the floor',
          'Tilt pelvis slightly upward',
          'Hold for 3 breaths and release',
          'Repeat 8-10 times'
        ],
        animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
        precautions: 'Avoid if you have diastasis recti',
        image:'/assets/pelvic.jpg'
      },
      {
        id: 2,
        title: 'Seated Meditation',
        benefits: [
          'Reduces stress and anxiety',
          'Improves emotional balance',
          'Enhances milk production'
        ],
        duration: '10 mins',
        level: 'All Levels',
        steps: [
          'Sit comfortably with spine straight',
          'Place hands on lap or knees',
          'Close eyes and focus on breath',
          'Breathe deeply for 5 counts',
          'Exhale slowly for 7 counts'
        ],
        animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
        precautions: 'Use cushion for support if needed',
        image :'/assets/meditation.jpg'
      },
      {
        id: 3,
        title: 'Cat-Cow Stretch',
        benefits: [
          'Relieves back tension',
          'Massages internal organs',
          'Improves spinal flexibility'
        ],
        duration: '7 mins',
        level: 'Beginner',
        steps: [
          'Come to hands and knees position',
          'Inhale: Arch back, lift head (Cow)',
          'Exhale: Round spine, tuck chin (Cat)',
          'Move slowly with your breath',
          'Repeat 8-10 times'
        ],
        animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
        precautions: 'Go gently if you had C-section',
        image : '/assets/catcow-stretch.jpg'
      }
    ],'hi-IN': [
  {
    id: 1,
    title: 'कोमल पेल्विक टिल्ट्स',
    benefits: [
      'पेट की मांसपेशियों को मजबूत करता है',
      'पेल्विक संरेखण में सुधार करता है',
      'कमर दर्द को कम करता है'
    ],
    duration: '5 मिनट',
    level: 'शुरुआती',
    steps: [
      'पीठ के बल लेटें और घुटनों को मोड़ें',
      'कमर को फर्श से चिपकाएं',
      'पेल्विस को हल्का ऊपर की ओर झुकाएं',
      '3 सांसों तक रोकें और छोड़ें',
      '8-10 बार दोहराएं'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'अगर आपको डायस्टेसिस रेक्टी है तो यह न करें',
    image:'/assets/pelvic.jpg'
  },
  {
    id: 2,
    title: 'बैठकर ध्यान लगाना',
    benefits: [
      'तनाव और चिंता को कम करता है',
      'भावनात्मक संतुलन बेहतर करता है',
      'दूध उत्पादन को बढ़ाता है'
    ],
    duration: '10 मिनट',
    level: 'सभी स्तर',
    steps: [
      'आराम से बैठें और रीढ़ की हड्डी सीधी रखें',
      'हाथों को गोद या घुटनों पर रखें',
      'आंखें बंद करें और सांस पर ध्यान दें',
      '5 तक गहरी सांस लें',
      '7 तक धीरे-धीरे सांस छोड़ें'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    precautions: 'जरूरत हो तो सहारे के लिए कुशन का उपयोग करें',
    image :'/assets/meditation.jpg'
  },
  {
    id: 3,
    title: 'कैट-काउ स्ट्रेच',
    benefits: [
      'पीठ के तनाव को दूर करता है',
      'आंतरिक अंगों की मालिश करता है',
      'रीढ़ की लचीलापन बढ़ाता है'
    ],
    duration: '7 मिनट',
    level: 'शुरुआती',
    steps: [
      'हाथों और घुटनों के बल आएं',
      'सांस लेते समय: पीठ को आर्च करें, सिर ऊपर उठाएं (काउ)',
      'सांस छोड़ते समय: रीढ़ को गोल करें, ठुड्डी को अंदर करें (कैट)',
      'सांस के साथ धीरे-धीरे हिलें',
      '8-10 बार दोहराएं'
    ],
    animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
    precautions: 'अगर सी-सेक्शन हुआ हो तो सावधानी से करें',
    image : '/assets/catcow-stretch.jpg'
  }
],'ta-IN': [
  {
    id: 1,
    title: 'மென்மையான பெண்வாயு அசைவுகள்',
    benefits: [
      'வயிற்றுத் தசைகளை வலுப்படுத்துகிறது',
      'பெண்வாயு சீரமைப்பை மேம்படுத்துகிறது',
      'தொடையில் ஏற்படும் வலியை குறைக்கிறது'
    ],
    duration: '5 நிமிடம்',
    level: 'தொடக்க நிலை',
    steps: [
      'மீது படுத்து, முட்டிகளை மடக்கவும்',
      'தொடையை தரைக்கு ஒட்டி சற்று அழுத்தவும்',
      'பெண்வாயுவை மெதுவாக மேல் தூக்கவும்',
      '3 மூச்சுகள் வரை பிடித்து விட்டு விடவும்',
      '8-10 முறை மீண்டும் செய்யவும்'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'உங்களிடம் டையாஸ்டாசிஸ் ரெக்டி இருந்தால் தவிர்க்கவும்',
    image:'/assets/pelvic.jpg'
  },
  {
    id: 2,
    title: 'இருந்து தியானம் செய்வது',
    benefits: [
      'மன அழுத்தம் மற்றும் கவலையை குறைக்கிறது',
      'உணர்ச்சி நிலையை சமநிலையில் வைத்திருக்கும்',
      'பாலின் உற்பத்தியை அதிகரிக்கிறது'
    ],
    duration: '10 நிமிடம்',
    level: 'எல்லா நிலைகளும்',
    steps: [
      'சரியான நிலையில் நிமிர்ந்து அமரவும்',
      'கைகளைக் மடிக்கையில் அல்லது தொடைகளில் வைக்கவும்',
      'கண்களை மூடுங்கள் மற்றும் மூச்சில் கவனம் செலுத்தவும்',
      '5 எண்ணிக்கைக்கு ஆழமாக சுவாசிக்கவும்',
      '7 எண்ணிக்கைக்கு மெதுவாக வெளியே மூச்சை விடவும்'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    precautions: 'தேவையெனில் மெத்தை போன்ற துணைக்கு அமரவும்',
    image :'/assets/meditation.jpg'
  },
  {
    id: 3,
    title: 'பூனை-மாடு விரிப்பு',
    benefits: [
      'முதுகு வலியை குறைக்கிறது',
      'உட்புற உறுப்புகளுக்கு மசாஜ் அளிக்கிறது',
      'முதுகெலும்பின் நெகிழ்வை மேம்படுத்துகிறது'
    ],
    duration: '7 நிமிடம்',
    level: 'தொடக்க நிலை',
    steps: [
      'கைகளும் முழங்கால்களும் தரையில் இருக்குமாறு வரவும்',
      'உள்வாங்கும் போது: முதுகை வளைத்து, தலையை மேலே உயர்த்தவும் (மாடு)',
      'வெளியே மூச்சு விடும் போது: முதுகை வளைத்து, தலையை கீழே தாழ்த்தவும் (பூனை)',
      'மூச்சோட்டத்துடன் மெதுவாக நகரவும்',
      '8-10 முறை மீண்டும் செய்யவும்'
    ],
    animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
    precautions: 'சி-செக்ஷன் செய்திருந்தால் மெதுவாக செய்யவும்',
    image : '/assets/catcow-stretch.jpg'
  }
],'te-IN': [
  {
    id: 1,
    title: 'సౌమ్యమైన పెల్విక్ టిల్ట్స్',
    benefits: [
      'అడిలోపలి కండరాలను బలపరిచే పని చేస్తుంది',
      'పెల్విక్ సరళిని మెరుగుపరుస్తుంది',
      'తక్కువ వెన్నెముక నొప్పిని తగ్గిస్తుంది'
    ],
    duration: '5 నిమిషాలు',
    level: 'ప్రారంభ స్థాయి',
    steps: [
      'బెడ్ మీద తలపాలుగా పడుకుని మోకాలిని మడవాలి',
      'తలకిందకు వెన్ను భాగాన్ని నేలపై ఒత్తుగా ఉంచాలి',
      'పెల్విస్‌ను కాస్త పైకి ఎత్తాలి',
      '3 ఊపిరులతో గట్టిగా పట్టుకుని వదలాలి',
      '8-10 సార్లు పునరావృతం చేయండి'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'డయాస్టేసిస్ రెక్టి ఉంటే ఈ వ్యాయామాన్ని నివారించండి',
    image:'/assets/pelvic.jpg'
  },
  {
    id: 2,
    title: 'కూర్చొని ధ్యానం',
    benefits: [
      'ఉత్తేజన మరియు ఆందోళన తగ్గిస్తుంది',
      'భావోద్వేగ సమతుల్యతను మెరుగుపరుస్తుంది',
      'పాలు ఉత్పత్తి మెరుగవుతుంది'
    ],
    duration: '10 నిమిషాలు',
    level: 'అన్ని స్థాయిలకు అనుకూలం',
    steps: [
      'సౌకర్యంగా కూర్చోవాలి, వెన్నెముక నేరుగా ఉంచాలి',
      'చేతులను మోకాలపై లేదా ఒడిలో ఉంచండి',
      'కళ్ళు మూసుకుని ఊపిరిపై దృష్టి పెట్టండి',
      '5 సంఖ్యల వరకు లోతుగా శ్వాసించండి',
      '7 సంఖ్యల వరకు మెల్లగా ఊపిరి విడిచిపెట్టండి'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    precautions: 'అవసరమైతే మద్దతు కోసం దిండును ఉపయోగించండి',
    image :'/assets/meditation.jpg'
  },
  {
    id: 3,
    title: 'క్యాట్-కౌ స్ట్రెచ్',
    benefits: [
      'వెన్నెముక ఒత్తిడిని తగ్గిస్తుంది',
      'అంతర్గత అవయవాలకు మసాజ్ ఇస్తుంది',
      'వెన్నెముక సౌలభ్యాన్ని పెంచుతుంది'
    ],
    duration: '7 నిమిషాలు',
    level: 'ప్రారంభ స్థాయి',
    steps: [
      'చేతులు మరియు మోకాలితో నేలపై వచ్చి నిలబడండి',
      'ఆముద్రణలో: వెన్నెముకను వంపుగా చేసి తలని పైకి లేపండి (కౌ)',
      'శ్వాస వదిలే సమయంలో: వెన్నెముకను లోపలికి తిప్పి తలని దిగవేయండి (క్యాట్)',
      'శ్వాసతో సహా మెల్లగా కదలండి',
      '8-10 సార్లు పునరావృతం చేయండి'
    ],
    animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
    precautions: 'సిజేరియన్ జరిగితే నెమ్మదిగా చేయాలి',
    image : '/assets/catcow-stretch.jpg'
  }
]
,
'kn-IN': [
  {
    id: 1,
    title: 'ಸೌಮ್ಯ ಪೆಲ್ವಿಕ್ ಟಿಲ್ಟ್ಸ್',
    benefits: [
      'ಒಡಲಿನ ಹೊಟ್ಟೆಯ ಸ್ನಾಯುಗಳನ್ನು ಬಲಪಡಿಸುತ್ತದೆ',
      'ಪೆಲ್ವಿಕ್ ಸ್ಥಿತಿಯನ್ನು ಸುಧಾರಿಸುತ್ತದೆ',
      'ಕೆಳಭಾಗದ ಬೆನ್ನುನೋವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ'
    ],
    duration: '5 ನಿಮಿಷ',
    level: 'ಆರಂಭಿಕ',
    steps: [
      'ಮೇಲ್ಭಾಗದಲ್ಲಿ ಬಲವಾಗಿ ಮಲಗಿ, ಮಡಚಿದ ಮೊಣಕಾಲುಗಳೊಂದಿಗೆ',
      'ನಿಮ್ಮ ಬೆನ್ನುಹೆಸರನ್ನು ನೆಲದ ವಿರುದ್ಧ ಚಪ್ಪಟಾಗಿ ಮಾಡಿ',
      'ಪೆಲ್ವಿಸ್ ಅನ್ನು ಸ್ವಲ್ಪ ಮೇಲಕ್ಕೆ ತೂಗಿಸಿ',
      '3 ಉಸಿರುಗೊಳಿಸೋವರೆಗೂ ಹಿಡಿದು ನಂತರ ಬಿಡಿ',
      '8-10 ಬಾರಿ ಪುನರಾವರ್ತಿಸಿ'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'ನಿಮಗೆ ಡಯಾಸ್ಟಾಸಿಸ್ ರೆಕ್ಟಿ ಇದ್ದರೆ ಈ ಅಭ್ಯಾಸವನ್ನು ತಪ್ಪಿಸಿ',
    image:'/assets/pelvic.jpg'
  },
  {
    id: 2,
    title: 'ಕುಳಿತು ಧ್ಯಾನ',
    benefits: [
      'ಉತ್ಕಂಠೆ ಮತ್ತು ಮಾನಸಿಕ ಒತ್ತಡವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ',
      'ಭಾವನಾತ್ಮಕ ಸಮತೋಲನವನ್ನು ಸುಧಾರಿಸುತ್ತದೆ',
      'ಹಾಲಿನ ಉತ್ಪಾದನೆಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ'
    ],
    duration: '10 ನಿಮಿಷ',
    level: 'ಎಲ್ಲಾ ಹಂತಗಳಿಗೆ',
    steps: [
      'ಸರಿಯಾದ ರೀತಿಯಲ್ಲಿ ಕುಳಿತುಕೊಳ್ಳಿ ಮತ್ತು ಬೆನ್ನು ನೇರವಾಗಿರಲಿ',
      'ಕೈಗಳನ್ನು ಮೊಣಕಾಲುಗಳ ಮೇಲೆ ಅಥವಾ ಮಡಿಲಿನಲ್ಲಿ ಇಡಿ',
      'ಕಣ್ಣುಗಳನ್ನು ಮುಚ್ಚಿ ಉಸಿರಿನ ಮೇಲೆ ಗಮನ ಹರಿಸಿ',
      '5 ಎಣಿಕೆಗೆ ಆಳವಾದ ಉಸಿರೆಳೆಯಿರಿ',
      '7 ಎಣಿಕೆಗೆ ಮೆಲ್ಮೆಲವಾಗಿ ಉಸಿರೆರೆಳಿಸಿ'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    precautions: 'ಆವಶ್ಯಕತೆ ಇದ್ದರೆ ಬೆಂಬಲಕ್ಕಾಗಿ ತುಷಣಿಯನ್ನು ಬಳಸಬಹುದು',
    image :'/assets/meditation.jpg'
  },
  {
    id: 3,
    title: 'ಕ್ಯಾಟ್-ಕೌ ಎಳೆದಾಟ',
    benefits: [
      'ಬೆನ್ನಿನ ಒತ್ತಡವನ್ನು ತಗ್ಗಿಸುತ್ತದೆ',
      'ಅಂತರಂಗ ಅಂಗಾಂಗಗಳಿಗೆ ಮಸಾಜ್ ನೀಡುತ್ತದೆ',
      'ಬೆನ್ನುಮೂಳೆಯ ಲವಚಿಕತೆಗೆ ಉತ್ತೇಜನ ನೀಡುತ್ತದೆ'
    ],
    duration: '7 ನಿಮಿಷ',
    level: 'ಆರಂಭಿಕ',
    steps: [
      'ಹೆಸರು ಮತ್ತು ಮೊಣಕಾಲುಗಳೊಂದಿಗೆ ನೆಲದ ಮೇಲೆ ಬರಲಿ',
      'ಉಸಿರೆಳೆಯುವಾಗ: ಬೆನ್ನುಮೂಳೆ ಬಾಗಿಸಿ ತಲೆಯನ್ನು ಎತ್ತಿ (ಕೌ)',
      'ಉಸಿರೆರೆಳಿಸುವಾಗ: ಬೆನ್ನು ಬಾಗಿಸಿ ತಲೆಯನ್ನು ತಗ್ಗಿಸಿ (ಕ್ಯಾಟ್)',
      'ನಿಮ್ಮ ಉಸಿರಿನೊಂದಿಗೆ ನಿಧಾನವಾಗಿ ಚಲಿಸಿ',
      '8-10 ಬಾರಿ ಪುನರಾವರ್ತಿಸಿ'
    ],
    animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
    precautions: 'ಸಿಜೇರಿಯನ್ ಹೆರಿಗೆ ಇದ್ದರೆ ನಿಧಾನವಾಗಿ ಮಾಡಿ',
    image : '/assets/catcow-stretch.jpg'
  }
],'mr-IN': [
  {
    id: 1,
    title: 'सौम्य पेल्विक टिल्ट्स',
    benefits: [
      'पोटाच्या स्नायूंना बळकट करते',
      'पेल्विक स्थिती सुधारते',
      'खालच्या पाठदुखीमध्ये आराम देते'
    ],
    duration: '5 मिनिटे',
    level: 'सुरुवातीचे',
    steps: [
      'पाठीवर झोपा आणि गुडघे वाका',
      'पाठीचा खालचा भाग जमिनीवर चिटकवा',
      'पेल्विस थोडा वर उचला',
      '3 श्वासांपर्यंत रोखा आणि सैल करा',
      '8-10 वेळा पुन्हा करा'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'डायस्टेसिस रेक्टी असल्यास टाळा',
    image:'/assets/pelvic.jpg'
  },
  {
    id: 2,
    title: 'बसून ध्यानधारणा',
    benefits: [
      'तणाव आणि चिंता कमी करते',
      'भावनिक संतुलन सुधारते',
      'दूध उत्पादन वाढवते'
    ],
    duration: '10 मिनिटे',
    level: 'सर्व पातळ्यांसाठी',
    steps: [
      'सोयीस्कर पद्धतीने सरळ मानेने बसा',
      'हात मांडीवर किंवा गुडघ्यांवर ठेवा',
      'डोळे बंद करून श्वासावर लक्ष केंद्रित करा',
      '5 मोजेपर्यंत खोल श्वास घ्या',
      '7 मोजेपर्यंत सावकाश श्वास सोडा'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    precautions: 'गरज असल्यास आधारासाठी उशी वापरा',
    image :'/assets/meditation.jpg'
  },
  {
    id: 3,
    title: 'बिल्ली-गाय पोज (Cat-Cow Stretch)',
    benefits: [
      'पाठीचा ताण कमी करतो',
      'अंतर्गत अवयवांना मसाज मिळतो',
      'पाठीचा लवचिकपणा वाढवतो'
    ],
    duration: '7 मिनिटे',
    level: 'सुरुवातीचे',
    steps: [
      'हात व गुडघे जमिनीवर ठेवून या स्थितीत या',
      'श्वास घेताना: पाठ वाकवा, डोके वर (गाय)',
      'श्वास सोडताना: पाठ गोल करा, ठोशी आत (बिल्ली)',
      'श्वासासोबत सौम्यपणे हालचाल करा',
      '8-10 वेळा पुन्हा करा'
    ],
    animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
    precautions: 'सी-सेक्शन झाल्यास हळू करा',
    image : '/assets/catcow-stretch.jpg'
  }
],'bn-IN': [
  {
    id: 1,
    title: 'নরম পেলভিক টিল্ট',
    benefits: [
      'পেটের পেশিকে শক্তিশালী করে',
      'পেলভিসের অ্যালাইনমেন্ট উন্নত করে',
      'নিচের পিঠের ব্যথা কমায়'
    ],
    duration: '৫ মিনিট',
    level: 'শুরুর স্তর',
    steps: [
      'পিঠের উপর শুয়ে পড়ুন এবং হাঁটু মোড়ান',
      'পিঠের নিচের অংশ মেঝের সাথে চেপে ধরুন',
      'পেলভিসকে হালকাভাবে উপরের দিকে উঠান',
      '৩ বার শ্বাস নিয়ে ধরে রাখুন এবং ছেড়ে দিন',
      '৮-১০ বার পুনরাবৃত্তি করুন'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'আপনার ডায়াসটেসিস রেক্টি থাকলে এই ব্যায়াম এড়িয়ে চলুন',
    image:'/assets/pelvic.jpg'
  },
  {
    id: 2,
    title: 'বসে ধ্যান করা',
    benefits: [
      'চাপ ও দুশ্চিন্তা হ্রাস করে',
      'আবেগের ভারসাম্য উন্নত করে',
      'দুধ উৎপাদন বাড়াতে সাহায্য করে'
    ],
    duration: '১০ মিনিট',
    level: 'সব স্তরের জন্য',
    steps: [
      'সোজা মেরুদণ্ড রেখে আরামদায়কভাবে বসুন',
      'হাত দুটো হাঁটু বা কোলের উপর রাখুন',
      'চোখ বন্ধ করে শ্বাসে মনোযোগ দিন',
      '৫ গোনা পর্যন্ত গভীর শ্বাস নিন',
      '৭ গোনা পর্যন্ত ধীরে ধীরে শ্বাস ছাড়ুন'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    precautions: 'প্রয়োজনে সাপোর্টের জন্য কুশন ব্যবহার করুন',
    image :'/assets/meditation.jpg'
  },
  {
    id: 3,
    title: 'ক্যাট-কাউ স্ট্রেচ',
    benefits: [
      'পিঠের টেনশন কমায়',
      'অভ্যন্তরীণ অঙ্গগুলোর ম্যাসাজ করে',
      'মেরুদণ্ডের নমনীয়তা বাড়ায়'
    ],
    duration: '৭ মিনিট',
    level: 'শুরুর স্তর',
    steps: [
      'হাত ও হাঁটুর উপর ভর দিয়ে অবস্থান নিন',
      'শ্বাস নিন: পিঠ নিচের দিকে বাঁকান, মাথা তুলুন (কাউ)',
      'শ্বাস ছাড়ুন: পিঠ উঁচু করে তুলুন, থুতনি বুকের দিকে (ক্যাট)',
      'শ্বাসের সাথে ধীরে ধীরে নড়াচড়া করুন',
      '৮-১০ বার পুনরাবৃত্তি করুন'
    ],
    animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
    precautions: 'সিজারিয়ান হয়ে থাকলে ধীরে ধীরে করুন',
    image : '/assets/catcow-stretch.jpg'
  }
],'gu-IN': [
  {
    id: 1,
    title: 'નમ્ર પેલ્વિક ટિલ્ટ્સ',
    benefits: [
      'પેટની માંસપેશીઓને મજબૂત બનાવે છે',
      'પેલ્વિક ગોઠવણી સુધારે છે',
      'નીચલા પીઠના દુઃખાવામાં રાહત આપે છે'
    ],
    duration: '5 મિનિટ',
    level: 'શરૂઆત માટે',
    steps: [
      'પીઠ પર સૂઈ જાઓ અને ઘૂંટણોને વાંકા કરો',
      'પીઠના નીચલા ભાગને જમીન સામે દબાવો',
      'પેલ્વિસને હળવી રીતે ઉપર ઢોળાવાવો',
      '3 શ્વાસ સુધી રોકો અને છોડો',
      '8-10 વાર પુનરાવૃત્તિ કરો'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'જો તમને ડાયાસ્ટેસિસ રેક્ટી હોય તો ટાળો',
    image:'/assets/pelvic.jpg'
  },
  {
    id: 2,
    title: 'બેસીને ધ્યાન',
    benefits: [
      'તણાવ અને ચિંતા ઘટાડે છે',
      'ભાવનાત્મક સંતુલન સુધારે છે',
      'દૂધના ઉત્પાદનમાં વધારો કરે છે'
    ],
    duration: '10 મિનિટ',
    level: 'બધા સ્તરો માટે',
    steps: [
      'સરળ અને સીધી પીઠ સાથે બેસો',
      'હાથોને ઘૂંટણો અથવા ગોદમાં રાખો',
      'આંખો બંધ કરો અને શ્વાસ પર ધ્યાન આપો',
      '5 સુધી ઊંડો શ્વાસ લો',
      '7 સુધી ધીમે ધીમે શ્વાસ છોડો'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    precautions: 'આવશ્યકતા હોય તો સાથ માટે તકિયાનો ઉપયોગ કરો',
    image :'/assets/meditation.jpg'
  },
  {
    id: 3,
    title: 'કેટ-કાઉ સ્ટ્રેચ',
    benefits: [
      'પીઠના તણાવમાં રાહત આપે છે',
      'આંતરિક અવયવોને મસાજ મળે છે',
      'પીઠની લવચીકતા સુધારે છે'
    ],
    duration: '7 મિનિટ',
    level: 'શરૂઆત માટે',
    steps: [
      'હાથ અને ઘૂંટણ ઉપર સપોર્ટ સાથે સ્થિતિ લો',
      'શ્વાસ લેતાં: પીઠ નીચે વાળો અને માથું ઉંચું કરો (કાઉ)',
      'શ્વાસ છોડતાં: પીઠ ઉંચી કરો અને માથું નીચે કરો (કેટ)',
      'શ્વાસ સાથે ધીમે ધીમે હલનચલન કરો',
      '8-10 વાર પુનરાવૃત્તિ કરો'
    ],
    animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
    precautions: 'સી-સેક્શન થયેલ હોય તો ધીમે કરો',
    image : '/assets/catcow-stretch.jpg'
  }
],'ml-IN': [
  {
    id: 1,
    title: 'സൗമ്യമായ പെൽവിക് ടിൽറ്റ്‌സ്',
    benefits: [
      'വയറ്റിലെ പേശികൾ ശക്തിപ്പെടുത്തുന്നു',
      'പെൽവിക് സജ്ജീകരണം മെച്ചപ്പെടുത്തുന്നു',
      'താഴെയുള്ള പുറകുവേദന കുറയ്ക്കുന്നു'
    ],
    duration: '5 മിനിറ്റ്',
    level: 'ആരംഭം',
    steps: [
      'പുറകിലായി കിടക്കുക, മുട്ടകൾ മടക്കുക',
      'പുറകിന്റെ താഴത്തെ ഭാഗം നിലത്ത് അമർത്തുക',
      'പെൽവിസ് യഥാശക്തി മേലേക്ക് തള്ളുക',
      '3 ശ്വാസങ്ങൾ വരെ പിടിച്ച് വിടുക',
      '8-10 തവണ ആവർത്തിക്കുക'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'ഡയാസ്ടേസിസ് റെക്റ്റി ഉള്ളവരാണെങ്കിൽ ഒഴിവാക്കുക',
    image:'/assets/pelvic.jpg'
  },
  {
    id: 2,
    title: 'കൂടി ഇരുന്ന് ധ്യാനം',
    benefits: [
      'മനോവിഷമവും ദു:ഖവും കുറയ്ക്കുന്നു',
      'ആവേശപരമായ സമതുലിതത്വം മെച്ചപ്പെടുത്തുന്നു',
      'പാലുണ്ടാക്കൽ മെച്ചപ്പെടുത്തുന്നു'
    ],
    duration: '10 മിനിറ്റ്',
    level: 'എല്ലാ തലങ്ങള്ക്കും',
    steps: [
      'സുഖപ്രദമായി നേരായി ഇരിക്കുക',
      'കൈകൾ മുട്ടയിൽ അല്ലെങ്കിൽ മടിയിൽ വയ്ക്കുക',
      'കണ്ണുകൾ അടച്ച് ശ്വാസത്തിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുക',
      '5 എണ്ണത്തിന് ആഴത്തിൽ ശ്വാസം എടുക്കുക',
      '7 എണ്ണം വരെ ശ്വാസം വിരൽച്ചായി വിട്ടുവെക്കുക'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    precautions: 'ആവശ്യമെങ്കിൽ തുണിയുടെ മേൽ ഇരിക്കുക',
    image :'/assets/meditation.jpg'
  },
  {
    id: 3,
    title: 'പൂച്ച-കാളയുടെ സ്ട്രെച്ച് (Cat-Cow Stretch)',
    benefits: [
      'പിറകുവേദന കുറയ്ക്കുന്നു',
      'അന്തർഘടകങ്ങൾക്കുള്ള മസാജ് നൽകുന്നു',
      'വേരറ്റം ലളിതമാക്കുന്നു'
    ],
    duration: '7 മിനിറ്റ്',
    level: 'ആരംഭം',
    steps: [
      'കൈകളും മുട്ടുകളും നിലത്തിൽ വയ്ക്കുക',
      'ശ്വാസം എടുക്കുമ്പോൾ: പുറം വാക്കുക, തല ഉയർത്തുക (കാവിന്റെ പൊസിഷൻ)',
      'ശ്വാസം വിട്ട്: പുറം ചുറ്റിക്കുക, താടി കിഴിച്ചേക്ക് (പൂച്ചയുടെ പൊസിഷൻ)',
      'ശ്വാസവുമായി ലയിച്ചുനിൽക്കുന്ന രീതിയിൽ മെല്ലെ ചലിക്കുക',
      '8-10 തവണ ആവർത്തിക്കുക'
    ],
    animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
    precautions: 'സി-സെക്ഷൻ നടത്തിയിട്ടുണ്ടെങ്കിൽ സൂക്ഷ്മത പുലർത്തുക',
    image : '/assets/catcow-stretch.jpg'
  }
],'pa-IN': [
  {
    id: 1,
    title: 'ਨਰਮ ਪੈਲਵਿਕ ਟਿਲਟਸ',
    benefits: [
      'ਪੇਟ ਦੇ ਮਾਸਪੇਸ਼ੀਆਂ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਦਾ ਹੈ',
      'ਪੈਲਵਿਕ ਅਲਾਈਨਮੈਂਟ ਨੂੰ ਸੁਧਾਰਦਾ ਹੈ',
      'ਹੇਠਲੇ ਪਿੱਠ ਦਰਦ ਨੂੰ ਘਟਾਉਂਦਾ ਹੈ'
    ],
    duration: '5 ਮਿੰਟ',
    level: 'ਸ਼ੁਰੂਆਤੀ',
    steps: [
      'ਪਿੱਠ ਉੱਤੇ ਲੇਟੋ ਅਤੇ ਘੁੱਟਣੇ ਮੋੜੋ',
      'ਹੇਠਲਾ ਪਿੱਠ ਜ਼ਮੀਨ ਨਾਲ ਲਾਈਨ ਕਰੋ',
      'ਪੈਲਵਿਸ ਨੂੰ ਹੌਲੀ ਜਿਹਾ ਉੱਪਰ ਵਲ ਝੁਕਾਓ',
      '3 ਸਾਹਾਂ ਲਈ ਰੋਕੋ ਅਤੇ ਛੱਡੋ',
      '8-10 ਵਾਰੀ ਦੁਹਰਾਓ'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'ਜੇ ਤੁਸੀਂ ਡਾਇਅਸਟੇਸਿਸ ਰੈਕਟੀ ਨਾਲ ਪੀੜਤ ਹੋ ਤਾਂ ਇਹ ਨਾ ਕਰੋ',
    image:'/assets/pelvic.jpg'
  },
  {
    id: 2,
    title: 'ਬੈਠ ਕੇ ਧਿਆਨ',
    benefits: [
      'ਤਣਾਅ ਅਤੇ ਚਿੰਤਾ ਨੂੰ ਘਟਾਉਂਦਾ ਹੈ',
      'ਭਾਵਨਾਤਮਕ ਸੰਤੁਲਨ ਵਧਾਉਂਦਾ ਹੈ',
      'ਦੁੱਧ ਉਤਪਾਦਨ ਵਧਾਉਂਦਾ ਹੈ'
    ],
    duration: '10 ਮਿੰਟ',
    level: 'ਸਭ ਪੱਧਰਾਂ ਲਈ',
    steps: [
      'ਆਰਾਮਦਾਇਕ ਤਰੀਕੇ ਨਾਲ ਸਿੱਧੀ ਪਿੱਠ ਨਾਲ ਬੈਠੋ',
      'ਹੱਥਾਂ ਨੂੰ ਮੋਢਿਆਂ ਜਾਂ ਗੋਦੀ ਵਿੱਚ ਰਖੋ',
      'ਅੱਖਾਂ ਮੁੰਦੋ ਅਤੇ ਸਾਹ ਉੱਤੇ ਧਿਆਨ ਕੇਂਦਰਤ ਕਰੋ',
      '5 ਗਿਣਤੀ ਲਈ ਡੂੰਘਾ ਸਾਹ ਲਵੋ',
      '7 ਗਿਣਤੀ ਲਈ ਹੌਲੀ ਹੌਲੀ ਛੱਡੋ'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    precautions: 'ਜ਼ਰੂਰਤ ਹੋਵੇ ਤਾਂ ਸਹਾਰੇ ਲਈ ਗੱਦਾ ਵਰਤੋ',
    image :'/assets/meditation.jpg'
  },
  {
    id: 3,
    title: 'ਕੈਟ-ਕਾਊ ਸਟਰੈਚ',
    benefits: [
      'ਪਿੱਠ ਦੀ ਖਿੱਚ ਨੂੰ ਘਟਾਉਂਦਾ ਹੈ',
      'ਅੰਦਰੂਨੀ ਅੰਗਾਂ ਦੀ ਮਲਿਸ਼ ਕਰਦਾ ਹੈ',
      'ਰੀੜ੍ਹ ਦੀ ਹੱਡੀ ਦੀ ਲਚਕ ਵਧਾਉਂਦਾ ਹੈ'
    ],
    duration: '7 ਮਿੰਟ',
    level: 'ਸ਼ੁਰੂਆਤੀ',
    steps: [
      'ਹੱਥਾਂ ਅਤੇ ਘੁੱਟਿਆਂ ਉੱਤੇ ਆ ਜਾਓ',
      'ਸਾਹ ਲੈਣ ਸਮੇਂ: ਪਿੱਠ ਝੁਕਾਓ, ਸਿਰ ਉੱਪਰ (ਕਾਊ)',
      'ਸਾਹ ਛੱਡਣ ਸਮੇਂ: ਪਿੱਠ ਗੋਲ ਕਰੋ, ਥੋੜੀ ਅੰਦਰ (ਕੈਟ)',
      'ਸਾਹ ਦੇ ਨਾਲ ਹੌਲੀ ਹੌਲੀ ਹਿਲੋ',
      '8-10 ਵਾਰੀ ਦੁਹਰਾਓ'
    ],
    animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
    precautions: 'ਜੇ ਸੀ-ਸੈਕਸ਼ਨ ਹੋਇਆ ਹੋਵੇ ਤਾਂ ਆਹਿਸਤਾ ਕਰੋ',
    image : '/assets/catcow-stretch.jpg'
  }
]






  };

  const poses = yogaData[language] || yogaData['en-IN'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4 md:p-8">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">
          {title}
        </h1>
        <p className="text-gray-600">
          {subtitle}
        </p>
      </motion.header>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {poses.map((pose) => (
          <motion.div key={pose.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-48 bg-blue-100 flex items-center justify-center relative">
              <img
    src={pose.image}
    alt={pose.title}
    className="h-full w-full object-cover"
  />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">{pose.title}</h3>
              <div className="flex items-center mb-3">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 flex items-center">
                  <FaRegClock className="mr-1" /> {pose.duration}
                </span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded flex items-center">
                  <FaChild className="mr-1" /> {pose.level}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Benefits</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
                {pose.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
              </ul>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Steps</h4>
              <ol className="list-decimal pl-5 space-y-1 text-gray-700 mb-4">
                {pose.steps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Precautions</h4>
              <p className="text-red-600">{pose.precautions}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12 bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-indigo-800 mb-4">
          {tipTitle}
        </h2>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            {tipText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostYogaPage;
