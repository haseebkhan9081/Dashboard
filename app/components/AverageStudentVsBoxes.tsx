import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const fetchAllFiles = async (
  quotationSheet: string,
  quotationWorkSheet: string,
  attendanceSheet: string,
  attendanceWorkSheet: string
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/mealCostStudentAverage?quotationSheet=${quotationSheet}&quotationWorkSheet=${quotationWorkSheet}&attendanceSheet=${attendanceSheet}&attendanceWorkSheet=${attendanceWorkSheet}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const AverageStudentVsBoxes: React.FC = () => {
  const params = useSearchParams();
  const attendanceSheet = params.get("AttendanceSheet");
  const quotationSheet = params.get("QuotationSheet");
  const quotationWorkSheet = params.get("QuotationWorkSheet");
  const attendanceWorkSheet = params.get("AttendanceWorkSheet");
  const expensesWorkSheet = params.get("ExpensesWorkSheet");

  const allParamsAvailable = attendanceSheet != null && quotationSheet != null && quotationWorkSheet != null && attendanceWorkSheet != null && expensesWorkSheet != null;

  const { data, error, isLoading } = useQuery({
    queryKey: ['worksheets', quotationSheet, quotationWorkSheet, attendanceSheet, attendanceWorkSheet],
    queryFn: () => {
      if (allParamsAvailable) {
        return fetchAllFiles(quotationSheet!, quotationWorkSheet!, attendanceSheet!, attendanceWorkSheet!);
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
    labels: [
      `Average Boxes (${data.currentWorksheet})`, 
      `Average Students Present (${data.currentWorksheet})`,
      '', // Spacer
      `Average Boxes (${data.previousWorksheet})`, 
      `Average Students Present (${data.previousWorksheet})`
    ],
    datasets: [
      {
        label: 'Counts',
        data: [
          data.averageBoxesCurrent, 
          data.averageStudentsPresentCurrent, 
          null, // Spacer
          data.averageBoxesPrevious, 
          data.averageStudentsPresentPrevious
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)', 
          'rgba(153, 102, 255, 0.5)', 
          'rgba(0, 0, 0, 0)', // Spacer
          'rgba(255, 206, 86, 0.5)', 
          'rgba(54, 162, 235, 0.5)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)', 
          'rgba(153, 102, 255, 1)', 
          'rgba(0, 0, 0, 0)', // Spacer
          'rgba(255, 206, 86, 1)', 
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Average Boxes and Students Present',
      },
    },
    scales: {
      y: {
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

export default AverageStudentVsBoxes;
