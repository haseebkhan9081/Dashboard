import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { parse, format } from 'date-fns';

const fetchAllFiles = async (
  quotationSheet: string,
  quotationWorkSheet: string
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/mealsServedLast7days?quotationSheet=${quotationSheet}&quotationWorkSheet=${quotationWorkSheet}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const MealsLastWeek: React.FC = () => {
  const params = useSearchParams();
  const quotationSheet = params.get("QuotationSheet");
  const quotationWorkSheet = params.get("QuotationWorkSheet");

  const allParamsAvailable = quotationSheet != null && quotationWorkSheet != null;

  const { data, error, isLoading } = useQuery({
    queryKey: ['mealsLast7Days', quotationSheet, quotationWorkSheet],
    queryFn: () => {
      if (allParamsAvailable) {
        return fetchAllFiles(quotationSheet!, quotationWorkSheet!);
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

  const formatDate = (dateString: string) => {
    const date = parse(dateString, 'MM/dd/yyyy', new Date());
    return format(date, 'EEEE');
  };

  return (
    <div className="p-4 md:p-6 w-full">
      <h2 className="text-2xl font-bold mb-4 text-primary">Meals Served in the Last 7 Days</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-primary">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">Day</th>
              <th className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">Meal Name</th>
              <th className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">Boxes</th>
            </tr>
          </thead>
          <tbody>
            {data.last7DaysMeals.map((meal: { date: string, mealName: string, boxes: string }) => (
              <tr key={meal.date}>
                <td className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">{formatDate(meal.date)}</td>
                <td className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">{meal.mealName}</td>
                <td className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">{meal.boxes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MealsLastWeek;
