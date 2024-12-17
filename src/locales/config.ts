export const localeNames = {
   "zh": '简体中文', // 简体中文
   "en": 'English', // 英语
  // //  "cs": 'Čeština', // 捷克语
   "fr": 'Français', // 法语
  //  "de": 'Deutsch', // 德语
   "es": 'Español', // 西班牙语
  //  "it": 'Italiano', // 意大利语
  //  "ja": '日本語', // 日语
  //  "ko": '한국어', // 韩语
  //  "nl": 'Nederlands', // 荷兰语
  //  "pt-BR": 'Português do Brasil', // 巴西葡萄牙语
  //  "ru": 'Русский', // 俄语
  //  "uk": 'Українська', // 乌克兰语
  //  "vi": 'Tiếng Việt', // 越南语
   "zh-TW": '繁体中文', // 繁体中文
   "pt": 'Português', // 葡萄牙语
  //  "da": 'Dansk', // 丹麦语
  //  "el": 'Ελληνικά (Elliniká)', // 希腊语
  //  "no": 'Norsk', // 挪威语
  //  "fi": 'Suomi', // 芬兰语
  //  "sv": 'Svenska', // 瑞典语
  //  "th": 'ไทย (Thai)', // 泰语
  //  "id": 'Bahasa Indonesia', // 印度尼西亚语
  //  "hi": 'हिन्दी (Hindi)', // 印地语
  //  // "ar": 'العربية (Arabic)', // 阿拉伯语 （从右往左）
  //  "bn": 'বাংলা (Bangla)', // 孟加拉语
  //  "ms": 'Bahasa Melayu', // 马来语
  //  "tr": 'Türkçe', // 土耳其语
  //  "fa": 'فارسی (Farsi)', // 波斯语 （从右往左）
}

export enum AVAILABLE_LOCALES {
  zh = 'zh', // 简体中文
  en = 'en', // 英语
  cs = 'cs', // 捷克语
  fr = 'fr', // 法语
  de = 'de', // 德语
  es = 'es', // 西班牙语
  it = 'it', // 意大利语
  ja = 'ja', // 日语
  ko = 'ko', // 韩语
  nl = 'nl', // 荷兰语
  ptBR = 'pt-BR', // 巴西葡萄牙语
  ru = 'ru', // 俄语
  uk = 'uk', // 乌克兰语
  vi = 'vi', // 越南语
  zhTW = 'zh-TW', // 繁体中文
  pt = 'pt', // 葡萄牙语
  da = 'da', // 丹麦语
  el = 'el', // 希腊语
  no = 'no', // 挪威语
  fi = 'fi', // 芬兰语
  sv = 'sv', // 瑞典语
  th = 'th', // 泰语
  id = 'id', // 印度尼西亚语
  hi = 'hi', // 印地语
  bn = 'bn', // 孟加拉语
  ms = 'ms', // 马来语
  tr = 'tr', // 土耳其语
}

export const locales = Object.keys(localeNames);

export const DEFAULT_LOCALE = AVAILABLE_LOCALES.zh;

export const siteUrl = process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_URL : "http://localhost:3000"