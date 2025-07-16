import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaShareAlt,FaBookmark, FaLeaf } from 'react-icons/fa';
import translations from './Posttranslations';
import Navbar from '../components/Navbar';
import navbarTranslations from '../translations/navbarTranslations'; 
const PostAyurveda = () => {
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState('en-IN');
    const [streak, setStreak]   = useState(0); 
  const [bookmarked, setBookmarked] = useState([]);
  const auth = getAuth();
   const t = translations[language] || translations['en-IN'];
  const ayurvedicRemedies = {
    "en-IN": [
  {
    id: 1,
    title: "Golden Milk Elixir",
    description: "Traditional Ayurvedic drink for postpartum recovery",
    benefits: [
      "Boosts immunity and energy",
      "Reduces inflammation",
      "Aids digestion and lactation",
      "Promotes restful sleep"
    ],
    ingredients: [
      "1 cup warm milk (cow or almond)",
      "½ tsp turmeric powder",
      "¼ tsp dry ginger powder",
      "Pinch of black pepper",
      "1 tsp ghee",
      "Jaggery to taste"
    ],
    preparation: [
      "Gently warm the milk without boiling",
      "Mix turmeric, ginger, and black pepper together",
      "Add the mixture to the warm milk and stir well",
      "Stir in ghee at the end",
      "Drink warm before bedtime"
    ],
    animation: "https://assets1.lottiefiles.com/packages/lf20_5itouocj.json",
    duration: "Daily for 40 days",
    precautions: "Avoid if allergic to dairy",
    image:'/assets/goldenmilk.jpg'
  },
  {
    id: 2,
    title: "Ajwain Water Infusion",
    description: "Cleansing and digestive tonic for postpartum mothers",
    benefits: [
      "Improves digestion",
      "Reduces bloating and gas",
      "Stimulates metabolism",
      "Supports uterine healing"
    ],
    ingredients: [
      "1 tsp ajwain seeds (carom seeds)",
      "2 cups water",
      "Honey (optional)"
    ],
    preparation: [
      "Boil ajwain seeds in 2 cups of water for 5–7 minutes",
      "Strain the mixture into a cup",
      "Add honey if desired",
      "Drink warm on an empty stomach"
    ],
    animation: "https://assets9.lottiefiles.com/private_files/lf30_saujcahz.json",
    duration: "Every morning for 30 days",
    precautions: "Excess may cause acidity in some individuals",
    image : "/assets/ajwain.jpg"
  },
  {
    id: 3,
    title: "Dry Ginger and Coriander Brew",
    description: "Warm herbal brew for digestive and anti-inflammatory support",
    benefits: [
      "Reduces gas and bloating",
      "Improves digestion and gut health",
      "Has anti-inflammatory properties",
      "Promotes internal warmth"
    ],
    ingredients: [
      "½ tsp dry ginger powder",
      "½ tsp coriander seed powder",
      "1.5 cups water",
      "Palm sugar or jaggery (optional)"
    ],
    preparation: [
      "Add dry ginger and coriander powder to 1.5 cups of water",
      "Boil and simmer for about 10 minutes",
      "Strain into a cup and sweeten if desired",
      "Consume warm, twice a day"
    ],
    animation: "https://assets7.lottiefiles.com/packages/lf20_q5pk6p1k.json",
    duration: "Morning and evening for 3 weeks",
    precautions: "Avoid if you have a high Pitta constitution or are prone to heat",
    image:'/assets/brew.jpg'
  }
],


    "hi-IN": [
  {
    id: 1,
    title: "स्वर्ण दूध",
    description: "प्रसव के बाद की देखभाल के लिए आयुर्वेदिक उपाय",
    benefits: [
      "रोग प्रतिरोधक क्षमता और ऊर्जा को बढ़ाता है",
      "सूजन को कम करता है",
      "पाचन और स्तनपान में सहायक",
      "गहरी नींद को प्रोत्साहित करता है"
    ],
    ingredients: [
      "1 कप गर्म दूध (गाय या बादाम)",
      "½ चम्मच हल्दी पाउडर",
      "¼ चम्मच सोंठ पाउडर",
      "एक चुटकी काली मिर्च",
      "1 चम्मच घी",
      "स्वादानुसार गुड़"
    ],
    preparation: [
      "दूध को धीरे से गर्म करें (उबालें नहीं)",
      "सभी सूखी सामग्री मिलाएं",
      "गर्म दूध में डालें और अच्छे से मिलाएं",
      "अंत में घी डालें",
      "सोने से पहले गर्मागरम पिएं"
    ],
    animation: "https://assets1.lottiefiles.com/packages/lf20_5itouocj.json",
    duration: "40 दिनों तक रोजाना",
    precautions: "यदि डेयरी से एलर्जी हो तो सेवन न करें",
    image:'/assets/goldenmilk.jpg'
  },
  {
    id: 2,
    title: "अजवाइन का पानी",
    description: "प्रसव के बाद की देखभाल के लिए आयुर्वेदिक उपाय",
    benefits: [
      "पाचन में सुधार करता है",
      "फुलाव और गैस को कम करता है",
      "मेटाबॉलिज्म को तेज करता है",
      "गर्भाशय की सफाई में मदद करता है"
    ],
    ingredients: [
      "1 चम्मच अजवाइन",
      "2 कप पानी",
      "शहद (वैकल्पिक)"
    ],
    preparation: [
      "पानी में अजवाइन डालकर 5–7 मिनट तक उबालें",
      "छान लें",
      "इच्छानुसार शहद डालें",
      "खाली पेट गुनगुना पिएं"
    ],
    animation: "https://assets9.lottiefiles.com/private_files/lf30_saujcahz.json",
    duration: "30 दिनों तक सुबह-सुबह",
    precautions: "अगर एसिडिटी की समस्या हो तो कम मात्रा में लें",
    image : "/assets/ajwain.jpg"
  },
  {
    id: 3,
    title: "सोंठ-धनिया का काढ़ा",
    description: "प्रसव के बाद की देखभाल के लिए आयुर्वेदिक उपाय",
    benefits: [
      "गैस और फुलाव को कम करता है",
      "पाचन को बेहतर बनाता है",
      "सूजनरोधी गुणों से भरपूर",
      "शरीर को गर्म रखता है"
    ],
    ingredients: [
      "½ चम्मच सोंठ पाउडर",
      "½ चम्मच धनिया पाउडर",
      "1.5 कप पानी",
      "स्वादानुसार खांड/गुड़"
    ],
    preparation: [
      "पानी में सोंठ और धनिया पाउडर डालें और उबालें",
      "10 मिनट तक धीमी आंच पर पकाएं",
      "छानकर मीठा मिलाएं यदि चाहें",
      "दिन में दो बार गर्म पिएं"
    ],
    animation: "https://assets7.lottiefiles.com/packages/lf20_q5pk6p1k.json",
    duration: "3 हफ्तों तक सुबह और शाम",
    precautions: "यदि शरीर में पित्त अधिक हो तो सेवन से बचें",
    image:'/assets/brew.jpg'
  }
],

    "ta-IN": [
  {
    id: 1,
    title: "பொன் பால்",
    description: "பிறப்புக்குப் பின் உடல் நலத்திற்கான பாரம்பரிய ஆயுர்வேத பானம்",
    benefits: [
      "தீவிர நோயெதிர்ப்பு சக்தியை உருவாக்குகிறது",
      "உடலில் வீக்கம் மற்றும் வலியை குறைக்கிறது",
      "செரிமானம் மற்றும் முலைப்பாலை ஊக்குவிக்கிறது",
      "அறிகுறியில்லாத தூக்கத்தை ஏற்படுத்துகிறது"
    ],
    ingredients: [
      "1 கப் சூடான பால் (மாடு அல்லது பாதாம்)",
      "½ தேக்கரண்டி மஞ்சள் தூள்",
      "¼ தேக்கரண்டி உலர் இஞ்சி தூள்",
      "சிறிது கருமிளகு தூள்",
      "1 தேக்கரண்டி நெய்",
      "வெல்லம் (சுவைக்கேற்ப)"
    ],
    preparation: [
      "பாலை மெதுவாக சூடாக்கவும் (கொதிக்க விடாதீர்கள்)",
      "மஞ்சள், இஞ்சி, கருமிளகு தூளை கலந்து கொள்ளவும்",
      "இதை பாட்டில் சேர்த்து நன்றாக கிளறவும்",
      "பிறகு நெய்யை சேர்க்கவும்",
      "மலக்கச் செல்லும் முன் சூடாக குடிக்கவும்"
    ],
    animation: "https://assets1.lottiefiles.com/packages/lf20_5itouocj.json",
    duration: "நாள்தோறும் 40 நாட்கள்",
    precautions: "பாலில் அலர்ஜி உள்ளவர்கள் தவிர்க்கவும்",
    image:'/assets/goldenmilk.jpg'
  },
  {
    id: 2,
    title: "அஜ்வைன் நீர் ஊறுகாய்",
    description: "பிறப்புக்குப் பின் வயிற்று சீரமைப்பிற்கான உடல்நல பானம்",
    benefits: [
      "செரிமானத்தை மேம்படுத்துகிறது",
      "வயிற்றுப்போக்கு மற்றும் வீக்கத்தை குறைக்கிறது",
      "உடல் மெட்டபாலிசத்தை தூண்டுகிறது",
      "கருப்பை சுத்திகரிப்புக்கு உதவுகிறது"
    ],
    ingredients: [
      "1 தேக்கரண்டி ஓமம் விதைகள்",
      "2 கப் தண்ணீர்",
      "தேனீ (விருப்பப்படி)"
    ],
    preparation: [
      "ஓமம் விதைகளை 2 கப் தண்ணீரில் 5–7 நிமிடங்கள் நன்றாக கொதிக்கவும்",
      "கசாயத்தை வடிகட்டி கப் ஒன்றில் ஊற்றவும்",
      "தேவைப்பட்டால் தேனீ சேர்க்கவும்",
      "வெறும் வயிற்றில் சூடாக குடிக்கவும்"
    ],
    animation: "https://assets9.lottiefiles.com/private_files/lf30_saujcahz.json",
    duration: "தினமும் காலை 30 நாட்கள்",
    precautions: "அதிகமாகக் குடித்தால் அமிலத்தன்மையை ஏற்படுத்தலாம்",
    image : "/assets/ajwain.jpg"
  },
  {
    id: 3,
    title: "இஞ்சி-மல்லி கஷாயம்",
    description: "சூடான உடல்நிலை மற்றும் செரிமானத்திற்கு ஆதரவான மூலிகை பானம்",
    benefits: [
      "வாயுவை குறைத்து வயிறு வீக்கத்தை குறைக்கும்",
      "செரிமானத்தை மேம்படுத்துகிறது",
      "வலியை குறைக்கும் உட்பெருக்க சக்தி உள்ளது",
      "உடலை உஷ்ணமாக வைத்திருக்க உதவுகிறது"
    ],
    ingredients: [
      "½ தேக்கரண்டி உலர் இஞ்சி தூள்",
      "½ தேக்கரண்டி மல்லி தூள்",
      "1.5 கப் தண்ணீர்",
      "வெல்லம் அல்லது நாட்டு சக்கரை (விருப்பப்படி)"
    ],
    preparation: [
      "இஞ்சி மற்றும் மல்லி தூளை தண்ணீரில் சேர்த்து கொதிக்க வைக்கவும்",
      "10 நிமிடங்கள் மெதுவாக சுடவும்",
      "வடிகட்டி தேவையானால் சாற்று அல்லது சக்கரை சேர்க்கவும்",
      "சகாலை மற்றும் மாலை வெறும் வயிற்றில் குடிக்கவும்"
    ],
    animation: "https://assets7.lottiefiles.com/packages/lf20_q5pk6p1k.json",
    duration: "மாலை மற்றும் காலை 3 வாரங்கள்",
    precautions: "உடலில் அதிக உஷ்ணம் உள்ளவர்களுக்கு பரிந்துரை செய்யப்படவில்லை",
    image:'/assets/brew.jpg'
  }
],
"te-IN": [
  {
    id: 1,
    title: "గోల్డెన్ మిల్క్ ఎలిక్సిర్",
    description: "ప్రసవం తర్వాత ఆరోగ్యాన్ని పునరుద్ధరించేందుకు అనువైన ఆయుర్వేద పానీయం",
    benefits: [
      "రోగనిరోధక శక్తి మరియు శక్తిని పెంచుతుంది",
      "శరీరంలోని వాపును తగ్గిస్తుంది",
      "జీర్ణక్రియను మెరుగుపరుస్తుంది మరియు పాల ఉత్పత్తికి సహాయపడుతుంది",
      "మంచి నిద్రకు దోహదం చేస్తుంది"
    ],
    ingredients: [
      "1 కప్పు గోధుమ పాలు (ఆవు లేదా బాదం పాలు)",
      "½ టీ స్పూన్ హల్దీ పొడి",
      "¼ టీ స్పూన్ శుంఠి పొడి",
      "చిటికెడు మిరియాల పొడి",
      "1 టీ స్పూన్ నెయ్యి",
      "జగ్జరీ లేదా బెల్లం రుచికి తగిన మేరకు"
    ],
    preparation: [
      "పాలను నెమ్మదిగా వేడి చేయాలి (కొదిలించవద్దు)",
      "హల్దీ, శుంఠి, మిరియాల పొడి కలపాలి",
      "వేడి పాలలో ఈ మిశ్రమాన్ని కలిపి బాగా కలపాలి",
      "చివరగా నెయ్యి కలపాలి",
      "నిద్రకు ముందు వేడిగా త్రాగాలి"
    ],
    animation: "https://assets1.lottiefiles.com/packages/lf20_5itouocj.json",
    duration: "రోజూ 40 రోజులు",
    precautions: "పాలతో అలెర్జీ ఉంటే తీసుకోకండి",
    image:'/assets/goldenmilk.jpg'
  },
  {
    id: 2,
    title: "వాముపు నీరు (అజ్వైన్ వాటర్)",
    description: "జీర్ణక్రియ కోసం ప్రసవం తర్వాత తాగే ఆయుర్వేద టానిక్",
    benefits: [
      "జీర్ణక్రియను మెరుగుపరుస్తుంది",
      "వాయువు మరియు పొట్ట వాపును తగ్గిస్తుంది",
      "శరీర శక్తిని పెంచుతుంది",
      "గర్భాశయ శుద్ధికి సహాయపడుతుంది"
    ],
    ingredients: [
      "1 టీ స్పూన్ వాముపు గింజలు",
      "2 కప్పుల నీరు",
      "తేనె (ఐచ్చికంగా)"
    ],
    preparation: [
      "వామును నీటిలో వేసి 5–7 నిమిషాలు మరిగించాలి",
      "చల్లాక తీసి తేనె కలిపి తాగవచ్చు",
      "వేడి వేడి గా ఖాళీ కడుపుపై తాగాలి"
    ],
    animation: "https://assets9.lottiefiles.com/private_files/lf30_saujcahz.json",
    duration: "ప్రతి ఉదయం 30 రోజులు",
    precautions: "అధికంగా తీసుకుంటే పేగులలో మంటలు రావచ్చు",
    image : "/assets/ajwain.jpg"
  },
  {
    id: 3,
    title: "శుంఠి-ధనియాల కషాయం",
    description: "శరీరాన్ని వేడి ఉంచే మరియు జీర్ణానికి సహాయపడే కషాయం",
    benefits: [
      "వాయువు, వాపు తగ్గుతుంది",
      "జీర్ణక్రియ మెరుగుపడుతుంది",
      "వాపు నివారణ గుణాలు కలిగి ఉంటుంది",
      "శరీరంలో ఉష్ణతను పెంచుతుంది"
    ],
    ingredients: [
      "½ టీ స్పూన్ శుంఠి పొడి",
      "½ టీ స్పూన్ ధనియాల పొడి",
      "1.5 కప్పుల నీరు",
      "బెల్లం లేదా తేనె (ఐచ్చికంగా)"
    ],
    preparation: [
      "శుంఠి మరియు ధనియాల పొడిని నీటిలో వేసి మరిగించాలి",
      "10 నిమిషాలు మరిగించి, దాన్ని వడకట్టాలి",
      "తేనె లేదా బెల్లం కలిపి త్రాగవచ్చు",
      "రోజుకు రెండు సార్లు వేడిగా తాగాలి"
    ],
    animation: "https://assets7.lottiefiles.com/packages/lf20_q5pk6p1k.json",
    duration: "రోజూ రెండు సార్లు 3 వారాలు",
    precautions: "తీవ్ర పిత్త దోషం ఉన్నవారు జాగ్రత్తగా వాడాలి",
    image:'/assets/brew.jpg'
  }
],
  "kn-IN": [
  {
    id: 1,
    title: "ಗೋಲ್ಡನ್ ಮಿಲ್ಕ್ ಎಲಿಕ್ಸಿರ್",
    description: "ಪ್ರಸವದ ನಂತರದ ದೈಹಿಕ ಪುನಶ್ಚೇತನಕ್ಕೆ ಸಾಂಪ್ರದಾಯಿಕ ಆಯುರ್ವೇದ ಪಾನೀಯ",
    benefits: [
      "ರೋಗನಿರೋಧಕ ಶಕ್ತಿ ಮತ್ತು ಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ",
      "ಉರಿಯೂತವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ",
      "ಜೀರ್ಣಕ್ರಿಯೆ ಮತ್ತು ಸ್ತನ್ಯಪಾನಕ್ಕೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ",
      "ಶಾಂತಿದಾಯಕ ನಿದ್ರೆಯನ್ನು ಉತ್ತೇಜಿಸುತ್ತದೆ"
    ],
    ingredients: [
      "1 ಕಪ್ ಬೆಚ್ಚಗಿನ ಹಾಲು (ಹಸಿ ಹಾಲು ಅಥವಾ ಬಾದಾಮಿ ಹಾಲು)",
      "½ ಟೀಸ್ಪೂನ್ ಹಳದಿ ಪುಡಿ",
      "¼ ಟೀಸ್ಪೂನ್ ಶುಂಠಿ ಪುಡಿ",
      "ಸ್ವಲ್ಪ ಕಪ್ಪು ಮೆಣಸಿನ ಪುಡಿ",
      "1 ಟೀಸ್ಪೂನ್ ತುಪ್ಪ",
      "ಬೆಲ್ಲ ರುಚಿಗೆ ತಕ್ಕಂತೆ"
    ],
    preparation: [
      "ಹಾಲನ್ನು ನಿಧಾನವಾಗಿ ಬೆಚ್ಚಗಾಗಿಸಿ (ಕುದಿಸಬೇಡಿ)",
      "ಹಳದಿ, ಶುಂಠಿ ಮತ್ತು ಮೆಣಸಿನ ಪುಡಿಯನ್ನು ಮಿಶ್ರಣ ಮಾಡಿ",
      "ಇದನ್ನು ಹಾಲಿಗೆ ಸೇರಿಸಿ ಚೆನ್ನಾಗಿ ಕಲಸಿ",
      "ಕೊನೆಯಲ್ಲಿ ತುಪ್ಪ ಸೇರಿಸಿ",
      "ಮಲಗುವ ಮೊದಲು ಈ ಪಾನೀಯವನ್ನು ಕುಡಿಯಿರಿ"
    ],
    animation: "https://assets1.lottiefiles.com/packages/lf20_5itouocj.json",
    duration: "ನಿತ್ಯ 40 ದಿನಗಳು",
    precautions: "ಹಾಲಿಗೆ ಅಲರ್ಜಿ ಇದ್ದರೆ ತಿನ್ನಬಾರದು",
    image:'/assets/goldenmilk.jpg'
  },
  {
    id: 2,
    title: "ಒಮೊದ ನೀರು",
    description: "ಜೀರ್ಣಕ್ರಿಯೆ ಮತ್ತು ಗರ್ಭಾಶಯದ ಶುದ್ಧೀಕರಣಕ್ಕೆ ಉಪಯುಕ್ತ ಆಯುರ್ವೇದ ದ್ರವ್ಯ",
    benefits: [
      "ಜೀರ್ಣಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ",
      "ಅಜೀರ್ಣ ಮತ್ತು ಉಬ್ಬರೆಗೆ ಸಹಾಯಕ",
      "ದೇಹದ ಶಕ್ತಿ ಮತ್ತು ಗರ್ಭಾಶಯದ ಶುದ್ಧತೆಗೆ ನೆರವು",
      "ಮೆಟಾಬಾಲಿಸಂ ಅನ್ನು ಉತ್ತೇಜಿಸುತ್ತದೆ"
    ],
    ingredients: [
      "1 ಟೀಸ್ಪೂನ್ ಒಮೊ (ಅಜ್ವೈನ್) ಬೀಜ",
      "2 ಕಪ್ ನೀರು",
      "ತೇನೊ ಅಥವಾ ಬೆಲ್ಲ (ಐಚ್ಛಿಕ)"
    ],
    preparation: [
      "ಒಮೊ ಬೀಜಗಳನ್ನು 2 ಕಪ್ ನೀರಿನಲ್ಲಿ 5–7 ನಿಮಿಷಗಳವರೆಗೆ ಕುದಿಸಿ",
      "ಚೆನ್ನಾಗಿ ವಡಿಸಿ ಮತ್ತು ಬೇಕಾದರೆ ಬೆಲ್ಲ ಅಥವಾ ತೇನೊ ಸೇರಿಸಿ",
      "ಸೊಂಪು ಬಾಯಿಯಿಂದ, ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ಕುಡಿಯಿರಿ"
    ],
    animation: "https://assets9.lottiefiles.com/private_files/lf30_saujcahz.json",
    duration: "ಪ್ರತಿ ಬೆಳಗ್ಗೆ 30 ದಿನಗಳ ಕಾಲ",
    precautions: "ಅಧಿಕವಾದ ಪ್ರಮಾಣದಲ್ಲಿ ಸೇವಿಸಿದರೆ ಆಮ್ಲತೆ ಉಂಟಾಗಬಹುದು",
    image : "/assets/ajwain.jpg"
  },
  {
    id: 3,
    title: "ಶುಂಠಿ-ಕೊತ್ತಂಬರಿ ಕಷಾಯ",
    description: "ಹಸಿವು, ಉಬ್ಬರೆ ಮತ್ತು ಜೀರ್ಣತಂತ್ರ ವ್ಯವಸ್ಥೆ ಸುಧಾರಣೆಗೆ ಉಪಯುಕ್ತ ಕಷಾಯ",
    benefits: [
      "ಅಜೀರ್ಣ, ಗ್ಯಾಸು ಮತ್ತು ಉಬ್ಬರವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ",
      "ಪೆಟ್ಟಿನ ಆರೋಗ್ಯವನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ",
      "ಉರಿಯೂತ ನಿವಾರಕ ಗುಣಗಳಿದೆ",
      "ದೇಹವನ್ನು ಒಳಗಿನಿಂದ ಬಿಸಿ ಉಳಿತಾಯ ಮಾಡುತ್ತದೆ"
    ],
    ingredients: [
      "½ ಟೀಸ್ಪೂನ್ ಶುಂಠಿ ಪುಡಿ",
      "½ ಟೀಸ್ಪೂನ್ ಕೊತ್ತಂಬರಿ ಪುಡಿ",
      "1.5 ಕಪ್ ನೀರು",
      "ಬೆಲ್ಲ ಅಥವಾ ನಾಟಿ ಸಕ್ಕರೆ (ಐಚ್ಛಿಕ)"
    ],
    preparation: [
      "ಶುಂಠಿ ಮತ್ತು ಕೊತ್ತಂಬರಿ ಪುಡಿಯನ್ನು ನೀರಿಗೆ ಸೇರಿಸಿ ಕುದಿಸಿ",
      "10 ನಿಮಿಷಗಳ ಕಾಲ ನಿಧಾನವಾಗಿ ಕುದಿಸಿ",
      "ಚೆನ್ನಾಗಿ ವಡಿಸಿ",
      "ಬೆಲ್ಲ ಸೇರಿಸಿ ಬಿಸಿ ಬಿಸಿ ಕುಡಿಯಿರಿ"
    ],
    animation: "https://assets7.lottiefiles.com/packages/lf20_q5pk6p1k.json",
    duration: "3 ವಾರಗಳ ಕಾಲ ಬೆಳಿಗ್ಗೆ ಮತ್ತು ಸಂಜೆ",
    precautions: "ಪಿತ್ತದ ದೋಷವಿರುವವರು ಕಡಿಮೆ ಪ್ರಮಾಣದಲ್ಲಿ ತೆಗೆದುಕೊಳ್ಳುವುದು ಉತ್ತಮ",
    image:'/assets/brew.jpg'
  }
],
"mr-IN": [
  {
    id: 1,
    title: "गोल्डन मिल्क एलीक्सिर",
    description: "प्रसवोत्तर काळात शरीर सशक्त करणारे पारंपरिक आयुर्वेदिक पेय",
    benefits: [
      "प्रतिकारशक्ती व ऊर्जा वाढवते",
      "शरीरातील सूज कमी करते",
      "जठराग्नी सुधारते आणि स्तन्यपानास मदत करते",
      "चांगली झोप आणते"
    ],
    ingredients: [
      "1 कप गरम दूध (गायीचे किंवा बदामाचे)",
      "½ टीस्पून हळद पावडर",
      "¼ टीस्पून सुंठ पावडर",
      "चिमूटभर काळी मिरी पावडर",
      "1 टीस्पून तूप",
      "चवीनुसार गूळ"
    ],
    preparation: [
      "दूध सौम्य आचेवर गरम करा (उकळू नका)",
      "हळद, सुंठ आणि मिरी पावडर मिसळा",
      "हे मिश्रण गरम दुधात घालून ढवळा",
      "शेवटी तूप घालावे",
      "झोपण्याआधी गरम गरम प्यावे"
    ],
    animation: "https://assets1.lottiefiles.com/packages/lf20_5itouocj.json",
    duration: "दररोज ४० दिवस",
    precautions: "दुधास अ‍ॅलर्जी असल्यास टाळा",
    image:'/assets/goldenmilk.jpg'
  },
  {
    id: 2,
    title: "ओव्याचे पाणी",
    description: "पचनासाठी उपयुक्त आणि गर्भाशय साफ करणारे पेय",
    benefits: [
      "जठराग्नी सुधारतो",
      "गॅस व फुगवटा कमी होतो",
      "चयापचय वाढवतो",
      "गर्भाशयाची स्वच्छता सुधारतो"
    ],
    ingredients: [
      "1 टीस्पून ओवा (अजवाइन)",
      "2 कप पाणी",
      "हवे असल्यास मध"
    ],
    preparation: [
      "ओवा 2 कप पाण्यात 5–7 मिनिटे उकळा",
      "गाळून कपात ओता",
      "हवे असल्यास मध घालावे",
      "रिकाम्या पोटी गरम गरम प्यावे"
    ],
    animation: "https://assets9.lottiefiles.com/private_files/lf30_saujcahz.json",
    duration: "दररोज सकाळी ३० दिवस",
    precautions: "अतिसेवन केल्यास अ‍ॅसिडिटी होऊ शकते",
    image : "/assets/ajwain.jpg"
  },
  {
    id: 3,
    title: "सुंठ-धने काढा",
    description: "प्रसवोत्तर पचन सुधारण्यासाठी आणि सूज कमी करण्यासाठी आयुर्वेदिक काढा",
    benefits: [
      "गॅस व फुगवटा कमी करतो",
      "पचन सुधारतो",
      "अंतर्गत सूज कमी करतो",
      "शरीरात उष्णता वाढवतो"
    ],
    ingredients: [
      "½ टीस्पून सुंठ पावडर",
      "½ टीस्पून धने पावडर",
      "1.5 कप पाणी",
      "चवीनुसार गूळ"
    ],
    preparation: [
      "सुंठ व धने पाण्यात टाकून 10 मिनिटे उकळा",
      "गाळून कपात ओता",
      "चवीनुसार गूळ घालून गरम गरम प्यावे",
      "दिवसातून दोनदा प्यावे"
    ],
    animation: "https://assets7.lottiefiles.com/packages/lf20_q5pk6p1k.json",
    duration: "3 आठवडे, सकाळ-संध्याकाळ",
    precautions: "अतितप्त प्रकृती असलेल्या महिलांनी कमी प्रमाणात घ्यावे",
    image:'/assets/brew.jpg'
  }
],"bn-IN": [
  {
    id: 1,
    title: "গোল্ডেন মিল্ক এলিক্সার",
    description: "প্রসূতির পর শরীর সুস্থ করতে সহায়ক একটি প্রাচীন আয়ুর্বেদিক পানীয়",
    benefits: [
      "রোগপ্রতিরোধ ক্ষমতা এবং শক্তি বাড়ায়",
      "শরীরের ফোলা ও প্রদাহ কমায়",
      "হজম এবং স্তন্যদানে সহায়তা করে",
      "ভালো ঘুম আনতে সাহায্য করে"
    ],
    ingredients: [
      "১ কাপ উষ্ণ দুধ (গরু বা বাদামের)",
      "½ চা চামচ হলুদ গুঁড়া",
      "¼ চা চামচ শুকনো আদা গুঁড়া",
      "এক চিমটে গোলমরিচ গুঁড়া",
      "১ চা চামচ ঘি",
      "চিনি বা গুড় স্বাদমতো"
    ],
    preparation: [
      "দুধ হালকা আঁচে গরম করুন (ফোটাবেন না)",
      "হলুদ, আদা, ও গোলমরিচ গুঁড়া মিশিয়ে নিন",
      "গরম দুধে মিশ্রণটি দিয়ে নাড়ুন",
      "শেষে ঘি মেশান",
      "ঘুমানোর আগে গরম অবস্থায় পান করুন"
    ],
    animation: "https://assets1.lottiefiles.com/packages/lf20_5itouocj.json",
    duration: "৪০ দিন প্রতিদিন",
    precautions: "দুধে অ্যালার্জি থাকলে এড়িয়ে চলুন",
    image:'/assets/goldenmilk.jpg'
  },
  {
    id: 2,
    title: "অজওয়াইন জল",
    description: "হজম ও জরায়ুর পরিশুদ্ধির জন্য উপকারী পানীয়",
    benefits: [
      "হজম শক্তি বাড়ায়",
      "গ্যাস এবং ফোলাভাব কমায়",
      "দেহের বিপাকক্রিয়া উন্নত করে",
      "জরায়ুর পরিষ্কারে সহায়তা করে"
    ],
    ingredients: [
      "১ চা চামচ অজওয়াইন বীজ",
      "২ কাপ জল",
      "মধু (ঐচ্ছিক)"
    ],
    preparation: [
      "অজওয়াইন ২ কাপ জলে ৫–৭ মিনিট ফুটিয়ে নিন",
      "ছেঁকে একটি কাপে ঢালুন",
      "মধু মিশিয়ে খালি পেটে গরম অবস্থায় পান করুন"
    ],
    animation: "https://assets9.lottiefiles.com/private_files/lf30_saujcahz.json",
    duration: "প্রতিদিন সকালে ৩০ দিন",
    precautions: "অতিরিক্ত সেবনে গ্যাসট্রিক সমস্যা হতে পারে",
    image : "/assets/ajwain.jpg"
  },
  {
    id: 3,
    title: "আদা-ধনিয়া ক্বাথ",
    description: "হজমে সহায়ক এবং দেহকে গরম রাখে এমন আয়ুর্বেদিক ক্বাথ",
    benefits: [
      "অতিরিক্ত গ্যাস ও ফোলাভাব কমায়",
      "পাকপ্রণালির কার্যক্ষমতা বাড়ায়",
      "অন্তর্নিহিত প্রদাহ কমাতে সাহায্য করে",
      "ঠান্ডা প্রতিরোধ করে শরীর গরম রাখে"
    ],
    ingredients: [
      "½ চা চামচ শুকনো আদা গুঁড়া",
      "½ চা চামচ ধনিয়া গুঁড়া",
      "১.৫ কাপ জল",
      "গুড় বা মধু (ঐচ্ছিক)"
    ],
    preparation: [
      "আদা ও ধনিয়া গুঁড়া জলে দিয়ে ১০ মিনিট ফুটান",
      "ছেঁকে নিন ও প্রয়োজনে গুড় বা মধু মেশান",
      "সকালে ও সন্ধ্যায় খালি পেটে গরম অবস্থায় পান করুন"
    ],
    animation: "https://assets7.lottiefiles.com/packages/lf20_q5pk6p1k.json",
    duration: "প্রতিদিন ৩ সপ্তাহ, দিনে ২ বার",
    precautions: "যাদের শরীর খুব গরম হয়, তারা কম মাত্রায় গ্রহণ করুন",
    image:'/assets/brew.jpg'
  }
],
"gu-IN": [
  {
    id: 1,
    title: "ગોલ્ડન મિલ્ક ઇલિક્સિર",
    description: "પ્રસવ પછી શરીર સુધારવા માટેનું પરંપરાગત આયુર્વેદિક પેય",
    benefits: [
      "રોગપ્રતિકારક શક્તિ અને ઊર્જા વધારશે",
      "સોજો ઘટાડશે",
      "જઠરક્રિયા સુધારશે અને સ્તનપાનમાં સહાય કરશે",
      "સારો ઊંઘ લાવશે"
    ],
    ingredients: [
      "૧ કપ ઉકળેલ દુધ (ગાયનું અથવા બદામનું)",
      "½ ચમચી હળદર પાવડર",
      "¼ ચમચી સુંઠ પાવડર",
      "થોડીક કાળી મરી પાવડર",
      "૧ ચમચી ઘી",
      "સ્વાદ અનુસાર ગુળ"
    ],
    preparation: [
      "દૂધ ધીમી આંચ પર ગરમ કરો (ઉકાળો નહીં)",
      "સૂકા પદાર્થો એકસાથે મિક્સ કરો",
      "દૂધમાં મિક્સ કરો અને સારી રીતે ભેળવો",
      "અંતે ઘી ઉમેરો",
      "સૂતાં પહેલા ગરમ પી લો"
    ],
    animation: "https://assets1.lottiefiles.com/packages/lf20_5itouocj.json",
    duration: "દરરોજ ૪૦ દિવસ માટે",
    precautions: "દૂધની એલર્જી હોય તો ટાળો",
    image:'/assets/goldenmilk.jpg'
  },
  {
    id: 2,
    title: "અજમો પાણી",
    description: "જઠરક્રિયા સુધારવા અને ગરમાશ આપવા માટેનું આયુર્વેદિક ટોનિક",
    benefits: [
      "ગેસ અને ફૂલવો ઘટાડે છે",
      "જઠરક્રિયા સુધારે છે",
      "મેટાબોલિઝમ વધારે છે",
      "ઉજાળો આપે છે અને પુનઃશક્તિ આપે છે"
    ],
    ingredients: [
      "૧ ચમચી અજમો",
      "૨ કપ પાણી",
      "મધ (વૈકલ્પિક)"
    ],
    preparation: [
      "અજમો ૫-૭ મિનિટ માટે પાણીમાં ઉકાળો",
      "છાનીને પીઓ",
      "મીઠાસ માટે મધ ઉમેરો (જોઈતું હોય તો)",
      "સવારના ખાલી પેટે પીવો"
    ],
    animation: "https://assets9.lottiefiles.com/private_files/lf30_saujcahz.json",
    duration: "દરરોજ ૩૦ દિવસ",
    precautions: "ઘણું પીવાથી પેટમાં અગ્નિ થઈ શકે છે",
    image : "/assets/ajwain.jpg"
  },
  {
    id: 3,
    title: "સૂંઠ-ધાણા કઢો",
    description: "પાચનશક્તિ વધારતું અને ઠંડક ટાળતું આયુર્વેદિક કઢો",
    benefits: [
      "ગેસ અને જઠરગ્રંથિની સમસ્યા ઘટાડે છે",
      "સોજો ઘટાડે છે",
      "શરીરમાં ગરમાશ લાવે છે",
      "અંદરથી સાફ અને તંદુરસ્ત રાખે છે"
    ],
    ingredients: [
      "½ ચમચી સૂંઠ પાવડર",
      "½ ચમચી ધાણા પાવડર",
      "૧.૫ કપ પાણી",
      "ગૂળ અથવા મધ (વૈકલ્પિક)"
    ],
    preparation: [
      "પાણીમાં બન્ને પાવડર ઉમેરી ૧૦ મિનિટ સુધી ઉકાળો",
      "છાણી લો અને ગૂળ ઉમેરો",
      "સવાર-સાંજે ગરમ પીવો"
    ],
    animation: "https://assets7.lottiefiles.com/packages/lf20_q5pk6p1k.json",
    duration: "૩ અઠવાડિયા સુધી, રોજે ૨ વખત",
    precautions: "પિત્તવાળાને ઓછી માત્રામાં લેવો",
    image:'/assets/brew.jpg'
  }
],"ml-IN": [
  {
    id: 1,
    title: "ഗോൾഡൻ മിൽക്ക് എലിക്‌സിർ",
    description: "പ്രസവത്തിനുശേഷം പുനരുദ്ധാരത്തിനായി ഉപയോഗിക്കുന്ന ആയുര്‍വേദ പാനീയം",
    benefits: [
      "പ്രതിരോധശക്തിയും ഊർജ്ജവും വർദ്ധിപ്പിക്കുന്നു",
      "ശരീരത്തിലെ വേദനയും വീക്കവും കുറയ്ക്കുന്നു",
      "ജീർണ്ണവും മുലപ്പാലുണ്ടാകുന്നതിലും സഹായിക്കുന്നു",
      "നല്ല ഉറക്കത്തിന് സഹായിക്കുന്നു"
    ],
    ingredients: [
      "1 കപ്പ് ചൂടായ പാൽ (പശു അല്ലെങ്കിൽ ബദാം പാൽ)",
      "½ ടീസ്പൂൺ മഞ്ഞൾപൊടി",
      "¼ ടീസ്പൂൺ ഇഞ്ചി പൊടി",
      "ചുട്ട മുളകുപൊടി (ഒരു ചിട്ടിക)",
      "1 ടീസ്പൂൺ നെയ്യ്",
      "ചക്കര/ശർക്കര – രുചിക്ക് അനുസരിച്ച്"
    ],
    preparation: [
      "പാൽ ഇളക്കി ചൂടാക്കുക (മുഴുവൻ തിളക്കരുത്)",
      "മഞ്ഞൾ, ഇഞ്ചി, കുരുമുളക് പൊടി ചേർക്കുക",
      "ഇത് ചൂടായ പാലിൽ ചേർത്ത് നന്നായി കലർക്കുക",
      "അവസാനം നെയ്യ് ചേർക്കുക",
      "ഉറങ്ങുന്നതിന് മുമ്പ് ചൂടായി കുടിക്കുക"
    ],
    animation: "https://assets1.lottiefiles.com/packages/lf20_5itouocj.json",
    duration: "പ്രതിദിനം 40 ദിവസത്തേക്ക്",
    precautions: "പാലിനോടുള്ള അലർജിയുള്ളവർ ഒഴിവാക്കുക",
    image:'/assets/goldenmilk.jpg'
  },
  {
    id: 2,
    title: "അയമോദകം വെള്ളം",
    description: "ജീർണ്ണശക്തിയും ഗർഭാശയ ശുദ്ധിയ്ക്കുമായി ഉപയോഗിക്കുന്ന പാനീയം",
    benefits: [
      "ഗ്യാസും അഴിച്ചിളക്കവും കുറയ്ക്കുന്നു",
      "ജീർണ്ണശക്തി വർദ്ധിപ്പിക്കുന്നു",
      "മേഹ സംരഭം സുഗമമാക്കുന്നു",
      "ശരീരത്തോട് ചൂട് നൽകുന്നു"
    ],
    ingredients: [
      "1 ടീസ്പൂൺ അയമോദകം (അജ്വൈൻ) വിത്ത്",
      "2 കപ്പ് വെള്ളം",
      "തേൻ (ഐച്ഛികം)"
    ],
    preparation: [
      "അയമോദകം 2 കപ്പ് വെള്ളത്തിൽ 5-7 മിനിറ്റ് തിളപ്പിക്കുക",
      "ശേഷം കളയുക, ആവശ്യമെങ്കിൽ തേൻ ചേർക്കുക",
      "രാവിലെ, വിശപ്പോടെ കുടിക്കുക"
    ],
    animation: "https://assets9.lottiefiles.com/private_files/lf30_saujcahz.json",
    duration: "പ്രതിദിനം 30 ദിവസം",
    precautions: "അധികം കുടിക്കരുത് – ഗാസ്ട്രിക് പ്രശ്നങ്ങൾ ഉണ്ടാകാം",
    image : "/assets/ajwain.jpg"
  },
  {
    id: 3,
    title: "ഇഞ്ചി-മല്ലി കഷായം",
    description: "ശരീരത്തിന് ചൂട് നൽകുകയും പാചകശക്തി കൂട്ടുകയും ചെയ്യുന്ന കഷായം",
    benefits: [
      "അജീർണ്ണം, വാതം, പല്ലിവേദന എന്നിവയ്ക്കുള്ള മികച്ച പരിഹാരം",
      "ഉൾവേദന കുറയ്ക്കുന്നു",
      "ശരീരം ചൂടായി നിലനിർത്തുന്നു",
      "പ്രസവാനന്തര പുനഃസ്ഥാപനം വേഗപ്പെടുത്തുന്നു"
    ],
    ingredients: [
      "½ ടീസ്പൂൺ ഇഞ്ചിപ്പൊടി",
      "½ ടീസ്പൂൺ മല്ലിപ്പൊടി",
      "1.5 കപ്പ് വെള്ളം",
      "ശർക്കര അല്ലെങ്കിൽ തേൻ (ഐച്ഛികം)"
    ],
    preparation: [
      "ഇഞ്ചി, മല്ലി പൊടി വെള്ളത്തിൽ ചേർത്ത് 10 മിനിറ്റ് തിളപ്പിക്കുക",
      "ശേഷം കളഞ്ഞ് ശർക്കര ചേർത്ത് ചൂടായി കുടിക്കുക",
      "പ്രതിദിനം രാവിലെയും വൈകുന്നേരവും കുടിക്കുക"
    ],
    animation: "https://assets7.lottiefiles.com/packages/lf20_q5pk6p1k.json",
    duration: "3 ആഴ്ചകൾ, ദിവസേന 2 പ്രാവശ്യം",
    precautions: "പിത്തം കൂടുന്നവരുടെ അതിരുവിട്ട ഉപയോഗം ഒഴിവാക്കുക",
    image:'/assets/brew.jpg'
  }
],"pa-IN": [
  {
    id: 1,
    title: "ਗੋਲਡਨ ਮਿਲਕ ਇਲਿਕਸਿਰ",
    description: "ਡਿਲਿਵਰੀ ਤੋਂ ਬਾਅਦ ਸਰੀਰ ਦੀ ਉਤਸ਼ਾਹਨਾ ਲਈ ਰਵਾਇਤੀ ਆਯੁਰਵੇਦਿਕ ਪੀਣਯੋਗ",
    benefits: [
      "ਰੋਗ ਪ੍ਰਤੀਰੋਧਕ ਤਾਕਤ ਅਤੇ ਊਰਜਾ ਵਧਾਉਂਦਾ ਹੈ",
      "ਸੋਜਸ਼ ਘਟਾਉਂਦਾ ਹੈ",
      "ਹਜ਼ਮ ਕਰਨ ਅਤੇ ਦੁੱਧ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦਗਾਰ",
      "ਚੰਗੀ ਨੀਂਦ ਲਈ ਮਦਦਗਾਰ"
    ],
    ingredients: [
      "1 ਕੱਪ ਗਰਮ ਦੁੱਧ (ਗਾਂ ਦਾ ਜਾਂ ਬਦਾਮ ਦਾ)",
      "½ ਚਮਚੀ ਹਲਦੀ ਪਾਉਡਰ",
      "¼ ਚਮਚੀ ਸੁੱਕੀ ਅਦਰਕ ਪਾਉਡਰ",
      "ਇੱਕ ਚੁਟਕੀ ਕਾਲੀ ਮਿਰਚ",
      "1 ਚਮਚੀ ਘੀ",
      "ਸਵਾਦ ਅਨੁਸਾਰ ਗੁੜ ਜਾਂ ਸ਼ੱਕਰ"
    ],
    preparation: [
      "ਦੁੱਧ ਹੌਲੀ ਅੱਗ ਉੱਤੇ ਗਰਮ ਕਰੋ (ਉਬਾਲੋ ਨਾ)",
      "ਹਲਦੀ, ਅਦਰਕ, ਤੇ ਕਾਲੀ ਮਿਰਚ ਪਾਓਡਰ ਮਿਲਾਓ",
      "ਇਹ ਮਿਲਾਵਟ ਗਰਮ ਦੁੱਧ ਵਿੱਚ ਪਾਓ ਅਤੇ ਚੰਗੀ ਤਰ੍ਹਾਂ ਹਿਲਾਓ",
      "ਆਖ਼ਰੀ 'ਚ ਘੀ ਪਾਓ",
      "ਸੁੱਤਣ ਤੋਂ ਪਹਿਲਾਂ ਗਰਮ-ਗਰਮ ਪੀਓ"
    ],
    animation: "https://assets1.lottiefiles.com/packages/lf20_5itouocj.json",
    duration: "ਰੋਜ਼ਾਨਾ 40 ਦਿਨਾਂ ਲਈ",
    precautions: "ਜੇ ਤੁਸੀਂ ਦੁੱਧ ਨਾਲ ਐਲਰਜਿਕ ਹੋ ਤਾਂ ਨਾ ਪੀਓ",
    image:'/assets/goldenmilk.jpg'
  },
  {
    id: 2,
    title: "ਅਜਵਾਇਨ ਦਾ ਪਾਣੀ",
    description: "ਜਠਰਗਤ ਸਿਹਤ ਅਤੇ ਗਰਭਾਸ਼ਯ ਸਫਾਈ ਲਈ ਆਯੁਰਵੇਦਿਕ ਟੋਨਿਕ",
    benefits: [
      "ਗੈਸ ਅਤੇ ਅਫ਼ਾਰ ਘਟਾਉਂਦਾ ਹੈ",
      "ਹਜ਼ਮ ਕਰਨ ਦੀ ਸਮਰੱਥਾ ਵਧਾਉਂਦਾ ਹੈ",
      "ਸਰੀਰ ਨੂੰ ਗਰਮੀ ਦਿੰਦਾ ਹੈ",
      "ਜੀਵਣਸ਼ਕਤੀ ਵਧਾਉਂਦਾ ਹੈ"
    ],
    ingredients: [
      "1 ਚਮਚੀ ਅਜਵਾਇਨ",
      "2 ਕੱਪ ਪਾਣੀ",
      "ਮਧੁ (ਚਾਹੁੰਦੇ ਹੋਵੋ ਤਾਂ)"
    ],
    preparation: [
      "ਅਜਵਾਇਨ ਨੂੰ 5–7 ਮਿੰਟ ਲਈ ਪਾਣੀ ਵਿੱਚ ਉਬਾਲੋ",
      "ਪਾਣੀ ਛਾਣ ਲਵੋ",
      "ਮਧੁ ਮਿਲਾ ਕੇ, ਸਵੇਰੇ ਖਾਲੀ ਪੇਟ ਪੀਓ"
    ],
    animation: "https://assets9.lottiefiles.com/private_files/lf30_saujcahz.json",
    duration: "ਰੋਜ਼ ਸਵੇਰੇ 30 ਦਿਨ",
    precautions: "ਵੱਧ ਖਪਤ ਨਾਲ ਅਮਲ, ਅਜੀਰਨ ਹੋ ਸਕਦਾ ਹੈ",
    image : "/assets/ajwain.jpg"
  },
  {
    id: 3,
    title: "ਸੌਂਠ-ਧਣੀਆ ਕਾਢਾ",
    description: "ਜਠਰਗਤ ਸੁਧਾਰ ਅਤੇ ਸਰੀਰ ਨੂੰ ਤਪਤ ਰੱਖਣ ਲਈ ਰਵਾਇਤੀ ਆਯੁਰਵੇਦਿਕ ਕਾਢਾ",
    benefits: [
      "ਅੰਦਰੂਨੀ ਸੋਜ ਘਟਾਉਂਦਾ ਹੈ",
      "ਪਚਨ ਤੰਤਰ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਦਾ ਹੈ",
      "ਸਰੀਰ ਨੂੰ ਗਰਮੀ ਦਿੰਦਾ ਹੈ",
      "ਥਕਾਵਟ ਘਟਾਉਂਦਾ ਹੈ"
    ],
    ingredients: [
      "½ ਚਮਚੀ ਸੌਂਠ ਪਾਊਡਰ",
      "½ ਚਮਚੀ ਧਣੀਆ ਪਾਊਡਰ",
      "1.5 ਕੱਪ ਪਾਣੀ",
      "ਸਵਾਦ ਅਨੁਸਾਰ ਗੁੜ ਜਾਂ ਮਧੁ"
    ],
    preparation: [
      "ਸੌਂਠ ਤੇ ਧਣੀਆ ਪਾਓਡਰ ਪਾਣੀ ਵਿੱਚ ਪਾਓ ਤੇ 10 ਮਿੰਟ ਉਬਾਲੋ",
      "ਛਾਣੋ ਤੇ ਚਾਹੁੰਦੇ ਹੋਵੋ ਤਾਂ ਮਧੁ ਪਾਓ",
      "ਸਵੇਰੇ ਤੇ ਸ਼ਾਮ ਨੂੰ ਗਰਮ ਕਰਕੇ ਪੀਓ"
    ],
    animation: "https://assets7.lottiefiles.com/packages/lf20_q5pk6p1k.json",
    duration: "3 ਹਫਤੇ, ਦਿਨ ਵਿੱਚ 2 ਵਾਰੀ",
    precautions: "ਜਿਨ੍ਹਾਂ ਨੂੰ ਪਿੱਤ ਵਧਦਾ ਹੈ ਉਹ ਘੱਟ ਵਰਤੋਂ ਕਰੋ",
    image:'/assets/brew.jpg'
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
          setStreak(docSnap.streak || 0); 
          setLanguage(docSnap.data().language || 'en-IN');
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
      {/* ✅ Navbar placed here */}
      <Navbar title={t.title} streak={streak} lang={language} />

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
      </div>
    </div>
  );
};

export default PostAyurveda;