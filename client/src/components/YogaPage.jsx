import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { Player } from '@lottiefiles/react-lottie-player';
import { FaHeart, FaBookmark, FaRegClock, FaChild } from 'react-icons/fa';

const PostYogaPage = () => {
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

  // Post-pregnancy yoga data
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
        category: 'core',
        steps: [
          'Lie on your back with knees bent',
          'Flatten lower back against the floor',
          'Tilt pelvis slightly upward',
          'Hold for 3 breaths and release',
          'Repeat 8-10 times'
        ],
        animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
        precautions: 'Avoid if you have diastasis recti'
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
        category: 'relaxation',
        steps: [
          'Sit comfortably with spine straight',
          'Place hands on lap or knees',
          'Close eyes and focus on breath',
          'Breathe deeply for 5 counts',
          'Exhale slowly for 7 counts'
        ],
        animation: 'https://assets8.lottiefiles.com/packages/lf20_3rwqjbjm.json',
        precautions: 'Use cushion for support if needed'
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
        category: 'flexibility',
        steps: [
          'Come to hands and knees position',
          'Inhale: Arch back, lift head (Cow)',
          'Exhale: Round spine, tuck chin (Cat)',
          'Move slowly with your breath',
          'Repeat 8-10 times'
        ],
        animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
        precautions: 'Go gently if you had C-section'
      }
    ],
    'hi-IN': [
      {
        id: 1,
        title: 'कोमल श्रोणि झुकाव',
        benefits: [
          'पेट की मांसपेशियों को मजबूत करता है',
          'श्रोणि संरेखण में सुधार करता है',
          'कमर दर्द को कम करता है'
        ],
        duration: '5 मिनट',
        level: 'शुरुआती',
        category: 'core',
        steps: [
          'पीठ के बल लेटकर घुटनों को मोड़ें',
          'निचली पीठ को फर्श पर सपाट करें',
          'श्रोणि को थोड़ा ऊपर की ओर झुकाएं',
          '3 सांसों तक रोककर रखें और छोड़ें',
          '8-10 बार दोहराएं'
        ],
        animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
        precautions: 'डायस्टेसिस रेक्टी हो तो न करें'
      },
      // ... more in Hindi
    ],
    'ta-IN': [
      {
        id: 1,
        title: 'மென்மையான இடுப்பு சாய்வு',
        benefits: [
          'வயிற்று தசைகளை வலுப்படுத்துகிறது',
          'இடுப்பு சீரமைப்பை மேம்படுத்துகிறது',
          'கீழ் முதுகு வலியை குறைக்கிறது'
        ],
        duration: '5 நிமிடங்கள்',
        level: 'தொடக்கநிலை',
        category: 'core',
        steps: [
          'முதுகில் படுத்து முழங்கால்களை வளைக்கவும்',
          'கீழ் முதுகை தரையில் சமப்படுத்தவும்',
          'இடுப்பை சிறிது மேல்நோக்கி சாய்த்து',
          '3 மூச்சுகள் வரை பிடித்து விட்டுவிடவும்',
          '8-10 முறை திரும்ப செய்யவும்'
        ],
        animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
        precautions: 'டயாஸ்டேசிஸ் ரெக்டி இருந்தால் தவிர்க்கவும்'
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">
          {language === 'hi-IN' ? 'प्रसवोत्तर योग' : 
           language === 'ta-IN' ? 'பிரசவத்திற்குப் பின் யோகா' : 
           'Post-Pregnancy Yoga'}
        </h1>
        <p className="text-gray-600">
          {language === 'hi-IN' ? 'धीरे-धीरे शक्ति और लचीलापन बढ़ाएं' : 
           language === 'ta-IN' ? 'படிப்படியாக வலிமை மற்றும் நெகிழ்வுத்தன்மையை அதிகரிக்கவும்' : 
           'Gently rebuild strength and flexibility'}
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
          className={`px-4 py-2 rounded-full whitespace-nowrap mr-2 ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}
          onClick={() => setActiveTab('all')}
        >
          {language === 'hi-IN' ? 'सभी' : 
           language === 'ta-IN' ? 'அனைத்தும்' : 
           'All'}
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap mr-2 ${activeTab === 'core' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}
          onClick={() => setActiveTab('core')}
        >
          {language === 'hi-IN' ? 'कोर' : 
           language === 'ta-IN' ? 'கோர்' : 
           'Core'}
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap mr-2 ${activeTab === 'relaxation' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}
          onClick={() => setActiveTab('relaxation')}
        >
          {language === 'hi-IN' ? 'आराम' : 
           language === 'ta-IN' ? 'ஓய்வு' : 
           'Relaxation'}
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'flexibility' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}
          onClick={() => setActiveTab('flexibility')}
        >
          {language === 'hi-IN' ? 'लचीलापन' : 
           language === 'ta-IN' ? 'நெகிழ்வுத்தன்மை' : 
           'Flexibility'}
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
            <div className="h-48 bg-blue-100 flex items-center justify-center relative">
              <Player
                autoplay
                loop
                src={pose.animation}
                style={{ height: '100%', width: '100%' }}
              />
              <button
                className={`absolute top-4 right-4 p-2 rounded-full ${bookmarked.includes(pose.id) ? 'text-indigo-600' : 'text-gray-400'}`}
                onClick={() => toggleBookmark(pose.id)}
              >
                <FaBookmark className="text-2xl" />
              </button>
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
              
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition"
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
              <div className="h-56 bg-blue-100 relative">
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
                  <h2 className="text-2xl font-bold text-indigo-800">{selectedPose.title}</h2>
                  <button 
                    className={`p-2 ${bookmarked.includes(selectedPose.id) ? 'text-indigo-600' : 'text-gray-400'}`}
                    onClick={() => toggleBookmark(selectedPose.id)}
                  >
                    <FaBookmark className="text-xl" />
                  </button>
                </div>
                
                <div className="flex mb-4">
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-2 flex items-center">
                    <FaRegClock className="mr-1" /> {selectedPose.duration}
                  </span>
                  <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center">
                    <FaChild className="mr-1" /> {selectedPose.level}
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
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
                  onClick={async () => {
                    if (auth.currentUser) {
                      try {
                        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                          yogaHistory: arrayUnion({
                            pose: selectedPose.title,
                            date: new Date().toISOString(),
                            duration: selectedPose.duration
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
        <h2 className="text-xl font-semibold text-indigo-800 mb-4">
          {language === 'hi-IN' ? 'आज का योग टिप' : 
           language === 'ta-IN' ? 'இன்றைய யோகா உதவிக்குறிப்பு' : 
           'Today\'s Yoga Tip'}
        </h2>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            {language === 'hi-IN' ? 'प्रसव के बाद पहले 6 सप्ताह तक केवल कोमल योग मुद्राएं ही करें। अपने शरीर को धीरे-धीरे मजबूत होने दें।' : 
             language === 'ta-IN' ? 'பிரசவத்திற்குப் பின் முதல் 6 வாரங்களுக்கு மென்மையான யோகாசனங்களை மட்டுமே செய்யவும். உங்கள் உடல் படிப்படியாக வலுப்படையட்டும்.' : 
             'For the first 6 weeks after delivery, only practice gentle yoga poses. Let your body strengthen gradually.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostYogaPage;