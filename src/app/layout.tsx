import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { Suspense } from "react";
import WhatsAppButton from "@/components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NK-3D Architecture Studio",
    template: "%s | NK-3D Architecture Studio"
  },
  description: "NK-3D Architecture Studio - Leading architectural design, engineering services, and construction solutions in Rwanda. Specializing in residential, commercial, and institutional projects with sustainable and innovative designs.",
  authors: [{ name: "NK-3D Architecture Studio" }],
  creator: "NK-3D Architecture Studio",
  publisher: "NK-3D Architecture Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nk3dstudio.rw'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nk3dstudio.rw',
    siteName: 'NK-3D Architecture Studio',
    title: 'NK-3D Architecture Studio - Architectural Design & Engineering Services',
    description: 'Leading architectural design, engineering services, and construction solutions in Rwanda. Specializing in residential, commercial, and institutional projects.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'NK-3D Architecture Studio Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NK-3D Architecture Studio',
    description: 'Leading architectural design, engineering services, and construction solutions in Rwanda.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/logo.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="keywords" content="NK-3D Architecture Studio, Architecture Rwanda, Architectural Design Rwanda, Engineering Services Rwanda, Construction Rwanda, Building Design, Architectural Services, 3D Architecture, Sustainable Architecture, Residential Architecture, Commercial Architecture, Institutional Architecture, Urban Planning, Interior Design, Landscaping, Project Management, Civil Engineering, MEP Engineering, Environmental Impact Assessment, ESIA, NK-3Darchitects.19, NK-3Dengineering.19, NK-3D Academy.19, Architecture Academy, Architecture Education, Kigali Architecture, Rwanda Construction, Green Building, Eco-friendly Architecture" />
        <meta name="author" content="NK-3D Architecture Studio" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#009f3b" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Elms+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConditionalNavbar />
        {children}
        <Suspense fallback={null}>
          <WhatsAppButton />
        </Suspense>
      </body>
    </html>
  );
}
