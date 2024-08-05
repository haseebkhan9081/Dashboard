import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartDataLabels);

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

  const allParamsAvailable = attendanceSheet && quotationSheet && quotationWorkSheet && attendanceWorkSheet && expensesWorkSheet;

  const { data, error, isLoading } = useQuery({
    queryKey: ['worksheets', quotationSheet, quotationWorkSheet, attendanceSheet, attendanceWorkSheet],
    queryFn: () => {
      if (allParamsAvailable) {
        return fetchAllFiles(quotationSheet!, quotationWorkSheet!, attendanceSheet!, attendanceWorkSheet!);
      } else {
        return Promise.resolve({}); // Handle missing params gracefully
      }
    },
    enabled: !!allParamsAvailable,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  // Helper function to round up values
  const roundUp = (value: number) => Math.ceil(value);

  // Ensure data is always an object with default values
  const {
    averageBoxesCurrent = 0,
    averageStudentsPresentCurrent = 0,
    averageBoxesPrevious = 0,
    averageStudentsPresentPrevious = 0,
    currentWorksheet = '',
    previousWorksheet = ''
  } = data ?? {};

  const chartData: ChartData<'bar'> = {
    labels: [
      `Average Boxes (${currentWorksheet})`,
      `Average Students Present (${currentWorksheet})`,
      `Average Boxes (${previousWorksheet})`,
      `Average Students Present (${previousWorksheet})`
    ],
    datasets: [
      {
        label: 'Average Boxes',
        data: [roundUp(averageBoxesCurrent), null, roundUp(averageBoxesPrevious), null],
        backgroundColor: ['#A2BD9D', '#A2BD9D', '#A2BD9D', '#A2BD9D'],
        borderColor: ['#A2BD9D', '#A2BD9D', '#A2BD9D', '#A2BD9D'],
        borderWidth: 1,
      },
      {
        label: 'Average Students Present',
        data: [null, roundUp(averageStudentsPresentCurrent), null, roundUp(averageStudentsPresentPrevious)],
        backgroundColor: ['#9B9B9B', '#9B9B9B', '#9B9B9B', '#9B9B9B'],
        borderColor: ['#9B9B9B', '#9B9B9B', '#9B9B9B', '#9B9B9B'],
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
      datalabels: {
        display: true,
        color: '#444',
        anchor: 'end',
        align: 'top',
        formatter: (value) => value !== null ? value.toString() : '',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(
          roundUp(averageBoxesCurrent), 
          roundUp(averageBoxesPrevious), 
          roundUp(averageStudentsPresentCurrent), 
          roundUp(averageStudentsPresentPrevious)
        ) + 10, // Add 10 to provide additional space
      },
      x: {
        stacked: true,
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
