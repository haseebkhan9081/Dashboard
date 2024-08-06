import React from 'react';
import StudentVSNoofBoxes from './StudentVSNoofBoxes';
import Expenses from './Expenses';
import MealCost from './MealCost';
import AverageStudentVsBoxes from './AverageStudentVsBoxes';
import AverageStudentPerClass from './AverageStudentPerClass';
import MealsLastWeek from './MealsLastWeek';

const Analytics: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full p-3 space-y-6 md:p-6">
      <h2 className="text-3xl font-bold text-center text-primary mb-4">
        Comprehensive Analytics Dashboard
      </h2>
      
      <div className="flex flex-col w-full justify-center items-center space-y-6">
        <StudentVSNoofBoxes />
        <div className='md:flex-row md:w-full md:justify-center md:items-center md:gap-x-6 md:flex'>
          <MealCost />
        </div>
        <div className='md:flex-row md:w-full md:gap-x-6 md:flex md:justify-center md:items-center'>
          <AverageStudentVsBoxes />
          <AverageStudentPerClass />
        </div>
        <div className='md:flex-row md:w-full md:gap-x-6 md:flex md:justify-center md:items-center'>
          <Expenses />
          <MealsLastWeek />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
