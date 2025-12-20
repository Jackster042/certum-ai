import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@/services/clerk/components/ClerkProivder";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { WebsiteSchema, OrganizationSchema } from "@/components/StructuredData";

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://certumai.xyz'),
  title: {
    default: 'Certum AI - AI-Powered Interview Preparation & Job Search Platform',
    template: '%s | Certum AI'
  },
  description: 'Master your next job interview with AI-powered preparation. Practice realistic mock interviews, optimize your resume, and analyze job descriptions with intelligent AI coaching. Land your dream job faster.',
  keywords: [
    'AI interview preparation',
    'mock interview practice',
    'resume optimization',
    'job search tools',
    'AI career coach',
    'interview coaching',
    'job description analysis',
    'technical interview practice',
    'behavioral interview prep',
    'career development',
    'job application help'
  ],
  authors: [{ name: 'Certum AI' }],
  creator: 'Certum AI',
  publisher: 'Certum AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22 fill=%22%236366f1%22>〰️</text></svg>',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://certumai.xyz',
    title: 'Certum AI - AI-Powered Interview Preparation Platform',
    description: 'Master your next job interview with AI-powered preparation. Practice realistic mock interviews, optimize your resume, and get personalized career coaching.',
    siteName: 'Certum AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Certum AI - AI-Powered Interview Preparation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certum AI - AI-Powered Interview Preparation',
    description: 'Master your next job interview with AI-powered coaching. Practice mock interviews, optimize your resume, and land your dream job.',
    images: ['/og-image.png'],
    creator: '@certumai',
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
  verification: {
    // Add when you set up Google Search Console
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <WebsiteSchema />
          <OrganizationSchema />
        </head>
        <body className={`${outfitSans.variable} antialiased font-sans`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableColorScheme
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
