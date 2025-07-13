import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaBaby, FaHeart, FaSpa } from 'react-icons/fa';
import { GiHerbsBundle, GiMeal } from 'react-icons/gi';
import { MdSelfImprovement } from 'react-icons/md';

const AyurvedaPage = () => {
  const [activeTab, setActiveTab] = useState('diet');

  // Ayurvedic knowledge data
  const ayurvedicKnowledge = {
    diet: {
      title: "Postpartum Diet (Sutika Paricharya)",
      items: [
        {
          title: "First 45 Days (Sacred Window)",
          description: "Focus on warm, easily digestible foods cooked with digestive spices like cumin, fennel, and ginger.",
          details: [
            "Golden Milk: Turmeric + warm milk + ghee (healing & anti-inflammatory)",
            "Moong Dal Khichdi: Easy-to-digest complete meal with ghee",
            "Shatavari Kalpa: Ayurvedic herb for hormonal balance",
            "Avoid: Cold foods, raw vegetables, processed foods"
          ]
        },
        {
          title: "Traditional Superfoods",
          description: "Ancient Indian superfoods for postpartum recovery:",
          details: [
            "Ghee: 1 tsp daily (heals tissues, improves digestion)",
            "Dry fruits: Soaked almonds & dates (energy & lactation)",
            "Fenugreek seeds: Increases milk production",
            "Jaggery: Rich in iron (replenishes blood loss)"
          ]
        }
      ]
    },
    herbs: {
      title: "Sacred Herbs & Formulations",
      items: [
        {
          title: "Essential Ayurvedic Herbs",
          description: "Time-tested herbs for postpartum healing:",
          details: [
            "Ashwagandha: Reduces stress, boosts energy",
            "Shatavari: Supports reproductive health & lactation",
            "Dashamoola: Nerve and muscle relaxant",
            "Lodhra: Uterine toner and healing"
          ]
        },
        {
          title: "Traditional Practices",
          description: "Ancient wisdom for modern mothers:",
          details: [
            "Udvartana: Herbal powder massage (improves circulation)",
            "Kashaya: Medicated herbal decoctions",
            "Lehana: Herbal jams for strength and immunity"
          ]
        }
      ]
    },
    routines: {
      title: "Daily Routines (Dinacharya)",
      items: [
        {
          title: "First 40 Days Protocol",
          description: "Sacred postpartum practices:",
          details: [
            "Abhyanga: Daily warm oil massage (sesame or medicated oils)",
            "Yoni Prakshalana: Herbal vaginal steam baths",
            "Rest: Strict bed rest for first 15 days",
            "Soundarya Lahari: Moonlight exposure for hormonal balance"
          ]
        },
        {
          title: "Modern Adaptations",
          description: "Ancient wisdom made practical:",
          details: [
            "5-5-5 Rule: 5 days in bed, 5 days on bed, 5 days near bed",
            "Digital Vrata: Technology fasting for mental peace",
            "Sattvic Environment: Calm, clean, positive space"
          ]
        }
      ]
    },
    mental: {
      title: "Mental & Emotional Care",
      items: [
        {
          title: "Ayurvedic Psychology",
          description: "Balancing the mind after birth:",
          details: [
            "Pranayama: Alternate nostril breathing (Nadi Shodhana)",
            "Mantra Therapy: Chanting for emotional stability",
            "Sattvic Diet: Foods that promote clarity and peace",
            "Oil Drops (Shirodhara at home): Warm oil on forehead"
          ]
        },
        {
          title: "Bonding Practices",
          description: "Ancient mother-baby bonding techniques:",
          details: [
            "Kangaroo Care: Skin-to-skin contact (modern validation of ancient practice)",
            "Sama Veda Lullabies: Specific sound vibrations for baby",
            "Co-sleeping with Ayurvedic safety guidelines"
          ]
        }
      ]
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <FaLeaf className="text-4xl text-amber-600" />
            <FaBaby className="text-4xl text-rose-400 mx-4" />
            <FaHeart className="text-4xl text-rose-600" />
          </div>
          <h1 className="text-4xl font-bold text-amber-900 mb-3">Sacred Window</h1>
          <p className="text-xl text-amber-800 max-w-3xl mx-auto">
            Ancient Ayurvedic Wisdom for Postpartum Healing & Rejuvenation
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center mb-12 gap-2"
        >
          {[
            { id: 'diet', icon: <GiMeal className="mr-2" />, label: 'Sacred Nutrition' },
            { id: 'herbs', icon: <GiHerbsBundle className="mr-2" />, label: 'Herbal Wisdom' },
            { id: 'routines', icon: <FaSpa className="mr-2" />, label: 'Daily Rituals' },
            { id: 'mental', icon: <MdSelfImprovement className="mr-2" />, label: 'Emotional Care' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              variants={itemVariants}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 ${activeTab === tab.id 
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-white text-amber-800 hover:bg-amber-100 shadow-md'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="p-8 sm:p-10">
            <h2 className="text-3xl font-bold text-amber-900 mb-8 flex items-center">
              {activeTab === 'diet' && <GiMeal className="mr-3" />}
              {activeTab === 'herbs' && <GiHerbsBundle className="mr-3" />}
              {activeTab === 'routines' && <FaSpa className="mr-3" />}
              {activeTab === 'mental' && <MdSelfImprovement className="mr-3" />}
              {ayurvedicKnowledge[activeTab].title}
            </h2>

            <div className="space-y-10">
              {ayurvedicKnowledge[activeTab].items.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-amber-50 rounded-2xl p-6 shadow-inner"
                >
                  <h3 className="text-2xl font-semibold text-amber-800 mb-3">{item.title}</h3>
                  <p className="text-lg text-amber-700 mb-4">{item.description}</p>
                  <ul className="space-y-3">
                    {item.details.map((detail, i) => (
                      <motion.li 
                        key={i}
                        whileHover={{ x: 5 }}
                        className="flex items-start text-amber-900"
                      >
                        <span className="text-amber-600 mr-2 mt-1">•</span>
                        <span>{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Ancient Wisdom Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <blockquote className="text-2xl italic text-amber-800 max-w-4xl mx-auto">
            "The first 42 days after birth are a sacred window where the mother's body is most receptive to healing. 
            Proper care during this time can prevent health issues for the next 42 years."
            <footer className="mt-4 text-xl not-italic font-semibold text-amber-700">
              — Ancient Ayurvedic Wisdom
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AyurvedaPage;