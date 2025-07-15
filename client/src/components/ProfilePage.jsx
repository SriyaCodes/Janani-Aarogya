import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FiEdit, FiSave, FiGlobe, FiUser } from 'react-icons/fi';
import { FaBaby, FaUserAlt, FaHeartbeat } from 'react-icons/fa';
import { Player } from '@lottiefiles/react-lottie-player';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPregnancyDate, setEditedPregnancyDate] = useState('');
  const [weeksPregnant, setWeeksPregnant] = useState(0);
  const [trimester, setTrimester] = useState(1);
  const auth = getAuth();
  const navigate = useNavigate();

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
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setEditedName(data.name);
          setEditedPregnancyDate(data.pregnancyStartDate || '');

          if (data.pregnancyStartDate) {
            const pregnancyStart = new Date(data.pregnancyStartDate);
            const today = new Date();
            const diffTime = Math.abs(today - pregnancyStart);
            const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
            setWeeksPregnant(diffWeeks);
            setTrimester(diffWeeks < 13 ? 1 : diffWeeks < 27 ? 2 : 3);
          }
        }
      }
    };
    fetchUserData();
  }, [auth.currentUser]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: editedName,
        pregnancyStartDate: editedPregnancyDate
      });
      setIsEditing(false);
      if (editedPregnancyDate) {
        const pregnancyStart = new Date(editedPregnancyDate);
        const today = new Date();
        const diffTime = Math.abs(today - pregnancyStart);
        const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
        setWeeksPregnant(diffWeeks);
        setTrimester(diffWeeks < 13 ? 1 : diffWeeks < 27 ? 2 : 3);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getLanguageName = (code) => {
    const languages = {
      'en-IN': 'English',
      'hi-IN': 'हिन्दी',
      'ta-IN': 'தமிழ்',
      'te-IN': 'తెలుగు',
      'kn-IN': 'ಕನ್ನಡ',
      'mr-IN': 'मराठी',
      'bn-IN': 'বাংলা',
      'gu-IN': 'ગુજરાતી',
      'ml-IN': 'മലയാളം',
      'pa-IN': 'ਪੰਜਾਬੀ'
    };
    return languages[code] || code;
  };

  const getStageName = (stage) => {
    const stages = {
      'preconception': 'Planning Pregnancy',
      'pregnant': 'Pregnant',
      'postpartum': 'Postpartum'
    };
    return stages[stage] || stage;
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <Player
          autoplay
          loop
          src="https://assets1.lottiefiles.com/packages/lf20_usmfx6bp.json"
          style={{ height: '200px', width: '200px' }}
        />
      </div>
    );
  }

 return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8 relative"
  >

    {/* Header */}
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      <h1 className="text-3xl font-bold text-purple-800 mb-2">Your Profile</h1>
      <p className="text-gray-600">Manage your account and preferences</p>
    </motion.header>

    {/* The rest of your original JSX remains untouched */}


      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden relative"
      >
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 px-4 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -bottom-8 left-6"
          >
            <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
              <FaUserAlt className="text-purple-500 text-2xl" />
            </div>
          </motion.div>
          <div className="pt-8">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-2xl font-bold bg-white bg-opacity-20 rounded px-3 py-1 w-full max-w-xs"
              />
            ) : (
              <h2 className="text-2xl font-bold">{userData.name}</h2>
            )}
            <p className="text-purple-100">{userData.email}</p>
          </div>
        </div>

        <div className="p-6 pt-12">
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiUser className="mr-2" /> Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-1/3 text-gray-600">Full Name:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="flex-1 border rounded px-3 py-1"
                  />
                ) : (
                  <span className="flex-1 font-medium">{userData.name}</span>
                )}
              </div>
              <div className="flex items-center">
                <span className="w-1/3 text-gray-600">Email:</span>
                <span className="flex-1 font-medium">{userData.email}</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaBaby className="mr-2" /> Pregnancy Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-1/3 text-gray-600">Stage:</span>
                <span className="flex-1 font-medium">{getStageName(userData.stage)}</span>
              </div>
              {userData.stage === 'pregnant' && (
                <>
                  <div className="flex items-center">
                    <span className="w-1/3 text-gray-600">Start Date:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedPregnancyDate}
                        onChange={(e) => setEditedPregnancyDate(e.target.value)}
                        className="flex-1 border rounded px-3 py-1"
                      />
                    ) : (
                      <span className="flex-1 font-medium">{userData.pregnancyStartDate || 'Not specified'}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="w-1/3 text-gray-600">Progress:</span>
                    <span className="flex-1 font-medium">
                      {weeksPregnant > 0 ? (
                        <span>
                          Week {weeksPregnant} • Trimester {trimester}
                        </span>
                      ) : (
                        'Not specified'
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiGlobe className="mr-2" /> Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-1/3 text-gray-600">Language:</span>
                <span className="flex-1 font-medium">{getLanguageName(userData.language)}</span>
              </div>
            </div>
          </motion.div>

          {userData.stage === 'pregnant' && weeksPregnant > 0 && (
            <motion.div variants={itemVariants} className="mb-8 bg-purple-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                <FaHeartbeat className="mr-2" /> Pregnancy Progress
              </h3>
              <div className="w-full bg-white rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-pink-400 to-purple-600 h-4 rounded-full"
                  style={{ width: `${Math.min(100, (weeksPregnant / 40) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Week 1</span>
                <span>Week {weeksPregnant} of 40</span>
                <span>Week 40</span>
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="flex justify-end space-x-3 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center"
                >
                  <FiSave className="mr-2" /> Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center"
              >
                <FiEdit className="mr-2" /> Edit Profile
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>
{/* Action Buttons - Language, Stage, Logout */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.4 }}
  className="max-w-3xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
>
  <button
    onClick={() => navigate('/language-selector')}
    className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center"
  >
    <FiGlobe className="text-purple-600 text-xl mr-3" />
    <div>
      <h3 className="font-medium text-gray-800">Change Language</h3>
      <p className="text-sm text-gray-500">Update your preferred language</p>
    </div>
  </button>

  <button
    onClick={() => navigate('/stage-selector')}
    className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center"
  >
    <FaBaby className="text-pink-500 text-xl mr-3" />
    <div>
      <h3 className="font-medium text-gray-800">Update Stage</h3>
      <p className="text-sm text-gray-500">Change your current stage</p>
    </div>
  </button>

  <button
    onClick={handleLogout}
    className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center"
  >
    <FiUser className="text-red-500 text-xl mr-3" />
    <div>
      <h3 className="font-medium text-gray-800">Logout</h3>
      <p className="text-sm text-gray-500">Sign out of your account</p>
    </div>
  </button>
</motion.div>

      {/* Stage/Language Update Buttons */}
     
      
      {userData.stage === 'pregnant' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-3xl mx-auto mt-8"
        >
          <Player
            autoplay
            loop
            src="https://assets6.lottiefiles.com/packages/lf20_0h4chocw.json"
            style={{ height: '150px' }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfilePage;
