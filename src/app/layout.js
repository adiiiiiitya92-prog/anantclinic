import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Best Skin and Piles Clinic in Nagpur Wadi | Dr. Om Dwivedi",
  description: "Anant Skin & Piles Relief Center. Dr. Om Dwivedi (B.A.M.S, CSD) specializes in Skin Care, Piles, Fistula, Fissure, and General Medicine in Wadi, Nagpur.",
  keywords: ["best skin clinic in wadi", "best piles clinic in nagpur", "Dr. Om Dwivedi", "Anant Clinic", "skin specialist wadi nagpur", "piles doctor wadi"],
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(reg) {
                    console.log('Service worker registered successfully', reg.scope);
                  })
                  .catch(function(err) {
                    console.error('Service worker registration failed:', err);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
