import { useEffect, useState } from "react";
import { transactionService } from "../../services/api";

const StatisticsCards = ({ selectedMonth }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await transactionService.fetchStatistics(selectedMonth);
        setStats(data);
        setError("");
      } catch (err) {
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [selectedMonth]);

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {loading ? (
        Array(3)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-lg p-6 h-32"
            />
          ))
      ) : (
        <>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Sales</h3>
            <p className="mt-2 text-3xl font-semibold text-blue-700">
              ${stats.totalSale.toLocaleString()}
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Sold Items</h3>
            <p className="mt-2 text-3xl font-semibold text-green-700">
              {stats.totalSold}
            </p>
          </div>

          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-red-600">Unsold Items</h3>
            <p className="mt-2 text-3xl font-semibold text-red-700">
              {stats.totalNotSold}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default StatisticsCards;
