import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

export const transactionService = {
  fetchTransactions: async (month, search, page) => {
    const params = {
      month,
      page,
      perPage: 10,
      ...(search && { search }),
    };
    const { data } = await axios.get(`${API_BASE}/transactions`, { params });
    return data;
  },
  initializeDatabase: () => axios.get(`${API_BASE}/initialize`),

  fetchStatistics: async (month) => {
    const { data } = await axios.get(`${API_BASE}/statistics`, {
      params: { month },
    });
    return data;
  },

  fetchBarChartData: async (month) => {
    const { data } = await axios.get(`${API_BASE}/bar-chart`, {
      params: { month },
    });
    return data;
  },
};
