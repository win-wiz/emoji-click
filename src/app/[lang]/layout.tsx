import Footer from "@/components/footer";
import Header from "@/components/header";
import AppWithTranslation from "@/components/i18n/app-with-translation";
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from "@/locales/config";
import { serverSideTranslations } from "@/locales/serverSideTranslations";
import "@/styles/globals.css";
import ScrollToTop from '@/components/scroll-to-top'
import { Toaster } from '@/components/ui/toaster'

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
          <main className="flex flex-col min-h-screen">
            <Header lang={lang as AVAILABLE_LOCALES}/>
            <div className="flex-grow">
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
