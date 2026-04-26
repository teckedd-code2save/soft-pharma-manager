import './globals.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Toaster } from 'sonner';
import { WelcomeToast } from '@/components/welcome-toast';
import { cn } from '@/lib/utils';
import { Search, SearchFallback } from '@/components/search';
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
            <div className="mx-8 flex flex-col gap-3 py-4 md:flex-row md:items-center">
              <div className="flex-1">
                <Suspense fallback={<SearchFallback />}>
                  <Search />
                </Suspense>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">Medicines</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/alerts">Alerts</Link>
                </Button>
              </div>
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
