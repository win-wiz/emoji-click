import Footer from "@/components/footer";
import Header from "@/components/header";
import AppWithTranslation from "@/components/i18n/app-with-translation";
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from "@/locales/config";
import { serverSideTranslations } from "@/locales/serverSideTranslations";
import "@/styles/globals.css";
import ScrollToTop from '@/components/scroll-to-top'

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
  
  return (
    <html lang={lang} suppressHydrationWarning className="scroll-smooth">
      <body>
        <AppWithTranslation i18n={i18n}>
          <main className="flex flex-col justify-between min-h-screen w-full">
            <Header lang={lang as AVAILABLE_LOCALES}/>
            {children}
            <Footer />
            <ScrollToTop />
          </main>
        </AppWithTranslation>
      </body>
    </html>
  );
}
