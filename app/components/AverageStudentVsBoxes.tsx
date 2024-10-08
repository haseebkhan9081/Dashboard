import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Loading from './Loading';
import ErrorDisplay from './Error';
import NoDataFallback from './NoDataFallback';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartDataLabels);

const fetchAllFiles = async (
  quotationSheet: string,
  attendanceSheet: string,
  WorkSheet: string
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/AverageStudentVsBoxes?quotationSheet=${quotationSheet}&attendanceSheet=${attendanceSheet}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const AverageStudentVsBoxes: React.FC = () => {
  const params = useSearchParams();
  const attendanceSheet = params.get("AttendanceSheet");
  const quotationSheet = params.get("QuotationSheet");
  const WorkSheet = params.get("WorkSheet");
  const expensesWorkSheet = params.get("ExpensesWorkSheet");

  const allParamsAvailable = attendanceSheet && quotationSheet && WorkSheet && expensesWorkSheet;

  const { data, error, isLoading } = useQuery({
    queryKey: ['worksheets', quotationSheet, attendanceSheet, WorkSheet],
    queryFn: () => {
      if (allParamsAvailable) {
        return fetchAllFiles(quotationSheet!, attendanceSheet!, WorkSheet!);
      } else {
        return Promise.resolve({}); // Handle missing params gracefully
      }
    },
    enabled: !!allParamsAvailable,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });

  if (isLoading) return <Loading/>;
  if (error) return <ErrorDisplay message={(error as Error).message}/>;

  const roundUp = (value: number) => Math.ceil(value);

  const labels = Object.keys(data || {});
  const averageBoxes = labels.map(label => roundUp(data[label]?.averageBoxes || 0));
  const averageStudentsPresent = labels.map(label => roundUp(data[label]?.averageStudentsPresent || 0));
console.log("data :",data);
  const chartData: ChartData<'bar', number[], string> = {
    labels,
    datasets: [
      {
        label: 'Average Meals',
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
        text: 'Average Student vs Average Meals',
        font: {
          weight: 'bold',
          size: 16,
        },
        color: '#333',
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
    <div className="h-[400px] p-4 md:p-6 w-full ">
     {chartData.datasets[0].data.length === 0 ? (
       <NoDataFallback
       message='Average Student vs Average Meals Chart'
       />


):(
  <Bar data={chartData} options={chartOptions} />
)}
    </div>
  );
};

export default AverageStudentVsBoxes;
