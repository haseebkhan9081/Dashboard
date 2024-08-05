import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const fetchAllFiles = async (
  attendanceSheet: string,
  attendanceWorkSheet: string
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/studentAveragePerClass?attendanceSheet=${attendanceSheet}&attendanceWorkSheet=${attendanceWorkSheet}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const AverageStudentPerClass: React.FC = () => {
  const params = useSearchParams();
  const attendanceSheet = params.get("AttendanceSheet");
  const quotationSheet = params.get("QuotationSheet");
  const quotationWorkSheet = params.get("QuotationWorkSheet");
  const attendanceWorkSheet = params.get("AttendanceWorkSheet");
  const expensesWorkSheet = params.get("ExpensesWorkSheet");

  const allParamsAvailable = attendanceSheet != null && quotationSheet != null && quotationWorkSheet != null && attendanceWorkSheet != null && expensesWorkSheet != null;

  const { data, error, isLoading } = useQuery({
    queryKey: ['worksheets', attendanceSheet, attendanceWorkSheet],
    queryFn: () => {
      if (allParamsAvailable) {
        return fetchAllFiles(attendanceSheet!, attendanceWorkSheet!);
      } else {
        return Promise.resolve([]);
      }
    },
    enabled: !!allParamsAvailable,
    retry: 3, // Number of retry attempts
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  const chartData: ChartData<'bar'> = {
    labels: data.map((d: { department: string }) => d.department),
    datasets: [
      {
        label: 'Average Students Present',
        // Round up the average values
        data: data.map((d: { average: string }) => Math.ceil(parseFloat(d.average))),
        backgroundColor: '#A2BD9D', // Primary color
        borderColor: '#A2BD9D', // Primary color
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y', // Make the chart horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Average Students Present Per Department in the last 7 Days',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-[400px] p-4 md:p-6 w-full md:w-[800px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default AverageStudentPerClass;
