import React, { useState } from 'react';
import SelecttAttendanceSheet from './SelecttAttendanceSheet';
import SelectQuotationSheet from './SelectQuotationSheet';
import SelectAttendanceWorkSheet from './SelectAttendanceWorkSheet';
import { useSearchParams } from 'next/navigation';
import SelectQuotationWorkSheet from './SelectQuotationWorkSheet';
import SelectExpensesWorkSheet from './SelectExpensesWorkSheet';
import { Button } from '@/components/ui/button';

// Define a TypeScript interface for the file data
interface File {
  value: string;
  label: string;
}

const SelectFiles: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false); // State to manage visibility
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
    <div className='w-full flex flex-col h-full justify-center items-center space-y-4'>
      {/* Render the component based on visibility state */}
      {isVisible && (
      <><h2 className='text-xl font-medium'>Please Select the relevant Files</h2>
        <div className='w-full flex flex-col h-full justify-center items-center space-y-4'>
          <SelecttAttendanceSheet />
          {AttendanceSheet && AttendanceSheet.length > 0 && <SelectAttendanceWorkSheet />}
          <SelectQuotationSheet />
          {QuotationSheet && QuotationSheet.length > 0 && <SelectQuotationWorkSheet />}
          {QuotationSheet && QuotationSheet.length > 0 && <SelectExpensesWorkSheet />}
        </div>
        </>
      )}
      {/* Button to toggle visibility */}
      <Button
      variant={"outline"}
        onClick={toggleVisibility}
        className='mt-4 px-8 bg-blue-500
        mb-4
         
        text-white rounded'
      >
        {isVisible?"OK":buttonText}
      </Button>
    </div>
  );
};

export default SelectFiles;
