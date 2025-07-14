// utils/translate.js
import { getGeminiReply } from '../services/geminiApi';

export const translateText = async (text, targetLanguage) => {
  try {
    const prompt = `Translate the following text to ${targetLanguage}. Only return the translated text, nothing else. Text to translate: "${text}"`;
    const translatedText = await getGeminiReply(prompt);
    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

export const translateRemedy = async (remedy, targetLanguage) => {
  const translatedRemedy = { ...remedy };
  
  // Translate simple string fields
  translatedRemedy.title = await translateText(remedy.title, targetLanguage);
  translatedRemedy.description = await translateText(remedy.description, targetLanguage);
  translatedRemedy.duration = await translateText(remedy.duration, targetLanguage);
  translatedRemedy.precautions = await translateText(remedy.precautions, targetLanguage);
  
  // Translate arrays
  translatedRemedy.benefits = await Promise.all(
    remedy.benefits.map(benefit => translateText(benefit, targetLanguage))
  );
  translatedRemedy.ingredients = await Promise.all(
    remedy.ingredients.map(ingredient => translateText(ingredient, targetLanguage))
  );
  translatedRemedy.preparation = await Promise.all(
    remedy.preparation.map(step => translateText(step, targetLanguage))
  );
  
  return translatedRemedy;
};

// Predefined UI translations
export const uiTranslations = {
  'headerTitle': {
    'en-IN': 'Post-Delivery Ayurvedic Care',
    'hi-IN': 'प्रसवोत्तर आयुर्वेदिक देखभाल',
    'ta-IN': 'பிரசவத்திற்குப் பின் ஆயுர்வேத மருத்துவம்'
  },
  'headerSubtitle': {
    'en-IN': 'Natural healing for mother and baby',
    'hi-IN': 'माँ और शिशु के लिए प्राकृतिक उपचार',
    'ta-IN': 'தாய் மற்றும் குழந்தைக்கான இயற்கை மருத்துவம்'
  },
  'viewDetails': {
    'en-IN': 'View Details',
    'hi-IN': 'विवरण देखें',
    'ta-IN': 'விவரங்களைக் காண்க'
  }
};