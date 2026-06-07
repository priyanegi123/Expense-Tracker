import { useState } from "react";

const CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];
const today = new Date().toISOString().split("T")[0];

export default function ExpenseForm({ onSubmit, initialData, onCancel, theme: t }) {
  const [form, setForm] = useState({
    amount: initialData?.amount || "",
    category: initialData?.category || "",
    date: initialData?.date || today,
    note: initialData?.note || "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || form.amount <= 0)
      return setError("Amount must be a positive number");
    if (!form.category)
      return setError("Category is required");
    if (!form.date)
      return setError("Date is required");
    if (form.date > today)
      return setError("Date cannot be in the future");
    setError("");
    onSubmit(form);
    setForm({ amount: "", category: "", date: today, note: "" });
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: `1px solid ${t?.border || "#ddd"}`,
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    background: t?.inputBg || "#fff",
    color: t?.inputColor || "#000",
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: t?.cardBg || "#fff",
      padding: "24px",
      borderRadius: "16px",
      border: `1px solid ${t?.border || "#ddd"}`,
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }}>
      <h2 style={{ margin: 0, color: t?.text || "#000", fontSize: "20px" }}>
        {initialData ? "✏️ Edit Expense" : "➕ Add Expense"}
      </h2>

      {error && (
        <p style={{ color: "#ef5350", fontSize: "13px", margin: 0 }}>{error}</p>
      )}

      <input
        type="number"
        name="amount"
        placeholder="Amount (₹)"
        value={form.amount}
        onChange={handleChange}
        style={inputStyle}
        min="0"
        step="0.01"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="">Select Category</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        max={today}
        style={inputStyle}
      />

      <input
        type="text"
        name="note"
        placeholder="Note (optional)"
        value={form.note}
        onChange={handleChange}
        style={inputStyle}
      />

      <div style={{ display: "flex", gap: "8px" }}>
        <button type="submit" style={{
          background: "linear-gradient(135deg, #6c63ff, #a855f7)",
          color: "#fff",
          border: "none",
          padding: "12px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          flex: 1,
          fontSize: "14px",
        }}>
          {initialData ? "Update Expense" : "Add Expense"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{
            background: t?.inputBg || "#eee",
            color: t?.text || "#333",
            border: `1px solid ${t?.border || "#ddd"}`,
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            flex: 1,
            fontSize: "14px",
          }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}