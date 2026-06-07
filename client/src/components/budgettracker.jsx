import { useEffect } from "react";

export default function BudgetTracker({
  budget,
  setBudget,
  totalExpense,
}) {
  const remaining = budget - totalExpense;

  const percentage =
    budget > 0
      ? Math.min((totalExpense / budget) * 100, 100)
      : 0;

  useEffect(() => {
    localStorage.setItem("budget", budget);
  }, [budget]);

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>🎯 Monthly Budget Tracker</h2>

      <div style={styles.inputSection}>
        <label style={styles.label}>
          Set Monthly Budget (₹)
        </label>

        <input
          type="number"
          value={budget}
          onChange={(e) =>
            setBudget(Number(e.target.value))
          }
          placeholder="Enter Budget"
          style={styles.input}
        />
      </div>

      <div style={styles.stats}>
        <div style={styles.statBox}>
          <span>Total Budget</span>
          <strong>₹{budget}</strong>
        </div>

        <div style={styles.statBox}>
          <span>Spent</span>
          <strong>₹{totalExpense}</strong>
        </div>

        <div style={styles.statBox}>
          <span>Remaining</span>

          <strong
            style={{
              color:
                remaining >= 0
                  ? "#4ade80"
                  : "#ef4444",
            }}
          >
            ₹{remaining}
          </strong>
        </div>
      </div>

      <div style={styles.progressContainer}>
        <div
          style={{
            ...styles.progressFill,
            width: `${percentage}%`,
            background:
              percentage >= 90
                ? "#ef4444"
                : percentage >= 70
                ? "#f59e0b"
                : "#6c63ff",
          }}
        />
      </div>

      <p style={styles.percentText}>
        {percentage.toFixed(1)}% of budget used
      </p>

      {percentage >= 100 && (
        <div style={styles.warning}>
          ⚠️ Budget Limit Exceeded
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#1a1a2e",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #2a2a4a",
    color: "#fff",
    marginTop: "20px",
  },

  heading: {
    marginBottom: "20px",
    fontSize: "22px",
  },

  inputSection: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#aaa",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #444",
    background: "#111827",
    color: "#fff",
    fontSize: "16px",
  },

  stats: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  statBox: {
    flex: 1,
    minWidth: "120px",
    background: "#111827",
    padding: "12px",
    borderRadius: "10px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  progressContainer: {
    height: "14px",
    background: "#2d3748",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    transition: "0.5s ease",
  },

  percentText: {
    textAlign: "center",
    marginTop: "10px",
    color: "#bbb",
  },

  warning: {
    marginTop: "15px",
    textAlign: "center",
    color: "#ef4444",
    fontWeight: "bold",
  },
};