import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Opportuna - Your AI-Powered Business Card',
  description:
    'Let your AI agent handle inquiries, schedule interviews, and negotiate rates. Perfect for early-career professionals looking to get discovered.',
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
      </body>
    </html>
  );
} 