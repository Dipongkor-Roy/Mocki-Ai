// app/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideFooter = pathname?.startsWith("/dashboard");

  return (
    <div className="font-dm-sans">
      <Header />
      <ClerkProvider>
        <main className="flex-1">{children}</main>
      </ClerkProvider>

      {!hideFooter && (
        <div className="pt-10">
          <Footer />
        </div>
      )}
    </div>
  );
}
