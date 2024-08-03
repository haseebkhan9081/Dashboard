import React from 'react';
import StudentVSNoofBoxes from './StudentVSNoofBoxes';
import Expenses from './Expenses';
import MealCost from './MealCost';
import AverageStudentVsBoxes from './AverageStudentVsBoxes';
import AverageStudentPerClass from './AverageStudentPerClass';

const Analytics = () => {
  return (
    <div className="flex flex-col w-full h-full p-3 space-y-6 md:p-6">
      <h2 className="text-2xl text-center text-slate-500 font-semibold">Analytics</h2>
      <div className=" flex flex-col  w-full justify-center
      items-center space-y-6 ">
        
          <StudentVSNoofBoxes />
         
        <div
        className='md:flex-row md:w-full md:justify-center md:items-center md:gap-x-6 md:flex'>
          <Expenses />
        
        
          <MealCost />
          </div>
          <div
        className='md:flex-row md:w-full md:gap-x-6 md:flex md:justify-center md:items-center'>
          <AverageStudentVsBoxes />
       
        
          <AverageStudentPerClass />
          </div>
        
      </div>
    </div>
  );
};

export default Analytics;
