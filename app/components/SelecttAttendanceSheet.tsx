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

const SelectAttendanceSheet = () => {
  const { data, error, isLoading } = useQuery<File[]>({
    queryKey: ['files'],
    queryFn: fetchAllFiles,
  });

  const [selectedValue, setSelectedValue] = React.useState<File | null>(null);

  React.useEffect(() => {
    // Extract the value from the URL when the component mounts
    const url = new URL(window.location.href);
    const sheetValue = url.searchParams.get('AttendanceSheet');
    console.log("value found in url", sheetValue);

    if (sheetValue && data) {
      const foundValue = data.find(file => file.value === sheetValue);
      setSelectedValue(foundValue || null);
    }
  }, [data]);

  const handleSelectChange = (selectedOption: File | null) => {
    setSelectedValue(selectedOption);
    // Update the URL with the selected value
    const url = new URL(window.location.href);
    if (selectedOption) {
      url.searchParams.set('AttendanceSheet', selectedOption.value);
    } else {
      url.searchParams.delete('AttendanceSheet');
    }
    window.history.pushState({}, '', url.toString());
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="w-full justify-center items-center flex space-y-4 flex-col">
      <h3 className="text-slate-500">Attendance Sheet:</h3>
      <Select
        value={selectedValue}
        onChange={handleSelectChange}
        options={data || []}
        placeholder="Select Attendance Sheet ..."
        className="w-[280px]"
      />
    </div>
  );
};

export default SelectAttendanceSheet;
