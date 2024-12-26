import Footer from "@/components/footer";
import Header from "@/components/header";
import AppWithTranslation from "@/components/i18n/app-with-translation";
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from "@/locales/config";
import { serverSideTranslations } from "@/locales/serverSideTranslations";
import "@/styles/globals.css";
import ScrollToTop from '@/components/scroll-to-top'
import { Toaster } from '@/components/ui/toaster'
import { activateLocale } from "@/locales/locale";
import { t } from "@lingui/macro";
import { Metadata } from "next";
// import { GoogleAnalytics } from '@next/third-parties/google'

export async function generateMetadata({ params }: { params: { lang: AVAILABLE_LOCALES } }): Promise<Metadata> {

  await activateLocale(params.lang)

  return {
    title: t`EmojiClick | 用AI找到最适合的表情`,
    description: t`寻找合适的表情符号？只需输入你的感受，EmojiClick会迅速为你找到最佳表情。快速、有趣，总是恰到好处。`,
    keywords: t`emoji search, AI-powered emoji, EmojiClick, smart emoji tool, contextual emoji, emoji discovery, chat enhancement, emoji recommendation engine`,
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
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>🤖</text></svg>" />
      </head>
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
