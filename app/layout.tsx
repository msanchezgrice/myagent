import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Oportuna - Your AI-Powered Business Card',
  description: 'Create your AI-powered business card that helps manage inquiries, schedule interviews, and negotiate rates.',
  metadataBase: new URL('https://oportuna.me'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-gray-900 text-white`}>
        <Providers>{children}</Providers>
        <Analytics />
        <Script src="/posthog.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
