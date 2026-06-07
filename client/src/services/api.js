import axios from "axios";

const API_BASE = "https://expense-tracker-api-p8hs.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
});

export const getExpenses = () => api.get("/expenses");
export const createExpense = (data) => api.post("/expenses", data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const getSummary = () => api.get("/expenses/summary");
export const setIncome = (income) => api.post("/income", { income });