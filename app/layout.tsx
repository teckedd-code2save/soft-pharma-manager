import './globals.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Toaster } from 'sonner';
import { WelcomeToast } from '@/components/welcome-toast';
import { cn } from '@/lib/utils';
import { Search, SearchFallback } from '@/components/search';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Pharmacy Manager — Next.js App Router',
  description: 'Manage your pharmacy inventory.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'bg-gray-100 font-sans antialiased dark:bg-black dark:text-white',
          GeistSans.variable
        )}
      >
        <div className="flex flex-col min-h-screen">
          <div className="sticky top-0 z-10 bg-gray-100 dark:bg-black">
            <div className="mx-8 py-4">
              <Suspense fallback={<SearchFallback />}>
                <Search />
              </Suspense>
            </div>
          </div>
          <div className="flex-1">{children}</div>
        </div>
        <Toaster closeButton />
        <WelcomeToast />
      </body>
    </html>
  );
}
