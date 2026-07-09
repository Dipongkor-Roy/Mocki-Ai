// app/layout.tsx
import "./globals.css";
import { Sora, DM_Sans } from "next/font/google";
import AOSWrapper from "@/components/layout/AOSWrapper";

// Define a secondary font for headings
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

// Define a font for your primary body text
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata = {
  title: "Exsit Next",
  description: "Modern Next.js app with Tailwind + TypeScript + SCSS",
};

import { ClerkProvider } from "@clerk/nextjs";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${sora.variable} ${dmSans.variable}`}>
        <body>
          <AOSWrapper />
          {children} {/* no global Header/Footer */}
        </body>
      </html>
    </ClerkProvider>
  );
}
