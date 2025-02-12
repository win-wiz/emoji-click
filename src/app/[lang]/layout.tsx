import Footer from "@/components/footer";
import Header from "@/components/header";
import AppWithTranslation from "@/components/i18n/app-with-translation";
import { AVAILABLE_LOCALES, DEFAULT_LOCALE, locales, siteUrl } from "@/locales/config";
import { serverSideTranslations } from "@/locales/serverSideTranslations";
import "@/styles/globals.css";
import ScrollToTop from '@/components/scroll-to-top'
import { Toaster } from '@/components/ui/toaster'
import { activateLocale } from "@/locales/locale";
import { t } from "@lingui/macro";
import { Metadata } from "next";
// import HeadIco from "@/components/head-ico";
// import { GoogleAnalytics } from '@next/third-parties/google'

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: { lang: AVAILABLE_LOCALES } }): Promise<Metadata> {
  await activateLocale(params.lang)

  const canonicalUrl = `${siteUrl}/${params.lang}`

  return {
    title: t`EmojiClick | 用AI找到最适合的表情`,
    description: t`寻找合适的表情符号？只需输入你的感受，EmojiClick会迅速为你找到最佳表情。快速、有趣，总是恰到好处。`,
    keywords: t`emoji search, AI-powered emoji, EmojiClick, smart emoji tool, contextual emoji, emoji discovery, chat enhancement, emoji recommendation engine`,
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        locales.map(locale => [locale, `${siteUrl}/${locale}`])
      ),
    },
    verification: {
      other: {
        'baidu-site-verification': 'codeva-UbrA1SnenS',
      },
    },
  }
}

export default async function RootLayout({
  children,
  params: {
    lang,
  },
}: Readonly<{ 
  children: React.ReactNode;
  params: {
    lang: AVAILABLE_LOCALES;
  };
}>) {
  const i18n = await serverSideTranslations(lang ?? DEFAULT_LOCALE);
  // const isDev = process.env.NODE_ENV === 'development'
  
  return (
    <html lang={lang} suppressHydrationWarning className="scroll-smooth">
      {/* <head>
        <link rel="canonical" href="https://emojis.click/en" />
        <meta name="baidu-site-verification" content="codeva-UbrA1SnenS" />
      </head> */}
      <body>
        <AppWithTranslation i18n={i18n}>
          <main className="flex flex-col min-h-screen bg-white">
            <Header lang={lang as AVAILABLE_LOCALES}/>
            <div className="flex-grow min-h-screen">
              {children}
            </div>
            <Footer lang={lang} />
            <ScrollToTop />
            <Toaster />
          </main>
        </AppWithTranslation>
      </body>
    </html>
  );
}
