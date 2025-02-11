import { useState } from "react";
import TransactionsFilters from "./components/Transactions/TransactionsFilters";
import TransactionsTable from "./components/Transactions/TransactionsTable";
import StatisticsCards from "./components/Transactions/StatisticsCards";
import BarChartComponent from "./components/Transactions/BarChart";
import "./App.css";

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [searchText, setSearchText] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Transaction Dashboard
          </h1>
          <p className="mt-2 text-gray-800">
            Showing data for{" "}
            {new Date(0, selectedMonth - 1).toLocaleString("default", {
              month: "long",
            })}
          </p>
        </div>

        <TransactionsFilters
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          searchText={searchText}
          onSearchChange={setSearchText}
        />

        <StatisticsCards selectedMonth={selectedMonth} />
        <BarChartComponent selectedMonth={selectedMonth} />

        <TransactionsTable
          selectedMonth={selectedMonth}
          searchText={searchText}
        />
      </div>
    </div>
  );
};

export default App;
