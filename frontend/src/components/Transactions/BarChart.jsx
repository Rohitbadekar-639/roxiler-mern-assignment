import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { transactionService } from "../../services/api";

const BarChartComponent = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await transactionService.fetchBarChartData(selectedMonth);
        setChartData(data);
        setError("");
      } catch (err) {
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedMonth]);

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">
        Bar Chart Stats -{" "}
        {new Date(0, selectedMonth - 1).toLocaleString("default", {
          month: "long",
        })}
      </h2>

      {loading ? (
        <div className="animate-pulse bg-gray-200 h-64 rounded" />
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="range"
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#66CCFF"
                radius={[4, 4, 0, 0]}
                name="Item Count"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default BarChartComponent;
