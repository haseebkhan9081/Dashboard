// app/clientLayout.tsx
'use client'; // Ensure this file is treated as a client component

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 
import { Inter } from 'next/font/google';
 
import LoadingState from '../components/LoadingState'; // Adjust the path as needed

const inter = Inter({ subsets: ['latin'] });

// Create a QueryClient instance
const queryClient = new QueryClient();

 

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center min-h-screen`}
      >
        <QueryClientProvider client={queryClient}>
          <React.Suspense fallback={<LoadingState />}>
            {children}
          </React.Suspense>
        </QueryClientProvider>
      </body>
    </html>
  );
}
