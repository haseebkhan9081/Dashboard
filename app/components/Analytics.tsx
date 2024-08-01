import React from 'react';
import StudentVSNoofBoxes from './StudentVSNoofBoxes';

const Analytics = () => {
  return (
    <div className="flex flex-col w-full h-full p-3 space-y-6 md:p-6">
      <h2 className="text-xl font-semibold">Analytics</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
       <div
       className='lg:col-span-3 md:col-span-2 col-span-1'>
        <StudentVSNoofBoxes />
        </div>
        {/* Add other components or elements here if needed */}
        {/* Example placeholder for additional content */}
         
      </div>
    </div>
  );
};

export default Analytics;
