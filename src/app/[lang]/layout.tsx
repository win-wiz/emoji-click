import Footer from "@/components/footer";
import Header from "@/components/header";
import AppWithTranslation from "@/components/i18n/app-with-translation";
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from "@/locales/config";
import { serverSideTranslations } from "@/locales/serverSideTranslations";
import "@/styles/globals.css";


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
    <html lang={lang} suppressHydrationWarning>
      <body>
        <AppWithTranslation i18n={i18n}>
          <Header lang={lang as AVAILABLE_LOCALES}/>
          {children}
          <Footer />
        </AppWithTranslation>
      </body>
    </html>
  );
}
