import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale);

const fetchAllFiles = async (quotationSheet: string, quotationWorkSheet: string) => {
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

  // Convert the data into a format suitable for the bar chart
  const exchangeRate = 280; // PKR to USD exchange rate
  const chartLabels = Object.keys(data);
  const pkrData = chartLabels.map(month => data[month]);
  const usdData = pkrData.map(cost => cost / exchangeRate);

  const chartData: ChartData<'bar'> = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Total Cost (PKR)',
        data: pkrData,
        backgroundColor: '#A2BD9D', // Primary color
        borderColor: '#A2BD9D', // Primary color
        borderWidth: 1,
        yAxisID: 'y-pkr',
      },
      {
        label: 'Total Cost (USD)',
        data: usdData,
        backgroundColor: '#9B9B9B', // Neutral color
        borderColor: '#9B9B9B', // Neutral color
        borderWidth: 1,
        yAxisID: 'y-usd',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      'y-pkr': {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Total Cost (PKR)',
        },
      },
      'y-usd': {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Total Cost (USD)',
        },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
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
    <div className="h-[400px] p-4 md:p-6 w-full md:w-[600px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MealCost;
