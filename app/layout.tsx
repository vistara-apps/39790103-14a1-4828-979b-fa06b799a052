import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HealthConnect - Connect, Advocate, and Thrive in Public Health',
  description: 'A mobile and web application connecting public health professionals, students, and advocates to resources, networking, and advocacy opportunities.',
  keywords: 'public health, advocacy, networking, healthcare professionals, health policy',
  authors: [{ name: 'HealthConnect Team' }],
  openGraph: {
    title: 'HealthConnect',
    description: 'Connect, Advocate, and Thrive in Public Health',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HealthConnect',
    description: 'Connect, Advocate, and Thrive in Public Health',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
