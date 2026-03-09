// app/layout.js
import { Cormorant_Garamond, Jost } from "next/font/google";
import { LanguageProvider }          from "@/context/LanguageContext";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight:  ["300", "400", "500", "600", "700"],
  variable:"--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight:  ["200", "300", "400", "500", "600"],
  variable:"--font-jost",
  display: "swap",
});

export const metadata = {
  title:       "Nour Al-Rashidi — Interior Designer",
  description: "Award-winning luxury interior designer specialising in timeless residential and commercial spaces.",
  openGraph: {
    title:       "Nour Al-Rashidi — Interior Designer",
    description: "Luxury interior design portfolio.",
    type:        "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="bg-ivory text-charcoal antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
