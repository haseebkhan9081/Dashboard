import React from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import SelectFiles from './SelectFiles';
import Analytics from './Analytics';

import MetricsDisplay from './MetricsDisplay';










const DashBoard: React.FC = () => {
  const params = useSearchParams();
  const attendanceSheet = params.get("AttendanceSheet");
  const quotationSheet = params.get("QuotationSheet");
  const  WorkSheet = params.get("WorkSheet");
  const expensesWorkSheet = params.get("ExpensesWorkSheet");

  // Determine if all required parameters are available
  const isParamsAvailable = 
    attendanceSheet !== null &&
    quotationSheet !== null &&
    WorkSheet !== null &&
    expensesWorkSheet !== null;
   
  // Example data - replace these with actual fetched data
 


 



  return (
    <div className="flex flex-col items-center space-y-6 p-3 w-full h-full md:p-6">
      <div className="flex flex-col w-full items-center mb-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-primary font-bold text-center mb-4">
          DashBoard NourishEd {new Date().getFullYear()}
        </h1>
        
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
