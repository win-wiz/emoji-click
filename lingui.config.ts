import { DEFAULT_LOCALE, locales } from './src/locales/config';
import type { LinguiConfig } from '@lingui/conf';
import { formatter } from "@lingui/format-json";

const config: LinguiConfig = {
  locales: locales,
  sourceLocale: DEFAULT_LOCALE,
  fallbackLocales: {
    default: DEFAULT_LOCALE
  },
  catalogs: [
    {
      path: '<rootDir>/src/translations/{locale}/messages',
      include: ['<rootDir>/src/**/*.{js,ts,jsx,tsx}'],
      exclude: ['**/node_modules/**', '**/__tests__/**', '**/__tests__/**'], 
    }
  ],
  format: formatter({ style: "lingui" }),
};

export default config;
