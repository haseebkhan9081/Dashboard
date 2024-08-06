import * as React from "react";
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import { useSearchParams } from "next/navigation";

type File = {
  value: number;
  label: string;
};

// Pass the value parameter to the fetch function
const fetchAllFiles = async (sheetId: string): Promise<File[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/sheet/worksheets?sheetId=${sheetId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const SelectMonth = () => {
  const searchParams = useSearchParams();
  const sheetId = searchParams.get("AttendanceSheet"); // Get the 'AttendanceSheet' parameter

  // Pass the sheetId to the query function
  const { data, error, isLoading } = useQuery<File[]>({
    queryKey: ['worksheets', sheetId], // Include sheetId in the query key
    queryFn: () => {
      if (sheetId) {
        return fetchAllFiles(sheetId);
      } else {
        return Promise.resolve([]); // Return an empty array if no sheetId
      }
    },
    enabled: !!sheetId // Only fetch if sheetId is available
  });

  const [selectedValue, setSelectedValue] = React.useState<File | null>(null);

  React.useEffect(() => {
    // Extract the label from the URL when the component mounts
    const url = new URL(window.location.href);
    const sheetLabel = url.searchParams.get('WorkSheet');
    console.log("value found in url for AttendanceWorkSheet ", sheetLabel);
    if (sheetLabel && data) {
      const foundValue = data.find(file => file.label === sheetLabel);
      setSelectedValue(foundValue || null);
    }
  }, [data]);

  const handleSelectChange = (selectedOption: File | null) => {
    setSelectedValue(selectedOption);
    // Update the URL with the selected label
    const url = new URL(window.location.href);
    if (selectedOption) {
      url.searchParams.set('WorkSheet', selectedOption.label);
    } else {
      url.searchParams.delete('WorkSheet');
    }
    window.history.pushState({}, '', url.toString());
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="w-full justify-center items-center flex space-y-4 flex-col">
      <h3 className="text-slate-500"> </h3>
      <Select
        value={selectedValue}
        onChange={handleSelectChange}
        options={data || []}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => String(option.value)}
        placeholder="Select Sheet..."
        className="w-[280px]"
      />
    </div>
  );
};

export default SelectMonth;
