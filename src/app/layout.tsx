import type { Metadata } from 'next';
import { Newsreader, Source_Sans_3, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { BorrowerProvider } from '../context/BorrowerContext';

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lokta Borrower Copilot | Indian Credit Self-Assessment & Negotiation Companion',
  description:
    'Client-side borrower companion helping Indian retail applicants evaluate loan necessity, true safe capacity, fair benchmark interest rate, and bank branch negotiation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${sourceSans.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-slate-950 text-slate-100 font-body min-h-[100dvh] antialiased selection:bg-blue-600 selection:text-white">
        <BorrowerProvider>
          {children}
        </BorrowerProvider>
      </body>
    </html>
  );
}
