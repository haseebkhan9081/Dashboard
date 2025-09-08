"use client";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import DashBoard from './components/DashBoard';
import { useEffect } from 'react';

const queryClient = new QueryClient();

export default function App() {



  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col py-4 space-y-6 w-full">
        <DashBoard />
      </div>
    </QueryClientProvider>
  );
}
