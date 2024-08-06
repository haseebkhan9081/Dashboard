import React from 'react';
import StudentVSNoofBoxes from './StudentVSNoofBoxes';
import Expenses from './Expenses';
import MealCost from './MealCost';
import AverageStudentVsBoxes from './AverageStudentVsBoxes';
import AverageStudentPerClass from './AverageStudentPerClass';
import MealsLastWeek from './MealsLastWeek';

const Analytics: React.FC = () => {
  return (
    <div className="p-3 md:p-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <h2 className="text-3xl font-bold text-center text-primary mb-4 col-span-full">
        Comprehensive Analytics Dashboard
      </h2>
      
      <div className="col-span-full lg:col-span-2 xl:col-span-4 w-full">
        <StudentVSNoofBoxes />
      </div>
      
      <div className="col-span-full lg:col-span-2 xl:col-span-4 w-full">
        <MealCost />
      </div>
      
      <div className="col-span-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        <div className="w-full">
          <AverageStudentVsBoxes />
        </div>
        <div className="w-full">
          <AverageStudentPerClass />
        </div>
      </div>
      
      <div className="col-span-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        <div className="w-full">
          <Expenses />
        </div>
        <div className="w-full">
          <MealsLastWeek />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
