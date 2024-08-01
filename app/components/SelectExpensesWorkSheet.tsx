import * as React from "react";
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";

type File = {
  value: Number;
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

const SelectExpensesWorkSheet = () => {
  const searchParams = useSearchParams();
  const sheetId = searchParams.get("QuotationSheet"); // Get the 'AttendanceSheet' parameter

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

  const [selectedValue, setSelectedValue] = React.useState<Number>();
  console.log("worksheets in this sheet",data);
  React.useEffect(() => {
    // Extract the value from the URL when the component mounts
    const url = new URL(window.location.href);
    const sheetValue = url.searchParams.get('ExpensesWorkSheet');
    console.log("value found in url", sheetValue);
    if (sheetValue) {
      setSelectedValue(Number(sheetValue));
    }
  }, []);

  const handleSelectChange = (value: string) => {
    setSelectedValue(Number(value));
    // Update the URL with the selected value
    const url = new URL(window.location.href);
    url.searchParams.set('ExpensesWorkSheet', value);
    window.history.pushState({}, '', url.toString());
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (

    <div
    className="w-full
    justify-center
    items-center
    flex
    space-y-4
    flex-col">
        <h3
        className="text-slate-500">Select Expenses WorkSheet...</h3>
<Select value={String(selectedValue)} onValueChange={handleSelectChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select Expenses WorkSheet..." />
      </SelectTrigger>  
      <SelectContent>
        <SelectGroup>
          {data?.map((file, index) => (
            <SelectItem
              key={index}
              value={String(file.value)}
            >
              {file.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
</div>


    
  );
};

export default SelectExpensesWorkSheet;
