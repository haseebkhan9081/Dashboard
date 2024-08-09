// components/LoadingState.tsx
"use client";

import Image from 'next/image';
import React from 'react';
import { BarLoader } from 'react-spinners';

const LoadingState: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <Image src="/Logo.png" alt="Logo" className="w-32 h-20 mb-4" width={100} height={100}/>
        <BarLoader color="#A2BD9D" width={200} />
      </div>
    </div>
  );
};

export default LoadingState;
