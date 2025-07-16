// src/utils/pathUtils.js
export const getAyurvedaPath = () => {
  const stage = localStorage.getItem('stage');

  switch (stage) {
    case 'prepregnancy':
    case 'preconception':
      return '/preconception-ayurveda';

    case 'pregnancy':
      return '/pregnancy-ayurveda';

    case 'post':
    case 'postpartum':
      return '/post-ayurveda';

    default:
      return '/ayurveda'; // fallback
  }
};

export const getYogaPath = () => {
  const stage = localStorage.getItem('stage');

  switch (stage) {
    case 'prepregnancy':
    case 'preconception':
      return '/preconception-yoga';

    case 'pregnancy':
      return '/pregnancy-yoga';

    case 'post':
    case 'postpartum':
      return '/post-yoga';

    default:
      return '/yoga'; // fallback
  }
};
