import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Player } from '@lottiefiles/react-lottie-player';
import { FaRegClock, FaBaby } from 'react-icons/fa';
import translations from './PregYogaTransaltions';
const PregYogaPage = () => {
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState('en-IN');
  const [trimester, setTrimester] = useState(1);
  const auth = getAuth();
  

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setLanguage(docSnap.data().language || 'en-IN');

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

  const yogaData = {
    'en-IN': {
  1: [
    {
      id: 101,
      title: 'Gentle Cat-Cow',
      benefits: [
        'Eases back tension',
        'Improves spinal flexibility',
        'Reduces morning sickness',
        'Promotes relaxation'
      ],
      duration: '5 mins',
      level: 'Beginner',
      category: 'flexibility',
      steps: [
        'Come to hands and knees position',
        'Inhale: Arch back, lift head (Cow)',
        'Exhale: Round spine, tuck chin (Cat)',
        'Move slowly with your breath',
        'Repeat 5-8 times gently'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
      precautions: 'Avoid if experiencing dizziness'
    },
    {
      id: 102,
      title: 'Side-Lying Corpse Pose',
      benefits: [
        'Relaxes entire body',
        'Reduces fatigue and stress',
        'Improves blood circulation',
        'Promotes mindfulness'
      ],
      duration: '7 mins',
      level: 'All Levels',
      category: 'relaxation',
      steps: [
        'Lie on your left side with a pillow between your knees',
        'Support your head with a folded towel or small cushion',
        'Keep arms in a relaxed position',
        'Close your eyes and breathe deeply',
        'Stay in this position for 5–7 minutes'
      ],
      animation: 'https://assets6.lottiefiles.com/packages/lf20_ihqvye2h.json',
      precautions: 'Use support under belly if needed'
    },
    {
      id: 103,
      title: 'Seated Forward Bend (Modified)',
      benefits: [
        'Stretches lower back and hamstrings',
        'Calms the nervous system',
        'Improves digestion',
        'Relieves mild anxiety'
      ],
      duration: '4 mins',
      level: 'Beginner',
      category: 'flexibility',
      steps: [
        'Sit with legs extended and slightly apart',
        'Place a bolster or pillow under knees if needed',
        'Inhale and lengthen the spine upward',
        'Exhale and gently hinge forward from hips',
        'Rest hands on legs or floor without strain'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_q6zrppfj.json',
      precautions: 'Avoid rounding the spine or overreaching'
    }
  ]
},'hi-IN': {
  1: [
    {
      id: 101,
      title: 'कोमल बिल्ली-गाय मुद्रा',
      benefits: [
        'पीठ के तनाव को कम करती है',
        'रीढ़ की लचीलापन बढ़ाती है',
        'सुबह की मतली को कम करती है',
        'आराम को बढ़ावा देती है'
      ],
      duration: '5 मिनट',
      level: 'शुरुआती',
      category: 'flexibility',
      steps: [
        'हाथों और घुटनों के बल आ जाएं',
        'श्वास लें: पीठ को मोड़ें, सिर ऊपर उठाएं (गाय मुद्रा)',
        'श्वास छोड़ें: रीढ़ को गोल करें, ठोड़ी नीचे करें (बिल्ली मुद्रा)',
        'धीरे-धीरे सांस के साथ आगे-पीछे हिलें',
        '5-8 बार धीरे-धीरे दोहराएं'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
      precautions: 'अगर चक्कर आए तो न करें'
    },
    {
      id: 102,
      title: 'बाईं ओर शवासन',
      benefits: [
        'पूरा शरीर शांत करता है',
        'थकान और तनाव को कम करता है',
        'रक्त संचार में सुधार करता है',
        'मानसिक सजगता को बढ़ावा देता है'
      ],
      duration: '7 मिनट',
      level: 'सभी स्तर',
      category: 'relaxation',
      steps: [
        'बाईं करवट लेट जाएं और पैरों के बीच तकिया रखें',
        'सिर को तकिए या तौलिये से सहारा दें',
        'बांहों को आराम से रखें',
        'आंखें बंद करें और गहरी सांस लें',
        '5–7 मिनट तक इसी स्थिति में रहें'
      ],
      animation: 'https://assets6.lottiefiles.com/packages/lf20_ihqvye2h.json',
      precautions: 'पेट के नीचे तकिया रखें यदि ज़रूरत हो'
    },
    {
      id: 103,
      title: 'बैठकर आगे झुकना (संशोधित)',
      benefits: [
        'नीचले पीठ और हैमस्ट्रिंग को स्ट्रेच करता है',
        'तंत्रिका तंत्र को शांत करता है',
        'पाचन में सुधार करता है',
        'हल्की चिंता को कम करता है'
      ],
      duration: '4 मिनट',
      level: 'शुरुआती',
      category: 'flexibility',
      steps: [
        'पैरों को थोड़ा फैला कर बैठ जाएं',
        'घुटनों के नीचे तकिया रखें यदि ज़रूरत हो',
        'श्वास लें और रीढ़ को ऊपर की ओर सीधा करें',
        'श्वास छोड़ते हुए कूल्हों से धीरे झुकें',
        'हाथों को पैरों या ज़मीन पर रखें, जोर न डालें'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_q6zrppfj.json',
      precautions: 'रीढ़ को झुकाने या अधिक झुकाव से बचें'
    }
  ]
},'ta-IN': {
  1: [
    {
      id: 101,
      title: 'மென்மையான பூனை-மாடு ஆசனம்',
      benefits: [
        'முதுகுப் பகுதி பதற்றத்தை குறைக்கிறது',
        'முதுகெலும்பின் நெகிழ்வுத்தன்மையை மேம்படுத்துகிறது',
        'காலை மயக்கம் குறைக்கிறது',
        'ஓய்வை ஊக்குவிக்கிறது'
      ],
      duration: '5 நிமிடங்கள்',
      level: 'தொடக்கநிலை',
      category: 'flexibility',
      steps: [
        'கைகள் மற்றும் முழங்கால்களில் வந்து நிலைநிறுத்துங்கள்',
        'மூச்சை இழுத்துக் கொள்ளவும்: முதுகை வளைத்து, தலை உயர்த்தவும் (மாடு)',
        'மூச்சை விடவும்: முதுகை வட்டமாக்கி, தாடையை உள்ளே கொண்டு வாருங்கள் (பூனை)',
        'மூச்சுக்கு ஏற்ப மெதுவாக நகரவும்',
        '5-8 முறை மெதுவாக மீண்டும் செய்யவும்'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
      precautions: 'தலைச்சுற்றல் இருந்தால் தவிர்க்கவும்'
    },
    {
      id: 102,
      title: 'பக்கவாட்டில் படுக்கும் சவாசனம்',
      benefits: [
        'முழு உடலையும் ஓய்வாக மாற்றுகிறது',
        'சோர்வும் மன அழுத்தமும் குறைகின்றன',
        'இரத்த ஓட்டத்தை மேம்படுத்துகிறது',
        'அறிவாற்றலை ஊக்குவிக்கிறது'
      ],
      duration: '7 நிமிடங்கள்',
      level: 'எல்லா நிலைகளுக்கும்',
      category: 'relaxation',
      steps: [
        'இடது பக்கமாக படுத்துக்கொள்ளவும்; கால்களுக்கு இடையே ஒரு தலையணை வைக்கவும்',
        'சிறிய துணி அல்லது தலையணையைத் தலைக்கு கீழ் வைக்கவும்',
        'கைகளை ஓய்வாக வைக்கவும்',
        'கண்களை மூடி ஆழ்ந்த மூச்சை எடுக்கவும்',
        '5–7 நிமிடங்கள் அந்த நிலையை தக்கவைக்கவும்'
      ],
      animation: 'https://assets6.lottiefiles.com/packages/lf20_ihqvye2h.json',
      precautions: 'தேவைப்பட்டால் வயிற்றுக்கு கீழே ஆதரவாக தலையணை பயன்படுத்தவும்'
    },
    {
      id: 103,
      title: 'உட்கார்ந்த முன்நகர்வு (மாற்றம் செய்யப்பட்ட)',
      benefits: [
        'முதுகுத்தண்டு மற்றும் தொடைக்கால்களுக்கு நல்ல மென்மையாக்கம்',
        'நரம்பியல் அமைப்பை அமைதியாக்குகிறது',
        'செரிமானத்தை மேம்படுத்துகிறது',
        'அலட்டையை குறைக்கிறது'
      ],
      duration: '4 நிமிடங்கள்',
      level: 'தொடக்கநிலை',
      category: 'flexibility',
      steps: [
        'கால்களை கொஞ்சம் விரித்து நேராக உட்காரவும்',
        'தேவைப்பட்டால் முழங்கால்களுக்கு கீழே ஒரு தலையணை வைக்கவும்',
        'மூச்சை இழுத்து முதுகை நேராக உயர்த்தவும்',
        'மூச்சை விட்டபின், இடுப்பிலிருந்து மெதுவாக முன்நகரவும்',
        'கைகளை கால்களில் அல்லது தரையில் வைத்து அமைதியாக இருங்கள்'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_q6zrppfj.json',
      precautions: 'முதுகை வளைத்தல் மற்றும் அதிகமாக முன்நகர்வதை தவிர்க்கவும்'
    }
  ]
},'te-IN': {
  1: [
    {
      id: 101,
      title: 'సాధారణ క్యాట్-కావ్ పోజ్',
      benefits: [
        'బెరకు నొప్పిని తగ్గిస్తుంది',
        'రెక్కల సౌలభ్యాన్ని మెరుగుపరుస్తుంది',
        'వికారాన్ని తగ్గిస్తుంది',
        'ఆరామాన్ని కలిగిస్తుంది'
      ],
      duration: '5 నిమిషాలు',
      level: 'ప్రారంభం',
      category: 'flexibility',
      steps: [
        'చేతులు మరియు మోకాళ్లపై నిలబడండి',
        'ఇన్హేల్: వెన్నెముకను వంపు చేసి తల పైకెత్తండి (కావ్)',
        'ఎక్స్హేల్: వెన్నెముకను గుండ్రంగా చేసి తలను తక్కువకు తిప్పండి (క్యాట్)',
        'మూత్రానికి అనుగుణంగా మెల్లగా కదలండి',
        '5-8 సార్లు మెల్లగా పునరావృతం చేయండి'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
      precautions: 'తలనొప్పి లేదా మైకము ఉంటే నివారించండి'
    },
    {
      id: 102,
      title: 'బెడ్‌సైడ్ శవాసనం (Side-Lying Corpse Pose)',
      benefits: [
        'మూలముగా శరీరానికి విశ్రాంతిని ఇస్తుంది',
        'దుర్బలత మరియు ఒత్తిడిని తగ్గిస్తుంది',
        'రక్త ప్రసరణను మెరుగుపరుస్తుంది',
        'మనస్సు ప్రశాంతతను ప్రోత్సహిస్తుంది'
      ],
      duration: '7 నిమిషాలు',
      level: 'అన్ని స్థాయిలకు',
      category: 'relaxation',
      steps: [
        'ఎడమ వైపున పడుకోండి, మోకాళ్ల మధ్య కుషన్ పెట్టండి',
        'తలకి చిన్న తువాలు లేదా కుషన్ మద్దతుగా పెట్టండి',
        'చేతులను శాంతంగా ఉంచండి',
        'కళ్లును మూసి నెమ్మదిగా శ్వాస తీసుకోండి',
        '5–7 నిమిషాల పాటు అదే స్థితిలో ఉండండి'
      ],
      animation: 'https://assets6.lottiefiles.com/packages/lf20_ihqvye2h.json',
      precautions: 'అవసరమైతే పొత్తికడుపు క్రింద మద్దతు ఇవ్వండి'
    },
    {
      id: 103,
      title: 'కూర్చుని ముందుకు వంగే ఆసనం (సవరించిన)',
      benefits: [
        'తొక్కులు మరియు దిగువ వెన్నెముకను చక్కగా చాపుతుంది',
        'నాడీ వ్యవస్థను శాంతపరుస్తుంది',
        'జీర్ణశక్తిని మెరుగుపరుస్తుంది',
        'స్వల్ప ఆందోళనను తగ్గిస్తుంది'
      ],
      duration: '4 నిమిషాలు',
      level: 'ప్రారంభం',
      category: 'flexibility',
      steps: [
        'కాళ్లు ముందుకు సాగదీసి కూర్చోండి',
        'అవసరమైతే మోకాళ్ళకు క్రింద బలిష్టం ఇవ్వండి',
        'ఇన్హేల్: వెన్నెముకను నిటారుగా పైకి వంచండి',
        'ఎక్స్హేల్: నెమ్మదిగా ముందుకు వంగండి',
        'చేతులను కాళ్లపై లేదా నేలపై మోపి ఉండండి'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_q6zrppfj.json',
      precautions: 'వెన్నెముకను బలంగా వంచకండి లేదా అతిగా ముందుకు పోకండి'
    }
  ]
},'kn-IN': {
  1: [
    {
      id: 101,
      title: 'ಸೌಮ್ಯ ಕ್ಯಾಟ್-ಕೌ ಆಸನ',
      benefits: [
        'ಹಿಂಭಾಗದ ಒತ್ತಡವನ್ನು ಇಳಿಸುತ್ತೆ',
        'ಹಿಡಿದಮೂಳೆ ಲವಚಿಕತೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ',
        'ಬೆಳಗಿನ ಹೊಕ್ಕಳೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ',
        'ಆರಾಮದಾಯಕ ಅನುಭವ ನೀಡುತ್ತದೆ'
      ],
      duration: '5 ನಿಮಿಷಗಳು',
      level: 'ಆರಂಭಿಕ',
      category: 'flexibility',
      steps: [
        'ಕೈಗಳು ಮತ್ತುಮೋಡಕಾಲುಗಳ ಮೇಲೆ ಬರಲೇ',
        'ಉಸಿರೆಳೆಯುವಾಗ: ಹಿಂಬದಿಯ ಮಡಚು, ತಲೆ ಎತ್ತಿ (ಕೌ)',
        'ಉಸಿರಬಿಡುವಾಗ: ಹಿಂಬದಿಯನ್ನು ಆವರಿಸಿ, ತಲೆ ಕೆಳಕ್ಕೆ (ಕ್ಯಾಟ್)',
        'ಉಸಿರಿನೊಂದಿಗೆ ನಿಭಾಯವಾಗಿ ಚಲಿಸಿ',
        '5-8 ಬಾರಿ ಈ ಕ್ರಿಯೆಯನ್ನು ಪುನರಾವರ್ತಿಸಿ'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
      precautions: 'ತಲೆ ಸುತ್ತುವಂತಹ ಅನುಭವ ಬಂದರೆ ತಪ್ಪಿಸಲು'
    },
    {
      id: 102,
      title: 'ಬದಿಯ ಬದಿಯಲ್ಲಿ ಮಲಗುವ ಶವಾಸನ',
      benefits: [
        'ಸಂಪೂರ್ಣ ಶರೀರಕ್ಕೆ ವಿಶ್ರಾಂತಿ ನೀಡುತ್ತದೆ',
        'ಆಯಾಸ ಮತ್ತು ಮಾನಸಿಕ ಒತ್ತಡವನ್ನು ಇಳಿಸುತ್ತದೆ',
        'ರಕ್ತಪ್ರಸರಣೆಯನ್ನು ಉತ್ತಮಗೊಳಿಸುತ್ತದೆ',
        'ಮನಸ್ಸಿನ ಎಚ್ಚರತೆ ಹೆಚ್ಚಿಸುತ್ತದೆ'
      ],
      duration: '7 ನಿಮಿಷಗಳು',
      level: 'ಎಲ್ಲಾ ಮಟ್ಟಗಳಿಗೂ',
      category: 'relaxation',
      steps: [
        'ಎಡಬದಿಗೆ ಮಲಗಿ, ಕಾಲುಗಳ ನಡುವೆ ತಲೆಯಂಚು ಅಥವಾ ಕುಶನ್ ಇಡಿ',
        'ತಲೆಗೆ ಚಿಕ್ಕ ಹಾಸಿಗೆ ಅಥವಾ ಕುಶನ್ ಇಡಿ',
        'ಕೈಗಳನ್ನು ವಿಶ್ರಾಂತವಾಗಿ ಇಡಿ',
        'ಕಣ್ಣು ಮುಚ್ಚಿ ಆಳವಾದ ಉಸಿರಾಟ ಮಾಡಿ',
        '5–7 ನಿಮಿಷಗಳ ಕಾಲ ಆ ಸ್ಥಿತಿಯಲ್ಲಿರಿರಿ'
      ],
      animation: 'https://assets6.lottiefiles.com/packages/lf20_ihqvye2h.json',
      precautions: 'ಅವಶ್ಯಕತೆಯಿದ್ದರೆ ಹೊಟ್ಟೆಕೆಳಗೆ ಬೆಂಬಲವನ್ನು ನೀಡಿ'
    },
    {
      id: 103,
      title: 'ಕುಳಿತು ಮುಂದಕ್ಕೆ ಒಡ್ಡುವ ಆಸನ (ತಿದ್ದುಪಡಿ ಮಾಡಲಾದ)',
      benefits: [
        'ಕೆಳಗಿನ ಬೆನ್ನು ಮತ್ತು ತೊಡೆಗೆ ವಿಸ್ತರಣೆ ನೀಡುತ್ತದೆ',
        'ನಾರಿಕಣ ವ್ಯವಸ್ಥೆಯನ್ನು ಶಮನಗೊಳಿಸುತ್ತದೆ',
        'ಜೀರ್ಣಕ್ರಿಯೆ ಸುಧಾರಿಸುತ್ತದೆ',
        'ಸ್ವಲ್ಪ ಆತಂಕವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ'
      ],
      duration: '4 ನಿಮಿಷಗಳು',
      level: 'ಆರಂಭಿಕ',
      category: 'flexibility',
      steps: [
        'ಕಾಲುಗಳನ್ನು ಸ್ವಲ್ಪ ಬೇರ್ಪಡಿಸಿ ನೇರವಾಗಿ ಕುಳಿತುಕೊಳ್ಳಿ',
        'ಅವಶ್ಯಕತೆಯಿದ್ದರೆ ಮಡಕಿದ ಕಾಲುಗಳ ಕೆಳಗೆ ಕುಶನ್ ಇಡಿ',
        'ಉಸಿರೆಳೆಯುವಾಗ: ನೇರವಾಗಿ ಬೆನ್ನು ಎತ್ತಿ',
        'ಉಸಿರಬಿಡುವಾಗ: ಮಡಕಿದವರಾಗಿ ಮುಂದಕ್ಕೆ ನೆಗೆಯಿರಿ',
        'ಕೈಗಳನ್ನು ಕಾಲುಗಳ ಮೇಲೆ ಅಥವಾ ನೆಲದ ಮೇಲೆ ಇಡಿ'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_q6zrppfj.json',
      precautions: 'ಹಿಡಿದಮೂಳೆಯೊಡನೆ ಹೆಚ್ಚು ಮುರಿಯಬೇಡಿ ಅಥವಾ ಹಗ್ಗದಂತೆ ಒತ್ತಬೇಡಿ'
    }
  ]
},'mr-IN': {
  1: [
    {
      id: 101,
      title: 'सौम्य मांजर-गाय आसन',
      benefits: [
        'पाठीचा ताण कमी करते',
        'मणक्याची लवचिकता सुधारते',
        'मॉर्निंग सिकनेस कमी करते',
        'शांतता आणि विश्रांतीला प्रोत्साहन देते'
      ],
      duration: '5 मिनिटे',
      level: 'शुरुआती',
      category: 'flexibility',
      steps: [
        'हात आणि गुडघ्यांवर या स्थितीत या',
        'श्वास घेताना: पाठ वाकवा, डोके वर (गाय)',
        'श्वास सोडताना: मणक्याला गोल करा, हनुवटी आत (मांजर)',
        'श्वासाच्या लयीत सौम्य हालचाल करा',
        '5–8 वेळा पुन्हा करा'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
      precautions: 'चक्कर येत असल्यास टाळा'
    },
    {
      id: 102,
      title: 'बाजूला झोपण्याचे शवासन',
      benefits: [
        'संपूर्ण शरीराला विश्रांती मिळते',
        'थकवा आणि तणाव कमी होतो',
        'रक्तप्रवाह सुधारतो',
        'एकाग्रता आणि mindfulness वाढते'
      ],
      duration: '7 मिनिटे',
      level: 'सर्व स्तरांसाठी',
      category: 'relaxation',
      steps: [
        'डाव्या कुशीवर झोपा, गुडघ्यांमध्ये उशी ठेवा',
        'डोक्याखाली छोटी उशी किंवा टॉवेल ठेवा',
        'हात आरामात ठेवा',
        'डोळे बंद करा आणि खोल श्वास घ्या',
        'या स्थितीत 5–7 मिनिटे राहा'
      ],
      animation: 'https://assets6.lottiefiles.com/packages/lf20_ihqvye2h.json',
      precautions: 'हवे असल्यास पोटाखाली उशी ठेवा'
    },
    {
      id: 103,
      title: 'बसून पुढे झुकणे (संशोधित)',
      benefits: [
        'पाठीचा खालचा भाग आणि मांड्यांची ताण वाढवते',
        'नर्व्हस सिस्टीम शांत करते',
        'पचन क्रिया सुधारते',
        'थोडासा तणाव कमी करते'
      ],
      duration: '4 मिनिटे',
      level: 'शुरुआती',
      category: 'flexibility',
      steps: [
        'पाय थोडे अंतरावर करून सरळ बसा',
        'हवे असल्यास गुडघ्यांखाली उशी ठेवा',
        'श्वास घेताना: पाठ सरळ करा',
        'श्वास सोडताना: कंबरमधून पुढे झुका',
        'हात मांडीवर किंवा जमिनीवर ठेवा'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_q6zrppfj.json',
      precautions: 'पाठ जास्त वाकवू नका किंवा ताण देऊ नका'
    }
  ]
},'bn-IN': {
  1: [
    {
      id: 101,
      title: 'হালকা ক্যাট-কাউ ভঙ্গি',
      benefits: [
        'পিঠের চাপ কমায়',
        'মেরুদণ্ডের নমনীয়তা বাড়ায়',
        'মর্নিং সিকনেস কমায়',
        'মন ও শরীরকে শান্ত করে'
      ],
      duration: '৫ মিনিট',
      level: 'শুরুকারী',
      category: 'flexibility',
      steps: [
        'হাত ও হাঁটুতে ভর দিয়ে আসন নিন',
        'শ্বাস নিন: পিঠ বাঁকান, মাথা তুলুন (কাউ)',
        'শ্বাস ছাড়ুন: মেরুদণ্ড গোল করুন, থুতনি বুকের কাছে (ক্যাট)',
        'শ্বাসের সাথে ধীরে ধীরে নড়াচড়া করুন',
        '৫–৮ বার ধীরে করুন'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
      precautions: 'চোখে ঝাপসা দেখলে বা মাথা ঘোরালে এড়িয়ে চলুন'
    },
    {
      id: 102,
      title: 'পার্শ্বে শোয়া শবাসন',
      benefits: [
        'সমগ্র শরীরকে বিশ্রাম দেয়',
        'ক্লান্তি ও স্ট্রেস কমায়',
        'রক্তসঞ্চালন উন্নত করে',
        'মাইন্ডফুলনেস বা মনোযোগ উন্নত করে'
      ],
      duration: '৭ মিনিট',
      level: 'সব স্তরের জন্য',
      category: 'relaxation',
      steps: [
        'বাম পাশে শুয়ে পড়ুন, দুই হাঁটুর মাঝে বালিশ রাখুন',
        'মাথার নিচে ছোট তোয়ালে বা বালিশ দিন',
        'হাত দুটি আরামে রাখুন',
        'চোখ বন্ধ করে গভীরভাবে শ্বাস নিন',
        '৫–৭ মিনিট এই অবস্থায় থাকুন'
      ],
      animation: 'https://assets6.lottiefiles.com/packages/lf20_ihqvye2h.json',
      precautions: 'প্রয়োজনে পেটের নিচে বালিশ দিন'
    },
    {
      id: 103,
      title: 'বসা অবস্থায় সামনের দিকে ঝোঁকা (পরিবর্তিত)',
      benefits: [
        'পিঠ ও হ্যামস্ট্রিং স্ট্রেচ করে',
        'স্নায়ুতন্ত্র শান্ত করে',
        'হজমশক্তি উন্নত করে',
        'হালকা উদ্বেগ কমায়'
      ],
      duration: '৪ মিনিট',
      level: 'শুরুকারী',
      category: 'flexibility',
      steps: [
        'পা সামান্য ফাঁক করে সোজা হয়ে বসুন',
        'প্রয়োজনে হাঁটুর নিচে বালিশ রাখুন',
        'শ্বাস নিন এবং মেরুদণ্ড সোজা করুন',
        'শ্বাস ছাড়ুন ও কোমর থেকে ধীরে ধীরে সামনের দিকে ঝুঁকুন',
        'হাত পায়ে বা মাটিতে রাখুন, যেন চাপ না পড়ে'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_q6zrppfj.json',
      precautions: 'পিঠ অতিরিক্ত বাঁকাবেন না বা অপ্রয়োজনীয়ভাবে টান দেবেন না'
    }
  ]
},'gu-IN': {
  1: [
    {
      id: 101,
      title: 'સૌમ્ય બિલાડી-ગાય આસન',
      benefits: [
        'પીઠનો તણાવ ઘટાડે છે',
        'રીઢની લવચીકતા વધારશે',
        'મોર્નિંગ સિકનેસ ઘટાડે છે',
        'મન અને શરીરમાં આરામ આપે છે'
      ],
      duration: '૫ મિનિટ',
      level: 'શરુઆતી',
      category: 'flexibility',
      steps: [
        'હાથ અને ઘૂંટણ પર સ્થિત થાઓ',
        'શ્વાસ લો: પીઠ વાંકી કરો, માથું ઉંચું કરો (ગાય)',
        'શ્વાસ છોડો: રીઢને ગોળ કરો, ચીન અંદર કરો (બિલાડી)',
        'તમારા શ્વાસ સાથે ધીમે ધીમે હલનચલન કરો',
        '૫–૮ વખત પુનરાવૃત્તિ કરો'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
      precautions: 'ચક્કર આવતું હોય તો ટાળો'
    },
    {
      id: 102,
      title: 'બાજુથી સૂવાનું શવાસન',
      benefits: [
        'શરીરને આરામ આપે છે',
        'થાક અને તણાવ ઘટાડે છે',
        'લોહીની સંચારીતાને સુધારે છે',
        'માઈન્ડફુલનેસને ઉત્સાહ આપે છે'
      ],
      duration: '૭ મિનિટ',
      level: 'બધા સ્તરો માટે',
      category: 'relaxation',
      steps: [
        'ડાબી બાજુ પર સૂવો, ઘૂંટણ વચ્ચે તકીયો રાખો',
        'માથા નીચે નાનું ટુવાલ અથવા તકીયો રાખો',
        'હાથ આરામદાયક સ્થિતિમાં રાખો',
        'આંખો બંધ કરીને ઊંડો શ્વાસ લો',
        '૫–૭ મિનિટ સુધી આ સ્થિતિમાં રહો'
      ],
      animation: 'https://assets6.lottiefiles.com/packages/lf20_ihqvye2h.json',
      precautions: 'જરૂર હોય તો પેટ નીચે સહારો આપો'
    },
    {
      id: 103,
      title: 'બેઠીને આગળ વાળવું (મોડિફાઈ)',
      benefits: [
        'પીઠ અને હેમસ્ટ્રિંગને ખેંચ આપે છે',
        'નર્વસ સિસ્ટમને શાંત કરે છે',
        'પાચન સુધારે છે',
        'હળવો ચિંતાને દૂર કરે છે'
      ],
      duration: '૪ મિનિટ',
      level: 'શરુઆતી',
      category: 'flexibility',
      steps: [
        'પગ થોડી દૂર રાખી સીધા બેસો',
        'ઘૂંટણ નીચે તકીયો જરૂર મુજબ મૂકો',
        'શ્વાસ લેતા પીઠ ઊંચી કરો',
        'શ્વાસ છોડતા કટિથી આગળ વાળો',
        'હાથ પાંસે અથવા જમીન પર મૂકો — દબાણ ન આવવું જોઈએ'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_q6zrppfj.json',
      precautions: 'પીઠ ગોળ ન કરો કે વધારે આગળ ન વાળો'
    }
  ]
},'ml-IN': {
  1: [
    {
      id: 101,
      title: 'സൗമ്യമായ പൂച്ച-കാള യോഗാസനം',
      benefits: [
        'പിറകുവശമുള്ള ഉരസലുകൾ ശമിപ്പിക്കുന്നു',
        'ചിതയിലെ ചലനക്ഷമത മെച്ചപ്പെടുത്തുന്നു',
        'പ്രഭാത ഘട്ടത്തിലെ മനസ്സിലാവാത്ത സമ്മര്‍ദ്ദം കുറയ്ക്കുന്നു',
        'ആരോഗ്യകരമായ വിശ്രമം നൽകുന്നു'
      ],
      duration: '5 മിനിറ്റ്',
      level: 'ആരംഭക്കാര്‍',
      category: 'flexibility',
      steps: [
        'കൈയും മുട്ടയും നിലയിലാക്കുക',
        'ശ്വാസം എടുക്കുക: ചിത വളച്ചാണ് തല ഉയർത്തുക (കാള)',
        'ശ്വാസം വിടുക: ചിത ഗോളമായി വളയ്‌ക്കുക, താടി കുഴിയിലാക്കി (പൂച്ച)',
        'നിങ്ങളുടെ ശ്വാസവുമായി സന്തുലിതമായി ചലിക്കുക',
        '5–8 തവണ മെല്ലെ ആവർത്തിക്കുക'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
      precautions: 'ചക്രം വന്നാല്‍ ചെയ്യരുത്'
    },
    {
      id: 102,
      title: 'വശത്തേയ്ക്ക് കിടക്കുന്ന ശവാസനം',
      benefits: [
        'മുഴുവൻ ശരീരത്തെയും ശമിപ്പിക്കുന്നു',
        'കലര്‍ച്ചയും സമ്മര്‍ദ്ദവും കുറയ്ക്കുന്നു',
        'രക്തചംക്രമണം മെച്ചപ്പെടുത്തുന്നു',
        'മനസ്സ് ശാന്തമാക്കുന്നു'
      ],
      duration: '7 മിനിറ്റ്',
      level: 'എല്ലാ നിലകൾക്കും',
      category: 'relaxation',
      steps: [
        'ഇടത് വശത്ത് കിടക്കുക, മുട്ടക്കിടയില്‍ തലയണ വെക്കുക',
        'തലയിന്‍റെ കീഴില്‍ തുണിയോ ചെറിയ തലയണയോ വെക്കുക',
        'കൈകള്‍ ആകുന്ന വിധത്തില്‍ ഇരിക്കുക',
        'കണ്ണുകൾ അടച്ച് ആഴത്തിൽ ശ്വാസം എടുക്കുക',
        '5–7 മിനിറ്റ് ഈ നിലയില്‍ ഇരിക്കുക'
      ],
      animation: 'https://assets6.lottiefiles.com/packages/lf20_ihqvye2h.json',
      precautions: 'വയറിന് താഴെ തുണി വെക്കാവുന്നതാണ്'
    },
    {
      id: 103,
      title: 'ഇറുമ്പുകാലി മുന്നിലേക്ക് വെട്ടി ഇരിക്കൽ (മാറ്റം ചെയ്ത രൂപം)',
      benefits: [
        'പിറകുവശവും അഗ്രചലനശേഷിയും നീട്ടുന്നു',
        'നാഡീമണ്ഡലം ശാന്തമാക്കുന്നു',
        'ജീർണ്ണശേഷി മെച്ചപ്പെടുത്തുന്നു',
        'ലഘുവായ മാനസിക സമ്മര്‍ദ്ദം കുറയ്ക്കുന്നു'
      ],
      duration: '4 മിനിറ്റ്',
      level: 'ആരംഭക്കാര്‍',
      category: 'flexibility',
      steps: [
        'കാല് വശങ്ങള്‍ വിട്ട് നേരിട്ട് ഇരിക്കുക',
        'മുട്ടയ്ക്ക് കീഴില്‍ തലയണ ഉപയോഗിക്കുക ആവശ്യമായി വന്നാൽ',
        'ശ്വാസം എടുക്കുമ്പോള്‍ പിറകു നീട്ടുക',
        'ശ്വാസം വിടുമ്പോള്‍ ചെറുതായി കിഴിഞ്ഞു മുന്നോട്ട് ചേരുക',
        'കൈകള്‍ കാല്‍മുട്ടിലോ നിലത്തോ ഇടുക'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_q6zrppfj.json',
      precautions: 'പിറകു വളയരുത് അല്ലെങ്കില്‍ അതിരു കടക്കരുത്'
    }
  ]
},'pa-IN': {
  1: [
    {
      id: 101,
      title: 'ਹੌਲੀ ਕੈਟ-ਕਾਉ ਪੋਜ਼',
      benefits: [
        'ਪੀਠ ਦੀ ਖਿੱਚ ਘਟਾਉਂਦਾ ਹੈ',
        'ਰੀੜ੍ਹ ਦੀ ਲਚਕ ਨੂੰ ਵਧਾਉਂਦਾ ਹੈ',
        'ਸਵੇਰ ਦੀ ਮਤਲੀ ਘਟਾਉਂਦਾ ਹੈ',
        'ਆਰਾਮ ਅਤੇ ਰਿਲੈਕਸੇਸ਼ਨ ਲਈ ਵਧੀਆ'
      ],
      duration: '5 ਮਿੰਟ',
      level: 'ਬਿਗਿਨਰ',
      category: 'flexibility',
      steps: [
        'ਹੱਥਾਂ ਅਤੇ ਘੁੱਟਿਆਂ ਦੇ ਬਲ ਆ ਜਾਓ',
        'ਸਾਹ ਲਵੋ: ਪਿੱਠ ਨੂੰ ਖਿੱਚੋ, ਸਿਰ ਚੁੱਕੋ (ਕਾਉ)',
        'ਸਾਹ ਛੱਡੋ: ਪਿੱਠ ਨੂੰ ਗੋਲ ਕਰੋ, ਥੋੜ੍ਹੀ ਨੀਂਹੇ ਵੱਲ (ਕੈਟ)',
        'ਆਪਣੀ ਸਾਹ ਨਾਲ ਹੌਲੀ ਹੌਲੀ ਹਿਲੋ',
        'ਇਹ ਕ੍ਰਿਆ 5-8 ਵਾਰ ਦੁਹਰਾਓ'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
      precautions: 'ਚੱਕਰ ਆਉਣ ਦੀ ਸਥਿਤੀ ਵਿੱਚ ਨਾ ਕਰੋ'
    },
    {
      id: 102,
      title: 'ਵੱਝੀ ਹੋਈ ਸ਼ਵ ਆਸਨ',
      benefits: [
        'ਸਾਰੇ ਸ਼ਰੀਰ ਨੂੰ ਆਰਾਮ ਦਿੰਦਾ ਹੈ',
        'ਥਕਾਵਟ ਅਤੇ ਤਣਾਅ ਘਟਾਉਂਦਾ ਹੈ',
        'ਖੂਨ ਦੇ ਪਰਵਾਹ ਨੂੰ ਵਧਾਉਂਦਾ ਹੈ',
        'ਮਨ ਨੂੰ ਸ਼ਾਂਤ ਕਰਦਾ ਹੈ'
      ],
      duration: '7 ਮਿੰਟ',
      level: 'ਸਭ ਲੈਵਲ',
      category: 'relaxation',
      steps: [
        'ਖੱਬੇ ਪਾਸੇ ਲੇਟੋ, ਘੁੱਟਿਆਂ ਵਿਚਕਾਰ ਤਕੀਆ ਰੱਖੋ',
        'ਸਿਰ ਹੇਠਾਂ ਨਰਮ ਤੌਲੀਆ ਜਾਂ ਛੋਟਾ ਤਕੀਆ ਰੱਖੋ',
        'ਹੱਥਾਂ ਨੂੰ ਆਰਾਮਦਾਇਕ ਅਵਸਥਾ ਵਿੱਚ ਰੱਖੋ',
        'ਅੱਖਾਂ ਬੰਦ ਕਰਕੇ ਗਹਿਰੀ ਸਾਂਸ ਲਵੋ',
        '5-7 ਮਿੰਟ ਇਸ ਅਵਸਥਾ ਵਿੱਚ ਰਹੋ'
      ],
      animation: 'https://assets6.lottiefiles.com/packages/lf20_ihqvye2h.json',
      precautions: 'ਲੋੜ ਪਏ ਤਾਂ ਪੇਟ ਹੇਠਾਂ ਸਹਾਰਾ ਵਰਤੋ'
    },
    {
      id: 103,
      title: 'ਬੈਠ ਕੇ ਅੱਗੇ ਵੱਲ ਝੁਕਣਾ (ਸੰਸ਼ੋਧਿਤ)',
      benefits: [
        'ਨਿਮੀਂ ਪਿੱਠ ਅਤੇ ਰਾਨਾਂ ਨੂੰ ਖਿੱਚ ਦਿੰਦਾ ਹੈ',
        'ਨਸਾਂ ਦੇ ਤੰਤਰ ਨੂੰ ਠੰਡਕ ਪਹੁੰਚਾਉਂਦਾ ਹੈ',
        'ਹਜਮਾ ਸੁਧਾਰਦਾ ਹੈ',
        'ਹਲਕੀ ਚਿੰਤਾ ਨੂੰ ਘਟਾਉਂਦਾ ਹੈ'
      ],
      duration: '4 ਮਿੰਟ',
      level: 'ਬਿਗਿਨਰ',
      category: 'flexibility',
      steps: [
        'ਪੈਰਾਂ ਨੂੰ ਥੋੜ੍ਹਾ ਖੁੱਲ੍ਹਾ ਰੱਖ ਕੇ ਬੈਠੋ',
        'ਲੋੜ ਹੋਵੇ ਤਾਂ ਘੁੱਟਿਆਂ ਹੇਠਾਂ ਬੋਲਸਟਰ ਜਾਂ ਤਕੀਆ ਰੱਖੋ',
        'ਸਾਹ ਲੈਕੇ ਪਿੱਠ ਨੂੰ ਉੱਚਾ ਕਰੋ',
        'ਸਾਹ ਛੱਡ ਕੇ ਹੌਲੀ ਹੌਲੀ ਕਮਰ ਤੋਂ ਅੱਗੇ ਵੱਲ ਝੁਕੋ',
        'ਹੱਥਾਂ ਨੂੰ ਲੱਤਾਂ ਜਾਂ ਫਰਸ਼ ਤੇ ਆਰਾਮ ਨਾਲ ਰੱਖੋ'
      ],
      animation: 'https://assets9.lottiefiles.com/packages/lf20_q6zrppfj.json',
      precautions: 'ਰੀੜ੍ਹ ਨੂੰ ਵੱਧ ਨਾ ਖਿੱਚੋ ਜਾਂ ਜ਼ਬਰਦਸਤੀ ਨਾ ਕਰੋ'
    }
  ]
},










  };

 
const trimesterPoses = yogaData[language]?.[trimester] || yogaData['en-IN'][trimester];

return (
  <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4 md:p-8">
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 text-center"
    >
      <h1 className="text-3xl font-bold text-purple-800 mb-2">
        {translations.title[language] || translations.title['en-IN']}
      </h1>
      <p className="text-gray-600">
        {translations.subtitle[language] || translations.subtitle['en-IN']}
      </p>
    </motion.header>

    <motion.div
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {trimesterPoses.map((pose) => (
        <motion.div
          key={pose.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden transition-all"
        >
          <div className="h-48 bg-pink-100 flex items-center justify-center relative">
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
              <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded mr-2 flex items-center">
                <FaRegClock className="mr-1" /> {pose.duration}
              </span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded flex items-center">
                <FaBaby className="mr-1" /> {pose.level}
              </span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {translations.benefits[language] || translations.benefits['en-IN']}
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
              {pose.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
            </ul>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {translations.steps[language] || translations.steps['en-IN']}
            </h4>
            <ol className="list-decimal pl-5 space-y-1 text-gray-700 mb-4">
              {pose.steps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {translations.precautions[language] || translations.precautions['en-IN']}
            </h4>
            <p className="text-red-600">{pose.precautions}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>

    <div className="mt-12 bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-purple-800 mb-4">
        {translations.tipTitle[language] || translations.tipTitle['en-IN']}
      </h2>
      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
        <p className="text-pink-800">
          {translations.tips[trimester]?.[language] || translations.tips[trimester]?.['en-IN']}
        </p>
      </div>
    </div>
  </div>
);
}
export default PregYogaPage;