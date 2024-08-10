import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Loading from './Loading';
import ErrorDisplay from './Error';

const fetchAllFiles = async (quotationSheet: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/analytics/quotationperMeal?quotationSheet=${quotationSheet}&quotationWorkSheet=Quotation Per Meal`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const QuotationPerMeal: React.FC = () => {
  const params = useSearchParams();
  const quotationSheet = params.get("QuotationSheet");

  const allParamsAvailable = quotationSheet != null;

  const { data, error, isLoading } = useQuery({
    queryKey: ['quotationPerMeal', quotationSheet],
    queryFn: () => {
      if (allParamsAvailable) {
        return fetchAllFiles(quotationSheet!);
      } else {
        return Promise.resolve([]);
      }
    },
    enabled: !!allParamsAvailable,
    retry: 3, // Number of retry attempts
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // Exponential backoff
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay message={(error as Error).message} />;

  return (
    <div className="p-4 md:p-6 w-full">
      <h2 className="text-2xl font-bold mb-4 text-primary">Meal Quotations and Costs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-primary">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">Meal Plan</th>
              <th className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">Quotations</th>
              <th className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">Cost for 200 Meals</th>
            </tr>
          </thead>
          <tbody>
            {data.map((meal: { mealPlan: string, quotations: string, costFor200Meals: string }, index: number) => (
              <tr key={index}>
                <td className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">{meal.mealPlan}</td>
                <td className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">{meal.quotations}</td>
                <td className="border border-primary px-2 py-1 text-sm md:px-4 md:py-2">{meal.costFor200Meals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotationPerMeal;
