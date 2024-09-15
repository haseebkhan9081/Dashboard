import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
import Loading from './Loading';
import ErrorDisplay from './Error';
import NoDataFallback from './NoDataFallback';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const fetchAllFiles = async (
  attendanceSheet: string,
  WorkSheet: string
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/studentAveragePerClass?attendanceSheet=${attendanceSheet}&attendanceWorkSheet=${WorkSheet}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const AverageStudentPerClass: React.FC = () => {
  const params = useSearchParams();
  const attendanceSheet = params.get("AttendanceSheet");
  const quotationSheet = params.get("QuotationSheet");
  const  WorkSheet = params.get("WorkSheet");

  const expensesWorkSheet = params.get("ExpensesWorkSheet");

  const allParamsAvailable = attendanceSheet != null && quotationSheet != null && WorkSheet != null && expensesWorkSheet != null;

  const { data, error, isLoading } = useQuery({
    queryKey: ['worksheets', attendanceSheet, WorkSheet],
    queryFn: () => {
      if (allParamsAvailable) {
        return fetchAllFiles(attendanceSheet!, WorkSheet!);
      } else {
        return Promise.resolve([]);
      }
    },
    enabled: !!allParamsAvailable,
    retry: 3, // Number of retry attempts
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });

  if (isLoading) return <Loading/>;
  if (error) return <ErrorDisplay message={(error as Error).message}/>;

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
      datalabels: {
        display: true,
        color: 'black',
        font: {
          weight: 'bold',
          size: 12,
        },
      },
      legend: {
        position: 'top',
        labels: {
          font: {
            weight: 'bold',
            size: 14,
          },
          color: '#333',
        },
      },
      title: {
        display: true,
        
        font: {
          weight: 'bold',
          size: 16,
        },
        color: '#333',
        text: 'Average Students Present Per Class in the last 7 Days',
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            weight: 'bold',
            size: 12,
          },
          color: '#333',
        },
        beginAtZero: true,
      },
      y: {
        ticks: {
          font: {
            weight: 'bold',
            size: 12,
          },
          color: '#333',
        },
      },
    },
  };

  return (
    <div className="h-[400px] p-4 md:p-6 w-full">
       {chartData.datasets[0].data.length === 0 ? (
       <NoDataFallback
       message='Average Students Present Per Class in the last 7 Days Chart'
       />


):(
  <Bar data={chartData} options={options} />
)}
     
    </div>
  );
};

export default AverageStudentPerClass;
