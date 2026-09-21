import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@wrksz/themes/next';
import { NextIntlClientProvider } from 'next-intl';
import TanstackQueryProvider from '../providers/tanstack-query-provider';
import { TooltipProvider } from '@odyssey/ui/components/ui/tooltip';
import { RootProvider } from 'fumadocs-ui/provider/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Odyssey',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RootProvider search={{ options: { api: '/api/v1/search' } }}>
          <ThemeProvider>
            <NextIntlClientProvider>
              <TanstackQueryProvider>
                <TooltipProvider>{children}</TooltipProvider>
              </TanstackQueryProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </RootProvider>
      </body>
    </html>
  );
}
