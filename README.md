# Expense Tracker

A full-stack expense tracking app built with React and Node.js. You can add daily expenses, set a monthly income, track what you've spent vs what's left, and filter by category or month.

**Live Demo:** https://expense-tracker-ten-bay-61.vercel.app  
**GitHub:** https://github.com/priyanegi123/Expense-Tracker

---

## Features

- Add, edit, and delete expenses (with confirmation before deleting)
- Set monthly income and see remaining balance
- View spending breakdown by category with a pie chart
- Monthly trend chart to compare spending across months
- Set budget goals per category with progress bars
- Spending insights — alerts when you're overspending
- Filter expenses by category, month, and year
- Search expenses by category or note
- Export all expenses to Excel
- Dark and light mode toggle
- Form validation on both frontend and backend

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), Recharts, Axios |
| Backend | Node.js, Express.js |
| Storage | In-memory (server-side) |
| Deployment | Vercel (frontend), Render (backend) |
| Export | SheetJS (xlsx) |

---

## Project Structure

```
expense-tracker/
├── client/              
│   └── src/
│       ├── components/
│       │   ├── ExpenseForm.jsx    
│       │   ├── ExpenseList.jsx    
│       │   ├── Summary.jsx        
│       │   └── Filters.jsx        
│       ├── services/
│       │   └── api.js             
│       └── App.jsx                
│
├── server/              
│   └── index.js         
│
└── README.md
```

---

## Running Locally

### Backend
```bash
cd server
npm install
npm run dev
```
Runs on `http://localhost:5000`

### Frontend
```bash
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173`

> For local development, change `API_BASE` in `client/src/services/api.js` to `http://localhost:5000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expenses` | Get all expenses |
| POST | `/expenses` | Add new expense |
| PUT | `/expenses/:id` | Update expense |
| DELETE | `/expenses/:id` | Delete expense |
| GET | `/expenses/summary` | Get summary stats |
| POST | `/income` | Set monthly income |

---

## What Works Well

- All CRUD operations work with validation on both frontend and backend
- Summary and charts update in real time after every add, edit, or delete
- Budget warnings show correctly when spending exceeds the set limit
- Excel export downloads properly
- Dark/light mode works across all components
- Filters correctly narrow down expenses by category, month, and year

---

## Known Limitations

- Data is not persistent — since I used in-memory storage, everything resets when the server restarts. This is the most significant limitation of the current version.
- No user authentication — anyone with the live link can view and modify the data.
- Render's free tier goes to sleep after inactivity, so the first request after a gap can take around 50 seconds.

---

## What I'd Improve Next

- Add a proper database (SQLite or MongoDB) so data doesn't get lost on restart
- Add user authentication so each person has their own private data
- Allow users to attach receipt images to expenses
- Add a calendar view to visualize spending by date
- Support recurring expenses like rent or subscriptions that auto-add each month
- Allow importing expenses from a CSV or bank statement

---

## Author

Priya Negi  
Built as part of Studio Graphene Associate Software Engineer Assignment