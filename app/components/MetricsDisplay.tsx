import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Decimal from 'decimal.js';
import Loading from './Loading';
import ErrorDisplay from './Error';
const fetchTotalMealsServed = async (quotationSheet: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/totalMealsServed?quotationSheet=${quotationSheet}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const fetchAverageStudents = async (attendanceSheet: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/averageAttendanceUntilNow?attendanceSheet=${attendanceSheet}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const MetricsDisplay: React.FC = () => {
  const params = useSearchParams();
  const attendanceSheet = params.get("AttendanceSheet");
  const quotationSheet = params.get("QuotationSheet");
  
  const allParamsAvailable = attendanceSheet != null && quotationSheet != null;

  const { data: mealsData, error: mealsError, isLoading: mealsLoading } = useQuery({
    queryKey: ['totalMealsServed', quotationSheet],
    queryFn: () => allParamsAvailable ? fetchTotalMealsServed(quotationSheet!) : Promise.resolve({ totalMealsServed: 0 }),
    enabled: !!allParamsAvailable,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });

  const { data: studentsData, error: studentsError, isLoading: studentsLoading } = useQuery({
    queryKey: ['averageStudents', attendanceSheet],
    queryFn: () => allParamsAvailable ? fetchAverageStudents(attendanceSheet!) : Promise.resolve({ averageStudents: 0 }),
    enabled: !!allParamsAvailable,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });

  if (mealsLoading || studentsLoading) return <Loading/>;
  if (mealsError) return <ErrorDisplay message={(mealsError as Error).message}/>;
  if (studentsError) return <ErrorDisplay message= {(studentsError as Error).message}/>;
 
  return (
    <div className="flex flex-col w-full md:w-3/4 lg:w-1/2 space-y-4 mb-6">
      <div className="bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold">
  Total Meals Served till <span className="text-2xl font-bold">{mealsData?.formattedLatestDate||0}</span>
</h2>

        <p className="text-3xl font-bold">{mealsData?.totalMealsServed?.toLocaleString() || '0'}</p>
      </div>
      <div className="bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Average Students</h2>
        <p className="text-3xl font-bold">
  {studentsData?.averageAttendanceUntilNow !== undefined 
    ? Math.ceil(studentsData.averageAttendanceUntilNow) 
    : '0'}
</p>


      </div>
    </div>
  );
};

export default MetricsDisplay;
