import { useState, useEffect } from "react";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const TransactionsFilters = ({
  selectedMonth,
  onMonthChange,
  searchText,
  onSearchChange,
}) => {
  const [searchInput, setSearchInput] = useState(searchText);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearchChange(searchInput);
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchInput, onSearchChange]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(Number(e.target.value))}
        className="p-2 border rounded-lg w-full md:w-64 bg-white"
      >
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search transactions..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="p-2 border rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default TransactionsFilters;
