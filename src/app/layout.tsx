// src/app/layout.tsx

import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import "./globals.scss";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.rickpereira.com.br";

const defaultSocialImage =
  "/images/social/portfolio-cover.png?v=4";

const socialImageUrl = `${siteUrl}${defaultSocialImage}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.webmanifest",

  title: {
    default: "Luis Henrique Pereira | Portfólio",
    template: "%s | Luis Henrique Pereira",
  },

  description:
    "Portfólio profissional de Luis Henrique Pereira, criador da marca Rick Pereira e desenvolvedor de sistemas, aplicativos e dashboards.",

  applicationName: "Portfólio Rick Pereira",

  authors: [
    {
      name: "Luis Henrique Pereira",
      url: siteUrl,
    },
  ],

  creator: "Luis Henrique Pereira",
  publisher: "Rick Pereira",

  keywords: [
    "Luis Henrique Pereira",
    "Rick Pereira",
    "Portfólio",
    "Desenvolvedor",
    "Next.js",
    "React",
    "React Native",
    "Power BI",
    "Sistemas web",
    "Aplicativos",
    "Dashboards",
  ],

  alternates: {
    canonical: siteUrl,
  },

  icons: {
    icon: "/images/brand/rick-pereira.png",
    shortcut: "/images/brand/rick-pereira.png",
    apple: "/images/brand/rick-pereira.png",
  },

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Portfólio Rick Pereira",
    title: "Luis Henrique Pereira | Portfólio",
    description:
      "Conheça meus projetos de sistemas web, aplicativos, dashboards e soluções digitais.",
    images: [
      {
        url: socialImageUrl,
        secureUrl: socialImageUrl,
        width: 1200,
        height: 630,
        alt: "Luis Henrique Pereira — Portfólio Rick Pereira",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Luis Henrique Pereira | Portfólio",
    description:
      "Conheça meus projetos de sistemas web, aplicativos, dashboards e soluções digitais.",
    images: [
      {
        url: socialImageUrl,
        alt: "Luis Henrique Pereira — Portfólio Rick Pereira",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${manrope.variable} ${spaceGrotesk.variable}`}
      >
        {children}
      </body>
    </html>
  );
}