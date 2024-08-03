import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const fetchAllFiles = async (
  quotationSheet: string,
  quotationWorkSheet: string,
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/mealCost?quotationSheet=${quotationSheet}&quotationWorkSheet=${quotationWorkSheet}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const MealCost: React.FC = () => {
  const params = useSearchParams();
  const attendanceSheet = params.get("AttendanceSheet");
  const quotationSheet = params.get("QuotationSheet");
  const quotationWorkSheet = params.get("QuotationWorkSheet");
  const attendanceWorkSheet = params.get("AttendanceWorkSheet");
  const expensesWorkSheet = params.get("ExpensesWorkSheet");

  const allParamsAvailable = attendanceSheet != null && quotationSheet != null && quotationWorkSheet != null && attendanceWorkSheet != null && expensesWorkSheet != null;

  const { data, error, isLoading } = useQuery({
    queryKey: ['worksheets', quotationSheet, quotationWorkSheet],
    queryFn: () => {
      if (allParamsAvailable) {
        return fetchAllFiles(quotationSheet!, quotationWorkSheet!);
      } else {
        return Promise.resolve({});
      }
    },
    enabled: !!allParamsAvailable,
    retry: 3, // Number of retry attempts
   retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff

  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  // Total cost in PKR and conversion to USD
  const totalCostPKR = data?.totalCostFor200Meals || 0;
  const exchangeRate = 280; // PKR to USD exchange rate
  const totalCostUSD = totalCostPKR / exchangeRate;

  const chartData: ChartData<'pie'> = {
    labels: ['Total Cost (PKR)', 'Total Cost (USD)'],
    datasets: [
      {
        label: 'Cost',
        data: [totalCostPKR, totalCostUSD],
        backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(153, 102, 255, 0.5)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Total Cost for 200 Meals (PKR vs USD)',
      },
    },
  };

  return (
    <div className="h-[400px] p-4 md:p-6 w-full md:w-[400px]">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default MealCost;
