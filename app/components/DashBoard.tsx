import React from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import SelectFiles from './SelectFiles';
import Analytics from './Analytics';
import Image from 'next/image'; // Import Image component
 

const DashBoard: React.FC = () => {
  const params = useSearchParams();
  const attendanceSheet = params.get("AttendanceSheet");
  const quotationSheet = params.get("QuotationSheet");
  const quotationWorkSheet = params.get("QuotationWorkSheet");
  const attendanceWorkSheet = params.get("AttendanceWorkSheet");
  const expensesWorkSheet = params.get("ExpensesWorkSheet");

  // Determine if all required parameters are available
  const isParamsAvailable = 
    attendanceSheet !== null &&
    quotationSheet !== null &&
    quotationWorkSheet !== null &&
    attendanceWorkSheet !== null &&
    expensesWorkSheet !== null;

  return (
    <div className="flex flex-col items-center space-y-6 p-3 w-full h-full md:p-6 ">
      <div className="flex flex-row w-full justify-center items-center mb-6 space-x-4 bg-white">
        <Image src={"/Logo.png"} alt="Logo" width={100} height={100} className="shadow-lg" />
        <h1 className="text-2xl md:text-3xl text-slate-800 font-semibold text-center tracking-wide">
          DashBoard NorishEd {new Date().getFullYear()}
        </h1>
      </div>
      <div className="flex flex-col w-full bg-white p-6 rounded-lg shadow-lg">
        <SelectFiles />
        {isParamsAvailable ? (
          <Analytics />
        ) : (
          <div className="text-center mt-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg shadow-sm">
            <p className="text-sm md:text-base">
              Please select the relevant files to view the analytics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
