import { localeNames } from "@/locales/config";

export default function Sitemap() {
  return [
    ...Object.entries(localeNames).map(([locale, name]) => ({
      url: `https://emojis.click/${locale}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    })),
    ...Object.entries(localeNames).map(([locale, name]) => ({
      url: `https://emojis.click/${locale}/terms-of-service`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    })),
    ...Object.entries(localeNames).map(([locale, name]) => ({
      url: `https://emojis.click/${locale}/privacy-policy`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    })),
  ]
}