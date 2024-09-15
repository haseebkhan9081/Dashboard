"use client";

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { DatePicker } from '../components/DatePicker';
import AttendanceSummaryByDate from '../components/AttendanceSummaryByDate';
import SelectInstitute from '../components/SelectInstitute';




const SummaryByDate = () => {
const params=useSearchParams();
const attendanceSheet = params.get("AttendanceSheet");
const date=params.get("date");
const [dateinput,setDateInput]=useState();



useEffect(()=>{

},[dateinput])


    return (
    <div
    className='flex
    p-6
    space-y-6
    flex-col
    w-full
    justify-center
    items-center
    '>
         
         <div
         className='z-50
         space-y-4
         '>
    <SelectInstitute/>
     <DatePicker/>
     </div>
<AttendanceSummaryByDate/>
    </div>
  )
}

export default SummaryByDate;