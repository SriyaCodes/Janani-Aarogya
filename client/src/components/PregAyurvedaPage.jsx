import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { Player } from '@lottiefiles/react-lottie-player';
import { FaHeart, FaBookmark, FaShareAlt } from 'react-icons/fa';

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
    'en-IN': {
      1: [
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
          animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
          duration: 'As needed during first trimester',
          precautions: 'Avoid excessive amounts if you have heartburn'
        },
        // ... more first trimester remedies
      ],
      2: [
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
          animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
          duration: '2-3 times per week',
          precautions: 'Consult doctor if on blood thinners'
        },
        // ... more second trimester remedies
      ],
      3: [
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
          animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
          duration: 'Daily in last 6 weeks',
          precautions: 'Reduce if experiencing excessive weight gain'
        },
        // ... more third trimester remedies
      ]
    },
    'hi-IN': {
      1: [
        {
          id: 101,
          title: 'अदरक-नींबू का काढ़ा',
          description: 'मॉर्निंग सिकनेस और मतली के लिए प्राकृतिक उपचार',
          benefits: [
            'मतली और उल्टी को कम करता है',
            'पाचन में सहायक',
            'रोग प्रतिरोधक क्षमता बढ़ाता है',
            'शरीर को हाइड्रेट करता है'
          ],
          ingredients: [
            '1 कप गर्म पानी',
            '1 इंच ताजा अदरक (पतले स्लाइस में)',
            '1 बड़ा चम्मच नींबू का रस',
            '1 चम्मच शहद (वैकल्पिक)'
          ],
          preparation: [
            'पानी उबालें और अदरक डालें',
            '5-7 मिनट तक रखें',
            'छानकर नींबू का रस मिलाएं',
            'इच्छानुसार शहद डालें',
            'दिन भर में धीरे-धीरे पियें'
          ],
          animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
          duration: 'पहली तिमाही में आवश्यकतानुसार',
          precautions: 'अगर सीने में जलन हो तो अधिक मात्रा से बचें'
        },
        // ... more Hindi remedies
      ],
      2: [
        // ... second trimester Hindi remedies
      ],
      3: [
        // ... third trimester Hindi remedies
      ]
    },
    'ta-IN': {
      1: [
        {
          id: 101,
          title: 'இஞ்சி-எலுமிச்சை கூழ்',
          description: 'காலை நேர மயக்கம் மற்றும் குமட்டலுக்கான இயற்கை மருந்து',
          benefits: [
            'குமட்டல் மற்றும் வாந்தியை குறைக்கிறது',
            'செரிமானத்தை ஊக்குவிக்கிறது',
            'நோயெதிர்ப்பு சக்தியை அதிகரிக்கிறது',
            'உடலை நீரேற்றுகிறது'
          ],
          ingredients: [
            '1 கப் சூடான நீர்',
            '1 அங்குல புதிய இஞ்சி (மெல்லிய துண்டுகளாக)',
            '1 தேக்கரண்டி எலுமிச்சை சாறு',
            '1 தேக்கரண்டி தேன் (விருப்பத்திற்கு ஏற்ப)'
          ],
          preparation: [
            'தண்ணீரை கொதிக்க வைத்து இஞ்சியை சேர்க்கவும்',
            '5-7 நிமிடங்கள் ஊற வைக்கவும்',
            'வடிகட்டி எலுமிச்சை சாறு சேர்க்கவும்',
            'விரும்பினால் தேன் சேர்க்கவும்',
            'நாள் முழுவதும் மெதுவாக குடிக்கவும்'
          ],
          animation: 'https://assets1.lottiefiles.com/packages/lf20_5itouocj.json',
          duration: 'முதல் மூன்று மாதங்களில் தேவைக்கேற்ப',
          precautions: 'மார்பு எரிச்சல் இருந்தால் அதிக அளவு தவிர்க்கவும்'
        },
        // ... more Tamil remedies
      ],
      2: [
        // ... second trimester Tamil remedies
      ],
      3: [
        // ... third trimester Tamil remedies
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
          {language === 'hi-IN' ? 'गर्भावस्था आयुर्वेदिक देखभाल' : 
           language === 'ta-IN' ? 'கர்ப்ப கால ஆயுர்வேத மருத்துவம்' : 
           'Pregnancy Ayurvedic Care'}
        </h1>
        <p className="text-gray-600">
          {language === 'hi-IN' ? 'माँ और बच्चे के लिए प्राकृतिक पोषण' : 
           language === 'ta-IN' ? 'தாய் மற்றும் குழந்தைக்கான இயற்கை ஊட்டச்சத்து' : 
           'Natural nourishment for mother and baby'}
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
                {language === 'hi-IN' ? `${num}री तिमाही` : 
                 language === 'ta-IN' ? `${num}வது மூன்று மாதம்` : 
                 `Trimester ${num}`}
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
                  <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition">
                    {language === 'hi-IN' ? 'आज की सूची में जोड़ें' : 
                     language === 'ta-IN' ? 'இன்றைய பட்டியலில் சேர்க்கவும்' : 
                     'Add to Today\'s List'}
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
          {language === 'hi-IN' ? 'आज का आयुर्वेदिक सुझाव' : 
           language === 'ta-IN' ? 'இன்றைய ஆயுர்வேத உதவிக்குறிப்பு' : 
           'Today\'s Ayurvedic Tip'}
        </h2>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-800">
            {trimester === 1 && (language === 'hi-IN' ? 'पहली तिमाही में हल्का, आसानी से पचने वाला भोजन लें। अदरक और नींबू की चाय मतली को कम करने में मदद कर सकती है।' : 
             language === 'ta-IN' ? 'முதல் மூன்று மாதங்களில் லேசான, எளிதில் செரிக்கக்கூடிய உணவை உண்ணவும். இஞ்சி மற்றும் எலுமிச்சை தேநீர் குமட்டலை குறைக்க உதவும்.' : 
             'During first trimester, eat light, easily digestible foods. Ginger and lemon tea can help reduce nausea.')
            }
            {trimester === 2 && (language === 'hi-IN' ? 'दूसरी तिमाही में दूध, घी और ताजे फलों का सेवन बढ़ाएं। यह बच्चे की वृद्धि और विकास के लिए आवश्यक है।' : 
             language === 'ta-IN' ? 'இரண்டாவது மூன்று மாதங்களில் பால், நெய் மற்றும் புதிய பழங்களை அதிகம் சாப்பிடுங்கள். இது குழந்தையின் வளர்ச்சி மற்றும் வளர்ச்சிக்கு அவசியம்.' : 
             'During second trimester, increase intake of milk, ghee and fresh fruits. This is essential for baby\'s growth and development.')
            }
            {trimester === 3 && (language === 'hi-IN' ? 'तीसरी तिमाही में खजूर और बादाम का सेवन बढ़ाएं। यह प्रसव के लिए शरीर को तैयार करने में मदद करता है।' : 
             language === 'ta-IN' ? 'மூன்றாவது மூன்று மாதங்களில் பேரீச்சம்பழம் மற்றும் பாதாமை அதிகம் சாப்பிடுங்கள். இது பிரசவத்திற்கு உடலை தயார்படுத்த உதவுகிறது.' : 
             'During third trimester, increase intake of dates and almonds. This helps prepare the body for delivery.')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default PregAyurvedaPage;