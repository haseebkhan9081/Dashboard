import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
import Loading from './Loading';
import ErrorDisplay from './Error';
import NoDataFallback from './NoDataFallback';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

type File = {
  Date: string;
  NoOfBoxes: string;
  NoOfPresents: number;
};

const fetchAllFiles = async (
  attendanceSheet: string,
  quotationSheet: string,
  WorkSheet: string,
  expensesWorkSheet: string
): Promise<File[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/Studentsvsboxes?attendanceSheet=${attendanceSheet}&quotationSheet=${quotationSheet}&quotationWorkSheet=${WorkSheet}&attendanceWorkSheet=${WorkSheet}&expensesWorkSheet=${expensesWorkSheet}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const StudentVSNoofBoxes: React.FC = () => {
  const params = useSearchParams();

  const attendanceSheet = params.get("AttendanceSheet");
  const quotationSheet = params.get("QuotationSheet");
  const  WorkSheet = params.get("WorkSheet");
  const expensesWorkSheet = params.get("ExpensesWorkSheet");

  const allParamsAvailable = attendanceSheet && quotationSheet && WorkSheet && expensesWorkSheet;

  const { data, error, isLoading,isRefetching ,} = useQuery<File[]>({
    queryKey: ['worksheets', attendanceSheet, quotationSheet, WorkSheet,expensesWorkSheet],
    queryFn: () => {
      if (allParamsAvailable) {
        return fetchAllFiles(attendanceSheet!, quotationSheet!,  WorkSheet, expensesWorkSheet!);
      } else {
        return Promise.resolve([]); // Return an empty array if not all params are available
      }
    },
    enabled: !!allParamsAvailable, // Only fetch if all params are available
    retry: 3, // Number of retry attempts
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });

const [isMobile,setIsMobile]=useState(false);

useEffect(()=>{
if(typeof(window)!=='undefined'){
  const handleResize=()=>{
    setIsMobile(window.innerWidth<768)
  }
  window.addEventListener('resize',handleResize);
  handleResize();
  return ()=>window.removeEventListener('resize',handleResize);
}
},[]);



  if (isLoading) return <Loading/>;
  if (error) return <ErrorDisplay message={(error as Error).message}/>;

  // Ensure data is always an array
  const cleanedData = (data ?? [])
    .filter(item =>
      item.Date &&
      !item.Date.includes('TOTAL') &&
      !item.Date.includes('Sunday Excluded') &&
      (parseInt(item.NoOfBoxes, 10) !== 0 || item.NoOfPresents !== 0) // Exclude entries where both values are 0
    )
    .map(item => ({
      Date: item.Date,
      NoOfBoxes: parseInt(item.NoOfBoxes, 10),
      NoOfPresents: item.NoOfPresents
    }));

  const chartData: ChartData<'line'> = {
    labels: cleanedData.map(entry => entry.Date),
    datasets: [
      {
        label: 'Number of Meals',
        data: cleanedData.map(entry => entry.NoOfBoxes),
        borderColor: '#A2BD9D', // Primary color
        backgroundColor: 'rgba(162, 189, 157, 0.2)', // Light version of primary color
        fill: true,
      },
      {
        label: 'Number of Students',
        data: cleanedData.map(entry => entry.NoOfPresents),
        borderColor: '#9B9B9B', // Neutral color
        backgroundColor: 'rgba(155, 155, 155, 0.2)', // Light neutral color
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    
    plugins: {

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
        
        text: 'Number of Meals vs Number of Students',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            // Customize tooltip labels as needed
            return tooltipItem.dataset.label + ': ' + tooltipItem.formattedValue;
          },
        },
      },
      datalabels: {

        display: isMobile?true:false, // Ensure data labels are not shown if you're using chartjs-plugin-datalabels
      },
    },
    scales: {
      x: {
        ticks: {
          // Rotate x-axis labels to vertical
          font: {
            weight: 'bold',
            size: 12,
          },
          color: '#333',
          maxRotation: 90, // Max rotation angle
          minRotation: 90, // Min rotation angle
        },
      },
      y: {
        min:80,
        ticks: {
          font: {
            weight: 'bold',
            size: 12,
          },
          color: '#333',
          callback: function(value) {
            return value.toLocaleString(); // Format numbers with commas
          },
        },
      },
    },
  };
  
  
 
  return (
    <div>
      {!(chartData.datasets[0].data.length==0)?<div className="h-[400px] p-4 md:p-6 w-full  ">
  <Line data={chartData} options={options} />
 </div>:<div
 className='text-center
 text-slate-400
 '
 >No Data!</div>}
    
 </div>
  );
};

export default StudentVSNoofBoxes;
