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

  const roundUp = (value: number) => Math.ceil(value);

  const labels = Object.keys(data || {});
  const averageBoxes = labels.map(label => roundUp(data[label]?.averageBoxes || 0));
  const averageStudentsPresent = labels.map(label => roundUp(data[label]?.averageStudentsPresent || 0));

  const chartData: ChartData<'bar', number[], string> = {
    labels,
    datasets: [
      {
        label: 'Average Boxes',
        data: averageBoxes,
        backgroundColor: '#A2BD9D',
        borderColor: '#A2BD9D',
        borderWidth: 1,
      },
      {
        label: 'Average Students Present',
        data: averageStudentsPresent,
        backgroundColor: '#9B9B9B',
        borderColor: '#9B9B9B',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio:false,
    plugins: {
      datalabels: {
        display: true,
        color: 'black',
      },
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Student vs Boxes',
      },
    },
  };

  return (
    <div className="h-[400px] p-4 md:p-6 w-full md:w-[800px]">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default AverageStudentVsBoxes;
