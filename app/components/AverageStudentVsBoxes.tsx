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
      `Average Boxes (${data.previousWorksheet})`, 
      `Average Students Present (${data.previousWorksheet})`
    ],
    datasets: [
      {
        label: 'Average Boxes',
        data: [
          data.averageBoxesCurrent, 
          null, // No data for students
          data.averageBoxesPrevious, 
          null  // No data for students
        ],
        backgroundColor: [
          '#A2BD9D', // Primary color for current boxes
          'rgba(0, 0, 0, 0)', // Transparent for spacing
          '#A2BD9D', // Primary color for previous boxes
          'rgba(0, 0, 0, 0)'  // Transparent for spacing
        ],
        borderColor: [
          '#A2BD9D', // Primary color for current boxes
          'rgba(0, 0, 0, 0)', // Transparent for spacing
          '#A2BD9D', // Primary color for previous boxes
          'rgba(0, 0, 0, 0)'  // Transparent for spacing
        ],
        borderWidth: 1,
      },
      {
        label: 'Average Students Present',
        data: [
          null, // No data for boxes
          data.averageStudentsPresentCurrent, 
          null, // No data for boxes
          data.averageStudentsPresentPrevious
        ],
        backgroundColor: [
          'rgba(153, 102, 255, 0.5)', // Secondary color for current students
          'rgba(153, 102, 255, 0.5)', // Secondary color for current students
          'rgba(153, 102, 255, 0.5)', // Secondary color for previous students
          'rgba(153, 102, 255, 0.5)'  // Secondary color for previous students
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)', // Secondary color for current students
          'rgba(153, 102, 255, 1)', // Secondary color for current students
          'rgba(153, 102, 255, 1)', // Secondary color for previous students
          'rgba(153, 102, 255, 1)'  // Secondary color for previous students
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
      x: {
        stacked: true, // Stack bars to avoid extra space
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
