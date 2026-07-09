// app/layout.tsx

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Mocki Ai",
  description: "Modern Next.js app with Tailwind + TypeScript + SCSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-dm-sans">
      <Header />
      <ClerkProvider>
        <main className="flex-1">{children}</main>
      </ClerkProvider>

      <div className="pt-10">
        <Footer />
      </div>
    </div>
  );
}
