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

const SelectQuotationSheet = () => {
  const { data, error, isLoading } = useQuery<File[]>({
    queryKey: ['files'],
    queryFn: fetchAllFiles,
  });

  const [selectedValue, setSelectedValue] = React.useState<string>("");

  React.useEffect(() => {
    // Extract the value from the URL when the component mounts
    const url = new URL(window.location.href);
    const sheetValue = url.searchParams.get('QuotationSheet');
    console.log("value found in url",sheetValue);
    if (sheetValue) {
      setSelectedValue(sheetValue);
    }
  }, []);

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
    // Update the URL with the selected value
    const url = new URL(window.location.href);
    url.searchParams.set('QuotationSheet', value);
    window.history.pushState({}, '', url.toString());
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <Select 
    
    value={selectedValue} onValueChange={handleSelectChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select Quotation Sheet..." />
      </SelectTrigger>  
      <SelectContent>
        <SelectGroup>
          {data?.map((file, index) => (
            <SelectItem
              key={index}
              value={file.value}
            >
              {file.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectQuotationSheet;
