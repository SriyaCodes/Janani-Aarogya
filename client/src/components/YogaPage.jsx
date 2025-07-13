import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';

const YogaPage = () => {
  const [selectedYoga, setSelectedYoga] = useState(null);
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState('en-IN');
  const navigate = useNavigate();
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
        }
      }
    };
    fetchUserData();
  }, [auth.currentUser]);

  // Post-pregnancy yoga poses with localized instructions
  const yogaPoses = {
    'en-IN': [
      {
        id: 1,
        name: 'Pelvic Floor Exercises',
        benefits: 'Strengthens pelvic muscles, helps recovery after delivery',
        steps: [
          'Lie on your back with knees bent',
          'Tighten pelvic muscles as if stopping urine flow',
          'Hold for 5 seconds, relax for 5 seconds',
          'Repeat 10 times, 3 sets daily'
        ],
        duration: '5 minutes',
        animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
        precautions: 'Avoid if you have stitches or pain'
      },
      {
        id: 2,
        name: 'Cat-Cow Stretch',
        benefits: 'Improves spine flexibility and abdominal strength',
        steps: [
          'Come to tabletop position (hands and knees)',
          'Inhale: Arch back, lift head (Cow Pose)',
          'Exhale: Round spine, tuck chin (Cat Pose)',
          'Repeat 10 times slowly'
        ],
        duration: '7 minutes',
        animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
        precautions: 'Go gently if you had C-section'
      },
      {
        id: 3,
        name: 'Legs-Up-The-Wall Pose',
        benefits: 'Reduces swelling in legs, improves circulation',
        steps: [
          'Sit close to a wall with side body touching it',
          'Swing legs up the wall as you lie back',
          'Keep arms relaxed by your sides',
          'Hold for 5-10 minutes with deep breathing'
        ],
        duration: '10 minutes',
        animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
        precautions: 'Use pillow under hips if uncomfortable'
      }
    ],
    'hi-IN': [
      {
        id: 1,
        name: 'श्रोणि तल व्यायाम',
        benefits: 'प्रसव के बाद पेल्विक मांसपेशियों को मजबूत करता है',
        steps: [
          'पीठ के बल लेटकर घुटनों को मोड़ें',
          'पेल्विक मसल्स को सिकोड़ें जैसे पेशाब रोक रहे हों',
          '5 सेकंड रोककर रखें, 5 सेकंड आराम दें',
          '10 बार दोहराएं, दिन में 3 सेट करें'
        ],
        duration: '5 मिनट',
        animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
        precautions: 'टांके या दर्द होने पर न करें'
      },
      {
        id: 2,
        name: 'मार्जरी-गोमुख आसन',
        benefits: 'रीढ़ की लचक बढ़ाता है और पेट की मांसपेशियों को मजबूत करता है',
        steps: [
          'हाथ और घुटनों के बल टेबलटॉप स्थिति में आएं',
          'सांस लें: पीठ को धनुषाकार करें, सिर ऊपर उठाएं (गाय मुद्रा)',
          'सांस छोड़ें: रीढ़ को गोल करें, ठोड़ी को अंदर लाएं (बिल्ली मुद्रा)',
          '10 बार धीरे-धीरे दोहराएं'
        ],
        duration: '7 मिनट',
        animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
        precautions: 'सी-सेक्शन होने पर धीरे से करें'
      },
      {
        id: 3,
        name: 'विपरीत करणी आसन',
        benefits: 'पैरों की सूजन कम करता है, रक्त संचार सुधारता है',
        steps: [
          'दीवार के पास बैठें जिससे शरीर का एक तरफ का हिस्सा दीवार को छुए',
          'पीठ के बल लेटते हुए पैरों को दीवार पर ऊपर उठाएं',
          'हाथों को शरीर के बगल में आराम से रखें',
          'गहरी सांसों के साथ 5-10 मिनट तक रुकें'
        ],
        duration: '10 मिनट',
        animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
        precautions: 'कूल्हों के नीचे तकिया लगाएं यदि असहज महसूस हो'
      }
    ],
    'ta-IN': [
      {
        id: 1,
        name: 'இடுப்பு தளப் பயிற்சிகள்',
        benefits: 'பிரசவத்திற்குப் பிறகு இடுப்பு தசைகளை வலுப்படுத்துகிறது',
        steps: [
          'முதுகில் படுத்து முழங்கால்களை வளைக்கவும்',
          'சிறுநீரை நிறுத்துவது போல் இடுப்பு தசைகளை இறுக்கவும்',
          '5 விநாடிகள் வைத்திருந்து, 5 விநாடிகள் ஓய்வெடுக்கவும்',
          '10 முறை செய்யவும், தினமும் 3 செட்'
        ],
        duration: '5 நிமிடங்கள்',
        animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
        precautions: 'தையல்கள் அல்லது வலி இருந்தால் தவிர்க்கவும்'
      },
      {
        id: 2,
        name: 'பூனை-மாடு நீட்சி',
        benefits: 'முதுகெலும்பின் நெகிழ்வுத்தன்மையையும் வயிற்று வலிமையையும் மேம்படுத்துகிறது',
        steps: [
          'மேசை மேல் நிலை (கைகள் மற்றும் முழங்கால்கள்)க்கு வாருங்கள்',
          'உள்ளிழுக்க: முதுகை வளைக்க, தலையை உயர்த்தவும் (மாடு போஸ்)',
          'வெளியேற்று: முதுகெலும்பை வட்டமாக்க, தாடையை உள்ளிழுக்க (பூனை போஸ்)',
          '10 முறை மெதுவாக திரும்பத் திரும்ப செய்யவும்'
        ],
        duration: '7 நிமிடங்கள்',
        animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
        precautions: 'சி-பிரிவு இருந்தால் மெதுவாக செய்யவும்'
      },
      {
        id: 3,
        name: 'சுவர் ஏற்ற கால் போஸ்',
        benefits: 'கால்களின் வீக்கத்தைக் குறைக்கிறது, இரத்த ஓட்டத்தை மேம்படுத்துகிறது',
        steps: [
          'உங்கள் பக்க உடல் அதைத் தொடும் வகையில் ஒரு சுவருக்கு அருகில் உட்காரவும்',
          'நீங்கள் பின்னால் படுக்கும்போது கால்களை சுவரில் ஏற்றவும்',
          'உங்கள் கைகளை உங்கள் பக்கங்களில் ஓய்வெடுக்கவும்',
          'ஆழமான சுவாசத்துடன் 5-10 நிமிடங்கள் வைத்திருங்கள்'
        ],
        duration: '10 நிமிடங்கள்',
        animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
        precautions: 'அசௌகரியமாக இருந்தால் இடுப்புகளின் கீழ் தலையணையைப் பயன்படுத்தவும்'
      }
    ]
  };

  // Get poses for current language
  const poses = yogaPoses[language] || yogaPoses['en-IN'];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-purple-800 mb-2">
          {language === 'hi-IN' ? 'प्रसवोत्तर योग' : 
           language === 'ta-IN' ? 'பிரசவம் பிறகு யோகா' : 
           'Post-Pregnancy Yoga'}
        </h1>
        <p className="text-gray-600">
          {language === 'hi-IN' ? 'धीरे-धीरे शरीर को मजबूत बनाएं' : 
           language === 'ta-IN' ? 'உடலை படிப்படியாக வலுப்படுத்துங்கள்' : 
           'Gently strengthen your body'}
        </p>
      </motion.header>

      {/* Yoga Pose Grid */}
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
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all"
            onClick={() => setSelectedYoga(pose)}
          >
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <Player
                autoplay
                loop
                src={pose.animation}
                style={{ height: '100%', width: '100%' }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">{pose.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{pose.benefits}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                  {pose.duration}
                </span>
                <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  {language === 'hi-IN' ? 'विवरण देखें' : 
                   language === 'ta-IN' ? 'விவரங்களைக் காண்க' : 
                   'View Details'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Yoga Pose Detail Modal */}
      <AnimatePresence>
        {selectedYoga && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedYoga(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-64 bg-gray-100 relative">
                <Player
                  autoplay
                  loop
                  src={selectedYoga.animation}
                  style={{ height: '100%', width: '100%' }}
                />
                <button
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
                  onClick={() => setSelectedYoga(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-purple-800 mb-4">{selectedYoga.name}</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {language === 'hi-IN' ? 'लाभ' : 
                     language === 'ta-IN' ? 'நன்மைகள்' : 
                     'Benefits'}
                  </h3>
                  <p className="text-gray-700">{selectedYoga.benefits}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {language === 'hi-IN' ? 'चरण' : 
                     language === 'ta-IN' ? 'படிகள்' : 
                     'Steps'}
                  </h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    {selectedYoga.steps.map((step, index) => (
                      <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {language === 'hi-IN' ? 'सावधानियां' : 
                     language === 'ta-IN' ? 'முன்னெச்சரிக்கைகள்' : 
                     'Precautions'}
                  </h3>
                  <p className="text-red-600">{selectedYoga.precautions}</p>
                </div>

                <button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition"
                  onClick={async () => {
                    // Track yoga started in user's history
                    if (auth.currentUser) {
                      try {
                        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                          yogaHistory: arrayUnion({
                            pose: selectedYoga.name,
                            date: new Date().toISOString(),
                            duration: selectedYoga.duration
                          }),
                          yogaCompleted: (userData?.yogaCompleted || 0) + 1,
                          yogaProgress: Math.min(100, (userData?.yogaProgress || 0) + 10)
                        });
                      } catch (error) {
                        console.error("Error updating yoga progress:", error);
                      }
                    }
                    setSelectedYoga(null);
                  }}
                >
                  {language === 'hi-IN' ? 'अभ्यास शुरू करें' : 
                   language === 'ta-IN' ? 'பயிற்சியைத் தொடங்கவும்' : 
                   'Start Practice'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Tracker */}
      <div className="mt-12 bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">
          {language === 'hi-IN' ? 'आपकी प्रगति' : 
           language === 'ta-IN' ? 'உங்கள் முன்னேற்றம்' : 
           'Your Progress'}
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className="bg-purple-600 h-4 rounded-full" 
            style={{ width: `${userData?.yogaProgress || 0}%` }}
          ></div>
        </div>
        <p className="text-center text-gray-700">
          {language === 'hi-IN' ? `आपने ${userData?.yogaCompleted || 0} योगासन पूरे किए` : 
           language === 'ta-IN' ? `நீங்கள் ${userData?.yogaCompleted || 0} யோகாசனங்களை முடித்துள்ளீர்கள்` : 
           `You've completed ${userData?.yogaCompleted || 0} yoga poses`}
        </p>
      </div>
    </div>
  );
};

export default YogaPage;