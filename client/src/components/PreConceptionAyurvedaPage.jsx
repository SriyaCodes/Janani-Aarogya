import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {FaSeedling, FaShareAlt, FaBookmark, FaLeaf } from 'react-icons/fa';
import translations from './PreAyurTranslations';

import Navbar from '../components/Navbar';                   
import navbarTranslations from '../translations/navbarTranslations'; 
const PreConceptionAyurvedaPage = () => {
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState('en-IN');
  const [streak, setStreak]   = useState(0);                  
  const [bookmarked, setBookmarked] = useState([]);
  const auth = getAuth();
  const t = translations[language] || translations['en-IN'];
  // Pre-Conception Ayurvedic remedies
  const ayurvedicRemedies = {
    'en-IN': [
      {
        id: 1,
        title: 'Fertility-Boosting Churna',
        description: 'Balances hormones and improves reproductive health',
        benefits: [
          'Regulates menstrual cycle',
          'Improves egg/sperm quality',
          'Detoxifies reproductive system',
          'Strengthens uterine lining'
        ],
        ingredients: [
          '1 tsp Shatavari powder',
          '1 tsp Ashwagandha powder',
          '1 tsp Lodhra powder',
          '1 tsp Gokshura powder',
          '1 tsp honey (optional)'
        ],
        preparation: [
          'Mix all powders together',
          'Take 1 tsp with warm milk or water',
          'Consume daily for 3-6 months'
        ],
        animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
        frequency: 'Daily (morning)',
        precautions: 'Avoid if Kapha imbalance (excessive weight)',
        image:'/assets/churna.jpg'
      },
      {
        id: 2,
        title: 'Pre-Conception Detox Tea',
        description: 'Cleanses the body for optimal fertility',
        benefits: [
          'Removes toxins (Ama)',
          'Improves liver function',
          'Enhances digestion',
          'Prepares womb environment'
        ],
        ingredients: [
          '1 cup hot water',
          '1 tsp coriander seeds',
          '1 tsp cumin seeds',
          '1 tsp fennel seeds',
          '1 inch fresh ginger'
        ],
        preparation: [
          'Boil all ingredients for 5 minutes',
          'Strain and drink warm',
          'Best consumed on empty stomach'
        ],
        animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
        frequency: '3 times/week',
        precautions: 'Reduce if experiencing dryness',
        image:'/assets/detoxtea.jpg'
      },
      {
  id: 3,
  title: 'Reproductive Health Laddu',
  description: 'Nourishes reproductive tissues and builds strength',
  benefits: [
    'Boosts fertility and stamina',
    'Balances Vata and Pitta doshas',
    'Improves vitality and hormonal health',
    'Supports ovulation and healthy sperm'
  ],
  ingredients: [
    '1 cup dry dates (seedless, chopped)',
    '½ cup almonds',
    '½ cup sesame seeds',
    '¼ cup desi ghee',
    '2 tbsp Shatavari powder',
    '2 tbsp Ashwagandha powder',
    '1 tsp cardamom powder'
  ],
  preparation: [
    'Dry roast almonds and sesame seeds; grind coarsely',
    'Heat ghee, add dates and stir till soft',
    'Mix all ingredients in a bowl',
    'Shape into small laddus',
    'Store in airtight container'
  ],
  animation: 'https://assets1.lottiefiles.com/packages/lf20_4qpnlyta.json',
  frequency: '1 laddu daily (evening)',
  precautions: 'Avoid during fever or heavy digestion issues',
  image:'/assets/laddu.jpg'
}

    ],
    'hi-IN': [
  {
    id: 1,
    title: 'प्रजनन-वर्धक चूर्ण',
    description: 'हार्मोन को संतुलित करता है और प्रजनन स्वास्थ्य को सुधारता है',
    benefits: [
      'मासिक धर्म चक्र को नियमित करता है',
      'अंडाणु/शुक्राणु की गुणवत्ता में सुधार करता है',
      'प्रजनन तंत्र को डिटॉक्स करता है',
      'गर्भाशय की परत को मजबूत करता है'
    ],
    ingredients: [
      '1 चम्मच शतावरी चूर्ण',
      '1 चम्मच अश्वगंधा चूर्ण',
      '1 चम्मच लोध्र चूर्ण',
      '1 चम्मच गोक्षुर चूर्ण',
      '1 चम्मच शहद (वैकल्पिक)'
    ],
    preparation: [
      'सभी चूर्णों को एक साथ मिलाएं',
      '1 चम्मच गर्म दूध या पानी के साथ लें',
      '3-6 महीने तक प्रतिदिन सेवन करें'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
    frequency: 'रोज़ सुबह',
    precautions: 'कफ असंतुलन (अत्यधिक वजन) होने पर सेवन न करें',
    image:'/assets/churna.jpg'
    
  },
  {
    id: 2,
    title: 'पूर्व-गर्भधारण डिटॉक्स चाय',
    description: 'उत्तम प्रजनन के लिए शरीर की सफाई करती है',
    benefits: [
      'विषाक्त पदार्थ (आम) को निकालती है',
      'जिगर की कार्यक्षमता में सुधार करती है',
      'पाचन को बढ़ावा देती है',
      'गर्भाशय के वातावरण को तैयार करती है'
    ],
    ingredients: [
      '1 कप गर्म पानी',
      '1 चम्मच धनिया बीज',
      '1 चम्मच जीरा',
      '1 चम्मच सौंफ',
      '1 इंच ताजा अदरक'
    ],
    preparation: [
      'सभी सामग्री को 5 मिनट तक उबालें',
      'छानें और गर्म पीएं',
      'खाली पेट सबसे अच्छा सेवन करें'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    frequency: 'सप्ताह में 3 बार',
    precautions: 'शुष्कता महसूस होने पर सेवन कम करें',
    image:'/assets/detoxtea.jpg'
  },
  {
    id: 3,
    title: 'प्रजनन स्वास्थ्य लड्डू',
    description: 'प्रजनन ऊतकों का पोषण करता है और शक्ति बढ़ाता है',
    benefits: [
      'प्रजनन क्षमता और सहनशक्ति बढ़ाता है',
      'वात और पित्त दोष को संतुलित करता है',
      'ऊर्जा और हार्मोनल स्वास्थ्य को बेहतर करता है',
      'ओव्यूलेशन और स्वस्थ शुक्राणु का समर्थन करता है'
    ],
    ingredients: [
      '1 कप सूखे खजूर (बीज रहित, कटे हुए)',
      '½ कप बादाम',
      '½ कप तिल',
      '¼ कप देसी घी',
      '2 बड़े चम्मच शतावरी चूर्ण',
      '2 बड़े चम्मच अश्वगंधा चूर्ण',
      '1 चम्मच इलायची पाउडर'
    ],
    preparation: [
      'बादाम और तिल को भूनें और मोटा पीस लें',
      'घी गरम करें, उसमें खजूर डालें और नरम होने तक भूनें',
      'सभी सामग्री को एक कटोरे में मिलाएं',
      'छोटे लड्डू बनाएं',
      'हवा बंद डिब्बे में रखें'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_4qpnlyta.json',
    frequency: '1 लड्डू रोज़ शाम को',
    precautions: 'बुखार या भारी पाचन समस्या होने पर सेवन न करें',
    image:'/assets/laddu.jpg'
  }
]
,
    'ta-IN': [
  {
    id: 1,
    title: 'கருமுடை ஊக்க கூர்ணம்',
    description: 'ஹார்மோன்களை சமநிலையில் வைத்திருக்கும் மற்றும் இனப்பெருக்க ஆரோக்கியத்தை மேம்படுத்துகிறது',
    benefits: [
      'மாதவிடாய் சுழற்சியை ஒழுங்குபடுத்துகிறது',
      'முட்டை/விந்தணுவின் தரத்தை மேம்படுத்துகிறது',
      'இனப்பெருக்க உறுப்புகளை டிடாக்ஸ் செய்கிறது',
      'கருப்பை சுவர் திசுக்களை பலப்படுத்துகிறது'
    ],
    ingredients: [
      '1 டீஸ்பூன் சதாவரி பொடி',
      '1 டீஸ்பூன் அஸ்வகந்தா பொடி',
      '1 டீஸ்பூன் லோத்ரா பொடி',
      '1 டீஸ்பூன் கோக்ஷுரா பொடி',
      '1 டீஸ்பூன் தேன் (விருப்பப்படி)'
    ],
    preparation: [
      'அனைத்து பொடிகளையும் கலந்து கொள்ளவும்',
      '1 டீஸ்பூன் சூடான பால் அல்லது தண்ணீருடன் எடுத்துக்கொள்ளவும்',
      'தினமும் 3-6 மாதங்கள் வரை பயன்படுத்தவும்'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
    frequency: 'தினமும் காலை',
    precautions: 'கபம் அதிகமாக உள்ளவர்கள் தவிர்க்கவும்',
    image:'/assets/churna.jpg'
  },
  {
    id: 2,
    title: 'கருப்பை சுத்திகரிப்பு டிடாக்ஸ் டீ',
    description: 'உயர் கருமுடைக்கான உடலை சுத்திகரிக்கிறது',
    benefits: [
      'ஆமா (விஷம்) நீக்கம்',
      'கல்லீரல் செயல்பாட்டை மேம்படுத்துகிறது',
      'செரிமானத்தை தூண்டும்',
      'கருப்பை சூழலுக்கு தயார் செய்கிறது'
    ],
    ingredients: [
      '1 கப் சூடான தண்ணீர்',
      '1 டீஸ்பூன் கொத்தமல்லி விதை',
      '1 டீஸ்பூன் சீரகம்',
      '1 டீஸ்பூன் பெருஞ்சீரகம்',
      '1 இஞ்ச் இஞ்சி துண்டு'
    ],
    preparation: [
      'அனைத்தையும் 5 நிமிடங்கள் கொதிக்க விடவும்',
      'சிறுகச்சட்டி கொண்டு வடிகட்டி பருகவும்',
      'வெறும் வயிற்றில் பருகுவது சிறந்தது'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    frequency: 'வாரம் 3 முறை',
    precautions: 'உடலில் உலர்ச்சி ஏற்படும் போது அளவைக் குறைக்கவும்',
    image:'/assets/detoxtea.jpg'
  },
  {
    id: 3,
    title: 'இனப்பெருக்க ஆரோக்கிய லட்டு',
    description: 'இனப்பெருக்க திசுக்களை ஊட்டும் மற்றும் சக்தியை அளிக்கிறது',
    benefits: [
      'கருமுடை திறனையும் சக்தியையும் மேம்படுத்துகிறது',
      'வாதம் மற்றும் பித்தத்தை சமநிலைப்படுத்துகிறது',
      'உற்சாகத்தையும் ஹார்மோன் சீராக்கத்தையும் மேம்படுத்துகிறது',
      'முட்டை உருவாக்கத்தையும் தரமான விந்தணுவையும் ஊக்குவிக்கிறது'
    ],
    ingredients: [
      '1 கப் உலர்ந்த பேரீச்சம்பழம் (முளைகொட்டிய, நறுக்கியது)',
      '½ கப் பாதாம்',
      '½ கப் எள்ளு விதைகள்',
      '¼ கப் தேசிகி நெய்',
      '2 மேசரிங் ஸ்பூன் சதாவரி பொடி',
      '2 மேசரிங் ஸ்பூன் அஸ்வகந்தா பொடி',
      '1 டீஸ்பூன் ஏலக்காய் பொடி'
    ],
    preparation: [
      'பாதாம் மற்றும் எள்ளை வறுத்து அரைக்கவும்',
      'நெய் சூடாக்கி, பேரீச்சம்பழம் சேர்த்து மென்மையாகும் வரை கிளறவும்',
      'அனைத்தையும் கலந்துவிட்டு சிறிய லட்டுகளாக உருட்டவும்',
      'காற்றுப்புகா டப்பாவில் வைக்கவும்'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_4qpnlyta.json',
    frequency: 'தினமும் 1 லட்டு (மாலை)',
    precautions: 'காய்ச்சல் அல்லது செரிமானக் கோளாறுகள் உள்ளபோது தவிர்க்கவும்',
    image:'/assets/laddu.jpg'
  }
],'te-IN': [
  {
    id: 1,
    title: 'ఫెర్టిలిటీ బూస్టింగ్ చూర్ణం',
    description: 'హార్మోన్లను సమతుల్యం చేసి జనన ఆరోగ్యాన్ని మెరుగుపరుస్తుంది',
    benefits: [
      'ఋతుస్రావ చక్రాన్ని నియంత్రిస్తుంది',
      'అండం/వీర్య నాణ్యతను మెరుగుపరుస్తుంది',
      'ప్రజనన వ్యవస్థను డీటాక్స్ చేస్తుంది',
      'గర్భాశయ గోడలను బలపరుస్తుంది'
    ],
    ingredients: [
      '1 టీస్పూన్ శతావరి పొడి',
      '1 టీస్పూన్ అశ్వగంధ పొడి',
      '1 టీస్పూన్ లోధ్రా పొడి',
      '1 టీస్పూన్ గోక్షురా పొడి',
      '1 టీస్పూన్ తేనె (ఐచ్ఛికం)'
    ],
    preparation: [
      'అన్ని పొడులను బాగా కలపాలి',
      '1 టీస్పూన్ నీటిలో లేదా పాలలో కలిపి తాగాలి',
      'రోజూ ఉదయాన్నే 3-6 నెలల పాటు తీసుకోవాలి'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
    frequency: 'ప్రతిరోజూ ఉదయం',
    precautions: 'కఫ దోషం ఉన్నవారు నివారించాలి',
    image:'/assets/churna.jpg'
  },
  {
    id: 2,
    title: 'ప్రీ-కన్సెప్షన్ డీటాక్స్ టీ',
    description: 'శరీరాన్ని శుభ్రపరచి ఫెర్టిలిటీకి సన్నద్ధత కల్పిస్తుంది',
    benefits: [
      'టాక్సిన్స్ (ఆమా) తొలగింపు',
      'లివర్ పనితీరు మెరుగవుతుంది',
      'జీర్ణక్రియ మెరుగవుతుంది',
      'గర్భాశయాన్ని సన్నద్ధం చేస్తుంది'
    ],
    ingredients: [
      '1 కప్ వేడి నీరు',
      '1 టీస్పూన్ ధనియాల విత్తనాలు',
      '1 టీస్పూన్ జీలకర్ర విత్తనాలు',
      '1 టీస్పూన్ సోంపు విత్తనాలు',
      '1 అంగుళం తాజా అల్లం'
    ],
    preparation: [
      'అన్నింటినీ 5 నిమిషాలు మరిగించాలి',
      'వడకట్టి వేడిగా త్రాగాలి',
      'ఖాళీ కడుపుతో త్రాగితే ఉత్తమం'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    frequency: 'వారానికి 3 సార్లు',
    precautions: 'శరీర ఉలికిపాట్లు/ఎండ తగిలిన సమయంలో తగ్గించాలి',
    image:'/assets/detoxtea.jpg'
  },
  {
    id: 3,
    title: 'ప్రజనన ఆరోగ్య లడ్డు',
    description: 'ప్రజనన సంబంధమైన శక్తిని పెంచుతుంది మరియు శరీరాన్ని పోషిస్తుంది',
    benefits: [
      'ఫెర్టిలిటీ మరియు శక్తిని పెంచుతుంది',
      'వాత మరియు పిత్త దోషాలను సమతుల్యం చేస్తుంది',
      'ఉత్సాహం మరియు హార్మోనల్ ఆరోగ్యం మెరుగవుతుంది',
      'అండోత్పత్తిని మరియు ఉత్తమ వీర్య ఉత్పత్తిని ప్రోత్సహిస్తుంది'
    ],
    ingredients: [
      '1 కప్ ఎండిన ఖర్జూరాలు (గింజలు తీసివేసి ముక్కలుగా చేయాలి)',
      '½ కప్ బాదం',
      '½ కప్ నువ్వులు',
      '¼ కప్ దేశీ నెయ్యి',
      '2 టేబుల్ స్పూన్లు శతావరి పొడి',
      '2 టేబుల్ స్పూన్లు అశ్వగంధ పొడి',
      '1 టీస్పూన్ యాలకుల పొడి'
    ],
    preparation: [
      'బాదం మరియు నువ్వులను వేపి కొరికి పోసుకోవాలి',
      'నెయ్యి వేడి చేసి ఖర్జూరాలు వేసి మృదువుగా కలపాలి',
      'అన్నింటినీ బాగా కలిపి చిన్న లడ్డూలుగా చేసుకోవాలి',
      'గాలి ప్రవేశించని డబ్బాలో భద్రపరచాలి'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_4qpnlyta.json',
    frequency: 'రోజుకు 1 లడ్డూ (సాయంత్రం)',
    precautions: 'జ్వరం లేదా తీవ్రమైన జీర్ణ సమస్యలు ఉన్నవారు నివారించాలి',
    image:'/assets/laddu.jpg'
  }
],'kn-IN': [
  {
    id: 1,
    title: 'ವಂಧ್ಯತ್ವ ನಿವಾರಕ ಚೂರ್ಣ',
    description: 'ಹಾರ್ಮೋನ್ ಸಮತೋಲನವನ್ನು ಸಾಧಿಸಿ ಪ್ರಜನನ ಆರೋಗ್ಯವನ್ನು ಉತ್ತಮಗೊಳಿಸುತ್ತದೆ',
    benefits: [
      'ಋತುಚಕ್ರವನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ',
      'ಅಂಡಾಣು/ಶುಕ್ರಾಣು ಗುಣಮಟ್ಟವನ್ನು ಸುಧಾರಿಸುತ್ತದೆ',
      'ಪ್ರಜನನ ಅಂಗಗಳನ್ನು ಡಿಟಾಕ್ಸ್ ಮಾಡುತ್ತದೆ',
      'ಗರ್ಭಾಶಯದ ಒಳಹೊದಿಕೆಯನ್ನು ಬಲಪಡಿಸುತ್ತದೆ'
    ],
    ingredients: [
      '1 ಟೀ ಸ್ಪೂನ್ ಶತಾವರಿ ಪುಡಿ',
      '1 ಟೀ ಸ್ಪೂನ್ ಅಶ್ವಗಂಧ ಪುಡಿ',
      '1 ಟೀ ಸ್ಪೂನ್ ಲೋಧಾನ ಪುಡಿ',
      '1 ಟೀ ಸ್ಪೂನ್ ಗೋಕ್ಷುರಾ ಪುಡಿ',
      '1 ಟೀ ಸ್ಪೂನ್ ತುಪ್ಪ ಅಥವಾ ಜೇನುತುಪ್ಪ (ಐಚ್ಛಿಕ)'
    ],
    preparation: [
      'ಎಲ್ಲಾ ಪುಡಿಗಳನ್ನು ಚೆನ್ನಾಗಿ ಮಿಶ್ರಣ ಮಾಡಿ',
      '1 ಟೀ ಸ್ಪೂನ್ ಅನ್ನು ಬಿಸಿ ಹಾಲು ಅಥವಾ ನೀರಿನಲ್ಲಿ ತೆಗೆದುಕೊಳ್ಳಿ',
      'ದಿನಕ್ಕೆ ಒಂದುವೇಳೆ 3-6 ತಿಂಗಳುಗಳವರೆಗೆ ಸೇವಿಸಬಹುದು'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
    frequency: 'ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ',
    precautions: 'ಕಫ ದೋಷವಿದ್ದರೆ ತಪ್ಪಿಸಿಕೊಳ್ಳಿ',
    image:'/assets/churna.jpg'
  },
  {
    id: 2,
    title: 'ಗರ್ಭಧಾರಣೆಗೆ ಮುಂಚಿನ ಡಿಟಾಕ್ಸ್ ಟೀ',
    description: 'ದೇಹವನ್ನು ಶುದ್ಧೀಕರಿಸಿ ಉತ್ಕೃಷ್ಟವಾದ ಫರ್ಟಿಲಿಟಿಗೆ ತಯಾರಿಸುತ್ತದೆ',
    benefits: [
      'ಟಾಕ್ಸಿನ್ಸ್ (ಆಮ) ಅನ್ನು ಹೊರಹಾಕುತ್ತದೆ',
      'ಯಕೃಚ್ಛೆ (ಲಿವರ್) ಕಾರ್ಯವನ್ನು ಸುಧಾರಿಸುತ್ತದೆ',
      'ಜೀರ್ಣಕ್ರಿಯೆ ಉತ್ತಮವಾಗುತ್ತದೆ',
      'ಗರ್ಭಾಶಯದ ಪರಿಸರವನ್ನು ತಯಾರಿಸುತ್ತದೆ'
    ],
    ingredients: [
      '1 ಕಪ್ ಬಿಸಿ ನೀರು',
      '1 ಟೀ ಸ್ಪೂನ್ ಕೊತ್ತಂಬರಿ ಬೀಜಗಳು',
      '1 ಟೀ ಸ್ಪೂನ್ ಜೀರಿಗೆ ಬೀಜಗಳು',
      '1 ಟೀ ಸ್ಪೂನ್ ಸೋಂಪು ಬೀಜಗಳು',
      '1 ಇಂಚು ಹೊಸ ಶುಂಠಿ'
    ],
    preparation: [
      'ಎಲ್ಲಾ ಪದಾರ್ಥಗಳನ್ನು 5 ನಿಮಿಷಗಳ ಕಾಲ ಮరిగಿಸಿ',
      'ಗಟಕಿದ ಮೇಲೆ ಬಿಸಿ ಬಿಸಿ ಕುಡಿಯಿರಿ',
      'ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ಸೇವಿಸುವುದು ಉತ್ತಮ'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    frequency: 'ವಾರಕ್ಕೆ 3 ಬಾರಿ',
    precautions: 'ಅತಿದೊಡ್ಡ ಶೋಷಣೆಯುಂಟಾದರೆ ಸೇವನೆಯನ್ನು ಕಡಿಮೆಮಾಡಿ',
    image:'/assets/detoxtea.jpg'
  },
  {
    id: 3,
    title: 'ಪ್ರಜನನ ಆರೋಗ್ಯ ಲಡ್ಡು',
    description: 'ಪ್ರಜನನ ಅಂಗಗಳನ್ನು ಪೋಷಿಸಿ ಶಕ್ತಿ ನೀಡುತ್ತದೆ',
    benefits: [
      'ಫರ್ಟಿಲಿಟಿ ಮತ್ತು ಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ',
      'ವಾತ ಮತ್ತು ಪಿತ್ತ ದೋಷಗಳನ್ನು ಸಮತೋಲನ ಮಾಡುತ್ತದೆ',
      'ಹಾರ್ಮೋನಲ್ ಆರೋಗ್ಯ ಮತ್ತು ಉತ್ಸಾಹವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ',
      'ಅಂಡಸ್ರವಣ ಮತ್ತು ಗುಣಮಟ್ಟದ ಶುಕ್ಲದ ಉತ್ಪತ್ತಿಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ'
    ],
    ingredients: [
      '1 ಕಪ್ ಒಣ ಖರ್ಜೂರ (ಬೀಜವಿಲ್ಲದೆ, ತುಂಡುಗಳಾಗಿ ಕತ್ತರಿಸಿ)',
      '½ ಕಪ್ ಬಾದಾಮಿ',
      '½ ಕಪ್ ಎಳ್ಳು',
      '¼ ಕಪ್ ನಾಯಿ ತುಪ್ಪ',
      '2 ಟೇಬಲ್ ಸ್ಪೂನ್ ಶತಾವರಿ ಪುಡಿ',
      '2 ಟೇಬಲ್ ಸ್ಪೂನ್ ಅಶ್ವಗಂಧ ಪುಡಿ',
      '1 ಟೀ ಸ್ಪೂನ್ ಎಲಕ್ಕಿ ಪುಡಿ'
    ],
    preparation: [
      'ಬಾದಾಮಿ ಮತ್ತು ಎಳ್ಳನ್ನು ಒಣಹುರಿದು, ಮಿಕ್ಸಿಯಲ್ಲಿ ತುಳಿದುಕೊಳ್ಳಿ',
      'ತುಪ್ಪವನ್ನು ಬಿಸಿ ಮಾಡಿ ಖರ್ಜೂರ ಸೇರಿಸಿ ಸಾಫ್ಟ್ ಆಗುವವರೆಗೆ ಹುರಿದುಕೊಳ್ಳಿ',
      'ಎಲ್ಲಾ ಪದಾರ್ಥಗಳನ್ನು ಸೇರಿಸಿ ಚೆನ್ನಾಗಿ ಕಲಸಿ ಲಡ್ಡುಗಳನ್ನಾಗಿ ಮಾಡಿ',
      'ಹಾರ್ಮೋನ್ ಫ್ರೀಡಾಂ ಟೈನರ್‌ನಲ್ಲಿ ಇಡಿರಿ'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_4qpnlyta.json',
    frequency: 'ದಿನಕ್ಕೆ 1 ಲಡ್ಡು (ಸಂಜೆ)',
    precautions: 'ಜ್ವರ ಅಥವಾ ತೀವ್ರ ಜೀರ್ಣ ಸಮಸ್ಯೆಗಳಿರುವವರು ಸೇವಿಸಬಾರದು',
    image:'/assets/laddu.jpg'
  }
],'mr-IN': [
  {
    id: 1,
    title: 'प्रजनन क्षमतेस मदत करणारा चूर्ण',
    description: 'हॉर्मोन्स संतुलित करतो आणि प्रजनन आरोग्य सुधारतो',
    benefits: [
      'मासिक पाळी नियमित करतो',
      'अंडाणू/शुक्राणूंची गुणवत्ता सुधारतो',
      'प्रजनन संस्थेचे शुद्धीकरण करतो',
      'गर्भाशयाच्या अंतर्भित्तीला बळकटी देतो'
    ],
    ingredients: [
      '१ टीस्पून शतावरी चूर्ण',
      '१ टीस्पून अश्वगंधा चूर्ण',
      '१ टीस्पून लोध्र चूर्ण',
      '१ टीस्पून गोक्षुर चूर्ण',
      '१ टीस्पून मध (पर्यायी)'
    ],
    preparation: [
      'सर्व चूर्णे एकत्र मिसळा',
      '१ टीस्पून गरम दूध किंवा पाण्याबरोबर घ्या',
      'दररोज ३-६ महिने घेणे उपयुक्त'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
    frequency: 'दररोज सकाळी',
    precautions: 'कफ वाढलेला असल्यास टाळा',
    image:'/assets/churna.jpg'
  },
  {
    id: 2,
    title: 'गर्भधारणेपूर्वी शरीरशुद्धी चहा',
    description: 'शरीराची शुद्धी करून प्रजननासाठी तयार करतो',
    benefits: [
      'शरीरातील विषारी घटक (आम) दूर करतो',
      'यकृताचे कार्य सुधारतो',
      'पचन क्रिया सुधारतो',
      'गर्भाशयातील पोषणासाठी तयार करतो'
    ],
    ingredients: [
      '१ कप गरम पाणी',
      '१ टीस्पून धणे',
      '१ टीस्पून जिरे',
      '१ टीस्पून बडीशेप',
      '१ इंच ताजी आले'
    ],
    preparation: [
      'सर्व घटक ५ मिनिटे उकळा',
      'गाळून गरम प्या',
      'रिकाम्या पोटी घेणे उत्तम'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    frequency: 'आठवड्यातून ३ वेळा',
    precautions: 'कोरडेपणा जाणवत असल्यास कमी करा',
    image:'/assets/detoxtea.jpg'
  },
  {
    id: 3,
    title: 'प्रजनन आरोग्यासाठी लाडू',
    description: 'प्रजनन अवयवांना पोषण देतो व ताकद वाढवतो',
    benefits: [
      'फर्टिलिटी आणि सहनशक्ती वाढवतो',
      'वात व पित्त दोष संतुलित करतो',
      'उत्साह आणि हॉर्मोनल आरोग्य सुधारतो',
      'अंडोत्सर्ग व शुक्र गुणवत्तेस मदत करतो'
    ],
    ingredients: [
      '१ कप सुकवलेली खजूर (बियाशिवाय, चिरून)',
      '½ कप बदाम',
      '½ कप तीळ',
      '¼ कप देशी तूप',
      '२ टेबलस्पून शतावरी चूर्ण',
      '२ टेबलस्पून अश्वगंधा चूर्ण',
      '१ टीस्पून वेलदोडा चूर्ण'
    ],
    preparation: [
      'बदाम व तीळ कोरडे भाजून थोडे भरड वाटा',
      'तूप गरम करून खजूर टाका आणि मऊ होईपर्यंत परतून घ्या',
      'सर्व घटक मिसळून लाडू वळा',
      'हवेबंद डब्यात ठेवा'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_4qpnlyta.json',
    frequency: 'दररोज १ लाडू (संध्याकाळी)',
    precautions: 'ताप किंवा पचनाची तक्रार असल्यास टाळा',
    image:'/assets/laddu.jpg'
  }
],'bn-IN': [
  {
    id: 1,
    title: 'ফার্টিলিটি-বুস্টিং চূর্ণ',
    description: 'হরমোনের ভারসাম্য বজায় রাখে ও প্রজনন স্বাস্থ্যের উন্নতি করে',
    benefits: [
      'ঋতুচক্র নিয়মিত করে',
      'ডিম্বাণু/শুক্রাণুর গুণমান উন্নত করে',
      'প্রজনন অঙ্গগুলোর ডিটক্স করে',
      'গর্ভাশয়ের আস্তরণকে শক্তিশালী করে'
    ],
    ingredients: [
      '১ চা চামচ শতাবরী গুঁড়ো',
      '১ চা চামচ অশ্বগন্ধা গুঁড়ো',
      '১ চা চামচ লোধ্রা গুঁড়ো',
      '১ চা চামচ গোক্ষুরা গুঁড়ো',
      '১ চা চামচ মধু (ঐচ্ছিক)'
    ],
    preparation: [
      'সব গুঁড়ো একসাথে মিশিয়ে নিন',
      '১ চা চামচ গরম দুধ বা পানির সাথে নিন',
      'প্রতিদিন ৩-৬ মাস খেতে হবে'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
    frequency: 'প্রতিদিন সকালে',
    precautions: 'যদি কফ বৃদ্ধি পায় (অতিরিক্ত ওজন), তাহলে এড়িয়ে চলুন',
    image:'/assets/churna.jpg'
  },
  {
    id: 2,
    title: 'গর্ভধারণের পূর্ববর্তী ডিটক্স চা',
    description: 'শরীরকে পরিশুদ্ধ করে গর্ভধারণের জন্য প্রস্তুত করে',
    benefits: [
      'টক্সিন (আম) দূর করে',
      'লিভারের কার্যকারিতা বাড়ায়',
      'হজমশক্তি বাড়ায়',
      'গর্ভাশয়ের পরিবেশ প্রস্তুত করে'
    ],
    ingredients: [
      '১ কাপ গরম জল',
      '১ চা চামচ ধনে বীজ',
      '১ চা চামচ জিরে বীজ',
      '১ চা চামচ মৌরি বীজ',
      '১ ইঞ্চি তাজা আদা'
    ],
    preparation: [
      'সব উপকরণ ৫ মিনিট ফুটিয়ে নিন',
      'ছেঁকে নিয়ে গরম গরম পান করুন',
      'খালি পেটে খাওয়া শ্রেয়'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    frequency: 'সপ্তাহে ৩ বার',
    precautions: 'যদি শুষ্কতা অনুভব করেন তবে ব্যবহার কমান',
    image:'/assets/detoxtea.jpg'
  },
  {
    id: 3,
    title: 'প্রজনন স্বাস্থ্য লাড্ডু',
    description: 'প্রজনন টিস্যুকে পুষ্টি জোগায় ও শক্তি বাড়ায়',
    benefits: [
      'ফার্টিলিটি ও সহনশক্তি বাড়ায়',
      'বায়ু ও পিত্ত দোষ নিয়ন্ত্রণ করে',
      'উৎসাহ ও হরমোনের স্বাস্থ্য উন্নত করে',
      'ডিম্বস্ফোটন ও সুস্থ শুক্রাণুর জন্য সহায়ক'
    ],
    ingredients: [
      '১ কাপ শুকনো খেজুর (বীজ ছাড়া, কুচানো)',
      '½ কাপ বাদাম',
      '½ কাপ তিল',
      '¼ কাপ ঘি',
      '২ টেবিল চামচ শতাবরী গুঁড়ো',
      '২ টেবিল চামচ অশ্বগন্ধা গুঁড়ো',
      '১ চা চামচ এলাচ গুঁড়ো'
    ],
    preparation: [
      'বাদাম ও তিল হালকা করে ভেজে নিয়ে সামান্য গুঁড়ো করে নিন',
      'ঘি গরম করে তাতে খেজুর দিন ও নরম হওয়া পর্যন্ত ভাজুন',
      'সব উপকরণ ভালো করে মিশিয়ে লাড্ডু তৈরি করুন',
      'বায়ুরোধী কন্টেইনারে সংরক্ষণ করুন'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_4qpnlyta.json',
    frequency: 'প্রতিদিন ১টি লাড্ডু (সন্ধ্যায়)',
    precautions: 'জ্বর বা হজমে সমস্যা থাকলে খাবেন না',
    image:'/assets/laddu.jpg'
  }
]
,'gu-IN': [
  {
    id: 1,
    title: 'ફર્ટિલિટી વધારનાર ચૂર્ણ',
    description: 'હોર્મોનનું સંતુલન જાળવે અને પ્રજનન સ્વાસ્થ્યમાં સુધારો કરે',
    benefits: [
      'માસિક ચક્ર નિયમિત કરે',
      'અંડાણ/શુક્રાણુની ગુણવત્તા સુધારે',
      'પ્રજનન અંગોને ડિટોક્સ કરે',
      'ગરભાશયની આવરણસૌમ્યતા મજબૂત કરે'
    ],
    ingredients: [
      '1 ચમચી શતાવરી પાઉડર',
      '1 ચમચી અશ્વગંધા પાઉડર',
      '1 ચમચી લોધ્રા પાઉડર',
      '1 ચમચી ગોખરુ પાઉડર',
      '1 ચમચી મધ (ઇચ્છા મુજબ)'
    ],
    preparation: [
      'બધા પાઉડરો ભેળવી લો',
      '1 ચમચી ગરમ દૂધ અથવા પાણી સાથે લો',
      'દૈનિક 3-6 મહિના સુધી સેવન કરો'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
    frequency: 'દૈનિક (સવાર)',
    precautions: 'કફ વધારે હોય (વજન વધેલું હોય) તો ટાળો',
    image:'/assets/churna.jpg'
  },
  {
    id: 2,
    title: 'ગર્ભાધાન પૂર્વે ડિટોક્સ ચા',
    description: 'શરીરને શુદ્ધ કરે અને ગર્ભાધાન માટે તૈયાર કરે',
    benefits: [
      'ટોક્સિન્સ (આમ) દૂર કરે',
      'યકૃતની કામગીરી સુધારે',
      'જઠરાંગની ક્રિયા વધારે',
      'ગરભાશય માટે સ્વસ્થ વાતાવરણ ઉભું કરે'
    ],
    ingredients: [
      '1 કપ ગરમ પાણી',
      '1 ચમચી ધાણા બીજ',
      '1 ચમચી જીરુ બીજ',
      '1 ચમચી સૌફ બીજ',
      '1 ઈંચ તાજું આદુ'
    ],
    preparation: [
      'બધી સામગ્રી 5 મિનિટ ઉકાળો',
      'છાણી લો અને ગરમ પીવો',
      'ખાલી પેટ સેવન કરવું શ્રેષ્ઠ'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    frequency: 'અઠવાડિયામાં 3 વખત',
    precautions: 'શરીરમાં સુકાઇએ તો સેવન ઘટાડી દો',
    image:'/assets/detoxtea.jpg'
  },
  {
    id: 3,
    title: 'પ્રજનન સ્વાસ્થ્ય લાડુ',
    description: 'પ્રજનન તંતુઓને પોષણ આપે અને શક્તિ વધારે',
    benefits: [
      'ફર્ટિલિટી અને શક્તિ વધારે',
      'વાત અને પિત્ત દોષ સંતુલિત કરે',
      'જાગૃતિ અને હોર્મોનલ સ્વાસ્થ્યમાં સુધારો કરે',
      'અંડોત્સર્ગ અને શુક્રાણુના આરોગ્ય માટે મદદરૂપ'
    ],
    ingredients: [
      '1 કપ સૂકા ખજુર (વીણેલા, ટુકડાઓમાં)',
      '½ કપ બદામ',
      '½ કપ તલ',
      '¼ કપ ઘી',
      '2 ટેબલસ્પૂન શતાવરી પાઉડર',
      '2 ટેબલસ્પૂન અશ્વગંધા પાઉડર',
      '1 ચમચી એલચી પાઉડર'
    ],
    preparation: [
      'બદામ અને તલ સેકી coarsely પીસી લો',
      'ઘી ગરમ કરી ખજુર ઉમેરો અને નરમ થાય ત્યાં સુધી હલાવો',
      'બધી સામગ્રી ભેળવી લાડુ બનાવો',
      'એર્ટેાઈટ ડબ્બામાં સ્ટોર કરો'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_4qpnlyta.json',
    frequency: 'દૈનિક 1 લાડુ (સાંજ)',
    precautions: 'તાવ હોય કે ભારે અન્ન પચાવવામાં તકલીફ હોય તો ટાળો',
    image:'/assets/laddu.jpg'
  }
],'ml-IN': [
  {
    id: 1,
    title: 'ഫെര്‍ട്ടിലിറ്റി വര്‍ദ്ധിപ്പിക്കുന്ന ചൂര്‍ണം',
    description: 'ഹോര്‍മോണുകളുടെ സമതുലിതം ഉറപ്പാക്കി പ്രജനനാരോഗ്യം മെച്ചപ്പെടുത്തുന്നു',
    benefits: [
      'മാസിക ചക്രം ക്രമപ്പെടുത്തുന്നു',
      'അണ്ഡങ്ങൾ/ശുക്ലാണുക്കളുടെ ഗുണമേന്മ മെച്ചപ്പെടുത്തുന്നു',
      'പ്രജനന അവയവങ്ങള്‍ ഡിറ്റോക്‌സ് ചെയ്യുന്നു',
      'ഗര്‍ഭാശയഭിത്തി ശക്തിപ്പെടുത്തുന്നു'
    ],
    ingredients: [
      '1 ടീസ്പൂണ്‍ ശതാവരി പൊടി',
      '1 ടീസ്പൂണ്‍ അശ്വഗന്ധ പൊടി',
      '1 ടീസ്പൂണ്‍ ലോധ്രാ പൊടി',
      '1 ടീസ്പൂണ്‍ ഗോക്ഷുര പൊടി',
      '1 ടീസ്പൂണ്‍ തേന്‍ (ഐച്ചികമായി)'
    ],
    preparation: [
      'എല്ലാ പൊടികളും നന്നായി ചേര്‍ക്കുക',
      '1 ടീസ്പൂണ്‍ ചൂടുള്ള പാല്‍ അല്ലെങ്കില്‍ വെള്ളം കൊണ്ടു കഴിക്കുക',
      'ദിവസേന 3-6 മാസം വരെ ഉപയോഗിക്കുക'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
    frequency: 'പ്രതിദിനം (രാവിലെ)',
    precautions: 'കഫ ദോഷം (ഭാരമേറിയ ശരീരം) ഉണ്ടെങ്കില്‍ ഒഴിവാക്കുക',
    image:'/assets/churna.jpg'
  },
  {
    id: 2,
    title: 'ഗര്‍ഭധാരണത്തിന് മുമ്പുള്ള ഡിറ്റോക്‌സ് ടീ',
    description: 'ശരീരത്തെ ശുദ്ധമാക്കി ഗര്‍ഭധാരണത്തിന് അനുയോജ്യമായതു് ഒരുക്കുന്നു',
    benefits: [
      'വിഷമാംശങ്ങള്‍ (അമ) നീക്കം ചെയ്യുന്നു',
      'ലിവറിന്റെ പ്രവര്‍ത്തനം മെച്ചപ്പെടുത്തുന്നു',
      'ജീരണം മെച്ചപ്പെടുത്തുന്നു',
      'ഗര്‍ഭാശയത്തെ ഗര്‍ഭത്തിനായി ഒരുക്കുന്നു'
    ],
    ingredients: [
      '1 കപ്പ് ചൂടുള്ള വെള്ളം',
      '1 ടീസ്പൂണ്‍ മല്ലി വിത്ത്',
      '1 ടീസ്പൂണ്‍ ജീരകം',
      '1 ടീസ്പൂണ്‍ പെരിഞ്ഞിരകം',
      '1 ഇഞ്ച് تازാ ഇഞ്ചി'
    ],
    preparation: [
      'എല്ലാം 5 മിനിറ്റ് വരെ തിളപ്പിക്കുക',
      'ശൂധമാക്കി ചൂടോടെ കുടിക്കുക',
      'ഖാലിസ്ഥിതിയില്‍ കഴിക്കുന്നത് ഏറ്റവും നല്ലത്'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    frequency: 'ആഴ്ചയില്‍ 3 പ്രാവശ്യം',
    precautions: 'ഉണക്കം അനുഭവപ്പെടുകയാണെങ്കില്‍ ഉപയോഗം കുറക്കുക',
    image:'/assets/detoxtea.jpg'
  },
  {
    id: 3,
    title: 'പ്രജനനാരോഗ്യത്തിനുള്ള ലഡ്ഡു',
    description: 'പ്രജനന നാഡികളെ പോഷിപ്പിക്കുകയും ശക്തി കൂട്ടുകയും ചെയ്യുന്നു',
    benefits: [
      'ഫെര്‍ട്ടിലിറ്റിയും ദൈര്‍ഘ്യശേഷിയും വര്‍ദ്ധിപ്പിക്കുന്നു',
      'വാതം-പിത്തം ദോഷങ്ങള്‍ സമതുലിതമാക്കുന്നു',
      'വൈടാലിറ്റിയും ഹോര്‍മോണല്‍ ആരോഗ്യമുള്ളതും ഉറപ്പാക്കുന്നു',
      'ഒവുലേഷനും ശുക്ലാണു ആരോഗ്യവും മെച്ചപ്പെടുത്തുന്നു'
    ],
    ingredients: [
      '1 കപ്പ് ഉണക്ക അത്പഴം (കടുക്കാതെ, അരിഞ്ഞത്)',
      '½ കപ്പ് ബദാം',
      '½ കപ്പ് എള്ള്',
      '¼ കപ്പ് ദേശീ നെയ്',
      '2 ടേബിള്‍സ്‌പൂണ്‍ ശതാവരി പൊടി',
      '2 ടേബിള്‍സ്‌പൂണ്‍ അശ്വഗന്ധ പൊടി',
      '1 ടീസ്പൂണ്‍ ഏലക്ക പൊടി'
    ],
    preparation: [
      'ബദാംയും എള്ളും വറുത്ത് അല്പം പൊടിക്കുക',
      'നെയ് ചൂടാക്കി അതില്‍ ഉണക്കത്പഴം ചേര്‍ത്ത് ഇളക്കുക',
      'എല്ലാം ചേര്‍ത്ത് നന്നായി മിക്സുചെയ്യുക',
      'ചെറിയ ലഡ്ഡുവായി ആക്കി എര്‍ടൈറ്റ് ബോക്‌സില്‍ സൂക്ഷിക്കുക'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_4qpnlyta.json',
    frequency: 'ദിവസേന 1 ലഡ്ഡു (വൈകുന്നേരം)',
    precautions: 'ജ്വരം അല്ലെങ്കില്‍ കനത്ത അജീര്‍ണത ഉണ്ടെങ്കില്‍ ഒഴിവാക്കുക',
    image:'/assets/laddu.jpg'
  }
]
,'pa-IN': [
  {
    id: 1,
    title: 'ਫਰਟੀਲਿਟੀ ਵਧਾਉਣ ਵਾਲਾ ਚੂਰਣ',
    description: 'ਹਾਰਮੋਨ ਸੰਤੁਲਿਤ ਕਰਦਾ ਹੈ ਅਤੇ ਪ੍ਰਜਨਨ ਸਿਹਤ ਨੂੰ ਸੁਧਾਰਦਾ ਹੈ',
    benefits: [
      'ਮਾਸਿਕ ਚੱਕਰ ਨੂੰ ਨਿਯਮਤ ਕਰਦਾ ਹੈ',
      'ਅੰਡਿਆਂ/ਸ਼ੁਕਰਾਣੂ ਦੀ ਗੁਣਵੱਤਾ ਨੂੰ ਸੁਧਾਰਦਾ ਹੈ',
      'ਪ੍ਰਜਨਨ ਪ੍ਰਣਾਲੀ ਨੂੰ ਡੀਟੌਕਸ ਕਰਦਾ ਹੈ',
      'ਗਰਭਾਸ਼ੈ ਦੀ ਪਰਤ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਦਾ ਹੈ'
    ],
    ingredients: [
      '1 ਚਮਚ ਸ਼atavari ਪਾਊਡਰ',
      '1 ਚਮਚ ਅਸ਼ਵਗੰਧਾ ਪਾਊਡਰ',
      '1 ਚਮਚ ਲੋਧਰਾ ਪਾਊਡਰ',
      '1 ਚਮਚ ਗੋਖਰੂ ਪਾਊਡਰ',
      '1 ਚਮਚ ਸ਼ਹਦ (ਚੋਣਵੀਂ)'
    ],
    preparation: [
      'ਸਾਰੇ ਪਾਊਡਰਾਂ ਨੂੰ ਮਿਲਾਓ',
      '1 ਚਮਚ ਗਰਮ ਦੁੱਧ ਜਾਂ ਪਾਣੀ ਨਾਲ ਲਓ',
      'ਰੋਜ਼ਾਨਾ 3-6 ਮਹੀਨੇ ਲਈ ਲਓ'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
    frequency: 'ਰੋਜ਼ਾਨਾ (ਸਵੇਰ)',
    precautions: 'ਜੇ ਕਰ ਤੁਹਾਡਾ ਕਫ ਵਧੇ ਹੋਇਆ ਹੋਵੇ (ਜ਼ਿਆਦਾ ਵਜ਼ਨ), ਤਾਂ ਨਾ ਲਓ',
    image:'/assets/churna.jpg'
  },
  {
    id: 2,
    title: 'ਗਰਭਧਾਰਣ ਤੋਂ ਪਹਿਲਾਂ ਡੀਟੌਕਸ ਚਾਹ',
    description: 'ਸ਼ਰੀਰ ਨੂੰ ਸ਼ੁੱਧ ਕਰਦੀ ਹੈ ਅਤੇ ਉਤਮ ਫਰਟੀਲਿਟੀ ਲਈ ਤਿਆਰ ਕਰਦੀ ਹੈ',
    benefits: [
      'ਟੌਕਸਿਨ (ਅਮਾ) ਨੂੰ ਦੂਰ ਕਰਦੀ ਹੈ',
      'ਜਿਗਰ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਨੂੰ ਸੁਧਾਰਦੀ ਹੈ',
      'ਹਜ਼ਮੇ ਨੂੰ ਸੁਧਾਰਦੀ ਹੈ',
      'ਗਰਭਾਸ਼ੈ ਲਈ ਸਿਹਤਮੰਦ ਵਾਤਾਵਰਣ ਤਿਆਰ ਕਰਦੀ ਹੈ'
    ],
    ingredients: [
      '1 ਕੱਪ ਗਰਮ ਪਾਣੀ',
      '1 ਚਮਚ ਧਨੀਆ ਦੇ ਬੀਜ',
      '1 ਚਮਚ ਜੀਰਾ',
      '1 ਚਮਚ ਸੋਫ਼',
      '1 ਇੰਚ ਤਾਜ਼ਾ ਅਦਰਕ'
    ],
    preparation: [
      'ਸਾਰੀਆਂ ਸਮੱਗਰੀਆਂ ਨੂੰ 5 ਮਿੰਟ ਉਬਾਲੋ',
      'ਛਾਣੋ ਅਤੇ ਗਰਮ ਹੀ ਪੀਓ',
      'ਖਾਲੀ ਪੇਟ ਪੀਣਾ ਸਭ ਤੋਂ ਵਧੀਆ ਹੈ'
    ],
    animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
    frequency: 'ਹਫ਼ਤੇ ਵਿੱਚ 3 ਵਾਰੀ',
    precautions: 'ਜੇ ਕਰ ਸੂਖਾਪਣ ਮਹਿਸੂਸ ਹੋਵੇ ਤਾਂ ਮਾਤਰਾ ਘਟਾਓ',
    image:'/assets/detoxtea.jpg'
  },
  {
    id: 3,
    title: 'ਪ੍ਰਜਨਨ ਸਿਹਤ ਲਈ ਲੱਦੂ',
    description: 'ਪ੍ਰਜਨਨ ਟਿਸ਼ੂ ਨੂੰ ਪੋਸ਼ਣ ਦਿੰਦਾ ਹੈ ਅਤੇ ਤਾਕਤ ਵਧਾਉਂਦਾ ਹੈ',
    benefits: [
      'ਫਰਟੀਲਿਟੀ ਅਤੇ ਸਟੈਮਿਨਾ ਵਧਾਉਂਦਾ ਹੈ',
      'ਵਾਤ ਅਤੇ ਪਿੱਤ ਦੋਸ਼ ਨੂੰ ਸੰਤੁਲਿਤ ਕਰਦਾ ਹੈ',
      'ਜੀਵਨ ਸ਼ਕਤੀ ਅਤੇ ਹਾਰਮੋਨਲ ਸਿਹਤ ਨੂੰ ਸੁਧਾਰਦਾ ਹੈ',
      'ਓਵੂਲੇਸ਼ਨ ਅਤੇ ਸ਼ੁਕਰਾਣੂ ਦੀ ਸਿਹਤ ਲਈ ਮਦਦਗਾਰ'
    ],
    ingredients: [
      '1 ਕੱਪ ਸੂਕੇ ਖਜੂਰ (ਬੀਜ ਰਹਿਤ, ਕਟੇ ਹੋਏ)',
      '½ ਕੱਪ ਬਦਾਮ',
      '½ ਕੱਪ ਤਿਲ',
      '¼ ਕੱਪ ਦੇਸੀ ਘੀ',
      '2 ਟੇਬਲਚਮਚ ਸ਼atavari ਪਾਊਡਰ',
      '2 ਟੇਬਲਚਮਚ ਅਸ਼ਵਗੰਧਾ ਪਾਊਡਰ',
      '1 ਚਮਚ ਇਲਾਇਚੀ ਪਾਊਡਰ'
    ],
    preparation: [
      'ਬਦਾਮ ਅਤੇ ਤਿਲ ਨੂੰ ਭੂੰਨ ਕੇ ਕੁਟ ਲਓ',
      'ਘੀ ਗਰਮ ਕਰੋ, ਖਜੂਰ ਪਾਓ ਅਤੇ ਨਰਮ ਹੋਣ ਤੱਕ ਭੂੰਨੋ',
      'ਸਾਰੀਆਂ ਸਮੱਗਰੀਆਂ ਮਿਲਾਓ',
      'ਛੋਟੇ ਲੱਦੂ ਬਣਾਓ',
      'ਹਵਾ-ਰੋਧੀ ਡੱਬੇ ਵਿੱਚ ਰੱਖੋ'
    ],
    animation: 'https://assets1.lottiefiles.com/packages/lf20_4qpnlyta.json',
    frequency: 'ਰੋਜ਼ਾਨਾ 1 ਲੱਦੂ (ਸ਼ਾਮ ਨੂੰ)',
    precautions: 'ਜੇ ਕਰ ਤੁਸੀਂ ਬੁਖਾਰ ਜਾਂ ਭਾਰੀ ਅਜੀਰਨ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ ਤਾਂ ਨਾ ਲਓ',
    image:'/assets/laddu.jpg'
  }
]

  };

     const remedies = ayurvedicRemedies[language] || ayurvedicRemedies['en-IN'];
  
    // Fetch user data
    useEffect(() => {
      const fetchUserData = async () => {
        if (auth.currentUser) {
          const docRef = doc(db, 'users', auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
            setLanguage(docSnap.data().language || 'en-IN');
            setStreak(docSnap.streak || 0); 
            setBookmarked(docSnap.data().bookmarkedRemedies || []);
          }
        }
      };
      fetchUserData();
    }, [auth.currentUser]);
  
    const toggleBookmark = async (remedyId) => {
      const newBookmarked = bookmarked.includes(remedyId)
        ? bookmarked.filter(id => id !== remedyId)
        : [...bookmarked, remedyId];
      
      setBookmarked(newBookmarked);
      
      if (auth.currentUser) {
        try {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            bookmarkedRemedies: newBookmarked
          });
        } catch (error) {
          console.error("Error updating bookmarks:", error);
        }
      }
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-teal-50">

    {/* ✅ Place Navbar outside the padded container to avoid extra spacing */}
    <Navbar title={t.title} streak={0} lang={language} />

    <div className="p-4 md:p-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-teal-800 mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600">
            {t.subtitle}
          </p>
        </motion.header>
  
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {remedies.map((remedy) => (
            <motion.div
              key={remedy.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all"
            >
              <div className="h-48 bg-green-100 flex items-center justify-center relative">
                <img
                  src={remedy.image}
                  alt={remedy.title}
                  className="h-full w-full object-cover"
                />
                <button
                  className={`absolute top-4 right-4 p-2 rounded-full ${
                    bookmarked.includes(remedy.id) ? 'text-teal-600' : 'text-gray-400'
                  }`}
                  onClick={() => toggleBookmark(remedy.id)}
                >
                  <FaBookmark className="text-2xl" />
                </button>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-teal-700 mb-2">{remedy.title}</h3>
                <p className="text-gray-600 mb-3">{remedy.description}</p>
                
                <div className="flex items-center mb-3">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-2 flex items-center">
                    <FaLeaf className="mr-1" /> {remedy.duration}
                  </span>
                </div>
  
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{t.benefits}</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
                  {remedy.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                </ul>
  
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{t.ingredients}</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
                  {remedy.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
                </ul>
  
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{t.preparation}</h4>
                <ol className="list-decimal pl-5 space-y-1 text-gray-700 mb-4">
                  {remedy.preparation.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
  
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{t.precautions}</h4>
                <p className="text-red-600">{remedy.precautions}</p>
  
                <div className="flex space-x-3 mt-4">
                  <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition">
                    {t.addToToday}
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg">
                    <FaShareAlt className="text-teal-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
  
        <div className="mt-12 bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-teal-800 mb-4">
            {t.todayTipTitle}
          </h2>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-800">
              {t.todayTip}
            </p>
          </div>
        </div>
      </div></div>
    );
  };
  

export default PreConceptionAyurvedaPage;





