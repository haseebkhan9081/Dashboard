import React from 'react';
import StudentVSNoofBoxes from './StudentVSNoofBoxes';
import Expenses from './Expenses';
import MealCost from './MealCost';
import AverageStudentVsBoxes from './AverageStudentVsBoxes';

const Analytics = () => {
  return (
    <div className="flex flex-col w-full h-full p-3 space-y-6 md:p-6">
      <h2 className="text-2xl text-center text-slate-500 font-semibold">Analytics</h2>
      <div className="grid grid-cols-1 w-full gap-10 md:grid-cols-2 justify-items-center">
        <div className="col-span-1 md:col-span-2">
          <StudentVSNoofBoxes />
        </div>
        <div className="col-span-1">
          <Expenses />
        </div>
        <div className="col-span-1">
          <MealCost />
        </div>
        <div className="col-span-1">
          <AverageStudentVsBoxes />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
