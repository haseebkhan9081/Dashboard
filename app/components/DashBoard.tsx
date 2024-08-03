import React from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import SelectFiles from './SelectFiles';
import Analytics from './Analytics';

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
    <div className="flex flex-col items-center space-y-6 p-3 w-full h-full md:p-6">
      <div className="flex flex-row w-full justify-center items-center mb-6">
        <h1 className="text-2xl md:text-3xl text-slate-800 font-semibold text-center">
          DashBoard NorishEd {new Date().getFullYear()}
        </h1>
      </div>
      <div className="flex flex-col w-full ">
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
