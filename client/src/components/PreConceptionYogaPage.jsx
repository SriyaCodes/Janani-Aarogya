import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Player } from '@lottiefiles/react-lottie-player';
import { FaRegClock, FaSeedling } from 'react-icons/fa';

const PreConceptionYogaPage = () => {
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState('en-IN');
  const auth = getAuth();

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
    title: 'Fertility-Boosting Butterfly Pose',
    benefits: [
      'Stimulates reproductive organs',
      'Improves blood flow to pelvis',
      'Reduces stress hormones',
      'Balances menstrual cycle'
    ],
    duration: '5 mins',
    level: 'Beginner',
    category: 'fertility',
    steps: [
      'Sit with soles of feet together',
      'Hold ankles and gently flap knees',
      'Inhale: Lengthen spine upward',
      'Exhale: Fold forward slightly',
      'Continue for 20-30 flaps'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'Avoid if you have hip injuries'
  },
  {
    id: 2,
    title: 'Hormone-Balancing Bridge Pose',
    benefits: [
      'Stimulates thyroid and pelvic organs',
      'Strengthens glutes and lower back',
      'Improves hormone regulation',
      'Reduces mild depression'
    ],
    duration: '3–4 mins',
    level: 'Beginner',
    category: 'hormonal',
    steps: [
      'Lie on your back with knees bent and feet hip-width apart',
      'Arms by your side, palms down',
      'Inhale and lift hips slowly off the floor',
      'Hold the position for 3–5 breaths',
      'Exhale and gently lower down'
    ],
    animation: 'https://assets9.lottiefiles.com/private_files/lf30_editor_zckc9auu.json',
    precautions: 'Avoid if you have recent neck or back injury'
  },
  {
    id: 3,
    title: 'Relaxing Reclined Bound Angle Pose',
    benefits: [
      'Opens hips and inner thighs',
      'Reduces stress and fatigue',
      'Encourages reproductive organ circulation',
      'Supports nervous system relaxation'
    ],
    duration: '7 mins',
    level: 'All Levels',
    category: 'relaxation',
    steps: [
      'Lie on your back with soles of feet together and knees dropped to sides',
      'Support knees with pillows if needed',
      'Place hands on belly or sides comfortably',
      'Close eyes and breathe slowly',
      'Hold the pose for several minutes'
    ],
    animation: 'https://assets7.lottiefiles.com/packages/lf20_5vfzbt7e.json',
    precautions: 'Use bolster under back if you feel strain'
  }
],'hi-IN': [
  {
    id: 1,
    title: 'प्रजनन बढ़ाने वाला तितली आसन',
    benefits: [
      'प्रजनन अंगों को उत्तेजित करता है',
      'श्रोणि में रक्त प्रवाह में सुधार करता है',
      'तनाव हार्मोन को कम करता है',
      'मासिक धर्म चक्र को संतुलित करता है'
    ],
    duration: '5 मिनट',
    level: 'शुरुआती',
    category: 'fertility',
    steps: [
      'पैरों के तलवे मिलाकर बैठें',
      'टखनों को पकड़ें और घुटनों को धीरे-धीरे फड़फड़ाएं',
      'सांस लें: रीढ़ को ऊपर की ओर लंबा करें',
      'सांस छोड़ें: हल्का आगे झुकें',
      '20-30 बार दोहराएं'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'यदि कूल्हे में चोट हो तो न करें'
  },
  {
    id: 2,
    title: 'हार्मोन संतुलन ब्रिज पोज़',
    benefits: [
      'थायरॉयड और श्रोणि अंगों को सक्रिय करता है',
      'पेट, पीठ और नितंबों को मजबूत करता है',
      'हार्मोनल संतुलन में सुधार करता है',
      'हल्के अवसाद को कम करता है'
    ],
    duration: '3–4 मिनट',
    level: 'शुरुआती',
    category: 'hormonal',
    steps: [
      'पीठ के बल लेट जाएं और घुटनों को मोड़ें, पैर कूल्हे की चौड़ाई पर रखें',
      'बाँहें शरीर के पास, हथेलियाँ नीचे की ओर',
      'सांस लेते हुए धीरे-धीरे कूल्हों को ऊपर उठाएं',
      '3–5 सांसों तक स्थिति बनाए रखें',
      'सांस छोड़ते हुए धीरे से नीचे लाएं'
    ],
    animation: 'https://assets9.lottiefiles.com/private_files/lf30_editor_zckc9auu.json',
    precautions: 'यदि गर्दन या पीठ में हाल ही में चोट लगी हो तो न करें'
  },
  {
    id: 3,
    title: 'आरामदायक सुप्त बद्ध कोण आसन',
    benefits: [
      'कूल्हों और अंदरूनी जांघों को खोलता है',
      'तनाव और थकान को कम करता है',
      'प्रजनन अंगों में रक्त संचार को प्रोत्साहित करता है',
      'तंत्रिका तंत्र को शांत करता है'
    ],
    duration: '7 मिनट',
    level: 'सभी स्तर',
    category: 'relaxation',
    steps: [
      'पीठ के बल लेट जाएं, पैरों के तलवे आपस में मिलाएं और घुटनों को बगल में गिरने दें',
      'आवश्यक हो तो घुटनों के नीचे तकिए रखें',
      'हाथों को पेट या बगल में आराम से रखें',
      'आंखें बंद करें और धीरे-धीरे सांस लें',
      'इस स्थिति में कुछ मिनट तक रहें'
    ],
    animation: 'https://assets7.lottiefiles.com/packages/lf20_5vfzbt7e.json',
    precautions: 'यदि पीठ में तनाव महसूस हो तो बॉल्स्टर का उपयोग करें'
  }
],'ta-IN': [
  {
    id: 1,
    title: 'கருப்பை வளர்க்கும் பட்டாம்பூச்சி ஆசனம்',
    benefits: [
      'மடியுறுப்பு உறுப்புகளை தூண்டுகிறது',
      'முதுகுத்தண்டில் இரத்த ஓட்டத்தை மேம்படுத்துகிறது',
      'மன அழுத்த ஹார்மோன்களை குறைக்கிறது',
      'மாதவிடாய் சுழற்சியை சீராக்குகிறது'
    ],
    duration: '5 நிமிடங்கள்',
    level: 'தொடக்கநிலை',
    category: 'fertility',
    steps: [
      'பாதங்களை ஒன்றாக இணைத்து உட்காரவும்',
      'கணுக்கால்களை பிடித்து மெதுவாக முழங்கால்களை அசைக்கவும்',
      'மூச்சை இழுத்துக் கொள்ளவும்: முதுகெலும்பை நீட்டவும்',
      'மூச்சுவிடவும்: சிறிது முன்னே சாயவும்',
      '20-30 முறை செய்யவும்'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'இடுப்பு பகுதியில் காயம் இருந்தால் தவிர்க்கவும்'
  },
  {
    id: 2,
    title: 'ஹார்மோன் சமநிலை பிரிட்ஜ் ஆசனம்',
    benefits: [
      'தைராய்டு மற்றும் இடுப்புப் பகுதிகளை தூண்டும்',
      'கழுத்துப் பகுதியில் உள்ள தசைகளை பலப்படுத்தும்',
      'ஹார்மோன்கள் சீராக செயல்பட உதவும்',
      'மிதமான மன அழுத்தத்தை குறைக்கும்'
    ],
    duration: '3–4 நிமிடங்கள்',
    level: 'தொடக்கநிலை',
    category: 'hormonal',
    steps: [
      'முனைகள் மடக்கப்பட்ட நிலையில் முதுகில் படுத்துக்கொள்ளவும்',
      'கைகள் பக்கத்தில், உள்ளங்கைகள் தரையில் இருக்க வேண்டும்',
      'மூச்சை இழுத்துக்கொள்ளவும்: நெஞ்சையும் இடுப்பையும் மெதுவாக தூக்கவும்',
      '3–5 மூச்சுகள் வரை நிலையைத் தக்கவைக்கவும்',
      'மூச்சுவிட்டு மெதுவாக கீழே இறக்கவும்'
    ],
    animation: 'https://assets9.lottiefiles.com/private_files/lf30_editor_zckc9auu.json',
    precautions: 'முதுகு அல்லது கழுத்து காயமுள்ளவர்கள் தவிர்க்க வேண்டும்'
  },
  {
    id: 3,
    title: 'இளைப்பாறும் படுத்த வட்டமான கோணம் ஆசனம்',
    benefits: [
      'இடுப்புகள் மற்றும் உள் தொடைகளைக் களிறு செய்கிறது',
      'மனஅழுத்தம் மற்றும் சோர்வைக் குறைக்கிறது',
      'கருப்பை உறுப்புகளில் இரத்த ஓட்டத்தை ஊக்குவிக்கிறது',
      'நரம்பியல் அமைப்பை நிதானப்படுத்துகிறது'
    ],
    duration: '7 நிமிடங்கள்',
    level: 'எல்லா நிலைகளும்',
    category: 'relaxation',
    steps: [
      'பின் படுத்து, பாதங்கள் ஒன்றோடொன்று இணைக்கவும், முழங்கால்கள் பக்கங்களில் சாயவும்',
      'முழங்கால்களுக்கு கீழே துணி அல்லது தலையணை வைக்கவும்',
      'கைகளை வயிறு அல்லது பக்கங்களில் வைத்துக் கொள்ளவும்',
      'கண்களை மூடி மெதுவாக மூச்சுவிடவும்',
      'இந்த நிலையில் சில நிமிடங்கள் இருப்பதுதான் சிறந்தது'
    ],
    animation: 'https://assets7.lottiefiles.com/packages/lf20_5vfzbt7e.json',
    precautions: 'பின்னால் அழுத்தம் இருந்தால் பேலஸ்டர் பயன்படுத்தலாம்'
  }
],'te-IN': [
  {
    id: 1,
    title: 'ఫెర్టిలిటీ పెంచే బటర్‌ఫ్లై పోజ్',
    benefits: [
      'పునరుత్పత్తి అవయవాలను ఉత్తేజింపజేస్తుంది',
      'పెల్విస్ ప్రాంతానికి రక్త ప్రవాహాన్ని మెరుగుపరుస్తుంది',
      'స్ట్రెస్ హార్మోన్‌లను తగ్గిస్తుంది',
      'మాసిక చక్రాన్ని సమతుల్యం చేస్తుంది'
    ],
    duration: '5 నిమిషాలు',
    level: 'ప్రారంభ స్థాయి',
    category: 'fertility',
    steps: [
      'పాదాలను కలిపి కూర్చోండి',
      'కాలి చీలికలను పట్టుకుని మోకాలిని నెమ్మదిగా కొట్టండి',
      'ఆస్వాసం తీసుకోండి: వెన్నెముకను నేరుగా ఉంచండి',
      'నిష్వాసం వదలండి: స్వల్పంగా ముందుకు వంగండి',
      '20-30 సార్లు పునరావృతం చేయండి'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'నడుము లేదా కూర్మం సమస్య ఉంటే నివారించాలి'
  },
  {
    id: 2,
    title: 'హార్మోన్ బ్యాలెన్స్ బ్రిడ్జ్ ఆసనం',
    benefits: [
      'థైరాయిడ్ మరియు పెల్విక్ అవయవాలను ఉత్తేజితంగా ఉంచుతుంది',
      'గ్లూట్స్ మరియు దిగువ వెన్నెముకను బలపరుస్తుంది',
      'హార్మోన్ నియంత్రణను మెరుగుపరుస్తుంది',
      'తేలికపాటి డిప్రెషన్‌ను తగ్గిస్తుంది'
    ],
    duration: '3–4 నిమిషాలు',
    level: 'ప్రారంభ స్థాయి',
    category: 'hormonal',
    steps: [
      'పట్టికపై వెన్నుపై నిద్రించండి, మోకాలును మడిచి పాదాలను నడుముగా ఉంచండి',
      'చేతులు మీ పక్కన, చేతుల పైభాగం నేలపై ఉంచండి',
      'ఆస్వాసం తీసుకుంటూ నెమ్మదిగా నితంబాలను పైకి ఎత్తండి',
      '3–5 శ్వాసల పాటు కదలకుండా ఉండండి',
      'నిష్వాసం వదిలి మళ్లీ కిందకి వంగండి'
    ],
    animation: 'https://assets9.lottiefiles.com/private_files/lf30_editor_zckc9auu.json',
    precautions: 'తాజాగా మెడ లేదా వెన్నెముక గాయమైతే చేయకండి'
  },
  {
    id: 3,
    title: 'విశ్రాంతి పడుకొని బౌండ్ యాంగిల్ పోజ్',
    benefits: [
      'నితంబాలు మరియు లోపలి తొడల మైకాన్ని పెంచుతుంది',
      'ఉద్రిక్తత మరియు అలసటను తగ్గిస్తుంది',
      'పునరుత్పత్తి అవయవాల్లో రక్త ప్రసరణను పెంచుతుంది',
      'నాడీ వ్యవస్థను శాంతపరుస్తుంది'
    ],
    duration: '7 నిమిషాలు',
    level: 'అన్ని స్థాయిలు',
    category: 'relaxation',
    steps: [
      'వెనుక పడుకొని, పాదాలను కలిపి మోకాలును పక్కకు వదిలేయండి',
      'కనుక అవసరమైతే మోకాలుకింద దిండు లేదా గద్దను వుంచండి',
      'చేతులను పొట్టపై లేదా పక్కన ఉంచండి',
      'కళ్లను మూసి నెమ్మదిగా శ్వాస తీసుకోండి',
      'ఈ స్థితిలో కొన్ని నిమిషాలు ఉండండి'
    ],
    animation: 'https://assets7.lottiefiles.com/packages/lf20_5vfzbt7e.json',
    precautions: 'వెనుక బరువు అనిపిస్తే ప్యాడ్ లేదా గద్దను వాడండి'
  }
],'kn-IN': [
  {
    id: 1,
    title: 'ಸಂತಾನೋತ್ಪತ್ತಿಗೆ ನೆರವಿರುವ ಬಟರ್ಫ್ಲೈ ಆಸನ',
    benefits: [
      'ಪುನರುತ್ಪಾದನಾ ಅಂಗಗಳನ್ನು ಉತ್ಸಾಹಪಡಿಸುತ್ತದೆ',
      'ಶ್ರೋಣಿಭಾಗದ ರಕ್ತ ಸಂಚಾರವನ್ನು ಉತ್ತಮಗೊಳಿಸುತ್ತದೆ',
      'ಮನಃಸ್ಥಿತಿಗೆ ಕಾರಣವಾಗುವ ಹಾರ್ಮೋನ್‌ಗಳನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ',
      'ಮಾಸಿಕ ಧರ್ಮ ಚಕ್ರವನ್ನು ಸಮತೋಲನದಲ್ಲಿಡುತ್ತದೆ'
    ],
    duration: '5 ನಿಮಿಷಗಳು',
    level: 'ಪ್ರಾರಂಭಿಕ',
    category: 'fertility',
    steps: [
      'ಪಾದಗಳನ್ನು ಒಂದಕ್ಕೊಂದು ಸೇರಿಸಿ ಕುಳಿತುಕೊಳ್ಳಿ',
      'ಕಾಲಿನ ಗುಟ್ಟುಗುಟ್ಟಲುಗಳನ್ನು ಹಿಡಿದು ಮಂಡಿಗಳನ್ನು ನಿಧಾನವಾಗಿ ಫಡಫಡಿಸಿ',
      'ಶ್ವಾಸ ತೆಗೆದುಕೊಳ್ಳಿ: ನಡುರಿಗೆ ಬೆನ್ನು ನೇರವಾಗಿ ಮಾಡಿ',
      'ಉಸಿರೆಳೆಯುತ್ತಾ: ಸ್ವಲ್ಪ ಮುಂದಕ್ಕೆ ವಾಲಿ',
      '20-30 ಬಾರಿ ಪುನರಾವರ್ತಿಸಿ'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'ನಡುರಿನ ಗಾಯವಿದ್ದರೆ ಈ ಆಸನವನ್ನ ತಪ್ಪಿಸಿ'
  },
  {
    id: 2,
    title: 'ಹಾರ್ಮೋನ್ ಸಮತೋಲನದ ಬ್ರಿಡ್ಜ್ ಆಸನ',
    benefits: [
      'ಥೈರಾಯ್ಡ್ ಮತ್ತು ಶ್ರೋಣಿಭಾಗದ ಅಂಗಗಳನ್ನು ಉತ್ಸಾಹಗೊಳಿಸುತ್ತದೆ',
      'ಕೂದಲು ಮತ್ತು ಕೆಳಬೆನ್ನು ಬಲಪಡಿಸುತ್ತದೆ',
      'ಹಾರ್ಮೋನ್ ನಿಯಂತ್ರಣವನ್ನು ಸುಧಾರಿಸುತ್ತದೆ',
      'ಸುಮಾರು ಮಾನಸಿಕ ಒತ್ತಡವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ'
    ],
    duration: '3–4 ನಿಮಿಷಗಳು',
    level: 'ಪ್ರಾರಂಭಿಕ',
    category: 'hormonal',
    steps: [
      'ಹಾಸಿಗೆಯ ಮೇಲೆ ಬೆನ್ನು ಬದಲಾಗಿ ಮಲಗಿಕೊಳ್ಳಿ, ಗುಡ್ಡಗಳನ್ನು ಮಡಚಿ, ಪಾದಗಳನ್ನು ಹಿಪ್ ಅಗಲದಲ್ಲಿ ಇರಿಸಿ',
      'ಬಲಕ್ಕೆ ಕೈಗಳನ್ನು ಇಡಿ, ತಲೆಯ ಮೇಲೆ ಅಥವಾ ಪಕ್ಕದಲ್ಲಿ ಇಡಿ',
      'ಉಸಿರಾಡಿ: ನಿಧಾನವಾಗಿ ನಿತಂಬವನ್ನು ಮೇಲಕ್ಕೆ ಎತ್ತಿ',
      '3–5 ಉಸಿರಿನವರೆಗೆ ಸ್ಥಿತಿಯಲ್ಲಿ ಇರಿ',
      'ಉಸಿರೆಳೆಯುತ್ತಾ ನಿಧಾನವಾಗಿ ಕೆಳಕ್ಕೆ ಇಳಿಸಿ'
    ],
    animation: 'https://assets9.lottiefiles.com/private_files/lf30_editor_zckc9auu.json',
    precautions: 'ಬೆ recente back ಅಥವಾ ಮೆದೇಗೆ ಗಾಯವಿದ್ದರೆ ತಪ್ಪಿಸಿ'
  },
  {
    id: 3,
    title: 'ಆರಾಮದಾಯಕ ಬೌಂಡ್ ಆಂಗಲ್ ಶಾಯಿತ ಆಸನ',
    benefits: [
      'ನಿತಂಬ ಮತ್ತು ಅಂತರ್ನಾಡಿ ತುದಿಗಳನ್ನು ತೆರೆದುತ್ತದೆ',
      'ಒತ್ತಡ ಮತ್ತು ಆಯಾಸವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ',
      'ಪುನರುತ್ಪಾದನಾ ಅಂಗಗಳಲ್ಲಿ ರಕ್ತ ಪ್ರವಾಹವನ್ನು ಉತ್ತೇಜಿಸುತ್ತದೆ',
      'ನರ ವ್ಯವಸ್ಥೆಗೆ ಶಾಂತಿಯನ್ನು ನೀಡುತ್ತದೆ'
    ],
    duration: '7 ನಿಮಿಷಗಳು',
    level: 'ಎಲ್ಲಾ ಮಟ್ಟಗಳು',
    category: 'relaxation',
    steps: [
      'ಹಾಸಿಗೆಯ ಮೇಲೆ ಬೆನ್ನಿಗೆ ಮಲಗಿ, ಪಾದಗಳನ್ನು ಒಂದಕ್ಕೊಂದು ಸೇರಿಸಿ ಮಡಕಿದ ಮಂಡಿಗಳನ್ನು ಬದಿಗೆ ಬಿಡಿ',
      'ಅಗತ್ಯವಿದ್ದರೆ ಮಡಕಿದ ಮಡಿಗಳ ಕೆಳಗೆ ಹಾಸಿಗೆ ಅಥವಾ ತಲೆಯನು ಇಡಿ',
      'ಕೈಗಳನ್ನು ಹೊಟ್ಟೆಯ ಮೇಲೆ ಅಥವಾ ಬದಿಗೆ ಇಡಿ',
      'ಕಣ್ಣನ್ನು ಮುಚ್ಚಿ ನಿಧಾನವಾಗಿ ಉಸಿರಾಡಿ',
      'ಈ ಸ್ಥಿತಿಯಲ್ಲಿ ಕೆಲವು ನಿಮಿಷಗಳ ಕಾಲ ಇರಿ'
    ],
    animation: 'https://assets7.lottiefiles.com/packages/lf20_5vfzbt7e.json',
    precautions: 'ಬದಿಯಲ್ಲಿ ನೋವಿದ್ದರೆ ಬೆನ್ನಿಗಡಿ ದಿಂಬು ಬಳಸಿ'
  }
],'mr-IN': [
  {
    id: 1,
    title: 'फलप्रद बटरफ्लाय आसन',
    benefits: [
      'प्रजनन अवयवांना उत्तेजित करते',
      'श्रोणीमध्ये रक्तप्रवाह वाढवते',
      'तणाव हार्मोन्स कमी करते',
      'मासिक पाळीचा चक्र संतुलित करते'
    ],
    duration: '5 मिनिटे',
    level: 'प्रारंभिक',
    category: 'fertility',
    steps: [
      'पायांच्या तळव्यांना एकत्र करून बसा',
      'घोट्यांना पकडून गुडघे हलक्या फडफडवून हालवा',
      'श्वास घ्या: पाठीचा कणा सरळ करा',
      'श्वास सोडा: थोडेसे पुढे वाका',
      '20-30 वेळा करा'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'जर कंबरेत दुखत असेल तर हे आसन टाळा'
  },
  {
    id: 2,
    title: 'हॉर्मोन संतुलनासाठी ब्रिज आसन',
    benefits: [
      'थायरॉईड व श्रोणि अवयवांना उत्तेजन देते',
      'नितंब आणि खालच्या पाठीस बळकटी देते',
      'हॉर्मोन्सचे संतुलन राखते',
      'हलक्या नैराश्यावर मात करते'
    ],
    duration: '3–4 मिनिटे',
    level: 'प्रारंभिक',
    category: 'hormonal',
    steps: [
      'पाठीवर झोपा, गुडघे वाकवून पाय कूल्ह्याच्या अंतरावर ठेवा',
      'हात शरीराजवळ, तळहात जमिनीवर ठेवा',
      'श्वास घेत वरती नितंब उचला',
      '3–5 श्वासांपर्यंत स्थिर राहा',
      'श्वास सोडत हळूहळू खाली या'
    ],
    animation: 'https://assets9.lottiefiles.com/private_files/lf30_editor_zckc9auu.json',
    precautions: 'कंबर किंवा मानेत दुखापत असल्यास करू नका'
  },
  {
    id: 3,
    title: 'आरामदायक रीक्लाइंड बाउंड अँगल आसन',
    benefits: [
      'श्रोणी व अंतर्गत मांडी उघडते',
      'तणाव व थकवा कमी करते',
      'प्रजनन अवयवांमध्ये रक्तप्रवाह सुधारते',
      'मस्तिष्क व मज्जासंस्थेला शांतता मिळते'
    ],
    duration: '7 मिनिटे',
    level: 'सर्व स्तर',
    category: 'relaxation',
    steps: [
      'पाठीवर झोपा, पायांचे तळवे एकत्र ठेवा व गुडघे बाजूला सोडा',
      'हवे असल्यास गुडघ्यांना आधार द्या',
      'हात पोटावर किंवा शरीराजवळ ठेवा',
      'डोळे बंद करा आणि हळूहळू श्वास घ्या',
      'काही मिनिटांपर्यंत ही स्थिती ठेवा'
    ],
    animation: 'https://assets7.lottiefiles.com/packages/lf20_5vfzbt7e.json',
    precautions: 'पाठीवर ताण जाणवत असल्यास आधार द्या'
  }
],'bn-IN': [
  {
    id: 1,
    title: 'প্রজনন বৃদ্ধিকারী বাটারফ্লাই পোজ',
    benefits: [
      'প্রজনন অঙ্গগুলিকে উদ্দীপিত করে',
      'পেলভিস অঞ্চলে রক্ত প্রবাহ বৃদ্ধি করে',
      'স্ট্রেস হরমোন কমায়',
      'মেনস্ট্রুয়াল সাইকেল নিয়ন্ত্রণে সাহায্য করে'
    ],
    duration: '৫ মিনিট',
    level: 'শুরুর স্তর',
    category: 'fertility',
    steps: [
      'পায়ের পাতা একসাথে রেখে বসুন',
      'গোড়ালি ধরে হাঁটু হালকাভাবে ফ্ল্যাপ করুন',
      'শ্বাস নিন: মেরুদণ্ড সোজা করুন',
      'শ্বাস ছাড়ুন: সামান্য সামনে ঝুঁকুন',
      '২০–৩০ বার করুন'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'কোমরের ইনজুরি থাকলে এড়িয়ে চলুন'
  },
  {
    id: 2,
    title: 'হরমোন ব্যালান্সিং ব্রিজ পোজ',
    benefits: [
      'থাইরয়েড ও পেলভিক অঙ্গগুলিকে উদ্দীপিত করে',
      'গ্লুটস ও নিচের পিঠ শক্তিশালী করে',
      'হরমোন নিয়ন্ত্রণে সাহায্য করে',
      'হালকা বিষণ্নতা হ্রাস করে'
    ],
    duration: '৩–৪ মিনিট',
    level: 'শুরুর স্তর',
    category: 'hormonal',
    steps: [
      'পিঠের উপর শুয়ে পড়ুন, হাঁটু ভাঁজ করুন ও পা কোমরের প্রস্থে রাখুন',
      'হাত পাশে রাখুন, তালু নিচে',
      'শ্বাস নিয়ে ধীরে ধীরে নিতম্ব উপরে তুলুন',
      '৩–৫ বার শ্বাস নিন এবং রাখুন',
      'শ্বাস ছেড়ে ধীরে ধীরে নিচে নামুন'
    ],
    animation: 'https://assets9.lottiefiles.com/private_files/lf30_editor_zckc9auu.json',
    precautions: 'ঘাড় বা পিঠের সাম্প্রতিক আঘাত থাকলে করবেন না'
  },
  {
    id: 3,
    title: 'রিল্যাক্সিং রিক্লাইনড বাউন্ড অ্যাঙ্গেল পোজ',
    benefits: [
      'হিপ ও ভিতরের উরু খুলে দেয়',
      'স্ট্রেস ও ক্লান্তি হ্রাস করে',
      'প্রজনন অঙ্গে রক্ত প্রবাহ বাড়ায়',
      'স্নায়ুতন্ত্রকে শিথিল করে'
    ],
    duration: '৭ মিনিট',
    level: 'সব স্তরের জন্য',
    category: 'relaxation',
    steps: [
      'পিঠে শুয়ে পড়ুন, পায়ের তলা একসাথে রেখে হাঁটু পাশে ছেড়ে দিন',
      'প্রয়োজনে হাঁটুর নিচে বালিশ দিন',
      'হাত পেটের উপর বা পাশে রাখুন',
      'চোখ বন্ধ করুন ও ধীরে ধীরে শ্বাস নিন',
      'কয়েক মিনিট ধরে এই অবস্থায় থাকুন'
    ],
    animation: 'https://assets7.lottiefiles.com/packages/lf20_5vfzbt7e.json',
    precautions: 'পিঠে চাপ অনুভব করলে বালিশ বা বোলস্টার ব্যবহার করুন'
  }
],'gu-IN': [
  {
    id: 1,
    title: 'ફર્ટિલિટી-બૂસ્ટિંગ બટરફલાય પોઝ',
    benefits: [
      'પ્રજનન અંગોને ઉત્તેજિત કરે છે',
      'પેલ્વિસમાં રક્ત પ્રવાહ વધારે છે',
      'સ્ટ્રેસ હોર્મોન ઘટાડે છે',
      'માસિક ધર્મ ચક્રને સંતુલિત કરે છે'
    ],
    duration: '૫ મિનિટ',
    level: 'શરુઆત માટે',
    category: 'fertility',
    steps: [
      'પગના તળિયા સાથે જોડીને બેઠો',
      'ગટ્ટાં પકડીને હળવે ધબકારા આપો',
      'સાંસ લો: પીઠ સીધી કરો',
      'સાંસ છોડી: થોડી આગળ વાંકો',
      '૨૦–૩૦ વાર પુનરાવૃત્તિ કરો'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'હિપ ઈજાની સ્થિતિમાં ટાળો'
  },
  {
    id: 2,
    title: 'હોર્મોન સંતુલન માટે બ્રિજ પોઝ',
    benefits: [
      'થાઈરોઇડ અને પેલ્વિક અંગોને ઉત્તેજિત કરે છે',
      'નિતંબ અને નીચલી પીઠ મજબૂત કરે છે',
      'હોર્મોનના નિયમનને સુધારે છે',
      'હળવો ડિપ્રેશન ઘટાડે છે'
    ],
    duration: '૩–૪ મિનિટ',
    level: 'શરુઆત માટે',
    category: 'hormonal',
    steps: [
      'પીઠ પર સૂઈ જાવ, ઘૂંટણ વાળી અને પગ હિપ-વિથ પર રાખો',
      'હાથ શરીર પાસે, તળિયા નીચે રાખો',
      'સાંસ લેતા નિતંબ ધીરે ઊંચા કરો',
      '૩–૫ વાર ઘેરો શ્વાસ લો',
      'સાંસ છોડી ધીમે થી પાછા નીચે આવો'
    ],
    animation: 'https://assets9.lottiefiles.com/private_files/lf30_editor_zckc9auu.json',
    precautions: 'જાડા અથવા પીઠની તાજી ઈજા હોય તો ટાળો'
  },
  {
    id: 3,
    title: 'રિલેક્સિંગ રિક્લાઇન્ડ બાઉન્ડ એંગલ પોઝ',
    benefits: [
      'હિપ્સ અને અંદરની જાંઘ ખુલ્લી કરે છે',
      'તણાવ અને થાક ઘટાડે છે',
      'પ્રજનન અંગોમાં રક્ત પ્રવાહ સુધારે છે',
      'નર્વસ સિસ્ટમને આરામ આપે છે'
    ],
    duration: '૭ મિનિટ',
    level: 'બધા સ્તરો માટે',
    category: 'relaxation',
    steps: [
      'પીઠ પર સૂઈ જાવ, પગના તળિયા જોડો અને ઘૂંટણોને બાજુમાં પડવા દો',
      'જો જરૂરી હોય તો ઘૂંટણ નીચે કુશન રાખો',
      'હાથ પેટ પર અથવા બાજુમાં આરામથી મૂકો',
      'આંખો બંધ કરો અને ધીરે શ્વાસ લો',
      'કેટલાક મિનિટ સુધી આ સ્થિતિ જાળવો'
    ],
    animation: 'https://assets7.lottiefiles.com/packages/lf20_5vfzbt7e.json',
    precautions: 'પીઠ પર તાણ જણાય તો બલસ્ટરનો ઉપયોગ કરો'
  }
],'ml-IN': [
  {
    id: 1,
    title: 'ഗർഭധാരണം വളർത്തുന്ന ബട്ടർഫ്ലൈ പോസ്',
    benefits: [
      'പ്രജനന അവയവങ്ങളെ ഉത്തേജിപ്പിക്കുന്നു',
      'പെൽവിസ് പ്രദേശത്തെ രക്തപ്രവാഹം വർദ്ധിപ്പിക്കുന്നു',
      'മനഃസമ്മത ഹോർമോണുകൾ കുറയ്ക്കുന്നു',
      'മാസിക ചക്രം സ്ഥിരമായി കാത്തുസൂക്ഷിക്കുന്നു'
    ],
    duration: '5 മിനിറ്റ്',
    level: 'ആരംഭക്കാർക്കായി',
    category: 'fertility',
    steps: [
      'കാല്‍ത്താളുകൾ ചേർത്ത് ഇരിക്കുക',
      'കുടലുകൾ പിടിച്ച് ഇളകുന്ന പോലെയിരിക്കുക',
      'ശ്വാസം കുടിക്കുക: പിറകുവശം നേരെയാക്കുക',
      'ശ്വാസം വിടുക: സാവധാനം മുന്നോട്ട് ചെരിയുക',
      '20–30 തവണ ആവർത്തിക്കുക'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'ഹിപ്പ് ഏരിയയിൽ പരിക്കുണ്ടെങ്കിൽ ഒഴിവാക്കുക'
  },
  {
    id: 2,
    title: 'ഹോർമോൺ ബാലൻസിങ് ബ്രിഡ്ജ് പോസ്',
    benefits: [
      'തൈറോയിഡ്, പെൽവിക് അവയവങ്ങൾ ഉത്തേജിപ്പിക്കുന്നു',
      'കിഴക്കത്തെ പിൻവശവും നിതംബങ്ങളും ശക്തിപ്പെടുത്തുന്നു',
      'ഹോർമോൺ നിയന്ത്രണത്തെ മെച്ചപ്പെടുത്തുന്നു',
      'പ്രകാശം കുറഞ്ഞ മാനസികാഭാസം കുറയ്ക്കുന്നു'
    ],
    duration: '3–4 മിനിറ്റ്',
    level: 'ആരംഭക്കാർക്കായി',
    category: 'hormonal',
    steps: [
      'പുറകുവശത്ത് കിടക്കുക, കാൽമുട്ടുകൾ മടക്കുക, കാൽ തോള്വ്യത്യാസത്തിൽ വയ്ക്കുക',
      'കൈകൾ ചുമരോട് ചേർത്ത്, കനകൂർപ്പുകൾ താഴേക്ക് കാണിക്കുക',
      'ശ്വാസം കുടിക്കുക: നിതംബം ഉയർത്തുക',
      '3–5 തവണ ശ്വാസം എടുക്കുക',
      'ശ്വാസം വിടുക: പതുക്കെ താഴെ ഇറങ്ങുക'
    ],
    animation: 'https://assets9.lottiefiles.com/private_files/lf30_editor_zckc9auu.json',
    precautions: 'പിത്തോ കശേരുക്കളിൽ പരിക്കുള്ളവർ ഒഴിവാക്കുക'
  },
  {
    id: 3,
    title: 'ആരാമകരമായ റിക്ലൈൻഡ് ബൗണ്ട് ആംഗിൾ പോസ്',
    benefits: [
      'കിഴക്കുമാറുകൾ തുറക്കുന്നു',
      'ഉളളന്തരങ്ങവും ക്ഷീണവും കുറയ്ക്കുന്നു',
      'പ്രജനന അവയവങ്ങളിലേയ്ക്ക് രക്തപ്രവാഹം മെച്ചപ്പെടുത്തുന്നു',
      'നാഡീസംബന്ധമായ ശാന്തി പ്രേരിപ്പിക്കുന്നു'
    ],
    duration: '7 മിനിറ്റ്',
    level: 'എല്ലാ നിലയിലും അനുയോജ്യം',
    category: 'relaxation',
    steps: [
      'പിറകുവശത്ത് കിടക്കുക, കാൽത്താളുകൾ ചേർത്ത്, കാൽമുട്ടുകൾ ഒറ്റപ്പെട്ടുവെക്കുക',
      'ആവശ്യമായി വന്നാൽ കാൽമുട്ടിനു കീഴിൽ തുണി ഇടുക',
      'കൈകൾ വയറിന് മീതെയോ വശത്തോ വയ്ക്കുക',
      'കണ്ണുകൾ അടച്ചു, ആഴത്തിൽ ശ്വാസം എടുക്കുക',
      'അവസ്ഥ കുറേ മിനിറ്റുകൾ തുടരുക'
    ],
    animation: 'https://assets7.lottiefiles.com/packages/lf20_5vfzbt7e.json',
    precautions: 'കിടക്കുന്ന സമയത്ത് പിന്നിൽ അമർച്ച ഉണ്ടെങ്കിൽ ബോൾസ്റ്റർ ഉപയോഗിക്കുക'
  }
],'pa-IN': [
  {
    id: 1,
    title: 'ਜਣਨਸ਼ੀਲਤਾ ਵਧਾਉਣ ਵਾਲਾ ਬਟਰਫਲਾਈ ਪੋਜ਼',
    benefits: [
      'ਜਣਨ ਅੰਗਾਂ ਨੂੰ ਉਤੇਜਿਤ ਕਰਦਾ ਹੈ',
      'ਪੈਲਵਿਕ ਖੇਤਰ ਵਿੱਚ ਖੂਨ ਦੀ ਆਵਾਜਾਈ ਵਧਾਉਂਦਾ ਹੈ',
      'ਤਣਾਅ ਹਾਰਮੋਨ ਘਟਾਉਂਦਾ ਹੈ',
      'ਮਾਸਿਕ ਚੱਕਰ ਨੂੰ ਸੰਤੁਲਿਤ ਕਰਦਾ ਹੈ'
    ],
    duration: '5 ਮਿੰਟ',
    level: 'ਸ਼ੁਰੂਆਤੀ',
    category: 'fertility',
    steps: [
      'ਪੈਰਾਂ ਦੇ ਤਲਵੇ ਇਕੱਠੇ ਕਰਕੇ ਬੈਠੋ',
      'ਐਡੀਆਂ ਫੜੋ ਅਤੇ ਹੌਲੀ-ਹੌਲੀ ਘੁੱਟਣ ਹਿਲਾਓ',
      'ਸਾਹ ਲਓ: ਰੀੜ੍ਹ ਦੀ ਹੱਡੀ ਨੂੰ ਸਿੱਧਾ ਕਰੋ',
      'ਸਾਹ ਛੱਡੋ: ਥੋੜ੍ਹਾ ਅੱਗੇ ਵੱਧੋ',
      '20–30 ਵਾਰ ਦੁਹਰਾਓ'
    ],
    animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
    precautions: 'ਜੇਕਰ ਕਮਰ ਜਾਂ ਹਿਪ ਵਿੱਚ ਚੋਟ ਹੋਵੇ ਤਾਂ ਇਹ ਨਾ ਕਰੋ'
  },
  {
    id: 2,
    title: 'ਹਾਰਮੋਨ ਸੰਤੁਲਨ ਲਈ ਬ੍ਰਿਜ ਪੋਜ਼',
    benefits: [
      'ਥਾਇਰਾਇਡ ਅਤੇ ਪੈਲਵਿਕ ਅੰਗਾਂ ਨੂੰ ਉਤੇਜਿਤ ਕਰਦਾ ਹੈ',
      'ਗਲੂਟਸ ਅਤੇ ਨੀਵੀਂ ਪਿੱਠ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਦਾ ਹੈ',
      'ਹਾਰਮੋਨ ਨਿਯੰਤਰਣ ਵਿੱਚ ਸੁਧਾਰ ਕਰਦਾ ਹੈ',
      'ਹਲਕੀ ਡਿੱਪ੍ਰੈਸ਼ਨ ਘਟਾਉਂਦਾ ਹੈ'
    ],
    duration: '3–4 ਮਿੰਟ',
    level: 'ਸ਼ੁਰੂਆਤੀ',
    category: 'hormonal',
    steps: [
      'ਪਿੱਠ ਉੱਤੇ ਲੇਟੋ, ਘੁੱਟਣ ਮੋੜੋ ਅਤੇ ਪੈਰ ਕੂਲ੍ਹਿਆਂ ਦੇ ਅਨੁਸਾਰ ਰੱਖੋ',
      'ਬਾਂਹਾਂ ਸਰੀਰ ਦੇ ਨਾਲ ਰੱਖੋ, ਹਥੇਲੀਆਂ ਹੇਠਾਂ ਵੱਲ',
      'ਸਾਹ ਲੈਂਦੇ ਹੋਏ ਹੌਲੀ-ਹੌਲੀ ਹਿਪ ਉੱਤੇ ਚੁੱਕੋ',
      '3–5 ਸਾਹਾਂ ਲਈ ਰੁੱਕੋ',
      'ਸਾਹ ਛੱਡਦੇ ਹੋਏ ਹੌਲੀ-ਹੌਲੀ ਹੇਠਾਂ ਆ ਜਾਓ'
    ],
    animation: 'https://assets9.lottiefiles.com/private_files/lf30_editor_zckc9auu.json',
    precautions: 'ਜੇ ਪਿੱਠ ਜਾਂ ਗਰਦਨ ਵਿੱਚ ਨਵੀ ਚੋਟ ਹੋਵੇ ਤਾਂ ਇਹ ਨਾ ਕਰੋ'
  },
  {
    id: 3,
    title: 'ਆਰਾਮਦਾਇਕ ਰਿਕਲਾਈਨਡ ਬਾਊਂਡ ਐਂਗਲ ਪੋਜ਼',
    benefits: [
      'ਕੂਲ੍ਹਿਆਂ ਅਤੇ ਅੰਦਰਲੇ ਰਾਨਾਂ ਨੂੰ ਖੋਲ੍ਹਦਾ ਹੈ',
      'ਤਣਾਅ ਅਤੇ ਥਕਾਵਟ ਘਟਾਉਂਦਾ ਹੈ',
      'ਜਣਨ ਅੰਗਾਂ ਵਿੱਚ ਖੂਨ ਦੀ ਆਵਾਜਾਈ ਵਧਾਉਂਦਾ ਹੈ',
      'ਨਰਵ ਸਿਸਟਮ ਨੂੰ ਸ਼ਾਂਤੀ ਦਿੰਦਾ ਹੈ'
    ],
    duration: '7 ਮਿੰਟ',
    level: 'ਸਭ ਲਈ',
    category: 'relaxation',
    steps: [
      'ਪਿੱਠ ਉੱਤੇ ਲੇਟੋ, ਪੈਰਾਂ ਦੇ ਤਲਵੇ ਮਿਲਾਓ ਅਤੇ ਘੁੱਟਣਾਂ ਨੂੰ ਦੋਹਾਂ ਪਾਸੇ ਡਿੱਗਣ ਦਿਓ',
      'ਜੇ ਲੋੜ ਹੋਵੇ ਤਾਂ ਘੁੱਟਣਾਂ ਹੇਠਾਂ ਤਕੀਆਂ ਰੱਖੋ',
      'ਹੱਥ ਪੇਟ ਜਾਂ ਬਾਹਾਂ ਦੇ ਨਾਲ ਰੱਖੋ',
      'ਅੱਖਾਂ ਬੰਦ ਕਰਕੇ ਹੌਲੀ-ਹੌਲੀ ਸਾਹ ਲਓ',
      'ਕਈ ਮਿੰਟਾਂ ਲਈ ਇਹ ਪੋਜ਼ ਬਣਾਈ ਰੱਖੋ'
    ],
    animation: 'https://assets7.lottiefiles.com/packages/lf20_5vfzbt7e.json',
    precautions: 'ਜੇ ਪਿੱਠ ਉੱਤੇ ਦਬਾਅ ਮਹਿਸੂਸ ਹੋਵੇ ਤਾਂ ਹੇਠਾਂ ਬਾਲਸਟਰ ਰੱਖੋ'
  }
]









  };

  const poses = yogaData[language] || yogaData['en-IN'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0, opacity: 1, transition: { duration: 0.5 }
  }
};

const localizedText = {
  heading: {
    'hi-IN': 'गर्भधारण पूर्व योग',
    'ta-IN': 'கருத்தரிப்புக்கு முன் யோகா',
    'te-IN': 'గర్భధారణకు ముందు యోగా',
    'kn-IN': 'ಗರ್ಭಧಾರಣೆಗೆ ಪೂರ್ವ ಯೋಗ',
    'ml-IN': 'ഗർഭധാരണത്തിനു മുൻപ് യോഗ',
    'gu-IN': 'ગર્ભધારણા પૂર્વ યોગ',
    'pa-IN': 'ਗਰਭਧਾਰਣ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਯੋਗਾ',
    'mr-IN': 'गर्भधारणपूर्व योग',
    'bn-IN': 'গর্ভধারণ-পূর্ব যোগ',
    'or-IN': 'ଗର୍ଭଧାରଣ ପୂର୍ବରୁ ଯୋଗ',
    'en-IN': 'Pre-Conception Yoga'
  },
  subtitle: {
    'hi-IN': 'प्रजनन स्वास्थ्य और हार्मोन संतुलन के लिए',
    'ta-IN': 'கருவுறுதல் ஆரோக்கியம் மற்றும் ஹார்மோன் சமநிலைக்காக',
    'te-IN': 'పునరుత్పత్తి ఆరోగ్యం మరియు హార్మోన్ సమతుల్యత కోసం',
    'kn-IN': 'ಪುನಃಉತ್ಪತ್ತಿ ಆರೋಗ್ಯ ಮತ್ತು ಹಾರ್ಮೋನ್ ಸಮತೋಲನಕ್ಕಾಗಿ',
    'ml-IN': 'പ്രജനനാരോഗ്യത്തിനും ഹോർമോൺ സമതുല്യതയ്ക്കുമായി',
    'gu-IN': 'પ્રજનન આરોગ્ય અને હોર્મોન સંતુલન માટે',
    'pa-IN': 'ਜਣਨਕ ਅੰਗਾਂ ਦੀ ਸਿਹਤ ਅਤੇ ਹਾਰਮੋਨ ਸੰਤੁਲਨ ਲਈ',
    'mr-IN': 'प्रजनन आरोग्य आणि संप्रेरक संतुलनासाठी',
    'bn-IN': 'প্রজনন স্বাস্থ্য এবং হরমোন ভারসাম্যের জন্য',
    'or-IN': 'ପୁନଃଉତ୍ପାଦନ ସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ହର୍ମୋନ ସମତୁଳନ ପାଇଁ',
    'en-IN': 'For reproductive health and hormonal balance'
  },
  benefits: {
    'hi-IN': 'लाभ', 'ta-IN': 'நன்மைகள்', 'te-IN': 'లాభాలు', 'kn-IN': 'ಲಾಭಗಳು', 'ml-IN': 'ലാഭങ്ങൾ',
    'gu-IN': 'ફાયદા', 'pa-IN': 'ਫਾਇਦੇ', 'mr-IN': 'फायदे', 'bn-IN': 'উপকারিতা', 'or-IN': 'ଲାଭ', 'en-IN': 'Benefits'
  },
  steps: {
    'hi-IN': 'चरण', 'ta-IN': 'படிகள்', 'te-IN': 'దశలు', 'kn-IN': 'ಹಂತಗಳು', 'ml-IN': 'പടികൾ',
    'gu-IN': 'પગલાં', 'pa-IN': 'ਕਦਮ', 'mr-IN': 'पायऱ्या', 'bn-IN': 'ধাপ', 'or-IN': 'ପଦକ୍ଷେପ', 'en-IN': 'Steps'
  },
  precautions: {
    'hi-IN': 'सावधानियां', 'ta-IN': 'முன்னெச்சரிக்கைகள்', 'te-IN': 'జాగ్రత్తలు', 'kn-IN': 'ಜಾಗ್ರತೆಗಳು', 'ml-IN': 'ജാഗ്രതകൾ',
    'gu-IN': 'પૃથ્થકરણ', 'pa-IN': 'ਸਾਵਧਾਨੀਆਂ', 'mr-IN': 'सावधगिरी', 'bn-IN': 'সতর্কতা', 'or-IN': 'ସତର୍କତା', 'en-IN': 'Precautions'
  },
  tipHeading: {
    'hi-IN': 'आज का योग टिप', 'ta-IN': 'இன்றைய யோகா உதவிக்குறிப்பு', 'te-IN': 'ఈరోజు యోగా చిట్కా',
    'kn-IN': 'ಇಂದಿನ ಯೋಗ ಟಿಪ್', 'ml-IN': 'ഇന്നത്തെ യോഗാ ടിപ്പ്', 'gu-IN': 'આજનો યોગ ટીપ', 'pa-IN': 'ਅੱਜ ਦੀ ਯੋਗਾ ਟਿਪ',
    'mr-IN': 'आजचा योग टिप', 'bn-IN': 'আজকের যোগ টিপস', 'or-IN': 'ଆଜିର ଯୋଗ ସୁପାରିଶ', 'en-IN': "Today's Yoga Tip"
  },
  tipText: {
    'hi-IN': 'गर्भधारण से 3 महीने पहले नियमित रूप से योग करें। सुबह 5-7 बजे (ब्रह्म मुहूर्त) का समय सबसे अच्छा माना जाता है।',
    'ta-IN': 'கருத்தரிப்பதற்கு 3 மாதங்களுக்கு முன்பு தினமும் யோகா செய்யவும். காலை 5-7 மணி (பிரம்ம முகூர்த்தம்) சிறந்த நேரம்.',
    'te-IN': 'గర్భధారణకు 3 నెలల ముందు యోగా రోజూ చేయండి. ఉదయం 5–7 గంటల మధ్య సమయం ఉత్తమం.',
    'kn-IN': 'ಗರ್ಭಧಾರಣೆಗೆ ಮುನ್ನ 3 ತಿಂಗಳು ನಿಯಮಿತವಾಗಿ ಯೋಗ ಅಭ್ಯಾಸ ಮಾಡಿ. ಬೆಳಿಗ್ಗೆ 5-7 ಸಮಯವು ಅತ್ಯುತ್ತಮವಾಗಿದೆ.',
    'ml-IN': 'ഗർഭധാരണത്തിനു മുൻപ് 3 മാസത്തോളം നിത്യയോഗം ചെയ്യുക. രാവിലെ 5-7 (ബ്രഹ്മമുഹൂർത്തം) ഉത്തമമാണ്.',
    'gu-IN': 'ગર્ભધારણા પહેલા 3 મહિના નિયમિત યોગ કરો. સવારે 5-7 વાગે (બ્રહ્મમુહૂર્ત) શ્રેષ્ઠ માનવામાં આવે છે.',
    'pa-IN': 'ਗਰਭਧਾਰਣ ਤੋਂ 3 ਮਹੀਨੇ ਪਹਿਲਾਂ ਨਿਯਮਤ ਯੋਗਾ ਕਰੋ। ਸਵੇਰੇ 5-7 ਵਜੇ (ਬਰਹਮ ਮੂਰਤ) ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਹੁੰਦਾ ਹੈ।',
    'mr-IN': 'गर्भधारणा होण्यापूर्वी 3 महिने नियमित योगाभ्यास करा. सकाळी ५–७ वाजेचा (ब्रह्म मुहूर्त) काळ सर्वोत्कृष्ट मानला जातो.',
    'bn-IN': 'গর্ভধারণের ৩ মাস আগে নিয়মিত যোগব্যায়াম করুন। সকাল ৫–৭ (ব্রহ্ম মুহূর্ত) সর্বোত্তম সময় হিসাবে বিবেচিত হয়।',
    'or-IN': 'ଗର୍ଭଧାରଣରୁ ୩ ମାସ ପূର୍ବରୁ ନିୟମିତ ଯୋଗ କରନ୍ତୁ। ସକାଳ ୫-୭ (ବ୍ରହ୍ମମୁହୂର୍ତ୍ତ) ସର୍ବୋତ୍ତମ ମାନାଯାଏ।',
    'en-IN': 'Practice yoga regularly 3 months before conception. Early morning 5–7 AM (Brahma Muhurta) is considered most beneficial.'
  }
};

return (
  <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4 md:p-8">
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 text-center"
    >
      <h1 className="text-3xl font-bold text-purple-800 mb-2">
        {localizedText.heading[language]}
      </h1>
      <p className="text-gray-600">
        {localizedText.subtitle[language]}
      </p>
    </motion.header>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {poses.map((pose) => (
        <motion.div
          key={pose.id}
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden transition-all"
        >
          <div className="h-48 bg-purple-100 flex items-center justify-center relative">
            <Player
              autoplay
              loop
              src={pose.animation}
              style={{ height: '100%', width: '100%' }}
            />
          </div>
          <div className="p-5">
            <h3 className="text-xl font-semibold text-purple-700 mb-2">{pose.title}</h3>
            <div className="flex items-center mb-3">
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded mr-2 flex items-center">
                <FaRegClock className="mr-1" /> {pose.duration}
              </span>
              <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded flex items-center">
                <FaSeedling className="mr-1" /> {pose.level}
              </span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {localizedText.benefits[language]}
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
              {pose.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
            </ul>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {localizedText.steps[language]}
            </h4>
            <ol className="list-decimal pl-5 space-y-1 text-gray-700 mb-4">
              {pose.steps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {localizedText.precautions[language]}
            </h4>
            <p className="text-red-600">{pose.precautions}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>

    <div className="mt-12 bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-purple-800 mb-4">
        {localizedText.tipHeading[language]}
      </h2>
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <p className="text-purple-800">
          {localizedText.tipText[language]}
        </p>
      </div>
    </div>
  </div>
);
}

export default PreConceptionYogaPage;
