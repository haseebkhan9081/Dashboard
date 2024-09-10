"use client";
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import Loading from './Loading';
import ErrorDisplay from './Error';

const fetchAttendanceData = async ({ date, attendanceSheet }: { date: string; attendanceSheet: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/AttendanceSummaryByDate?date=${date}&attendanceSheet=${attendanceSheet}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Define the types
interface Student {
  'AC-No': string;
  Name: string;
  Department: string;
  Date: string;
  Time: string;
  status: string;
}

interface AttendanceData {
  [className: string]: Student[];
}

const AttendanceSummaryByDate = () => {
  const params = useSearchParams();
  const date = params.get('date');
  const attendanceSheet = params.get('AttendanceSheet');

  const allParamsAvailable = date && attendanceSheet;

  const { data, error, isLoading } = useQuery<AttendanceData>({
    queryKey: ['attendanceData', date, attendanceSheet],
    queryFn: () => {
      if (allParamsAvailable) {
        return fetchAttendanceData({ date, attendanceSheet });
      } else {
        return Promise.resolve({});
      }
    },
    enabled: !!allParamsAvailable,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay message={(error as Error).message} />;

  // Render tables for each class
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-bold text-center mb-4">Attendance Summary</h1>
      {data && Object.keys(data).length > 0 ? (
        Object.entries(data).map(([className, students]) => (
          <div key={className} className="mb-8">
            <h2 className="text-lg font-semibold mb-2">{className}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-primary border-collapse hidden sm:table">
                <thead>
                  <tr className="border-b border-primary">
                    <th className="p-2 border-r border-primary text-left">AC-No</th>
                    <th className="p-2 border-r border-primary text-left">Name</th>
                    <th className="p-2 border-r border-primary text-left">Date</th>
                    <th className="p-2 border-r border-primary text-left">Time</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students && students.map((student: Student) => (
                    <tr key={student['AC-No']} className="border-b border-primary">
                      <td className="p-2 border-r border-primary">{student['AC-No']}</td>
                      <td className="p-2 border-r border-primary">{student['Name']}</td>
                      <td className="p-2 border-r border-primary">{student['Date']}</td>
                      <td className="p-2 border-r border-primary">{student['Time']}</td>
                      <td className="p-2 text-red-600">{student['status']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Mobile View */}
              <div className="block sm:hidden">
                {students && students.map((student: Student) => (
                  <div key={student['AC-No']} className="mb-4 border border-primary rounded-lg p-4">
                    <p className="font-semibold">AC-No: <span className="font-normal">{student['AC-No']}</span></p>
                    <p className="font-semibold">Name: <span className="font-normal">{student['Name']}</span></p>
                    <p className="font-semibold">Date: <span className="font-normal">{student['Date']}</span></p>
                    <p className="font-semibold">Time: <span className="font-normal">{student['Time']}</span></p>
                    <p className="font-semibold">Status: <span className={`font-normal ${student['status'] === 'Absent' ? 'text-red-600' : 'text-green-600'}`}>{student['status']}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">No data available</p>
      )}
    </div>
  );
};

export default AttendanceSummaryByDate;
