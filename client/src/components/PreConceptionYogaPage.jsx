import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { Player } from '@lottiefiles/react-lottie-player';
import { FaHeart, FaBookmark, FaRegClock, FaSeedling } from 'react-icons/fa';

const PreConceptionYogaPage = () => {
  const [selectedPose, setSelectedPose] = useState(null);
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState('en-IN');
  const [bookmarked, setBookmarked] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const auth = getAuth();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setLanguage(docSnap.data().language || 'en-IN');
          setBookmarked(docSnap.data().bookmarkedYoga || []);
        }
      }
    };
    fetchUserData();
  }, [auth.currentUser]);

  // Pre-conception yoga data
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
        title: 'Hormone-Balancing Cobra',
        benefits: [
          'Massages adrenal glands',
          'Strengthens uterine muscles',
          'Relieves menstrual cramps',
          'Enhances ovarian function'
        ],
        duration: '3 mins',
        level: 'Beginner',
        category: 'hormonal',
        steps: [
          'Lie on stomach, palms under shoulders',
          'Inhale: Lift chest gently',
          'Keep pelvis grounded',
          'Hold for 3-5 breaths',
          'Release slowly'
        ],
        animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
        precautions: 'Don\'t overarch if back pain exists'
      },
      {
        id: 3,
        title: 'Stress-Relieving Child\'s Pose',
        benefits: [
          'Calms nervous system',
          'Reduces cortisol levels',
          'Promotes relaxation',
          'Improves sleep quality'
        ],
        duration: '7 mins',
        level: 'All Levels',
        category: 'relaxation',
        steps: [
          'Kneel with big toes touching',
          'Spread knees hip-width apart',
          'Fold forward, arms extended',
          'Forehead rests on mat',
          'Breathe deeply'
        ],
        animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
        precautions: 'Use pillow under forehead if needed'
      }
    ],
    'hi-IN': [
      {
        id: 1,
        title: 'प्रजनन बढ़ाने वाला तितली आसन',
        benefits: [
          'प्रजनन अंगों को उत्तेजित करता है',
          'श्रोणि में रक्त प्रवाह बढ़ाता है',
          'तनाव हार्मोन को कम करता है',
          'मासिक धर्म को नियमित करता है'
        ],
        duration: '5 मिनट',
        level: 'शुरुआती',
        category: 'fertility',
        steps: [
          'पैरों के तलवे मिलाकर बैठें',
          'टखनों को पकड़कर घुटनों को फड़फड़ाएं',
          'सांस लें: रीढ़ को लंबा करें',
          'सांस छोड़ें: आगे की ओर झुकें',
          '20-30 बार दोहराएं'
        ],
        animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
        precautions: 'कूल्हे में चोट हो तो न करें'
      },
      // ... more in Hindi
    ],
    'ta-IN': [
      {
        id: 1,
        title: 'கருவுறுதலை ஊக்குவிக்கும் பட்டாம்பூச்சி போஸ்',
        benefits: [
          'பிறப்பு உறுப்புகளை தூண்டுகிறது',
          'இடுப்புக்கு இரத்த ஓட்டத்தை மேம்படுத்துகிறது',
          'மன அழுத்த ஹார்மோன்களை குறைக்கிறது',
          'மாதவிடாய் சுழற்சியை சீராக்குகிறது'
        ],
        duration: '5 நிமிடங்கள்',
        level: 'தொடக்கநிலை',
        category: 'fertility',
        steps: [
          'பாதங்களை ஒன்றாக இணைத்து உட்காரவும்',
          'கணுக்கால்களை பிடித்து மெதுவாக முழங்கால்களை அசைக்கவும்',
          'மூச்சிழுக்க: முதுகெலும்பை நீட்டவும்',
          'மூச்சுவிட: சிறிது முன்னே வளைக்கவும்',
          '20-30 முறை திரும்ப செய்யவும்'
        ],
        animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
        precautions: 'இடுப்பு காயம் இருந்தால் தவிர்க்கவும்'
      },
      // ... more in Tamil
    ]
  };

  const poses = yogaData[language] || yogaData['en-IN'];
  const filteredPoses = activeTab === 'all' 
    ? poses 
    : poses.filter(pose => pose.category === activeTab);

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

  const toggleBookmark = async (poseId) => {
    const newBookmarked = bookmarked.includes(poseId)
      ? bookmarked.filter(id => id !== poseId)
      : [...bookmarked, poseId];
    
    setBookmarked(newBookmarked);
    
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          bookmarkedYoga: newBookmarked
        });
      } catch (error) {
        console.error("Error updating bookmarks:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-purple-800 mb-2">
          {language === 'hi-IN' ? 'गर्भधारण पूर्व योग' : 
           language === 'ta-IN' ? 'கருத்தரிப்புக்கு முன் யோகா' : 
           'Pre-Conception Yoga'}
        </h1>
        <p className="text-gray-600">
          {language === 'hi-IN' ? 'प्रजनन स्वास्थ्य और हार्मोन संतुलन के लिए' : 
           language === 'ta-IN' ? 'கருவுறுதல் ஆரோக்கியம் மற்றும் ஹார்மோன் சமநிலைக்காக' : 
           'For reproductive health and hormonal balance'}
        </p>
      </motion.header>

      {/* Category Tabs */}
      <motion.div 
        className="flex overflow-x-auto mb-6 pb-2 scrollbar-hide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap mr-2 ${activeTab === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'}`}
          onClick={() => setActiveTab('all')}
        >
          {language === 'hi-IN' ? 'सभी' : 
           language === 'ta-IN' ? 'அனைத்தும்' : 
           'All'}
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap mr-2 ${activeTab === 'fertility' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'}`}
          onClick={() => setActiveTab('fertility')}
        >
          {language === 'hi-IN' ? 'प्रजनन' : 
           language === 'ta-IN' ? 'கருவுறுதல்' : 
           'Fertility'}
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap mr-2 ${activeTab === 'hormonal' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'}`}
          onClick={() => setActiveTab('hormonal')}
        >
          {language === 'hi-IN' ? 'हार्मोनल' : 
           language === 'ta-IN' ? 'ஹார்மோன்' : 
           'Hormonal'}
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'relaxation' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'}`}
          onClick={() => setActiveTab('relaxation')}
        >
          {language === 'hi-IN' ? 'आराम' : 
           language === 'ta-IN' ? 'ஓய்வு' : 
           'Relaxation'}
        </button>
      </motion.div>

      {/* Yoga Pose Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredPoses.map((pose) => (
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
              <button
                className={`absolute top-4 right-4 p-2 rounded-full ${bookmarked.includes(pose.id) ? 'text-purple-600' : 'text-gray-400'}`}
                onClick={() => toggleBookmark(pose.id)}
              >
                <FaBookmark className="text-2xl" />
              </button>
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
              
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition"
                onClick={() => setSelectedPose(pose)}
              >
                {language === 'hi-IN' ? 'विवरण देखें' : 
                 language === 'ta-IN' ? 'விவரங்களைக் காண்க' : 
                 'View Details'}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pose Detail Modal */}
      <AnimatePresence>
        {selectedPose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPose(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-56 bg-purple-100 relative">
                <Player
                  autoplay
                  loop
                  src={selectedPose.animation}
                  style={{ height: '100%', width: '100%' }}
                />
                <button
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
                  onClick={() => setSelectedPose(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-purple-800">{selectedPose.title}</h2>
                  <button 
                    className={`p-2 ${bookmarked.includes(selectedPose.id) ? 'text-purple-600' : 'text-gray-400'}`}
                    onClick={() => toggleBookmark(selectedPose.id)}
                  >
                    <FaBookmark className="text-xl" />
                  </button>
                </div>
                
                <div className="flex mb-4">
                  <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full mr-2 flex items-center">
                    <FaRegClock className="mr-1" /> {selectedPose.duration}
                  </span>
                  <span className="text-sm bg-pink-100 text-pink-800 px-3 py-1 rounded-full flex items-center">
                    <FaSeedling className="mr-1" /> {selectedPose.level}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {language === 'hi-IN' ? 'लाभ' : 
                     language === 'ta-IN' ? 'நன்மைகள்' : 
                     'Benefits'}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedPose.benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-700">{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {language === 'hi-IN' ? 'चरण' : 
                     language === 'ta-IN' ? 'படிகள்' : 
                     'Steps'}
                  </h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    {selectedPose.steps.map((step, index) => (
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
                  <p className="text-red-600">{selectedPose.precautions}</p>
                </div>

                <button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition"
                  onClick={async () => {
                    if (auth.currentUser) {
                      try {
                        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                          yogaHistory: arrayUnion({
                            pose: selectedPose.title,
                            date: new Date().toISOString(),
                            duration: selectedPose.duration,
                            category: 'pre-conception'
                          })
                        });
                      } catch (error) {
                        console.error("Error updating yoga history:", error);
                      }
                    }
                    setSelectedPose(null);
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

      {/* Daily Tip */}
      <div className="mt-12 bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">
          {language === 'hi-IN' ? 'आज का योग टिप' : 
           language === 'ta-IN' ? 'இன்றைய யோகா உதவிக்குறிப்பு' : 
           'Today\'s Yoga Tip'}
        </h2>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-purple-800">
            {language === 'hi-IN' ? 'गर्भधारण से 3 महीने पहले नियमित रूप से योग करें। सुबह 5-7 बजे (ब्रह्म मुहूर्त) का समय सबसे अच्छा माना जाता है।' : 
             language === 'ta-IN' ? 'கருத்தரிப்பதற்கு 3 மாதங்களுக்கு முன்பு தினமும் யோகா செய்யவும். காலை 5-7 மணி (பிரம்ம முகூர்த்தம்) சிறந்த நேரம்.' : 
             'Practice yoga regularly 3 months before conception. Early morning 5-7 AM (Brahma Muhurta) is considered most beneficial.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreConceptionYogaPage;