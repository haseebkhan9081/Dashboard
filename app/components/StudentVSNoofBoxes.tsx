import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

type File = {
  Date: string;
  NoOfBoxes: string;
  NoOfPresents: number;
};

const fetchAllFiles = async (
  attendanceSheet: string,
  quotationSheet: string,
  quotationWorkSheet: string,
  attendanceWorkSheet: string,
  expensesWorkSheet: string
): Promise<File[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/Studentsvsboxes?attendanceSheet=${attendanceSheet}&quotationSheet=${quotationSheet}&quotationWorkSheet=${quotationWorkSheet}&attendanceWorkSheet=${attendanceWorkSheet}&expensesWorkSheet=${expensesWorkSheet}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const StudentVSNoofBoxes: React.FC = () => {
  const params = useSearchParams();

  const attendanceSheet = params.get("AttendanceSheet");
  const quotationSheet = params.get("QuotationSheet");
  const quotationWorkSheet = params.get("QuotationWorkSheet");
  const attendanceWorkSheet = params.get("AttendanceWorkSheet");
  const expensesWorkSheet = params.get("ExpensesWorkSheet");

  const allParamsAvailable = attendanceSheet && quotationSheet && quotationWorkSheet && attendanceWorkSheet && expensesWorkSheet;

  const { data, error, isLoading } = useQuery<File[]>({
    queryKey: ['worksheets', attendanceSheet, quotationSheet, quotationWorkSheet, attendanceWorkSheet, expensesWorkSheet],
    queryFn: () => {
      if (allParamsAvailable) {
        return fetchAllFiles(attendanceSheet!, quotationSheet!, quotationWorkSheet!, attendanceWorkSheet!, expensesWorkSheet!);
      } else {
        return Promise.resolve([]); // Return an empty array if not all params are available
      }
    },
    enabled: !!allParamsAvailable, // Only fetch if all params are available
    retry: 3, // Number of retry attempts
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  // Ensure data is always an array
  const cleanedData = (data ?? [])
    .filter(item =>
      item.Date &&
      !item.Date.includes('TOTAL') &&
      !item.Date.includes('Sunday Excluded') &&
      (parseInt(item.NoOfBoxes, 10) !== 0 || item.NoOfPresents !== 0) // Exclude entries where both values are 0
    )
    .map(item => ({
      Date: item.Date,
      NoOfBoxes: parseInt(item.NoOfBoxes, 10),
      NoOfPresents: item.NoOfPresents
    }));

  const chartData: ChartData<'line'> = {
    labels: cleanedData.map(entry => entry.Date),
    datasets: [
      {
        label: 'Number of Boxes',
        data: cleanedData.map(entry => entry.NoOfBoxes),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Number of Presents',
        data: cleanedData.map(entry => entry.NoOfPresents),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
  maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const, // 'top' must be typed as const
      },
      title: {
        display: true,
        text: 'Number of Boxes vs Number of Presents',
      },
    },
  };

  return (
     
      <div className="h-[400px] p-4 md:p-6 w-full md:w-[1200px]">
        <Line data={chartData} options={options} />
      </div>
    
  );
};

export default StudentVSNoofBoxes;
