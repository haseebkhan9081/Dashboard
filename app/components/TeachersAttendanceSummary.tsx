import { useSearchParams } from 'next/navigation';
import React from 'react';
import { dataTagSymbol, useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartData, ChartOptions } from 'chart.js';
import Loading from './Loading';
import ErrorDisplay from './Error';

ChartJS.register(BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale, ChartDataLabels);

const fetchAllFiles = async (attendanceSheet: string, WorkSheet: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/TeachersAttendanceSummary?attendanceSheet=${attendanceSheet}&attendanceWorkSheet=${WorkSheet}`
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const TeachersAttendanceSummary: React.FC = () => {
  const params = useSearchParams();
  const attendanceSheet = params.get("AttendanceSheet");
  const quotationSheet = params.get("QuotationSheet");
  const  WorkSheet = params.get("WorkSheet");
  const expensesWorkSheet = params.get("ExpensesWorkSheet");

  const allParamsAvailable = attendanceSheet != null && quotationSheet != null && WorkSheet != null && WorkSheet != null && expensesWorkSheet != null;

  const { data, error, isLoading } = useQuery({
    queryKey: ["TeachersAttendanceSummary", attendanceSheet, WorkSheet],
    queryFn: () => {
      if (allParamsAvailable) {
        return fetchAllFiles(attendanceSheet!, WorkSheet!);
      } else {
        return Promise.resolve({});
      }
    },
    enabled: !!allParamsAvailable,
    retry: 3, // Number of retry attempts
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });

  if (isLoading) return <Loading/>;
  if (error) return <ErrorDisplay message={(error as Error).message}/>;
  // Early return if data is empty or undefined
  if (!Array.isArray(data) || data.length === 0) return null;

 
  
  
  console.log("TeachersAttendanceSummary in this commponenet: ", data);
  
  return (
    <>
      {data && data?.length > 0 && (
        <div className="p-4 md:p-6 w-full">
          <h2 className="text-2xl font-bold mb-4 text-primary">
            Staff Attendance Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-primary">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">
                    Name
                  </th>
                  <th className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">
                    Presents
                  </th>
                  <th className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">
                    Absents
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map(
                  (
                    Attendance: {
                      acNo: string;
                      Name: string;
                      Present: string;
                      Absent: string;
                    },
                    index: number
                  ) => (
                    <tr key={index}>
                      <td className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">
                        {Attendance.Name}
                      </td>
                      <td className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">
                        {Attendance.Present}
                      </td>
                      <td className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">
                        {Attendance.Absent}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default TeachersAttendanceSummary;