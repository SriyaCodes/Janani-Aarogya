import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { Player } from '@lottiefiles/react-lottie-player';
import { FaHeart, FaBookmark, FaShareAlt } from 'react-icons/fa';

const PostAyurveda = () => {
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState('en-IN');
  const [bookmarked, setBookmarked] = useState([]);
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
        }
      }
    };
    fetchUserData();
  }, [auth.currentUser]);

  // Post-delivery Ayurvedic remedies
  const ayurvedicRemedies = {
    'en-IN': [
      {
        id: 1,
        title: 'Golden Milk Elixir',
        description: 'Traditional healing drink for postpartum recovery',
        benefits: [
          'Boosts immunity and energy',
          'Reduces inflammation',
          'Aids digestion and lactation',
          'Promotes restful sleep'
        ],
        ingredients: [
          '1 cup warm milk (cow or almond)',
          '½ tsp turmeric powder',
          '¼ tsp ginger powder',
          'Pinch of black pepper',
          '1 tsp ghee',
          'Jaggery to taste'
        ],
        preparation: [
          'Heat milk gently (do not boil)',
          'Mix all dry ingredients',
          'Add to warm milk and stir well',
          'Add ghee at the end',
          'Drink warm before bedtime'
        ],
        animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
        duration: 'Daily for 40 days',
        precautions: 'Avoid if allergic to dairy'
      },
      // ... more remedies in English
    ],
    'hi-IN': [
      {
        id: 1,
        title: 'स्वर्ण दूध',
        description: 'प्रसव के बाद की देखभाल के लिए पारंपरिक आयुर्वेदिक पेय',
        benefits: [
          'रोग प्रतिरोधक क्षमता बढ़ाता है',
          'सूजन कम करता है',
          'पाचन और स्तनपान में सहायक',
          'अच्छी नींद लाने में मददगार'
        ],
        ingredients: [
          '1 कप गर्म दूध (गाय या बादाम)',
          '½ चम्मच हल्दी पाउडर',
          '¼ चम्मच सोंठ पाउडर',
          'चुटकी भर काली मिर्च',
          '1 चम्मच घी',
          'गुड़ स्वादानुसार'
        ],
        preparation: [
          'दूध को धीमी आंच पर गर्म करें (उबालें नहीं)',
          'सभी सूखी सामग्री मिलाएं',
          'गर्म दूध में डालकर अच्छी तरह मिलाएं',
          'अंत में घी डालें',
          'सोने से पहले गर्मागर्म पियें'
        ],
        animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
        duration: '40 दिनों तक रोजाना',
        precautions: 'डेयरी से एलर्जी हो तो न पियें'
      },
      // ... more remedies in Hindi
    ],
    'ta-IN': [
      {
        id: 1,
        title: 'பொன் பால்',
        description: 'பிரசவத்திற்குப் பின் சிகிச்சைக்கான பாரம்பரிய ஆயுர்வேத பானம்',
        benefits: [
          'நோயெதிர்ப்பு சக்தியை அதிகரிக்கிறது',
          'வீக்கத்தை குறைக்கிறது',
          'செரிமானம் மற்றும் முலைப்பால் ஊட்டுவதற்கு உதவுகிறது',
          'நல்ல தூக்கத்தை ஊக்குவிக்கிறது'
        ],
        ingredients: [
          '1 கப் சூடான பால் (மாடு அல்லது பாதாம்)',
          '½ தேக்கரண்டி மஞ்சள் தூள்',
          '¼ தேக்கரண்டி இஞ்சி தூள்',
          'சிட்டிகை கருமிளகு',
          '1 தேக்கரண்டி நெய்',
          'வெல்லம் சுவைக்கேற்ப'
        ],
        preparation: [
          'பாலை மெதுவாக சூடாக்கவும் (கொதிக்க விடக்கூடாது)',
          'அனைத்து உலர் பொருட்களையும் கலக்கவும்',
          'சூடான பாலில் சேர்த்து நன்றாக கலக்கவும்',
          'கடைசியில் நெய் சேர்க்கவும்',
          'படுக்கைக்கு செல்வதற்கு முன் சூடாக அருந்தவும்'
        ],
        animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
        duration: '40 நாட்கள் தினமும்',
        precautions: 'பால் வெறுப்பு இருந்தால் தவிர்க்கவும்'
      },
      // ... more remedies in Tamil
    ]
  };

  // Get remedies for current language
  const remedies = ayurvedicRemedies[language] || ayurvedicRemedies['en-IN'];

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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-orange-800 mb-2">
          {language === 'hi-IN' ? 'प्रसवोत्तर आयुर्वेदिक देखभाल' : 
           language === 'ta-IN' ? 'பிரசவத்திற்குப் பின் ஆயுர்வேத மருத்துவம்' : 
           'Post-Delivery Ayurvedic Care'}
        </h1>
        <p className="text-gray-600">
          {language === 'hi-IN' ? 'माँ और शिशु के लिए प्राकृतिक उपचार' : 
           language === 'ta-IN' ? 'தாய் மற்றும் குழந்தைக்கான இயற்கை மருத்துவம்' : 
           'Natural healing for mother and baby'}
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
            <div className="h-48 bg-amber-100 flex items-center justify-center relative">
              <Player
                autoplay
                loop
                src={remedy.animation}
                style={{ height: '100%', width: '100%' }}
              />
              <button
                className={`absolute top-4 right-4 p-2 rounded-full ${bookmarked.includes(remedy.id) ? 'text-amber-600' : 'text-gray-400'}`}
                onClick={() => toggleBookmark(remedy.id)}
              >
                <FaBookmark className="text-2xl" />
              </button>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-orange-700">{remedy.title}</h3>
                <button className="text-amber-500">
                  <FaHeart />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">{remedy.description}</p>
              
              <div className="flex items-center mb-3">
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded mr-2">
                  {remedy.duration}
                </span>
              </div>
              
              <button
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium transition"
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
              <div className="h-56 bg-amber-100 relative">
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
                  <h2 className="text-2xl font-bold text-orange-800">{selectedRemedy.title}</h2>
                  <button 
                    className={`p-2 ${bookmarked.includes(selectedRemedy.id) ? 'text-amber-600' : 'text-gray-400'}`}
                    onClick={() => toggleBookmark(selectedRemedy.id)}
                  >
                    <FaBookmark className="text-xl" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {language === 'hi-IN' ? 'लाभ' : 
                     language === 'ta-IN' ? 'நன்மைகள்' : 
                     'Benefits'}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedRemedy.benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-700">{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {language === 'hi-IN' ? 'सामग्री' : 
                     language === 'ta-IN' ? 'பொருட்கள்' : 
                     'Ingredients'}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedRemedy.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-gray-700">{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {language === 'hi-IN' ? 'बनाने की विधि' : 
                     language === 'ta-IN' ? 'தயாரிப்பு முறை' : 
                     'Preparation'}
                  </h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    {selectedRemedy.preparation.map((step, index) => (
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
                  <p className="text-red-600">{selectedRemedy.precautions}</p>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition">
                    {language === 'hi-IN' ? 'आज की सूची में जोड़ें' : 
                     language === 'ta-IN' ? 'இன்றைய பட்டியலில் சேர்க்கவும்' : 
                     'Add to Today\'s List'}
                  </button>
                  <button className="p-3 bg-gray-100 rounded-lg">
                    <FaShareAlt className="text-amber-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Tips Section */}
      <div className="mt-12 bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-orange-800 mb-4">
          {language === 'hi-IN' ? 'आज का आयुर्वेदिक सुझाव' : 
           language === 'ta-IN' ? 'இன்றைய ஆயுர்வேத உதவிக்குறிப்பு' : 
           'Today\'s Ayurvedic Tip'}
        </h2>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <p className="text-amber-800">
            {language === 'hi-IN' ? 'प्रसव के बाद पहले 40 दिनों तक हल्का गर्म तेल से पूरे शरीर की मालिश करें। यह मांसपेशियों को आराम देता है और शरीर को पुनर्जीवित करता है।' : 
             language === 'ta-IN' ? 'பிரசவத்திற்குப் பின் முதல் 40 நாட்களுக்கு சூடான எண்ணெயால் முழு உடலுக்கும் மசாஜ் செய்யவும். இது தசைகளை ஓய்வு பெறச் செய்து உடலை புத்துணர்ச்சியடையச் செய்கிறது.' : 
             'For the first 40 days after delivery, massage your entire body with lukewarm oil. This relaxes muscles and rejuvenates the body.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostAyurveda;