import React from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import SelectFiles from './SelectFiles';
import Analytics from './Analytics';

import MetricsDisplay from './MetricsDisplay';











const DashBoard: React.FC = () => {
  const params = useSearchParams();
  const programId = params.get("programId");
  const month = params.get("month");


 
  const isParamsAvailable =
    programId !== null &&
    month !== null 
   
  
 


 



  return (
    <div className="flex flex-col items-center space-y-6 p-3 w-full h-full md:p-6">
      <div className="flex flex-row w-full justify-center   items-center mb-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-primary font-bold text-center ">
          Dashboard NourishEd {new Date().getFullYear()}
        </h1>
        {/* <Image src={"/Logo.png"} width={100} height={100} alt="logo" className='w-28 '  /> */}
      </div>

      {/* Statistics Section */}
      <MetricsDisplay/>

      <div className="flex flex-col w-full ">
        <SelectFiles />
        {isParamsAvailable ? (
          <Analytics />
        ) : (
          <div className="text-center mt-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg shadow-sm">
            <p className="text-sm md:text-base">
              Please select the relevant Month to view the analytics.
            </p>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
