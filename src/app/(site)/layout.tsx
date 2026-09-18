// src/app/(site)/layout.tsx

import Footer from "@/components/layout/Footer/Footer";
import Header from "@/components/layout/Header/Header";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
