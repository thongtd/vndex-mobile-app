import ReactNative from 'react-native';
import I18n from 'react-native-i18n';

// Import all locales
import en from '../dictionaries/en.json';
import vi from '../dictionaries/vi.json';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  vi,
  en
};

const currentLocale = I18n.currentLocale();



// Is it a RTL language?
export const isRTL = currentLocale.indexOf('vi-VN') === 0 || currentLocale.indexOf('en-US') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string
export function _t(name, params = {}) {
  return I18n.t(name, params);
};

export default I18n;