import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { Player } from '@lottiefiles/react-lottie-player';
import { FaHeart, FaBookmark, FaShareAlt } from 'react-icons/fa';
import translations from './Pretranslations';
const PregAyurvedaPage = () => {
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState('en-IN');
  const [bookmarked, setBookmarked] = useState([]);
  const [trimester, setTrimester] = useState(1); // 1, 2, or 3
  const auth = getAuth();

  // Fetch user data and language preference
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setLanguage(docSnap.data().language || 'en-IN');
          setBookmarked(docSnap.data().bookmarkedRemedies || []);
          
          // Calculate trimester based on pregnancy start date if available
          if (docSnap.data().pregnancyStartDate) {
            const pregnancyStart = new Date(docSnap.data().pregnancyStartDate);
            const weeksPregnant = Math.floor((new Date() - pregnancyStart) / (7 * 24 * 60 * 60 * 1000));
            setTrimester(weeksPregnant < 13 ? 1 : weeksPregnant < 27 ? 2 : 3);
          }
        }
      }
    };
    fetchUserData();
  }, [auth.currentUser]);

  // Pregnancy Ayurvedic remedies organized by trimester and language
  const ayurvedicRemedies = {
    'en-IN': { // English
    1: [ // First Trimester
      {
        id: 101,
        title: 'Ginger-Lemon Infusion',
        description: 'Natural remedy for morning sickness and nausea',
        benefits: [
          'Reduces nausea and vomiting',
          'Aids digestion',
          'Boosts immunity',
          'Hydrates the body'
        ],
        ingredients: [
          '1 cup warm water',
          '1 inch fresh ginger (thinly sliced)',
          '1 tbsp lemon juice',
          '1 tsp honey (optional)'
        ],
        preparation: [
          'Boil water and add ginger slices',
          'Let steep for 5-7 minutes',
          'Strain and add lemon juice',
          'Add honey if desired',
          'Sip slowly throughout the day'
        ],
        duration: 'As needed during first trimester',
        precautions: 'Avoid excessive amounts if you have heartburn'
      },
      {
        id: 102,
        title: 'Coconut Water Elixir',
        description: 'Replenishes electrolytes and prevents dehydration',
        benefits: [
          'Rich in natural electrolytes',
          'Prevents urinary infections',
          'Cooling for the body',
          'Provides essential minerals'
        ],
        ingredients: [
          '1 cup fresh coconut water',
          '1 tsp coriander powder',
          'Pinch of rock salt'
        ],
        preparation: [
          'Mix all ingredients well',
          'Drink fresh in the morning',
          'Can be consumed 2-3 times weekly'
        ],
        duration: '2-3 times per week',
        precautions: 'Avoid if allergic to coconut'
      },
      {
        id: 103,
        title: 'Fennel Seed Tea',
        description: 'Digestive aid for early pregnancy discomfort',
        benefits: [
          'Relieves bloating and gas',
          'Reduces acidity',
          'Calms the stomach',
          'Improves appetite'
        ],
        ingredients: [
          '1 tsp fennel seeds',
          '1 cup hot water',
          '1 tsp honey (optional)'
        ],
        preparation: [
          'Crush fennel seeds lightly',
          'Steep in hot water for 5 minutes',
          'Strain and add honey if desired',
          'Drink after meals'
        ],
        duration: 'Daily after meals',
        precautions: 'Limit to 2 cups per day'
      }
    ],
    2: [ // Second Trimester
      {
        id: 201,
        title: 'Golden Milk for Immunity',
        description: 'Nutrient-rich drink for second trimester wellness',
        benefits: [
          'Supports bone development',
          'Enhances immunity',
          'Reduces inflammation',
          'Promotes restful sleep'
        ],
        ingredients: [
          '1 cup warm milk (or almond milk)',
          '½ tsp turmeric powder',
          '¼ tsp cinnamon',
          'Pinch of black pepper',
          '1 tsp ghee',
          '1 tsp honey'
        ],
        preparation: [
          'Heat milk gently (do not boil)',
          'Mix all dry ingredients',
          'Add to warm milk and stir well',
          'Add ghee and honey last',
          'Drink warm before bedtime'
        ],
        duration: '2-3 times per week',
        precautions: 'Consult doctor if on blood thinners'
      },
      {
        id: 202,
        title: 'Shatavari Kalpa',
        description: 'Traditional tonic for maternal health',
        benefits: [
          'Nourishes reproductive tissues',
          'Supports hormonal balance',
          'Enhances milk production',
          'Reduces pregnancy fatigue'
        ],
        ingredients: [
          '1 tsp Shatavari powder',
          '1 tsp ghee',
          '1 tsp honey',
          '1 cup warm milk'
        ],
        preparation: [
          'Mix Shatavari powder with ghee and honey',
          'Add to warm milk and stir well',
          'Drink in the morning on empty stomach'
        ],
        duration: 'Daily for 1 month',
        precautions: 'Avoid if experiencing diarrhea'
      },
      {
        id: 203,
        title: 'Iron-Rich Beetroot Juice',
        description: 'Natural prevention for pregnancy anemia',
        benefits: [
          'Boosts hemoglobin levels',
          'Improves blood circulation',
          'Rich in folate',
          'Supports fetal growth'
        ],
        ingredients: [
          '1 medium beetroot',
          '1 carrot',
          '1 inch ginger',
          '1 tsp lemon juice'
        ],
        preparation: [
          'Juice all ingredients together',
          'Add lemon juice',
          'Drink fresh in the morning',
          'Can dilute with water if too strong'
        ],
        duration: '3 times per week',
        precautions: 'Avoid if blood pressure is low'
      }
    ],
    3: [ // Third Trimester
      {
        id: 301,
        title: 'Dates & Almond Tonic',
        description: 'Energy booster for third trimester preparation',
        benefits: [
          'Natural source of iron',
          'Prepares uterus for labor',
          'Provides sustained energy',
          'Supports fetal brain development'
        ],
        ingredients: [
          '2-3 soaked dates',
          '5-6 soaked almonds',
          '1 cup warm milk',
          'Pinch of cardamom powder',
          '1 tsp ghee'
        ],
        preparation: [
          'Blend soaked dates and almonds with milk',
          'Strain if preferred smooth texture',
          'Add cardamom and ghee',
          'Drink in the morning'
        ],
        duration: 'Daily in last 6 weeks',
        precautions: 'Reduce if experiencing excessive weight gain'
      },
      {
        id: 302,
        title: 'Raspberry Leaf Tea',
        description: 'Prepares uterus for smooth delivery',
        benefits: [
          'Tones uterine muscles',
          'Reduces labor duration',
          'Rich in vitamins and minerals',
          'Eases postpartum recovery'
        ],
        ingredients: [
          '1 tsp dried raspberry leaves',
          '1 cup hot water',
          '1 tsp honey (optional)'
        ],
        preparation: [
          'Steep leaves in hot water for 10 minutes',
          'Strain and add honey if desired',
          'Drink warm in the morning'
        ],
        duration: 'Daily from 32 weeks',
        precautions: 'Start with small amounts'
      },
      {
        id: 303,
        title: 'Ghee Massage Blend',
        description: 'Perineal massage oil to prepare for birth',
        benefits: [
          'Increases tissue elasticity',
          'Reduces tearing risk',
          'Promotes healing',
          'Soothes stretching discomfort'
        ],
        ingredients: [
          '2 tbsp warm sesame oil',
          '1 tbsp ghee',
          '1 tsp turmeric powder'
        ],
        preparation: [
          'Mix all ingredients gently',
          'Warm slightly (body temperature)',
          'Massage perineal area daily',
          'Wipe excess after 20 minutes'
        ],
        duration: 'Daily from 34 weeks',
        precautions: 'Discontinue if irritation occurs'
      }
    ]
  },
    'hi-IN': {
  1: [ // First Trimester
    {
      id: 101,
      title: 'अदरक-नींबू का जल',
      description: 'सुबह की मतली और जी मिचलाने के लिए प्राकृतिक उपाय',
      benefits: [
        'मतली और उल्टी को कम करता है',
        'पाचन में सहायक',
        'रोग प्रतिरोधक क्षमता बढ़ाता है',
        'शरीर को हाइड्रेट करता है'
      ],
      ingredients: [
        '1 कप गर्म पानी',
        '1 इंच ताजा अदरक (पतले स्लाइस)',
        '1 बड़ा चम्मच नींबू का रस',
        '1 छोटा चम्मच शहद (वैकल्पिक)'
      ],
      preparation: [
        'पानी उबालें और अदरक डालें',
        '5-7 मिनट तक ढककर रखें',
        'छानकर नींबू का रस मिलाएं',
        'शहद मिलाकर दिनभर धीरे-धीरे पिएं'
      ],
      duration: 'पहली तिमाही में आवश्यकतानुसार',
      precautions: 'यदि सीने में जलन हो तो अधिक मात्रा से बचें'
    },
    {
      id: 102,
      title: 'नारियल पानी पेय',
      description: 'इलेक्ट्रोलाइट्स की पूर्ति और शरीर को हाइड्रेट करता है',
      benefits: [
        'प्राकृतिक इलेक्ट्रोलाइट्स से भरपूर',
        'मूत्र संक्रमण से बचाता है',
        'शरीर को ठंडक देता है',
        'महत्वपूर्ण खनिज प्रदान करता है'
      ],
      ingredients: [
        '1 कप ताजा नारियल पानी',
        '1 छोटा चम्मच धनिया पाउडर',
        'चुटकी भर सेंधा नमक'
      ],
      preparation: [
        'सभी सामग्री मिलाएं',
        'सुबह ताजा पिएं',
        'सप्ताह में 2-3 बार उपयोग करें'
      ],
      duration: 'सप्ताह में 2-3 बार',
      precautions: 'यदि नारियल से एलर्जी हो तो सेवन न करें'
    }
  ],
  2: [ // Second Trimester
    {
      id: 201,
      title: 'इम्युनिटी के लिए हल्दी दूध',
      description: 'दूसरी तिमाही के स्वास्थ्य के लिए पौष्टिक पेय',
      benefits: [
        'हड्डियों के विकास में सहायक',
        'प्रतिरक्षा प्रणाली को मजबूत करता है',
        'सूजन को कम करता है',
        'अच्छी नींद लाने में सहायक'
      ],
      ingredients: [
        '1 कप गर्म दूध (या बादाम दूध)',
        '½ छोटा चम्मच हल्दी पाउडर',
        '¼ छोटा चम्मच दालचीनी',
        'चुटकी भर काली मिर्च',
        '1 छोटा चम्मच घी',
        '1 छोटा चम्मच शहद'
      ],
      preparation: [
        'दूध को धीरे से गर्म करें',
        'सूखी सामग्री मिलाएं',
        'दूध में डालकर अच्छे से मिलाएं',
        'अंत में घी और शहद मिलाएं',
        'सोने से पहले गर्म पिएं'
      ],
      duration: 'सप्ताह में 2-3 बार',
      precautions: 'यदि रक्त पतला करने की दवा लें रहे हैं तो डॉक्टर से सलाह लें'
    }
  ],
  3: [ // Third Trimester
    {
      id: 301,
      title: 'खजूर और बादाम टॉनिक',
      description: 'तीसरी तिमाही में ऊर्जा बढ़ाने के लिए टॉनिक',
      benefits: [
        'प्राकृतिक आयरन का स्रोत',
        'गर्भाशय को प्रसव के लिए तैयार करता है',
        'स्थायी ऊर्जा प्रदान करता है',
        'भ्रूण के मस्तिष्क के विकास में सहायक'
      ],
      ingredients: [
        '2-3 भीगे हुए खजूर',
        '5-6 भीगे हुए बादाम',
        '1 कप गर्म दूध',
        'चुटकी भर इलायची पाउडर',
        '1 छोटा चम्मच घी'
      ],
      preparation: [
        'भीगे हुए खजूर और बादाम को दूध के साथ ब्लेंड करें',
        'स्मूद टेक्सचर के लिए छान सकते हैं',
        'इलायची और घी मिलाएं',
        'सुबह सेवन करें'
      ],
      duration: 'अंतिम 6 हफ्तों में रोजाना',
      precautions: 'यदि वजन अधिक बढ़ रहा हो तो मात्रा कम करें'
    }
  ]
},

    'ta-IN': {
  1: [ // First Trimester
    {
      id: 101,
      title: 'இஞ்சி-எலுமிச்சை குடிநீர்',
      description: 'காலை மனச்சோர்வு மற்றும் வாந்திக்கு இயற்கை தீர்வு',
      benefits: [
        'வாந்தி மற்றும் மனச்சோர்வை குறைக்கும்',
        'செரிமானத்தில் உதவுகிறது',
        'நோயெதிர்ப்பு சக்தியை அதிகரிக்கிறது',
        'உடலை ஈரப்பதமாக வைத்திருக்கிறது'
      ],
      ingredients: [
        '1 கப் சூடான நீர்',
        '1 அங்குலம் இஞ்சி துண்டுகள்',
        '1 மேசைக்கரண்டி எலுமிச்சை रसம்',
        '1 டீஸ்பூன் தேன் (விருப்பப்படி)'
      ],
      preparation: [
        'தண்ணீரை கொதிக்கவைத்து இஞ்சியைச் சேர்க்கவும்',
        '5-7 நிமிடங்கள் ஊறவைக்கவும்',
        'வடிகட்டி எலுமிச்சைச் சாறு சேர்க்கவும்',
        'தேனும் சேர்த்துச் சாப்பிடவும்',
        'பொதுவாக நாளுக்குள் குடிக்கவும்'
      ],
      duration: 'முதலாம் மாதத்தில் தேவையானபோது',
      precautions: 'அதிகமாக குடிக்காமல் இருங்கள், தேக்கம் ஏற்படலாம்'
    }
  ],
  2: [ // Second Trimester
    {
      id: 201,
      title: 'தங்க பாலுடன் பாதுகாப்பு',
      description: 'இரண்டாம் மாதத்தில் ஆரோக்கியத்தை பாதுகாக்கும் பானம்',
      benefits: [
        'எலும்பு வளர்ச்சிக்கு உதவும்',
        'நோயெதிர்ப்பு சக்தியை மேம்படுத்தும்',
        'வீக்கத்தை குறைக்கும்',
        'தூக்கத்தை மேம்படுத்தும்'
      ],
      ingredients: [
        '1 கப் சூடான பால் (அல்லது பாதாம் பால்)',
        '½ டீஸ்பூன் மஞ்சள் தூள்',
        '¼ டீஸ்பூன் இலவங்கப்பட்டை தூள்',
        'சிறிது மிளகு தூள்',
        '1 டீஸ்பூன் நெய்',
        '1 டீஸ்பூன் தேன்'
      ],
      preparation: [
        'பாலைக் கொதிக்காமல் சூடாக்கவும்',
        'முழு உலர் பொருட்களை கலக்கவும்',
        'பாலில் சேர்த்து நன்கு கலக்கவும்',
        'கடைசியில் நெய் மற்றும் தேன் சேர்க்கவும்',
        'மலர்ந்த நிலையில் குடிக்கவும்'
      ],
      duration: 'வாரத்திற்கு 2-3 முறை',
      precautions: 'இரத்தம் கொழுக்கும் மருந்து எடுத்தால் மருத்துவரிடம் ஆலோசனை செய்யவும்'
    }
  ],
  3: [ // Third Trimester
    {
      id: 301,
      title: 'பேரிச்சம் பழம் மற்றும் பாதாம் டொனிக்',
      description: 'மூன்றாம் மாதத்தில் சக்தி தரும் பானம்',
      benefits: [
        'இரும்புச் சத்தம் நிறைந்தது',
        'பிறப்புக்கு குழந்தைமுன் மாத்திரை பெற உதவும்',
        'நீண்ட நேரம் சக்தியை தரும்',
        'குழந்தையின் மூளை வளர்ச்சிக்கு உதவும்'
      ],
      ingredients: [
        '2-3 ஊறவைத்த பேரிச்சம்பழம்',
        '5-6 ஊறவைத்த பாதாம்',
        '1 கப் சூடான பால்',
        'சிறிது ஏலக்காய் தூள்',
        '1 டீஸ்பூன் நெய்'
      ],
      preparation: [
        'பேரிச்சம் பழமும் பாதாமும் பாலைச் சேர்த்து அரைக்கவும்',
        'மெல்லிய வடிவுக்கு வடிகட்டி கொள்ளலாம்',
        'ஏலக்காயும் நெய்யும் சேர்க்கவும்',
        'காலை நேரத்தில் குடிக்கவும்'
      ],
      duration: 'இறுதி 6 வாரங்களில் தினசரி',
      precautions: 'அதிக எடையால் பாதிக்கப்படுவோர் அளவை குறைக்கவும்'
    }
  ]
},'te-IN': {
  1: [ // First Trimester
    {
      id: 101,
      title: 'అల్లం-నిమ్మకాయ ద్రావణం',
      description: 'ఉదయం వాంతులు మరియు అసహ్యతకు సహాయపడే సహజ చికిత్స',
      benefits: [
        'వాంతులు మరియు అసహ్యతను తగ్గిస్తుంది',
        'జీర్ణక్రియను మెరుగుపరుస్తుంది',
        'రోగనిరోధక శక్తిని పెంపొందిస్తుంది',
        'శరీరాన్ని తేమగా ఉంచుతుంది'
      ],
      ingredients: [
        '1 కప్పు గోరువెచ్చని నీరు',
        '1 అంగుళం తాజా అల్లం ముక్కలు',
        '1 టేబుల్ స్పూన్ నిమ్మరసం',
        '1 టీస్పూన్ తేనె (ఐచ్చికం)'
      ],
      preparation: [
        'నీటిని మరిగించి అల్లం ముక్కలు వేయండి',
        '5-7 నిమిషాలు మరిగించండి',
        'వడగట్టి నిమ్మరసం వేసి కలపండి',
        'తేనె అవసరమైతే వేసుకోవచ్చు',
        'రోజంతా మెల్లగా త్రాగండి'
      ],
      duration: 'మొదటి త్రైమాసికంలో అవసరమైనప్పుడు',
      precautions: 'గుండె మంట ఉంటే అధికంగా తీసుకోవద్దు'
    }
  ],
  2: [ // Second Trimester
    {
      id: 201,
      title: 'తుర్మరిక్ పాల టానిక్',
      description: 'రెండో త్రైమాసికంలో ఆరోగ్యాన్ని మెరుగుపరచే పానీయం',
      benefits: [
        'ఎముకల అభివృద్ధికి సహాయపడుతుంది',
        'రోగనిరోధక శక్తిని పెంచుతుంది',
        'శరీరంలో వాపును తగ్గిస్తుంది',
        'శాంతియుత నిద్రను కలిగిస్తుంది'
      ],
      ingredients: [
        '1 కప్పు గోరువెచ్చని పాలు (లేదా బాదాం పాలు)',
        '½ టీస్పూన్ పసుపు పొడి',
        '¼ టీస్పూన్ దాల్చిన చెక్క పొడి',
        'చిటికెడు మిరియాల పొడి',
        '1 టీస్పూన్ నెయ్యి',
        '1 టీస్పూన్ తేనె'
      ],
      preparation: [
        'పాలను మరిగించకుండా వెచ్చగా చేయండి',
        'పొడులన్నీ కలపండి',
        'పాలలో కలిపి బాగా కలపండి',
        'చివరగా నెయ్యి, తేనె వేసి కలపండి',
        'రాత్రి నిద్రకు ముందు త్రాగండి'
      ],
      duration: 'వారానికి 2-3 సార్లు',
      precautions: 'రక్తం కొరుకుల మందులు తీసుకుంటే వైద్యుడిని సంప్రదించండి'
    }
  ],
  3: [ // Third Trimester
    {
      id: 301,
      title: 'ఖర్జూరం-బాదం టానిక్',
      description: 'మూడవ త్రైమాసికంలో శక్తిని అందించే పానీయం',
      benefits: [
        'ఐరన్ సమృద్ధిగా అందుతుంది',
        'ప్రసవానికి గర్భాశయాన్ని సిద్ధం చేస్తుంది',
        'శక్తిని మన్నించి ఇస్తుంది',
        'శిశువు మెదడు అభివృద్ధికి సహాయపడుతుంది'
      ],
      ingredients: [
        '2-3 ముంచిన ఖర్జూరాలు',
        '5-6 ముంచిన బాదం',
        '1 కప్పు గోరువెచ్చని పాలు',
        'చిటికెడు ఏలకుల పొడి',
        '1 టీస్పూన్ నెయ్యి'
      ],
      preparation: [
        'ఖర్జూరాలు, బాదం పాలతో కలిపి మిక్సీ లో వేసి బ్లెండ్ చేయండి',
        'సమతుల్యంగా ఉండాలంటే వడకట్టి తీయండి',
        'ఏలకుల పొడి, నెయ్యి కలపండి',
        'ప్రతిరోజు ఉదయం త్రాగండి'
      ],
      duration: 'చివరి 6 వారాలలో ప్రతి రోజు',
      precautions: 'అధిక బరువు పెరుగుతున్నట్లయితే పరిమితంగా తీసుకోవాలి'
    }
  ]
},'kn-IN': {
  1: [ // First Trimester
    {
      id: 101,
      title: 'ಶುಂಠಿ-ನಿಂಬೆ ಕಷಾಯ',
      description: 'ಮಲಗುವಾಸೆ ಮತ್ತು ಅಸ್ವಸ್ಥತೆಯ ತಾತ್ಕಾಲಿಕ ಪರಿಹಾರ',
      benefits: [
        'ವಾಂತಿ ಮತ್ತು ಅಸ್ವಸ್ಥತೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ',
        'ಜೀರ್ಣಕ್ರಿಯೆಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ',
        'ರೋಗನಿರೋಧಕ ಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ',
        'ದೇಹವನ್ನು ಹೊಕ್ಕಿರಿಸುತ್ತದೆ'
      ],
      ingredients: [
        '1 ಕಪ್ ಬಿಸಿ ನೀರು',
        '1 ಇಂಚು ಹಸಿರು ಶುಂಠಿ (ತುಳಿದಿರುವುದು)',
        '1 ಟಿಬಲ್ ಸ್ಪೂನ್ ನಿಂಬೆ ರಸ',
        '1 ಟೀಸ್ಪೂನ್ ಜೇನುತುಪ್ಪ (ಐಚ್ಛಿಕ)'
      ],
      preparation: [
        'ನೀರನ್ನು ಕೊಚ್ಚಿಸಿ ಶುಂಠಿ ಹಾಕಿ',
        '5-7 ನಿಮಿಷಗಳವರೆಗೆ ನಿಲ್ಲಿಸಿ',
        'ಜರಿದ ನಂತರ ನಿಂಬೆ ರಸವನ್ನು ಸೇರಿಸಿ',
        'ಜೇನುತುಪ್ಪ ಹಾಕಬಹುದಾದರೆ ಸೇರಿಸಿ',
        'ದಿನದಾದ್ಯಂತ ನಿಧಾನವಾಗಿ ಸೇವಿಸಿ'
      ],
      duration: 'ಪ್ರಥಮ ತ್ರೈಮಾಸಿಕದ ವೇಳೆ ಅಗತ್ಯವಿದ್ದಾಗ',
      precautions: 'ಹೃದಯ ಜ್ವಲನೆ ಇರುವವರಿಗೆ ಹೆಚ್ಚು ಸೇವಿಸಬಾರದು'
    }
  ],
  2: [ // Second Trimester
    {
      id: 201,
      title: 'ಹಾಲು-ಹಳದಿ ಪಾನೀಯ',
      description: 'ದ್ವಿತೀಯ ತ್ರೈಮಾಸಿಕದಲ್ಲಿ ಆರೋಗ್ಯಕ್ಕಾಗಿ ಪೋಷಕ ಪಾನೀಯ',
      benefits: [
        'ಎಲುಬುಗಳ ವಿಕಾಸಕ್ಕೆ ನೆರವು',
        'ರೋಗನಿರೋಧಕ ಶಕ್ತಿಯನ್ನು ಉತ್ತಮಗೊಳಿಸುತ್ತದೆ',
        'ಶರೀರದ ಉರಿಯೂತವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ',
        'ಅತಿ ಉತ್ತಮ ನಿದ್ರೆಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ'
      ],
      ingredients: [
        '1 ಕಪ್ ಬಿಸಿ ಹಾಲು (ಅಥವಾ ಬಾದಾಮಿ ಹಾಲು)',
        '½ ಟೀಸ್ಪೂನ್ ಹಳದಿ ಪುಡಿ',
        '¼ ಟೀಸ್ಪೂನ್ ದಾಲ್ಚಿನ್ನಿ ಪುಡಿ',
        'ಚಿಟಿಕೆ ಕಪ್ಪು ಮೆಣಸು ಪುಡಿ',
        '1 ಟೀಸ್ಪೂನ್ ತುಪ್ಪ',
        '1 ಟೀಸ್ಪೂನ್ ಜೇನುತುಪ್ಪ'
      ],
      preparation: [
        'ಹಾಲನ್ನು ಉರುಳಿಸದೆ ಬಿಸಿ ಮಾಡಿ',
        'ಎಲ್ಲಾ ಒಣ ಪದಾರ್ಥಗಳನ್ನು ಸೇರಿಸಿ',
        'ಹಾಲಿಗೆ ಹಾಕಿ ಚೆನ್ನಾಗಿ ಮಿಕ್ಸ್ ಮಾಡಿ',
        'ಜೇನುತುಪ್ಪ ಮತ್ತು ತುಪ್ಪವನ್ನು ಕೊನೆಗೆ ಸೇರಿಸಿ',
        'ರಾತ್ರಿ ನಿದ್ರೆಗೆ ಮುನ್ನ ಸೇವಿಸಿ'
      ],
      duration: 'ವಾರದಲ್ಲಿ 2-3 ಬಾರಿ',
      precautions: 'ರಕ್ತ ಜಂಘದ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದರೆ ವೈದ್ಯರ ಸಲಹೆ ಪಡೆಯಿರಿ'
    }
  ],
  3: [ // Third Trimester
    {
      id: 301,
      title: 'ಖರ್ಜೂರ ಮತ್ತು ಬಾದಾಮಿ ಪಾನೀಯ',
      description: 'ಮೂರನೇ ತ್ರೈಮಾಸಿಕದ ಶಕ್ತಿ ಪೂರಕ ಪಾನೀಯ',
      benefits: [
        'ನೈಸರ್ಗಿಕ ಐರನ್ ಮೂಲ',
        'ಪ್ರಸವಕ್ಕೆ ಗರ್ಭಾಶಯವನ್ನು ಸಿದ್ಧಗೊಳಿಸುತ್ತದೆ',
        'ದೀರ್ಘಕಾಲ ಶಕ್ತಿಯನ್ನು ಒದಗಿಸುತ್ತದೆ',
        'ಭ್ರೂಣದ ಮೆದುಳಿನ ವಿಕಾಸಕ್ಕೆ ಸಹಕಾರಿ'
      ],
      ingredients: [
        '2-3 ನೆನೆಸಿದ ಖರ್ಜೂರ',
        '5-6 ನೆನೆಸಿದ ಬಾದಾಮಿ',
        '1 ಕಪ್ ಬಿಸಿ ಹಾಲು',
        'ಚಿಟಿಕೆ ಏಲಕ್ಕಿ ಪುಡಿ',
        '1 ಟೀಸ್ಪೂನ್ ತುಪ್ಪ'
      ],
      preparation: [
        'ಖರ್ಜೂರ ಮತ್ತು ಬಾದಾಮಿ ಹಾಲಿನಲ್ಲಿ ಬೆರೆಸಿ ಹಲ್ಲಿಸು',
        'ಸಾಫಾಗಿ ಇಚ್ಛಿಸಿದ್ದರೆ ಜರಿಯಿರಿ',
        'ಏಲಕ್ಕಿ ಮತ್ತು ತುಪ್ಪವನ್ನು ಸೇರಿಸಿ',
        'ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ ಸೇವಿಸಿ'
      ],
      duration: 'ಕೊನೆಯ 6 ವಾರಗಳಲ್ಲಿ ಪ್ರತಿದಿನ',
      precautions: 'ಹದಿನಿಂದ ಹೆಚ್ಚು ತೂಕ ಹೆಚ್ಚಾದರೆ ಪ್ರಮಾಣ ಕಡಿಮೆ ಮಾಡಿ'
    }
  ]
},'mr-IN': {
  1: [ // First Trimester
    {
      id: 101,
      title: 'आलं-लिंबू काढा',
      description: 'प्रथम तिमाहीतील मळमळ आणि उलट्या रोखण्यासाठी आयुर्वेदिक उपाय',
      benefits: [
        'मळमळ आणि उलट्या कमी करते',
        'पचनास मदत करते',
        'रोगप्रतिकारशक्ती वाढवते',
        'शरीर हायड्रेट ठेवते'
      ],
      ingredients: [
        '1 कप गरम पाणी',
        '1 इंच ताजं आलं (पातळ चिरलेलं)',
        '1 टेबलस्पून लिंबाचा रस',
        '1 टीस्पून मध (ऐच्छिक)'
      ],
      preparation: [
        'पाणी उकळवून त्यात आलं घाला',
        '5-7 मिनिटे झाकून ठेवा',
        'गाळून लिंबाचा रस घाला',
        'हवे असल्यास मध मिसळा',
        'हळूहळू दिवसातून प्यावा'
      ],
      duration: 'प्रथम तिमाहीत गरजेनुसार',
      precautions: 'अतिसार असल्यास किंवा गॅस्ट्रिक समस्या असल्यास मर्यादित घ्या'
    }
  ],
  2: [ // Second Trimester
    {
      id: 201,
      title: 'हळद दूध टॉनिक',
      description: 'द्वितीय तिमाहीत प्रतिकारशक्तीसाठी पौष्टिक पेय',
      benefits: [
        'हाडांच्या विकासास मदत करते',
        'रोगप्रतिकारशक्ती वाढवते',
        'दाह कमी करते',
        'गाढ झोप आणते'
      ],
      ingredients: [
        '1 कप गरम दूध (साधं किंवा बदामाचं)',
        '½ टीस्पून हळद',
        '¼ टीस्पून दालचिनी',
        'चिमूटभर काळी मिरी पूड',
        '1 टीस्पून साजूक तूप',
        '1 टीस्पून मध'
      ],
      preparation: [
        'दूध सौम्य गरम करा',
        'सर्व कोरडी सामग्री मिसळा',
        'दूधात टाकून ढवळा',
        'तूप व मध शेवटी घाला',
        'रात्री झोपण्याआधी घ्या'
      ],
      duration: 'आठवड्यातून 2-3 वेळा',
      precautions: 'रक्त पातळ करणारी औषधे घेत असल्यास डॉक्टरांचा सल्ला घ्या'
    }
  ],
  3: [ // Third Trimester
    {
      id: 301,
      title: 'खजूर-बदाम टॉनिक',
      description: 'तिसऱ्या तिमाहीत ऊर्जेसाठी आणि प्रसूतीची तयारीसाठी',
      benefits: [
        'प्राकृतिक लोह स्त्रोत',
        'गर्भाशय प्रसूतीसाठी तयार करते',
        'ऊर्जा पुरवते',
        'बाळाच्या मेंदूच्या विकासास मदत करते'
      ],
      ingredients: [
        '2-3 भिजवलेले खजूर',
        '5-6 भिजवलेले बदाम',
        '1 कप गरम दूध',
        'चिमूटभर वेलची पूड',
        '1 टीस्पून साजूक तूप'
      ],
      preparation: [
        'खजूर व बदाम दूधात ब्लेंड करा',
        'हवे असल्यास गाळा',
        'वेलची पूड व तूप घाला',
        'सकाळी रिकाम्या पोटी घ्या'
      ],
      duration: 'शेवटच्या 6 आठवड्यांत रोज',
      precautions: 'तुमचं वजन खूप वाढत असेल तर प्रमाण मर्यादित ठेवा'
    }
  ]
},'bn-IN': {
  1: [ // First Trimester
    {
      id: 101,
      title: 'আদা-লেবু ইনফিউশন',
      description: 'গর্ভাবস্থার শুরুতে বমিভাব ও বমি কমানোর জন্য প্রাকৃতিক প্রতিকার',
      benefits: [
        'বমিভাব ও বমি হ্রাস করে',
        'হজমে সহায়তা করে',
        'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে',
        'শরীরকে হাইড্রেট রাখে'
      ],
      ingredients: [
        '১ কাপ গরম পানি',
        '১ ইঞ্চি তাজা আদা (পাতলা করে কাটা)',
        '১ টেবিলচামচ লেবুর রস',
        '১ চা চামচ মধু (ঐচ্ছিক)'
      ],
      preparation: [
        'পানিতে আদা দিয়ে ৫-৭ মিনিট ফোটান',
        'ছেঁকে নিয়ে লেবুর রস দিন',
        'মধু মেশান (যদি ইচ্ছা থাকে)',
        'সারাদিনে ধীরে ধীরে চুমুক দিয়ে পান করুন'
      ],
      duration: 'প্রথম ত্রৈমাসিকে প্রয়োজনে',
      precautions: 'অতিরিক্ত খেলে গ্যাস্ট্রিক বা অম্বলের সমস্যা হতে পারে'
    }
  ],
  2: [ // Second Trimester
    {
      id: 201,
      title: 'হলুদ দুধ টনিক',
      description: 'দ্বিতীয় ত্রৈমাসিকে রোগ প্রতিরোধে পুষ্টিকর পানীয়',
      benefits: [
        'হাড়ের গঠনে সহায়তা করে',
        'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে',
        'অ্যান্টি-ইনফ্ল্যামেটরি প্রভাব',
        'ঘুম ভালো হয়'
      ],
      ingredients: [
        '১ কাপ গরম দুধ (বা বাদাম দুধ)',
        '½ চা চামচ হলুদ গুঁড়ো',
        '¼ চা চামচ দারচিনি গুঁড়ো',
        'এক চিমটি গোলমরিচ গুঁড়ো',
        '১ চা চামচ ঘি',
        '১ চা চামচ মধু'
      ],
      preparation: [
        'দুধ হালকা গরম করুন',
        'সব শুকনো উপাদান মেশান',
        'দুধে মিশিয়ে ভালো করে নাড়ুন',
        'শেষে ঘি ও মধু দিন',
        'রাতে ঘুমানোর আগে পান করুন'
      ],
      duration: 'সপ্তাহে ২-৩ বার',
      precautions: 'রক্ত পাতলা করার ওষুধ খেলে চিকিৎসকের পরামর্শ নিন'
    }
  ],
  3: [ // Third Trimester
    {
      id: 301,
      title: 'খেজুর-বাদাম টনিক',
      description: 'তৃতীয় ত্রৈমাসিকে শক্তি এবং প্রসব প্রস্তুতির জন্য',
      benefits: [
        'প্রাকৃতিক আয়রনের উৎস',
        'জরায়ুকে প্রসবের জন্য প্রস্তুত করে',
        'দীর্ঘস্থায়ী শক্তি প্রদান করে',
        'ভ্রূণের মস্তিষ্ক বিকাশে সহায়তা করে'
      ],
      ingredients: [
        '২-৩টি ভেজানো খেজুর',
        '৫-৬টি ভেজানো বাদাম',
        '১ কাপ গরম দুধ',
        'এক চিমটি এলাচ গুঁড়ো',
        '১ চা চামচ ঘি'
      ],
      preparation: [
        'খেজুর ও বাদাম দুধে ব্লেন্ড করুন',
        'মসৃণ করতে চাইলে ছেঁকে নিন',
        'এলাচ গুঁড়ো ও ঘি মেশান',
        'সকালে খালি পেটে পান করুন'
      ],
      duration: 'শেষ ৬ সপ্তাহে প্রতিদিন',
      precautions: 'যদি ওজন দ্রুত বাড়ে তবে পরিমাণ কমান'
    }
  ]
},'gu-IN': {
  1: [ // First Trimester
    {
      id: 101,
      title: 'આદુ-લીંબૂ ઇન્ફ્યુઝન',
      description: 'સવારની અસ્વસ્થતા અને ઉલટીઓ માટે કુદરતી ઉપાય',
      benefits: [
        'ઉલટી અને મલમળાટ ઘટાડે છે',
        'પાચનમાં મદદ કરે છે',
        'પ્રતિરોધક શક્તિ વધારશે',
        'શરીરને હાઇડ્રેટ રાખે છે'
      ],
      ingredients: [
        '1 કપ ગુંજવું ગરમ પાણી',
        '1 ઇંચ તાજું આદુ (પાતળું કાપેલું)',
        '1 ટેબલસ્પૂન લીંબૂનો રસ',
        '1 ટીસ્પૂન मध (ઇચ્છાએ)'
      ],
      preparation: [
        'પાણી ઉકાળીને તેમાં આદુ ઉમેરો',
        '5-7 મિનિટ સુધી ઉકાળો',
        'ગાળીને લીંબૂનો રસ ઉમેરો',
        'મધ ઉમેરો જો ઇચ્છા હોય',
        'દિવસભરમાં ધીમે ધીમે પીવો'
      ],
      duration: 'પ્રથમ ત્રિમાસિક દરમિયાન જરૂરી હોય ત્યારે',
      precautions: 'જો એસિડિટીની સમસ્યા હોય તો વધુ ન પીવો'
    }
  ],
  2: [ // Second Trimester
    {
      id: 201,
      title: 'હલદીતું દૂધ ટોનિક',
      description: 'બીજા ત્રિમાસિકમાં આરોગ્ય માટે પૌષ્ટિક પેય',
      benefits: [
        'હાડકાંના વિકાસમાં સહાયરૂપ',
        'ઇમ્યુનિટી વધારશે',
        'સોજો ઘટાડે છે',
        'ઘેંસાળી ઊંઘ માટે સારું'
      ],
      ingredients: [
        '1 કપ ગરમ દૂધ (અથવા બદામ દૂધ)',
        '½ ટીસ્પૂન હળદર પાવડર',
        '¼ ટીસ્પૂન દાળચીની પાવડર',
        'થોડું કાળું મરી પાવડર',
        '1 ટીસ્પૂન ઘી',
        '1 ટીસ્પૂન મધ'
      ],
      preparation: [
        'દૂધને ધીમે ગરમ કરો (ઉકાળશો નહીં)',
        'બધી સુકી સામગ્રી મિક્સ કરો',
        'દૂધમાં ઉમેરી હલાવો',
        'છેવાના અંતે ઘી અને મધ ઉમેરો',
        'સાંજે સૂતા પહેલા પીવો'
      ],
      duration: 'અઠવાડિયામાં 2-3 વખત',
      precautions: 'જો તમારું બ્લડ થિનર ચલાવે છે તો ડૉક્ટરની સલાહ લો'
    }
  ],
  3: [ // Third Trimester
    {
      id: 301,
      title: 'ખજૂર અને બદામનો ટોનિક',
      description: 'ત્રિજિય ત્રિમાસિક દરમિયાન શક્તિ અને પ્રસૂતિ તૈયારી માટે',
      benefits: [
        'આયર્નનો કુદરતી સ્ત્રોત',
        'જજરૂને પ્રસૂતિ માટે તૈયાર કરે છે',
        'દીર્ઘકાલીન ઉર્જા આપે છે',
        'ગર્ભમાં બાળકના મગજના વિકાસમાં સહાયરૂપ'
      ],
      ingredients: [
        '2-3 વિંધેલા ખજૂર',
        '5-6 વિંધેલા બદામ',
        '1 કપ ગરમ દૂધ',
        'એક ચીમૂચ એલચી પાવડર',
        '1 ટીસ્પૂન ઘી'
      ],
      preparation: [
        'ખજૂર અને બદામને દૂધમાં મિક્ષ કરીને બ્લેન્ડ કરો',
        'છેંણવાનું હોય તો ગાળી લો',
        'એલચી અને ઘી ઉમેરો',
        'સવારના સમયે પીવો'
      ],
      duration: 'છેલ્લા 6 અઠવાડિયામાં દરરોજ',
      precautions: 'વજન વધારે વધે તો માત્રા ઓછી કરો'
    }
  ]
},'ml-IN': {
  1: [ // First Trimester
    {
      id: 101,
      title: 'ഇഞ്ചി-ചെറുനാരങ്ങ കഷായം',
      description: 'പ്രഭാത കാലത്തെ ഛര്‍ദ്ദിയും അസ്വസ്ഥതയും കുറയ്ക്കുന്ന ഔഷധം',
      benefits: [
        'ഉള്‍ക്കടിപ്പും ഛര്‍ദ്ദിയും കുറയ്ക്കുന്നു',
        'ജീർണ്ണശക്തി മെച്ചപ്പെടുത്തുന്നു',
        'പ്രതിരോധശേഷി വര്‍ദ്ധിപ്പിക്കുന്നു',
        'ശരീരം ആവിഷ്കരിക്കുന്നു'
      ],
      ingredients: [
        '1 കപ്പ് ചൂടുവെള്ളം',
        '1 ഇഞ്ച് ഇഞ്ചി (സ്ലൈസുകൾ)',
        '1 ടേബിള്‍സ്പൂണ്‍ ചെറുനാരങ്ങാനീര്',
        '1 ടീസ്പൂണ്‍ തേന്‍ (ഐച്ഛികം)'
      ],
      preparation: [
        'വെള്ളം തിളപ്പിച്ച് ഇഞ്ചി ചേർക്കുക',
        '5-7 മിനിറ്റ് പൊഴിക്കുക',
        'ചെറുനാരങ്ങാനീര് ചേര്‍ക്കുക',
        'തേന് ചേർക്കാൻ ആഗ്രഹമുണ്ടെങ്കിൽ ചേർക്കുക',
        'ദിവസം മുഴുവൻ ചെറുതായി കഴിക്കുക'
      ],
      duration: 'ആവശ്യമുള്ളപ്പോൾ ആദ്യ ത്രൈമാസത്തിൽ',
      precautions: 'ആസിഡിറ്റിയുണ്ടെങ്കിൽ അതികം ഉപയോഗിക്കരുത്'
    }
  ],
  2: [ // Second Trimester
    {
      id: 201,
      title: 'മഞ്ഞള്‍ പാല്‍ ടോണിക്',
      description: 'രണ്ടാം ത്രൈമാസം ആരോഗ്യത്തിനുള്ള പോഷക പാനീയം',
      benefits: [
        'എളുപ്പത്തിൽ അസ്ഥി വികസനത്തിന് സഹായകരം',
        'പ്രതിരോധശേഷി വർദ്ധിപ്പിക്കുന്നു',
        'ഉറച്ച വേദനകൾക്കും മികച്ചതാണ്',
        'നല്ല ഉറക്കം പ്രോത്സാഹിപ്പിക്കുന്നു'
      ],
      ingredients: [
        '1 കപ്പ് ചൂടായ പാലു (അല്ലെങ്കില്‍ ബദാം പാലു)',
        '½ ടീസ്പൂണ്‍ മഞ്ഞള്‍ പൊടി',
        '¼ ടീസ്പൂണ്‍ പട്ട പൊടി',
        'ഒരു കിനാവു കുരുമുളക് പൊടി',
        '1 ടീസ്പൂണ്‍ നെയ്',
        '1 ടീസ്പൂണ്‍ തേന്‍'
      ],
      preparation: [
        'പാല്‍ ചെറുതായി ചൂടാക്കുക (തിളപ്പിക്കരുത്)',
        'വയറ്റിലെ വസ്തുക്കൾ ചേർക്കുക',
        'ചൂടായ പാലില്‍ ഇട്ട് നന്നായി കലക്കുക',
        'അവസാനത്തില്‍ നെയ്, തേന് ചേർക്കുക',
        'ഉറങ്ങുന്നതിന് മുന്‍പ് കുടിക്കുക'
      ],
      duration: 'ആഴ്ചയില്‍ 2-3 തവണ',
      precautions: 'ബ്ലഡ് തിന്നര്‍ ഉപയോഗിക്കുന്നവര്‍ ഡോക്ടറുടെ ഉപദേശം തേടുക'
    }
  ],
  3: [ // Third Trimester
    {
      id: 301,
      title: 'ഇന്ത്-ബദാം ടോണിക്',
      description: 'മൂന്നാം ത്രൈമാസത്തിൽ ഊര്‍ജം നൽകുന്ന പാനീയം',
      benefits: [
        'ആയണ്‍ ലഭ്യത വര്‍ദ്ധിപ്പിക്കുന്നു',
        'പ്രസവത്തിനായി ഗര്‍ഭപാത്രം സജ്ജമാക്കുന്നു',
        'നീണ്ട സമയത്തേക്കുള്ള ഊര്‍ജം നൽകുന്നു',
        'ശിശുവിന്റെ ശാരീരിക-മാനസിക വളർച്ചയ്ക്ക് സഹായിക്കുന്നു'
      ],
      ingredients: [
        '2-3 ഇന്ത് (ചേര്‍ത്തുവച്ചത്)',
        '5-6 ബദാം (ചേര്‍ത്തുവച്ചത്)',
        '1 കപ്പ് ചൂടായ പാലു',
        'ഒരു നുള്ള് ഏലക്ക പൊടി',
        '1 ടീസ്പൂണ്‍ നെയ്'
      ],
      preparation: [
        'ഇന്തും ബദാമും പാലില്‍ ചേർത്ത് അരക്കുക',
        'സുന്ദരമായ കൺസിസ്റ്റൻസിയ്ക്ക് ഇത് ഫിൽറ്റർ ചെയ്യാവുന്നതാണ്',
        'ഏലക്ക പൊടിയും നെയ് ചേർക്കുക',
        'സമയം കഴിയുന്നതിന് മുന്‍പ് കുടിക്കുക'
      ],
      duration: 'അവസാന 6 ആഴ്ചകളിൽ ദിവസേന',
      precautions: 'അമിതമായ ഭാരം വന്നാൽ ഉപയോഗം കുറയ്ക്കുക'
    }
  ]
},'pa-IN': {
  1: [ // ਪਹਿਲੀ ਤਿਮਾਹੀ
    {
      id: 101,
      title: 'ਅਦਰਕ-ਨਿੰਬੂ ਕਾਢਾ',
      description: 'ਮੋਰਨਿੰਗ ਸਿਕਨੈੱਸ ਅਤੇ ਮਤਲੀ ਲਈ ਕੁਦਰਤੀ ਇਲਾਜ',
      benefits: [
        'ਮਤਲੀ ਅਤੇ ਉਲਟੀ ਨੂੰ ਘਟਾਉਂਦਾ ਹੈ',
        'ਹਾਜਮੇ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ',
        'ਰੋਗ ਪ੍ਰਤੀਰੋਧਕ ਤਾਕਤ ਵਧਾਉਂਦਾ ਹੈ',
        'ਸਰੀਰ ਨੂੰ ਹਾਈਡਰੇਟ ਕਰਦਾ ਹੈ'
      ],
      ingredients: [
        '1 ਕੱਪ ਗੁੰਮ ਗਰਮ ਪਾਣੀ',
        '1 ਇੰਚ ਅਦਰਕ (ਪਤਲੇ ਸਲਾਈਸ)',
        '1 ਟੇਬਲ-ਚਮਚ ਨਿੰਬੂ ਰਸ',
        '1 ਚਮਚ ਸ਼ਹਦ (ਇੱਛਾ ਅਨੁਸਾਰ)'
      ],
      preparation: [
        'ਪਾਣੀ ਉਬਾਲੋ ਤੇ ਅਦਰਕ ਪਾਓ',
        '5-7 ਮਿੰਟ ਲਈ ਭੀਜਣ ਦਿਓ',
        'ਛਾਣ ਕੇ ਨਿੰਬੂ ਰਸ ਪਾਓ',
        'ਸ਼ਹਦ ਪਾਓ ਜੇ ਲੋੜ ਹੋਵੇ',
        'ਦਿਨ ਭਰ ਹੌਲੀ ਹੌਲੀ ਪੀਓ'
      ],
      duration: 'ਜਦੋਂ ਵੀ ਲੋੜ ਹੋਵੇ ਪਹਿਲੀ ਤਿਮਾਹੀ ਵਿੱਚ',
      precautions: 'ਜੇ ਐਸਿਡਿਟੀ ਹੋਵੇ ਤਾਂ ਵਧੀਕ ਨਾ ਪੀਓ'
    }
  ],
  2: [ // ਦੂਜੀ ਤਿਮਾਹੀ
    {
      id: 201,
      title: 'ਹਲਦੀ ਵਾਲਾ ਦੁੱਧ',
      description: 'ਦੂਜੀ ਤਿਮਾਹੀ ਵਿੱਚ ਸਿਹਤ ਲਈ ਪੋਸ਼ਣ ਭਰਪੂਰ ਪੀਣ ਵਾਲਾ ਪਦਾਰਥ',
      benefits: [
        'ਅਸਥੀਆਂ ਦੀ ਵਿਕਾਸ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ',
        'ਇਮਿਊਨ ਸਿਸਟਮ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਦਾ ਹੈ',
        'ਸੋਜ ਘਟਾਉਂਦਾ ਹੈ',
        'ਅੱਛੀ ਨੀਂਦ ਲਈ ਮਦਦਗਾਰ'
      ],
      ingredients: [
        '1 ਕੱਪ ਗਰਮ ਦੁੱਧ (ਗਾਂ ਦਾ ਜਾਂ ਬਦਾਮ ਦੁੱਧ)',
        '½ ਚਮਚ ਹਲਦੀ ਪਾਊਡਰ',
        '¼ ਚਮਚ ਦਾਲਚੀਨੀ',
        'ਚੁਟਕੀ ਭੂਰੀ ਮਿਰਚ',
        '1 ਚਮਚ ਘਿਉ',
        '1 ਚਮਚ ਸ਼ਹਦ'
      ],
      preparation: [
        'ਦੁੱਧ ਹੌਲੀ ਹੌਲੀ ਗਰਮ ਕਰੋ (ਉਬਾਲੋ ਨਹੀਂ)',
        'ਸਾਰੇ ਸੁੱਕੇ ਸਮੱਗਰੀ ਮਿਲਾਓ',
        'ਦੁੱਧ ਵਿੱਚ ਪਾਓ ਤੇ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾਓ',
        'ਘਿਉ ਅਤੇ ਸ਼ਹਦ ਆਖ਼ਿਰ ਵਿੱਚ ਪਾਓ',
        'ਸੋਣ ਤੋਂ ਪਹਿਲਾਂ ਪੀਓ'
      ],
      duration: 'ਹਫ਼ਤੇ ਵਿੱਚ 2-3 ਵਾਰੀ',
      precautions: 'ਜੇ ਖੂਨ ਪਤਲਾ ਕਰਨ ਵਾਲੀ ਦਵਾਈ ਲੈ ਰਹੇ ਹੋ ਤਾਂ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਲਓ'
    }
  ],
  3: [ // ਤੀਜੀ ਤਿਮਾਹੀ
    {
      id: 301,
      title: 'ਖਜੂਰ ਤੇ ਬਦਾਮ ਟੋਨਿਕ',
      description: 'ਤੀਜੀ ਤਿਮਾਹੀ ਲਈ ਊਰਜਾ ਦੇਣ ਵਾਲਾ ਪੀਣ ਵਾਲਾ ਪਦਾਰਥ',
      benefits: [
        'ਕੁਦਰਤੀ ਆਇਰਨ ਦਾ ਸਰੋਤ',
        'ਜਣਨ ਅੰਗ ਨੂੰ ਪ੍ਰਸਵ ਲਈ ਤਿਆਰ ਕਰਦਾ ਹੈ',
        'ਲੰਮੇ ਸਮੇਂ ਤੱਕ ਊਰਜਾ ਦਿੰਦਾ ਹੈ',
        'ਬੱਚੇ ਦੀ ਦਿਮਾਗੀ ਵਿਕਾਸ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ'
      ],
      ingredients: [
        '2-3 ਭੀਜੇ ਹੋਏ ਖਜੂਰ',
        '5-6 ਭੀਜੇ ਹੋਏ ਬਦਾਮ',
        '1 ਕੱਪ ਗਰਮ ਦੁੱਧ',
        'ਚੁਟਕੀ ਏਲਾਚੀ ਪਾਊਡਰ',
        '1 ਚਮਚ ਘਿਉ'
      ],
      preparation: [
        'ਖਜੂਰ ਤੇ ਬਦਾਮ ਦੁੱਧ ਨਾਲ ਪੀਸੋ',
        'ਚਾਹੋ ਤਾਂ ਛਾਣ ਸਕਦੇ ਹੋ',
        'ਏਲਾਚੀ ਤੇ ਘਿਉ ਪਾਓ',
        'ਸਵੇਰੇ ਖਾਲੀ ਪੇਟ ਪੀਓ'
      ],
      duration: 'ਆਖ਼ਰੀ 6 ਹਫ਼ਤਿਆਂ ਵਿੱਚ ਰੋਜ਼',
      precautions: 'ਜੇ ਵਧੇਰੇ ਵਜ਼ਨ ਵਧ ਰਿਹਾ ਹੋਵੇ ਤਾਂ ਘਟਾਓ'
    }
  ]
}







  };

  // Get remedies for current language and trimester
  const remedies = ayurvedicRemedies[language]?.[trimester] || ayurvedicRemedies['en-IN'][trimester];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-teal-50 p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-teal-800 mb-2">
          {translations[language]?.heading || translations['en-IN'].heading}

        </h1>
        <p className="text-gray-600">
          {translations[language]?.heading || translations['en-IN'].heading}

        </p>
        
        {/* Trimester Selector */}
        <div className="flex justify-center mt-4">
          <div className="inline-flex rounded-md shadow-sm">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => setTrimester(num)}
                className={`px-4 py-2 text-sm font-medium ${trimester === num 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-white text-teal-700 hover:bg-teal-50'} 
                  ${num === 1 ? 'rounded-l-lg' : ''} 
                  ${num === 3 ? 'rounded-r-lg' : ''} 
                  border border-teal-200`}
              >
                {translations[language]?.heading || translations['en-IN'].heading}

              </button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Remedies Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {remedies.map((remedy) => (
          <motion.div
            key={remedy.id}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all"
          >
            <div className="h-48 bg-green-100 flex items-center justify-center relative">
              <Player
                autoplay
                loop
                src={remedy.animation}
                style={{ height: '100%', width: '100%' }}
              />
              <button
                className={`absolute top-4 right-4 p-2 rounded-full ${bookmarked.includes(remedy.id) ? 'text-teal-600' : 'text-gray-400'}`}
                onClick={() => toggleBookmark(remedy.id)}
              >
                <FaBookmark className="text-2xl" />
              </button>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-teal-700">{remedy.title}</h3>
                <button className="text-green-500">
                  <FaHeart />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">{remedy.description}</p>
              
              <div className="flex items-center mb-3">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                  {remedy.duration}
                </span>
              </div>
              
              <button
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition"
                onClick={() => setSelectedRemedy(remedy)}
              >
               {translations[language]?.heading || translations['en-IN'].heading}

              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Remedy Detail Modal */}
      <AnimatePresence>
        {selectedRemedy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRemedy(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-56 bg-green-100 relative">
                <Player
                  autoplay
                  loop
                  src={selectedRemedy.animation}
                  style={{ height: '100%', width: '100%' }}
                />
                <button
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
                  onClick={() => setSelectedRemedy(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-teal-800">{selectedRemedy.title}</h2>
                  <button 
                    className={`p-2 ${bookmarked.includes(selectedRemedy.id) ? 'text-teal-600' : 'text-gray-400'}`}
                    onClick={() => toggleBookmark(selectedRemedy.id)}
                  >
                    <FaBookmark className="text-xl" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {translations[language]?.heading || translations['en-IN'].heading}

                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedRemedy.benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-700">{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {translations[language]?.heading || translations['en-IN'].heading}

                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedRemedy.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-gray-700">{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {translations[language]?.heading || translations['en-IN'].heading}

                  </h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    {selectedRemedy.preparation.map((step, index) => (
                      <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {translations[language]?.heading || translations['en-IN'].heading}

                  </h3>
                  <p className="text-red-600">{selectedRemedy.precautions}</p>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition">
                    {translations[language]?.heading || translations['en-IN'].heading}

                  </button>
                  <button className="p-3 bg-gray-100 rounded-lg">
                    <FaShareAlt className="text-teal-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Tips Section */}
      <div className="mt-12 bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-teal-800 mb-4">
          {translations[language]?.heading || translations['en-IN'].heading}

        </h2>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-800">
            {translations[language]?.tips?.[trimester] || translations['en-IN'].tips[trimester]}

            {translations[language]?.tips?.[trimester] || translations['en-IN'].tips[trimester]}

            {translations[language]?.tips?.[trimester] || translations['en-IN'].tips[trimester]}

          </p>
        </div>
      </div>
    </div>
  );
};

export default PregAyurvedaPage;