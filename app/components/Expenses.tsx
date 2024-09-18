import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
import Loading from './Loading';
import ErrorDisplay from './Error';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const fetchAllFiles = async (
  quotationSheet: string,
  expensesWorkSheet: string,
  WorkSheet: string
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/expenses?quotationSheet=${quotationSheet}&expensesWorkSheet=${expensesWorkSheet}&month=${WorkSheet}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Expenses= ({onDataAvailability}:{onDataAvailability:(v:boolean)=>void}) => {
  const params = useSearchParams();
  const attendanceSheet = params.get("AttendanceSheet");
  const quotationSheet = params.get("QuotationSheet");
  const WorkSheet = params.get("WorkSheet");
  const expensesWorkSheet = params.get("ExpensesWorkSheet");

  const allParamsAvailable = attendanceSheet != null && quotationSheet != null && WorkSheet != null && expensesWorkSheet != null;

  const { data, error, isLoading } = useQuery({
    queryKey: ['worksheets', quotationSheet, expensesWorkSheet, WorkSheet],
    queryFn: () => {
      if (allParamsAvailable) {
        return fetchAllFiles(quotationSheet!, expensesWorkSheet!, WorkSheet!);
      } else {
        return Promise.resolve({});
      }
    },
    enabled: !!allParamsAvailable,
    retry: 3, // Number of retry attempts
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });
  useEffect(() => {
    if(data){

    
    const months = Object.keys(data);
  const salarySums = months.map(month => data[month].salarySum);
  const otherExpensesSums = months.map(month => data[month].otherExpensesSum);
console.log("the test ",salarySums[0])
    onDataAvailability(!(salarySums[0]==undefined&&otherExpensesSums[0]==undefined));
  }
  }, [data, onDataAvailability]);

  if (isLoading) return <Loading/>;
  if (error) return <ErrorDisplay message={(error as Error).message}/>;
   // Prepare chart data
  const months = Object.keys(data);
  const salarySums = months.map(month => data[month].salarySum);
  const otherExpensesSums = months.map(month => data[month].otherExpensesSum);

  const chartData: ChartData<'bar'> = {
    labels: months,
    datasets: [
      {
        label: 'Salary',
        data: salarySums,
        backgroundColor: '#A2BD9D',
        borderColor: '#A2BD9D',
        borderWidth: 1,
        stack: 'stack1',
      },
      {
        label: 'Other Expenses',
        data: otherExpensesSums,
        backgroundColor: '#9B9B9B',
        borderColor: '#9B9B9B',
        borderWidth: 1,
        stack: 'stack2',
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
        text: 'Monthly Salary and Other Expenses',
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            weight: 'bold',
            size: 12,
          },
          color: '#333',
        },
      },
      y: {
        stacked: true,
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
    <div>
      {!(salarySums[0]==undefined&&otherExpensesSums[0]==undefined)&&<div className="h-[400px] p-4 md:p-6 w-full">
      <Bar data={chartData} options={options} />
    </div>}
    
    </div>
  );
};

export default Expenses;
