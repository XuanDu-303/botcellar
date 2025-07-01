import { Geist, Geist_Mono, Be_Vietnam_Pro } from "next/font/google";
import "../globals.css";
import ClientProviders from "@/components/shared/providers/client-providers";
import ChatbotWidget from "@/components/shared/chatbot-witget";
import { getDirection } from "@/i18n-config";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { getSetting } from "@/lib/actions/setting.actions";
import { cookies } from "next/headers";
import { routing } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata() {
  const {
    site: { slogan, name, description, url },
  } = await getSetting();
  return {
    title: {
      template: `%s | ${name}`,
      default: `${name}. ${slogan}`,
    },
    description: description,
    metadataBase: new URL(url),
  };
}

export default async function AppLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}>) {
  const setting = await getSetting();
  const currencyCookie = (await cookies()).get("currency");
  const currency = currencyCookie ? currencyCookie.value : "USD";

  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={getDirection(locale) === "rtl" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          ${locale === "vi" ? beVietnamPro.variable : ""}
          antialiased transition-colors duration-300 ease-in-out
        `}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders setting={{ ...setting, currency }}>
            {children}
            <ChatbotWidget />
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
