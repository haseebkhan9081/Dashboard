"use client";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import DashBoard from './components/DashBoard';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col w-full">
        <DashBoard />
      </div>
    </QueryClientProvider>
  );
}
