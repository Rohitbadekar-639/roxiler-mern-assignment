import { useEffect, useState } from "react";
import { transactionService } from "../../services/api";

const TransactionsTable = ({ selectedMonth, searchText }) => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await transactionService.fetchTransactions(
          selectedMonth,
          searchText,
          currentPage
        );
        setTransactions(data);
      } catch (err) {
        setError("Failed to load transactions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [selectedMonth, searchText, currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => setCurrentPage((prev) => prev + 1);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "ID",
                "Title",
                "Description",
                "Price",
                "Category",
                "Sold",
                "Image",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                {/* ID Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.id}
                </td>

                {/* Title with Tooltip */}
                <td className="px-6 py-4 max-w-[200px] group relative">
                  <div className="truncate" title={transaction.title}>
                    {transaction.title}
                  </div>
                  <div className="hidden group-hover:block absolute top-full left-0 z-10 w-64 p-2 bg-white border rounded shadow-lg text-sm break-words">
                    {transaction.title}
                  </div>
                </td>

                {/* Description with Tooltip */}
                <td className="px-6 py-4 max-w-[300px] group relative">
                  <div className="truncate" title={transaction.description}>
                    {transaction.description}
                  </div>
                  <div className="hidden group-hover:block absolute top-full left-0 z-10 w-96 p-2 bg-white border rounded shadow-lg text-sm break-words">
                    {transaction.description}
                  </div>
                </td>

                {/* Price */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${transaction.price.toFixed(2)}
                </td>

                {/* Category */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {transaction.category}
                </td>

                {/* Sold Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.sold
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.sold ? "Yes" : "No"}
                  </span>
                </td>

                {/* Image */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img
                      className="h-12 w-12 rounded-md object-contain bg-gray-100"
                      src={transaction.image}
                      alt={transaction.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isLoading && (
        <div className="p-4 text-center text-gray-500">
          Loading transactions...
        </div>
      )}

      {error && <div className="p-4 text-center text-red-500">{error}</div>}

      {!isLoading && transactions.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          No transactions found
        </div>
      )}

      <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1 || isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-700">Page {currentPage}</span>

        <button
          onClick={handleNext}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
