import type { Metadata } from 'next';
import { Newsreader, Source_Sans_3, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

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
  title: 'Borrower Copilot · Indian Credit Self-Assessment & Negotiation Companion',
  description: 'Personal copilot helping Indian retail borrowers evaluate loan necessity, true safe capacity, fair benchmark interest rate, and branch negotiation.',
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234B2440' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/%3E%3Cpolyline points='9 22 9 12 15 12 15 22'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${sourceSans.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-bg-light dark:bg-bg-dark text-ink dark:text-ink-dark font-body min-h-[100dvh] antialiased transition-colors duration-200 selection:bg-plum-200 selection:text-plum-950">
        {children}
      </body>
    </html>
  );
}
