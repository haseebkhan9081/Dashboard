import React, { useState } from 'react';
import SelecttAttendanceSheet from './SelecttAttendanceSheet';
import SelectQuotationSheet from './SelectQuotationSheet';
import SelectAttendanceWorkSheet from './SelectAttendanceWorkSheet';
import { useSearchParams } from 'next/navigation';
import SelectQuotationWorkSheet from './SelectQuotationWorkSheet';
import SelectExpensesWorkSheet from './SelectExpensesWorkSheet';
import { Button } from '@/components/ui/button';
import SelectMonth from './SelectMonth';

// Define a TypeScript interface for the file data
interface File {
  value: string;
  label: string;
}

const SelectFiles: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true); // State to manage visibility
  const params = useSearchParams();
  const AttendanceSheet = params.get("AttendanceSheet");
  const QuotationSheet = params.get("QuotationSheet");

  // Toggle visibility function
  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  // Determine button text based on query parameters
  const buttonText = AttendanceSheet || QuotationSheet ? 'Edit' : 'Start';

  return (
    <div className="w-full flex flex-col h-full justify-center items-center space-y-4 p-4 md:p-6">
      {/* Render the component based on visibility state */}
      {isVisible && (
        <div className="w-full max-w-3xl flex flex-col h-full justify-center items-center space-y-6">
          <h2 className="text-2xl font-semibold text-primary">Please Select the Relevant Institution & Month</h2>
          <div className="w-full flex flex-col space-y-4">
            <SelecttAttendanceSheet/>
            {AttendanceSheet && AttendanceSheet.length > 0 && <SelectMonth />}
          </div>
        </div>
      )}
      {/* Button to toggle visibility */}
      
    </div>
  );
};

export default SelectFiles;
