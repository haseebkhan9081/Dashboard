import React from 'react'; 

import SelectMonth from './SelectMonth';
import SelectInstitute from './SelectInstitute';
const SelectFiles: React.FC = () => {






  return (
    <div className="w-full flex flex-col h-full justify-center items-center space-y-4 p-4 md:p-6">
      {/* Render the component based on visibility state */}
      
        <div className="w-full max-w-3xl flex flex-col h-full justify-center items-center space-y-6">
          <h2 className="text-2xl font-semibold text-primary">Please Select the Relevant Program & Month</h2>
          <div className="w-full flex flex-col space-y-4">
            <SelectInstitute/>
            <SelectMonth />
          </div>
        </div>
   
    
      
    </div>
  );
};

export default SelectFiles;
