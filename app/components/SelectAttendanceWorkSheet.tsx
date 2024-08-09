import * as React from "react";
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import { useSearchParams } from "next/navigation";
import Loading from "./Loading";
import ErrorDisplay from "./Error";

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

const SelectAttendanceWorkSheet = () => {
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
    // Extract the value from the URL when the component mounts
    const url = new URL(window.location.href);
    const sheetValue = url.searchParams.get('AttendanceWorkSheet');
    console.log("value found in url for AttendanceWorkSheet ", sheetValue);
    if (sheetValue && data) {
      const foundValue = data.find(file => file.value === Number(sheetValue));
      setSelectedValue(foundValue || null);
    }
  }, [data]);

  const handleSelectChange = (selectedOption: File | null) => {
    setSelectedValue(selectedOption);
    // Update the URL with the selected value
    const url = new URL(window.location.href);
    if (selectedOption) {
      url.searchParams.set('AttendanceWorkSheet', String(selectedOption.value));
    } else {
      url.searchParams.delete('AttendanceWorkSheet');
    }
    window.history.pushState({}, '', url.toString());
  };

  if (isLoading) return <Loading/>;
  if (error) return <ErrorDisplay message={(error as Error).message}/>;

  return (
    <div className="w-full justify-center items-center flex space-y-4 flex-col">
      <h3 className="text-slate-500">Attendance WorkSheet:</h3>
      <Select
        value={selectedValue}
        onChange={handleSelectChange}
        options={data || []}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => String(option.value)}
        placeholder="Select Attendance Work Sheet..."
        className="w-[280px]"
      />
    </div>
  );
};

export default SelectAttendanceWorkSheet;
