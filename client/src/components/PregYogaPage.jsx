import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { Player } from '@lottiefiles/react-lottie-player';
import { FaHeart, FaBookmark, FaRegClock, FaChild, FaBaby } from 'react-icons/fa';

const PregYogaPage = () => {
  const [selectedPose, setSelectedPose] = useState(null);
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState('en-IN');
  const [bookmarked, setBookmarked] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [trimester, setTrimester] = useState(1);
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

  // Pregnancy yoga data organized by trimester and language
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
        // ... more first trimester poses
      ],
      2: [
        {
          id: 201,
          title: 'Supported Bridge Pose',
          benefits: [
            'Relieves lower back pain',
            'Stretches chest and hips',
            'Improves circulation',
            'Calms the nervous system'
          ],
          duration: '3 mins',
          level: 'Beginner',
          category: 'relaxation',
          steps: [
            'Lie on back with knees bent',
            'Place block or pillow under hips',
            'Arms relaxed by sides',
            'Breathe deeply and hold',
            'Release gently after 3 minutes'
          ],
          animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
          precautions: 'Use support if uncomfortable'
        },
        // ... more second trimester poses
      ],
      3: [
        {
          id: 301,
          title: 'Supported Squat',
          benefits: [
            'Opens pelvis for birth',
            'Strengthens legs',
            'Improves posture',
            'Relieves pressure on spine'
          ],
          duration: '2 mins',
          level: 'Intermediate',
          category: 'pelvic',
          steps: [
            'Stand with feet wider than hips',
            'Use wall or chair for support',
            'Slowly lower into squat',
            'Keep knees aligned with toes',
            'Hold for 5-8 breaths'
          ],
          animation: 'https://assets5.lottiefiles.com/packages/lf20_5itouocj.json',
          precautions: 'Stop if any pain occurs'
        },
        // ... more third trimester poses
      ]
    },
    'hi-IN': {
      1: [
        {
          id: 101,
          title: 'कोमल बिल्ली-गाय मुद्रा',
          benefits: [
            'पीठ के तनाव को कम करती है',
            'रीढ़ की लचीलापन बढ़ाती है',
            'मॉर्निंग सिकनेस कम करती है',
            'आराम को बढ़ावा देती है'
          ],
          duration: '5 मिनट',
          level: 'शुरुआती',
          category: 'flexibility',
          steps: [
            'हाथों और घुटनों के बल आएं',
            'श्वास लें: पीठ मोड़ें, सिर ऊपर (गाय)',
            'श्वास छोड़ें: रीढ़ गोल करें, ठोड़ी नीचे (बिल्ली)',
            'धीरे-धीरे सांस के साथ हिलें',
            '5-8 बार धीरे से दोहराएं'
          ],
          animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
          precautions: 'चक्कर आने पर न करें'
        },
        // ... more Hindi poses
      ],
      2: [
        // ... second trimester Hindi poses
      ],
      3: [
        // ... third trimester Hindi poses
      ]
    },
    'ta-IN': {
      1: [
        {
          id: 101,
          title: 'மென்மையான பூனை-மாடு தோரணை',
          benefits: [
            'முதுகு பதற்றத்தை குறைக்கிறது',
            'முதுகெலும்பு நெகிழ்வுத்தன்மையை மேம்படுத்துகிறது',
            'காலை நேர மயக்கத்தை குறைக்கிறது',
            'ஓய்வை ஊக்குவிக்கிறது'
          ],
          duration: '5 நிமிடங்கள்',
          level: 'தொடக்கநிலை',
          category: 'flexibility',
          steps: [
            'கைகள் மற்றும் முழங்கால்களில் வந்து நில்லுங்கள்',
            'மூச்சிழுக்க: முதுகை வளைக்க, தலையை உயர்த்தவும் (மாடு)',
            'மூச்சுவிட: முதுகெலும்பை வட்டமாக்க, தாடையை உள்நோக்கி (பூனை)',
            'மூச்சுடன் மெதுவாக நகரவும்',
            '5-8 முறை மெதுவாக திரும்ப செய்யவும்'
          ],
          animation: 'https://assets9.lottiefiles.com/packages/lf20_skaukw.json',
          precautions: 'தலைச்சுற்றல் ஏற்பட்டால் தவிர்க்கவும்'
        },
        // ... more Tamil poses
      ],
      2: [
        // ... second trimester Tamil poses
      ],
      3: [
        // ... third trimester Tamil poses
      ]
    }
  };

  // Get poses for current language and trimester
  const trimesterPoses = yogaData[language]?.[trimester] || yogaData['en-IN'][trimester];
  const filteredPoses = activeTab === 'all' 
    ? trimesterPoses 
    : trimesterPoses.filter(pose => pose.category === activeTab);

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
          {language === 'hi-IN' ? 'गर्भावस्था योग' : 
           language === 'ta-IN' ? 'கர்ப்ப கால யோகா' : 
           'Prenatal Yoga'}
        </h1>
        <p className="text-gray-600">
          {language === 'hi-IN' ? 'माँ और बच्चे के लिए सुरक्षित अभ्यास' : 
           language === 'ta-IN' ? 'தாய் மற்றும் குழந்தைக்கு பாதுகாப்பான பயிற்சிகள்' : 
           'Safe practices for mother and baby'}
        </p>
        
        {/* Trimester Selector */}
        <div className="flex justify-center mt-4 mb-6">
          <div className="inline-flex rounded-md shadow-sm">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => setTrimester(num)}
                className={`px-4 py-2 text-sm font-medium ${trimester === num 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-purple-700 hover:bg-purple-50'} 
                  ${num === 1 ? 'rounded-l-lg' : ''} 
                  ${num === 3 ? 'rounded-r-lg' : ''} 
                  border border-purple-200`}
              >
                {language === 'hi-IN' ? `${num}री तिमाही` : 
                 language === 'ta-IN' ? `${num}வது மூன்று மாதம்` : 
                 `Trimester ${num}`}
              </button>
            ))}
          </div>
        </div>
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
          className={`px-4 py-2 rounded-full whitespace-nowrap mr-2 ${activeTab === 'flexibility' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'}`}
          onClick={() => setActiveTab('flexibility')}
        >
          {language === 'hi-IN' ? 'लचीलापन' : 
           language === 'ta-IN' ? 'நெகிழ்வுத்தன்மை' : 
           'Flexibility'}
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap mr-2 ${activeTab === 'relaxation' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'}`}
          onClick={() => setActiveTab('relaxation')}
        >
          {language === 'hi-IN' ? 'आराम' : 
           language === 'ta-IN' ? 'ஓய்வு' : 
           'Relaxation'}
        </button>
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'pelvic' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'}`}
          onClick={() => setActiveTab('pelvic')}
        >
          {language === 'hi-IN' ? 'श्रोणि' : 
           language === 'ta-IN' ? 'இடுப்பு' : 
           'Pelvic'}
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
            <div className="h-48 bg-pink-100 flex items-center justify-center relative">
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
                <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded mr-2 flex items-center">
                  <FaRegClock className="mr-1" /> {pose.duration}
                </span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded flex items-center">
                  <FaBaby className="mr-1" /> {pose.level}
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
              <div className="h-56 bg-pink-100 relative">
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
                  <span className="text-sm bg-pink-100 text-pink-800 px-3 py-1 rounded-full mr-2 flex items-center">
                    <FaRegClock className="mr-1" /> {selectedPose.duration}
                  </span>
                  <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center">
                    <FaBaby className="mr-1" /> {selectedPose.level}
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
                            trimester: trimester
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
        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
          <p className="text-pink-800">
            {trimester === 1 && (language === 'hi-IN' ? 'पहली तिमाही में ज़ोरदार मुद्राओं से बचें। धीमी, कोमल गतिविधियों पर ध्यान दें और खूब पानी पिएँ।' : 
             language === 'ta-IN' ? 'முதல் மூன்று மாதங்களில் தீவிரமான தோரணைகளைத் தவிர்க்கவும். மெதுவான, மென்மையான செயல்பாடுகளில் கவனம் செலுத்துங்கள் மற்றும் நிறைய தண்ணீர் குடிக்கவும்.' : 
             'Avoid vigorous poses in first trimester. Focus on slow, gentle movements and drink plenty of water.')
            }
            {trimester === 2 && (language === 'hi-IN' ? 'दूसरी तिमाही में संतुलन मुद्राओं के लिए दीवार का सहारा लें। पेट के बल लेटने से बचें।' : 
             language === 'ta-IN' ? 'இரண்டாவது மூன்று மாதங்களில் சமநிலை தோரணைகளுக்கு சுவரைப் பயன்படுத்தவும். வயிற்றில் படுத்துக்கொள்வதைத் தவிர்க்கவும்.' : 
             'Use wall for balance poses in second trimester. Avoid lying on your belly.')
            }
            {trimester === 3 && (language === 'hi-IN' ? 'तीसरी तिमाही में श्रोणि खोलने वाली मुद्राओं पर ध्यान दें। लंबे समय तक पीठ के बल न लेटें।' : 
             language === 'ta-IN' ? 'மூன்றாவது மூன்று மாதங்களில் இடுப்பை திறக்கும் தோரணைகளில் கவனம் செலுத்துங்கள். நீண்ட நேரம் முதுகில் படுத்துக்கொள்ளாதீர்கள்.' : 
             'Focus on pelvis-opening poses in third trimester. Don\'t lie on back for long periods.')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default PregYogaPage;