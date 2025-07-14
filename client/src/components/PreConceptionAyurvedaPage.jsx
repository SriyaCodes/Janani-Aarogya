import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { Player } from '@lottiefiles/react-lottie-player';
import { FaHeart, FaBookmark, FaLeaf, FaSeedling } from 'react-icons/fa';

const PreConceptionAyurvedaPage = () => {
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState('en-IN');
  const [bookmarked, setBookmarked] = useState([]);
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
          setBookmarked(docSnap.data().bookmarkedRemedies || []);
        }
      }
    };
    fetchUserData();
  }, [auth.currentUser]);

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
        precautions: 'Avoid if Kapha imbalance (excessive weight)'
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
        precautions: 'Reduce if experiencing dryness'
      }
    ],
    'hi-IN': [
      {
        id: 1,
        title: 'गर्भधारण की तैयारी का चूर्ण',
        description: 'हार्मोन संतुलित करता है और प्रजनन स्वास्थ्य सुधारता है',
        benefits: [
          'मासिक धर्म नियमित करता है',
          'अंडे/शुक्राणु गुणवत्ता बढ़ाता है',
          'प्रजनन प्रणाली को शुद्ध करता है',
          'गर्भाशय की परत मजबूत करता है'
        ],
        ingredients: [
          '1 चम्मच शतावरी पाउडर',
          '1 चम्मच अश्वगंधा पाउडर',
          '1 चम्मच लोध्र पाउडर',
          '1 चम्मच गोक्षुरा पाउडर',
          '1 चम्मच शहद (वैकल्पिक)'
        ],
        preparation: [
          'सभी चूर्ण मिलाएं',
          '1 चम्मच गर्म दूध या पानी के साथ लें',
          '3-6 महीने तक रोजाना सेवन करें'
        ],
        animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
        frequency: 'रोज सुबह',
        precautions: 'कफ प्रकृति वालों को कम मात्रा में लें'
      }
    ],
    'ta-IN': [
      {
        id: 1,
        title: 'கருத்தரிப்புக்கு முன் சூர்ணம்',
        description: 'இயக்குநீர்களை சமநிலைப்படுத்தி பிறப்பு ஆரோக்கியத்தை மேம்படுத்துகிறது',
        benefits: [
          'மாதவிடாய் சுழற்சியை ஒழுங்குபடுத்துகிறது',
          'முட்டை/விந்தணு தரம் மேம்படுகிறது',
          'பிறப்பு உறுப்புகளை தூய்மைப்படுத்துகிறது',
          'கர்ப்பப்பையின் உள்தளத்தை வலுப்படுத்துகிறது'
        ],
        ingredients: [
          '1 தேக்கரண்டி சதாவரி பொடி',
          '1 தேக்கரண்டி அசுவகந்தா பொடி',
          '1 தேக்கரண்டி லோத்ரா பொடி',
          '1 தேக்கரண்டி கோக்ஷுரா பொடி',
          '1 தேக்கரண்டி தேன் (விருப்பத்திற்குரியது)'
        ],
        preparation: [
          'அனைத்து பொடிகளையும் கலக்கவும்',
          '1 தேக்கரண்டி சுடு பால் அல்லது தண்ணீருடன் எடுத்துக் கொள்ளவும்',
          '3-6 மாதங்கள் தினமும் சாப்பிடவும்'
        ],
        animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
        frequency: 'தினமும் காலை',
        precautions: 'கப தோஷம் இருந்தால் குறைந்த அளவு எடுத்துக்கொள்ளவும்'
      }
    ]
  };

  const remedies = ayurvedicRemedies[language] || ayurvedicRemedies['en-IN'];

  // ... (rest of the component remains the same, just remove trimester-related code)
  
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
          {language === 'hi-IN' ? 'गर्भधारण पूर्व आयुर्वेदिक देखभाल' : 
           language === 'ta-IN' ? 'கருத்தரிப்புக்கு முன் ஆயுர்வேத மருத்துவம்' : 
           'Pre-Conception Ayurvedic Care'}
        </h1>
        <p className="text-gray-600">
          {language === 'hi-IN' ? 'स्वस्थ गर्भावस्था की तैयारी' : 
           language === 'ta-IN' ? 'ஆரோக்கியமான கர்ப்பத்திற்கான தயாரிப்பு' : 
           'Prepare for a healthy pregnancy'}
        </p>
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
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-2 flex items-center">
                  <FaLeaf className="mr-1" /> {remedy.frequency}
                </span>
                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded flex items-center">
                  <FaSeedling className="mr-1" /> 
                  {language === 'hi-IN' ? 'गर्भधारण पूर्व' : 
                   language === 'ta-IN' ? 'கருத்தரிப்புக்கு முன்' : 
                   'Pre-Conception'}
                </span>
              </div>
              
              <button
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition"
                onClick={() => setSelectedRemedy(remedy)}
              >
                {language === 'hi-IN' ? 'विवरण देखें' : 
                 language === 'ta-IN' ? 'விவரங்களைக் காண்க' : 
                 'View Details'}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Daily Tip */}
      <div className="mt-12 bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-teal-800 mb-4">
          {language === 'hi-IN' ? 'आयुर्वेदिक सलाह' : 
           language === 'ta-IN' ? 'ஆயுர்வேத உதவிக்குறிப்பு' : 
           'Ayurvedic Advice'}
        </h2>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-800">
            {language === 'hi-IN' ? 'गर्भधारण से 3-6 महीने पहले शरीर को शुद्ध करें (पंचकर्म करवाएं), संतुलित आहार लें, और तनाव मुक्त रहें। सुबह 6-8 बजे के बीच योग (भ्रामरी प्राणायाम, योग निद्रा) अवश्य करें।' : 
             language === 'ta-IN' ? 'கருத்தரிப்பதற்கு 3-6 மாதங்களுக்கு முன்பு உடலை சுத்தம் செய்யுங்கள் (பஞ்சகர்மம்), சீரான உணவு உண்ணவும், மன அழுத்தம் இல்லாமல் இருங்கள். காலை 6-8 மணிக்கு இடையே யோகா (பிராமரி பிராணாயாமம், யோக நித்ரா) செய்யுங்கள்.' : 
             'Detox your body (Panchakarma) 3-6 months before conception, eat balanced meals, and stay stress-free. Practice yoga (Bhramari Pranayama, Yoga Nidra) daily between 6-8 AM.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreConceptionAyurvedaPage;