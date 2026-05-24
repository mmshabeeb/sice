import type { Metadata } from "next";
import { Bricolage_Grotesque, Fraunces, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const siteUrl = "https://thesice.com";
const siteName = "SICE - The South Indian Creators Economy";
const description =
  "SICE - The South Indian Creators Economy is a media platform for Malayalam, Tamil, Telugu, and Kannada creators across South India.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s | SICE",
  },
  description,
  applicationName: siteName,
  authors: [{ name: "SICE Media" }],
  creator: "SICE Media",
  publisher: "SICE Media",
  keywords: [
    "SICE",
    "South Indian Creators Economy",
    "South Indian creator economy",
    "Malayalam creators",
    "Tamil creators",
    "Telugu creators",
    "Kannada creators",
    "creator membership South India",
    "regional creators India",
    "creator media platform",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: siteName,
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SICE - The South Indian Creators Economy",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: ["/og-image.png"],
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
  category: "media",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.variable} ${bricolage.variable} ${fraunces.variable}`}>
        {children}
      </body>
    </html>
  );
}
