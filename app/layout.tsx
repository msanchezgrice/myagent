import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'My Agent - Create Your AI Agent',
  description:
    'Create, customize, and monetize your own AI agent. Set preferences, define personality, and let it work for you.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
} 