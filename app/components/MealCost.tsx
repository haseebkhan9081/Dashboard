import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale, ChartDataLabels);

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
  const chartLabels = Object.keys(data).sort(); // Sort months alphabetically
  const pkrData = chartLabels.map(month => data[month]);
  const usdData = pkrData.map(cost => cost / exchangeRate);

  const maxPKR = Math.max(...pkrData) * 1.2; // Adjust this multiplier to add extra space
  const maxUSD = Math.max(...usdData) * 1.2; // Adjust this multiplier to add extra space

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
        barPercentage: 0.8, // Adjust this value to change the width of the bars
      },
      {
        label: 'Total Cost (USD)',
        data: usdData,
        backgroundColor: '#9B9B9B', // Neutral color
        borderColor: '#9B9B9B', // Neutral color
        borderWidth: 1,
        yAxisID: 'y-usd',
        barPercentage: 0.8, // Adjust this value to change the width of the bars
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      'y-pkr': {
        beginAtZero: true,
        type: 'linear',
        position: 'left',
        min: 0,
        max: maxPKR, // Set max value to include extra space
        ticks: {
          callback: function (value) {
            return value.toLocaleString(); // Format numbers with commas
          }
        },
        title: {
          display: false, // Remove title for PKR axis
        },
      },
      'y-usd': {
        beginAtZero: true,
        type: 'linear',
        position: 'right',
        min: 0,
        max: maxUSD, // Set max value to include extra space
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
        ticks: {
          callback: function (value) {
            return value.toLocaleString(); // Format numbers with commas
          }
        },
        title: {
          display: false, // Remove title for USD axis
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Total Cost Paid to Vendor (PKR vs USD)',
      },
      datalabels: {
        display: true,
        color: '#444',
        anchor: 'end',
        align: 'top',
        formatter: (value) => value.toLocaleString(), // Format numbers with commas
        font: {
          size: 10, // Adjust font size as needed
        },
        clamp: true, // Ensures labels fit within bar
        padding: {
          top: 4, // Adjust padding if needed
        },
        clip: true, // Clips labels to ensure they do not overflow the chart area
      }
    },
  };

  return (
    <div className="h-[400px] p-4 md:p-6 w-full md:w-[600px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MealCost;
