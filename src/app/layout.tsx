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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var theme = localStorage.getItem('lokta_theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();`,
          }}
        />
      </head>
      <body className="bg-bg-light dark:bg-bg-dark text-ink dark:text-ink-dark font-body min-h-[100dvh] antialiased selection:bg-plum-900 selection:text-white dark:selection:bg-plum-300 dark:selection:text-plum-950">
        <BorrowerProvider>
          {children}
        </BorrowerProvider>
      </body>
    </html>
  );
}
