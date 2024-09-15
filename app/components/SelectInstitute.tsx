import * as React from "react";
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';

type File = {
  value: string;
  label: string;
};

const fetchAllFiles = async (): Promise<File[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/sheets`); // Replace with your API endpoint

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const SelectInstitute = () => {
  const { data, error, isLoading } = useQuery<File[]>({
    queryKey: ['files'],
    queryFn: fetchAllFiles,
  });
  
  const [selectedValue, setSelectedValue] = React.useState<File | null>(null);
console.log("data array ",data);
  React.useEffect(() => {
    // Extract the value from the URL when the component mounts
    const url = new URL(window.location.href);
    const sheetValue = url.searchParams.get('AttendanceSheet');
    console.log("value found in url", sheetValue);

    if (sheetValue && data) {
      const foundValue = data.find(file => file.value === sheetValue);
      setSelectedValue(
        foundValue
          ? {
              ...foundValue,
              label: foundValue.label.split('Attendance Sheet')[0]
            }
          : null
      );
    }
  }, [data]);

  const handleSelectChange = (selectedOption: File | null) => {
    setSelectedValue(selectedOption);
    // Update the URL with the selected value
    const url = new URL(window.location.href);
    if (selectedOption) {
      console.log("selectedOption ",selectedOption);
      url.searchParams.set('AttendanceSheet', selectedOption.value);
       const institutionName=selectedOption.label.split('Attendance Sheet')[0];
       console.log("institutionName ",institutionName)
       console.log("the original data before filter ",data);
       const filteredData=data?.filter(item=>item.label.includes(institutionName));
       console.log("filteredData" ,filteredData)
       const QuotationSheet=filteredData?.filter(item=>item.label.includes('Quotation'));
      console.log("QuotationSheet",QuotationSheet)
       console.log(QuotationSheet?.[0].value);
       if (QuotationSheet && QuotationSheet.length > 0) {
        url.searchParams.set('QuotationSheet', QuotationSheet[0].value);
      }
    } else {
      url.searchParams.delete('AttendanceSheet');
    }
    window.history.pushState({}, '', url.toString());
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="w-full justify-center items-center flex space-y-4 flex-col">
      <h3 className="text-slate-500">Institution:</h3>
      <Select
       
        value={selectedValue}
        onChange={handleSelectChange}
        options={data?.filter(item=>item.label.includes('Attendance Sheet')).map(item=>({
          ...item,
          label:item.label.split('Attendance Sheet')[0]
        })) || []}
        placeholder="Select Institution ..."
        className="w-[280px]
        rounded-xl
        border-primary
        "
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
          
            borderColor:'#a2bd9d',
            borderRadius: '12px' // Adjust this value to make the corners more or less rounded
          }),
           
           
        }}
      
      />
    </div>
  );
};

export default SelectInstitute;
