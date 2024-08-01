import { Database } from 'lucide-react';
import React from 'react';
import SelectFiles from './SelectFiles';
import Analytics from './Analytics';

const DashBoard: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center p-3 w-full h-full md:p-6">
      <div className="flex flex-row w-full justify-center items-center mb-6">
        <h1 className="text-3xl text-slate-800 font-semibold">
          DashBoard NorishEd {year}
        </h1>
      </div>
      <div className="flex flex-col w-full max-w-6xl">
        <SelectFiles />
        <Analytics />
      </div>
    </div>
  );
};

export default DashBoard;
