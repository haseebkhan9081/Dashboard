import React from 'react';

import SelecttAttendanceSheet  from './SelecttAttendanceSheet';
import SelectQuotationSheet from './SelectQuotationSheet';
import SelectAttendanceWorkSheet from './SelectAttendanceWorkSheet';
import { useSearchParams } from 'next/navigation';
import SelectQuotationWorkSheet from './SelectQuotationWorkSheet';
import SelectExpensesWorkSheet from './SelectExpensesWorkSheet';

// Define a TypeScript interface for the file data
interface File {
  value: string;
  label: string;
}

 

const SelectFiles: React.FC = () => {
 const params=useSearchParams();
const AttendanceSheet=params.get("AttendanceSheet");
const QuotationSheet=params.get("QuotationSheet");
 
  return (
    <div
    className='w-full
    flex
    mt-4
    flex-col
    h-full
    justify-center
    items-center
    space-y-4
    '>
        <h2
        className='text-xl font-medium'>Please Select the relevant Files</h2>
         <SelecttAttendanceSheet/>
         {AttendanceSheet&&AttendanceSheet?.length>0&&<SelectAttendanceWorkSheet/>} 
         <SelectQuotationSheet/>
         {QuotationSheet&&QuotationSheet?.length>0&&(<SelectQuotationWorkSheet/>)}
         {QuotationSheet&&QuotationSheet?.length>0&&(<SelectExpensesWorkSheet/>)}
    </div>
  );
};

export default SelectFiles;
