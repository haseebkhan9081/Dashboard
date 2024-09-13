"use client";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import DashBoard from './components/DashBoard';
import { useEffect } from 'react';

const queryClient = new QueryClient();

export default function App() {

  useEffect(() => {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    // Set the parameters
      searchParams.set('ExpensesWorkSheet', process.env.NEXT_PUBLIC_EXPENSES_WORK_SHEET || '');
    
    // Update the URL without reloading the page
    window.history.replaceState(null, '', url.toString());

    console.log("Values were set in the URL");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col py-4 space-y-6 w-full">
        <DashBoard />
      </div>
    </QueryClientProvider>
  );
}
