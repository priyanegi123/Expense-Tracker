import { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";
import Filters from "./components/Filters";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
} from "./services/api";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({ category: "", month: "", year: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("dark");

  const t = themes[theme];

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await getExpenses();
      setExpenses(res.data);
    } catch {
      setError("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await getSummary();
      setSummary(res.data);
    } catch {
      setError("Failed to fetch summary");
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  const handleAdd = async (form) => {
    try {
      await createExpense(form);
      await fetchExpenses();
      await fetchSummary();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add expense");
    }
  };

  const handleUpdate = async (form) => {
    try {
      await updateExpense(editingExpense.id, form);
      setEditingExpense(null);
      await fetchExpenses();
      await fetchSummary();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update expense");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      await fetchExpenses();
      await fetchSummary();
    } catch {
      setError("Failed to delete expense");
    }
  };

  const filteredExpenses = expenses.filter((e) => {
    if (filters.category && e.category !== filters.category) return false;
    if (filters.month) {
      const d = new Date(e.date);
      if (d.getMonth() + 1 !== parseInt(filters.month)) return false;
    }
    if (filters.year) {
      const d = new Date(e.date);
      if (d.getFullYear() !== parseInt(filters.year)) return false;
    }
    return true;
  });

  return (
    <div style={{ ...styles.page, background: t.pageBg }}>
      {/* Header */}
      <div style={{ ...styles.header, background: t.headerBg, borderBottom: `2px solid ${t.accent}` }}>
        <div style={styles.headerLeft}>
          <h1 style={{ ...styles.title, WebkitTextFillColor: theme === "dark" ? "transparent" : t.accent }}>
            💸 Expense Tracker
          </h1>
          <p style={{ ...styles.subtitle, color: t.subtext }}>
            Track your spending, manage your money
          </p>
        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{ ...styles.themeBtn, background: t.cardBg, color: t.text, border: `1px solid ${t.border}` }}
        >
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div style={styles.container}>
        {error && (
          <div style={styles.errorBanner}>
            {error}
            <button onClick={() => setError("")} style={styles.closeBtn}>✕</button>
          </div>
        )}

        {/* TOP: Form + Summary */}
        <div style={styles.topSection}>
          <div style={styles.formBox}>
            <ExpenseForm
              onSubmit={editingExpense ? handleUpdate : handleAdd}
              initialData={editingExpense}
              onCancel={editingExpense ? () => setEditingExpense(null) : null}
              theme={t}
            />
          </div>
          <div style={styles.summaryBox}>
            <Summary
              summary={summary}
              expenses={expenses}
              onIncomeUpdate={fetchSummary}
              theme={t}
            />
          </div>
        </div>

        {/* BOTTOM: Filters + List */}
        <div style={styles.bottomSection}>
          <div style={{ ...styles.filterBar, background: t.cardBg, border: `1px solid ${t.border}` }}>
            <p style={{ ...styles.filterLabel, color: t.subtext }}>🔍 Filter Expenses</p>
            <Filters filters={filters} onChange={setFilters} theme={t} />
          </div>
          {loading ? (
            <div style={{ ...styles.loading, background: t.cardBg, color: t.subtext }}>
              Loading expenses...
            </div>
          ) : (
            <ExpenseList
              expenses={filteredExpenses}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
              theme={t}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const themes = {
  dark: {
    pageBg: "#0f0f1a",
    headerBg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    cardBg: "#1a1a2e",
    cardBg2: "#16213e",
    text: "#ffffff",
    subtext: "#aaaaaa",
    border: "#2a2a4a",
    accent: "#6c63ff",
    inputBg: "#0f0f1a",
    inputColor: "#ffffff",
  },
  light: {
    pageBg: "#f5f5f5",
    headerBg: "linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)",
    cardBg: "#ffffff",
    cardBg2: "#f0edff",
    text: "#1a1a2e",
    subtext: "#555555",
    border: "#e0e0e0",
    accent: "#6c63ff",
    inputBg: "#f9f9f9",
    inputColor: "#1a1a2e",
  },
};

const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    transition: "background 0.3s ease",
  },
  header: {
    padding: "24px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  title: {
    margin: 0,
    fontSize: "36px",
    fontWeight: "800",
    background: "linear-gradient(90deg, #6c63ff, #a855f7, #ec4899)",
    WebkitBackgroundClip: "text",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
  },
  themeBtn: {
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  container: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  topSection: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  formBox: { flex: "1", minWidth: "300px" },
  summaryBox: { flex: "2", minWidth: "340px" },
  bottomSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  filterBar: {
    padding: "16px 20px",
    borderRadius: "14px",
  },
  filterLabel: {
    margin: "0 0 10px 0",
    fontWeight: "bold",
    fontSize: "14px",
  },
  errorBanner: {
    background: "#2a0a0a",
    color: "#ef5350",
    padding: "12px 16px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ef5350",
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#ef5350",
    fontSize: "16px",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    borderRadius: "12px",
  },
};