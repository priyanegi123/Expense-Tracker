import {
  PieChart, Pie, Cell, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid
} from "recharts";
import { useState } from "react";
import { setIncome } from "../services/api";
import * as XLSX from "xlsx";

const COLORS = ["#6c63ff", "#ff6584", "#43b89c", "#f9a825", "#ef5350", "#00bcd4"];

const CATEGORY_ICONS = {
  Food: "🍔", Transport: "🚕", Bills: "🏠",
  Entertainment: "🎬", Other: "🛒",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

export default function Summary({ summary, expenses, onIncomeUpdate, theme: t }) {
  const [incomeInput, setIncomeInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [budgets, setBudgets] = useState({});
  const [budgetInput, setBudgetInput] = useState({});
  const [showBudget, setShowBudget] = useState(false);

  if (!summary) return null;

  const { totalThisMonth, perCategory, highest, monthlyIncome, remaining } = summary;

  const pieData = [
    ...Object.entries(perCategory).map(([name, value]) => ({ name, value })),
    ...(monthlyIncome > 0 && remaining > 0 ? [{ name: "Remaining", value: remaining }] : []),
  ];

  const insights = [];
  Object.entries(perCategory).forEach(([cat, amt]) => {
    if (budgets[cat] && amt > budgets[cat]) {
      insights.push(`⚠️ ${CATEGORY_ICONS[cat] || "💸"} ${cat} budget exceeded! Spent ${formatCurrency(amt)} vs budget ${formatCurrency(budgets[cat])}`);
    }
  });
  if (monthlyIncome > 0 && totalThisMonth > monthlyIncome * 0.8)
    insights.push("⚠️ You've spent over 80% of your monthly income!");
  if (monthlyIncome > 0 && remaining > monthlyIncome * 0.5)
    insights.push("✅ Great job! You still have more than 50% of your income remaining.");
  if (highest && monthlyIncome > 0 && highest.amount > monthlyIncome * 0.2)
    insights.push(`💡 Your highest expense (${formatCurrency(highest.amount)} on ${highest.category}) is over 20% of your income.`);

  const monthlyTrend = {};
  (expenses || []).forEach((e) => {
    const month = e.date.slice(0, 7);
    monthlyTrend[month] = (monthlyTrend[month] || 0) + e.amount;
  });
  const trendData = Object.entries(monthlyTrend)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }));

  const handleIncomeSubmit = async () => {
    if (!incomeInput || incomeInput <= 0) return;
    await setIncome(incomeInput);
    setIncomeInput("");
    setEditing(false);
    onIncomeUpdate();
  };

  const handleExportCSV = () => {
    const data = (expenses || []).map((e) => ({
      Date: e.date, Category: e.category, Amount: e.amount, Note: e.note,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "expenses.xlsx");
  };

  const remainingColor = remaining < 0 ? "#ef5350" : "#43b89c";
  const card = { background: t?.cardBg2 || "#16213e", padding: "14px", borderRadius: "12px", flex: 1, minWidth: "120px", border: `1px solid ${t?.border || "#2a2a4a"}` };

  return (
    <div style={{ background: t?.cardBg || "#1a1a2e", padding: "20px", borderRadius: "16px", border: `1px solid ${t?.border || "#2a2a4a"}`, display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Income Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: t?.cardBg2 || "#16213e", padding: "16px", borderRadius: "12px", border: `1px solid ${t?.border || "#2a2a4a"}` }}>
        <div>
          <p style={{ margin: 0, fontSize: "13px", color: t?.subtext || "#aaa" }}>💰 Monthly Income</p>
          <p style={{ margin: 0, fontSize: "22px", fontWeight: "bold", color: t?.accent || "#6c63ff" }}>
            {monthlyIncome > 0 ? formatCurrency(monthlyIncome) : "Not set"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleExportCSV} style={{ background: "#43b89c", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
            ⬇ Export Excel
          </button>
          <button onClick={() => setEditing(!editing)} style={{ background: t?.accent || "#6c63ff", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
            {editing ? "Cancel" : "Set Income"}
          </button>
        </div>
      </div>

      {editing && (
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="number"
            placeholder="Enter monthly income (₹)"
            value={incomeInput}
            onChange={(e) => setIncomeInput(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: "8px", border: `1px solid ${t?.border || "#2a2a4a"}`, background: t?.inputBg || "#0f0f1a", color: t?.inputColor || "#fff", fontSize: "14px" }}
          />
          <button onClick={handleIncomeSubmit} style={{ background: "#43b89c", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
            Save
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <div style={card}>
          <p style={{ margin: 0, fontSize: "12px", color: t?.subtext || "#aaa" }}>📅 Spent This Month</p>
          <p style={{ margin: "4px 0 0 0", fontSize: "18px", fontWeight: "bold", color: t?.text || "#fff" }}>{formatCurrency(totalThisMonth)}</p>
        </div>
        <div style={{ ...card, borderLeft: `3px solid ${remainingColor}` }}>
          <p style={{ margin: 0, fontSize: "12px", color: t?.subtext || "#aaa" }}>{remaining >= 0 ? "✅ Remaining" : "⚠️ Overspent"}</p>
          <p style={{ margin: "4px 0 0 0", fontSize: "18px", fontWeight: "bold", color: remainingColor }}>
            {monthlyIncome > 0 ? formatCurrency(Math.abs(remaining)) : "—"}
          </p>
        </div>
        <div style={card}>
          <p style={{ margin: 0, fontSize: "12px", color: t?.subtext || "#aaa" }}>🔺 Highest</p>
          <p style={{ margin: "4px 0 0 0", fontSize: "18px", fontWeight: "bold", color: t?.text || "#fff" }}>{highest ? formatCurrency(highest.amount) : "—"}</p>
          {highest && <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: t?.subtext || "#aaa" }}>{CATEGORY_ICONS[highest.category]} {highest.category}</p>}
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "260px", background: t?.cardBg2 || "#16213e", padding: "16px", borderRadius: "12px", border: `1px solid ${t?.border || "#2a2a4a"}` }}>
          <p style={{ margin: "0 0 12px 0", fontWeight: "bold", color: t?.text || "#ccc", fontSize: "14px" }}>📊 Expense Breakdown</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {trendData.length > 1 && (
          <div style={{ flex: 1, minWidth: "260px", background: t?.cardBg2 || "#16213e", padding: "16px", borderRadius: "12px", border: `1px solid ${t?.border || "#2a2a4a"}` }}>
            <p style={{ margin: "0 0 12px 0", fontWeight: "bold", color: t?.text || "#ccc", fontSize: "14px" }}>📈 Monthly Trend</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={t?.border || "#2a2a4a"} />
                <XAxis dataKey="month" stroke={t?.subtext || "#aaa"} fontSize={11} />
                <YAxis stroke={t?.subtext || "#aaa"} fontSize={11} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Line type="monotone" dataKey="total" stroke="#6c63ff" strokeWidth={2} dot={{ fill: "#6c63ff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div>
        <p style={{ margin: "0 0 12px 0", fontWeight: "bold", color: t?.text || "#ccc", fontSize: "14px" }}>🗂 Category Breakdown</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {Object.entries(perCategory).map(([cat, amt], i) => (
            <div key={cat} style={{ background: t?.cardBg2 || "#16213e", padding: "10px 14px", borderRadius: "8px", minWidth: "110px", border: `1px solid ${t?.border || "#2a2a4a"}`, borderLeft: `4px solid ${COLORS[i % COLORS.length]}` }}>
              <p style={{ margin: 0, fontSize: "12px", color: t?.subtext || "#aaa" }}>{CATEGORY_ICONS[cat] || "💸"} {cat}</p>
              <p style={{ margin: "4px 0 0 0", fontWeight: "bold", fontSize: "15px", color: COLORS[i % COLORS.length] }}>{formatCurrency(amt)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Goals */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <p style={{ margin: 0, fontWeight: "bold", color: t?.text || "#ccc", fontSize: "14px" }}>🎯 Budget Goals</p>
          <button onClick={() => setShowBudget(!showBudget)} style={{ background: t?.accent || "#6c63ff", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
            {showBudget ? "Hide" : "Set Budgets"}
          </button>
        </div>
        {showBudget && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {["Food", "Transport", "Bills", "Entertainment", "Other"].map((cat) => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: t?.text || "#ccc", fontSize: "13px", minWidth: "120px" }}>{CATEGORY_ICONS[cat]} {cat}</span>
                <input
                  type="number"
                  placeholder="Budget (₹)"
                  value={budgetInput[cat] || ""}
                  onChange={(e) => setBudgetInput({ ...budgetInput, [cat]: e.target.value })}
                  style={{ flex: 1, padding: "8px", borderRadius: "8px", border: `1px solid ${t?.border || "#2a2a4a"}`, background: t?.inputBg || "#0f0f1a", color: t?.inputColor || "#fff", fontSize: "13px" }}
                />
                <button onClick={() => setBudgets({ ...budgets, [cat]: parseFloat(budgetInput[cat]) })}
                  style={{ background: "#43b89c", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                  Set
                </button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {Object.entries(perCategory).map(([cat, amt]) => {
            const budget = budgets[cat];
            if (!budget) return null;
            const pct = Math.min((amt / budget) * 100, 100);
            const color = pct >= 100 ? "#ef5350" : pct >= 80 ? "#f9a825" : "#43b89c";
            return (
              <div key={cat} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: t?.text || "#ccc", fontSize: "13px" }}>{CATEGORY_ICONS[cat]} {cat}</span>
                  <span style={{ color, fontSize: "13px" }}>{formatCurrency(amt)} / {formatCurrency(budget)}</span>
                </div>
                <div style={{ background: t?.inputBg || "#0f0f1a", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "999px", transition: "width 0.3s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div style={{ background: t?.cardBg2 || "#16213e", padding: "16px", borderRadius: "12px", border: `1px solid ${t?.border || "#2a2a4a"}` }}>
          <p style={{ margin: "0 0 12px 0", fontWeight: "bold", color: t?.text || "#ccc", fontSize: "14px" }}>🤖 AI Spending Insights</p>
          {insights.map((msg, i) => (
            <div key={i} style={{ padding: "10px 14px", marginBottom: "8px", borderRadius: "8px", background: t?.inputBg || "#0f0f1a", color: t?.text || "#ccc", fontSize: "13px", borderLeft: "3px solid #6c63ff" }}>
              {msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}