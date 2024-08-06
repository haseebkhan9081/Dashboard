import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const fetchAllFiles = async (
  quotationSheet: string,
  expensesWorkSheet: string
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/expenses?quotationSheet=${quotationSheet}&expensesWorkSheet=${expensesWorkSheet}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Expenses: React.FC = () => {
  const params = useSearchParams();
  const attendanceSheet = params.get("AttendanceSheet");
  const quotationSheet = params.get("QuotationSheet");
  const  WorkSheet = params.get("WorkSheet");
  const expensesWorkSheet = params.get("ExpensesWorkSheet");

  const allParamsAvailable = attendanceSheet != null && quotationSheet != null && WorkSheet != null   && expensesWorkSheet != null;

  const { data, error, isLoading } = useQuery({
    queryKey: ['worksheets', quotationSheet, expensesWorkSheet],
    queryFn: () => {
      if (allParamsAvailable) {
        return fetchAllFiles(quotationSheet!, expensesWorkSheet!);
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
    labels: ['Salary', 'Other Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [data.salarySum, data.otherExpensesSum],
        backgroundColor: ['#A2BD9D', '#9B9B9B'], // Use primary color and a neutral color for contrast
        borderColor: ['#A2BD9D', '#9B9B9B'],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
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
        text: 'Salary vs Other Expenses',
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

export default Expenses;
