 
import React, { Suspense, useState, useEffect } from 'react';
import { BarLoader } from 'react-spinners';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from 'next/image';
import LoadingState from './components/LoadingState';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DashBoard NourishEd",
  description: "Comprehensive Analytics Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center min-h-screen`}>
        <Suspense
          fallback={
           <LoadingState/>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
