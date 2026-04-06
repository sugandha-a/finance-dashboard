import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function App() {
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    date: "",
  });

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [form, setForm] = useState({ email: "", password: "" });

  const [record, setRecord] = useState({
    amount: "",
    type: "income",
    category: "",
    notes: "",
  });

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);

  // 🔥 COMMON HEADER
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token]);

  // LOGIN
  const login = async () => {
    try {
      const res = await axios.post(`${API}/users/login`, form);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      alert("Logged in!");
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  // USERS
  const getUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`, authHeader);
      setUsers(res.data);
    } catch (err) {
      alert("Error fetching users");
    }
  };

  // CREATE RECORD
  const createRecord = async () => {
    try {
      await axios.post(`${API}/records`, record, authHeader);
      alert("Record added");
      getRecords();
    } catch (err) {
      alert("Error adding record");
    }
  };

  // GET RECORDS
  const getRecords = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`${API}/records?${query}`, authHeader);
      setRecords(res.data);
    } catch (err) {
      alert("Error fetching records");
    }
  };

  // SUMMARY
  const getSummary = async () => {
    try {
      const res = await axios.get(`${API}/dashboard`, authHeader);
      setSummary(res.data);
    } catch (err) {
      alert("Unauthorized / Error fetching summary");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>💰 Finance Dashboard</h1>

        {token && (
          <button
            onClick={logout}
            style={{
              background: "red",
              color: "white",
              padding: "8px",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Logout
          </button>
        )}
      </div>

      {!token ? (
        <div style={card}>
          <h3>Login</h3>
          <input
            placeholder="Email"
            style={input}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            style={input}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button style={btn} onClick={login}>
            Login
          </button>
        </div>
      ) : (
        <>
          {/* DASHBOARD */}
          <div style={card}>
            <h3>Dashboard</h3>
            <button style={btn} onClick={getSummary}>
              Load Summary
            </button>

            {summary && (
              <div>
                <p>Income: ₹{summary.totalIncome}</p>
                <p>Expense: ₹{summary.totalExpense}</p>
                <p>Balance: ₹{summary.netBalance}</p>
              </div>
            )}
          </div>

          {/* ADD RECORD */}
          <div style={card}>
            <h3>Add Record</h3>

            <input
              placeholder="Amount"
              style={input}
              onChange={(e) =>
                setRecord({ ...record, amount: e.target.value })
              }
            />

            <input
              placeholder="Category"
              style={input}
              onChange={(e) =>
                setRecord({ ...record, category: e.target.value })
              }
            />

            <input
              placeholder="Notes"
              style={input}
              onChange={(e) =>
                setRecord({ ...record, notes: e.target.value })
              }
            />

            <select
              style={input}
              onChange={(e) =>
                setRecord({ ...record, type: e.target.value })
              }
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <button style={btn} onClick={createRecord}>
              Add
            </button>
          </div>

          {/* FILTERS */}
          <div style={card}>
  <h3>Filters</h3>

  <select
    style={input}
    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
  >
    <option value="">All Types</option>
    <option value="income">Income</option>
    <option value="expense">Expense</option>
  </select>

  <input
    placeholder="Category"
    style={input}
    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
  />

  <input
    type="date"
    style={input}
    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
  />

  <button style={btn} onClick={getRecords}>
    Apply Filters
  </button>

  <button
    style={{ ...btn, background: "gray", marginTop: "5px" }}
    onClick={() => {
      setFilters({ type: "", category: "", date: "" });
      getRecords();
    }}
  >
    Reset / Refresh
  </button>
</div>
          {/* RECORDS */}
          <div style={card}>
            <h3>Records</h3>
            <button style={btn} onClick={getRecords}>
              Refresh
            </button>

            {records.map((r) => (
              <div key={r._id} style={recordCard}>
                <p>
                  <b>{r.type}</b> - ₹{r.amount}
                </p>
                <p>{r.category}</p>
                <small>{r.notes}</small>
              </div>
            ))}
          </div>

          {/* USERS */}
          <div style={card}>
            <h3>User Management</h3>
            <button style={btn} onClick={getUsers}>
              Load Users
            </button>

            {users.map((u) => (
              <div key={u._id} style={recordCard}>
                <p>
                  {u.name} ({u.role})
                </p>
                <p>{u.isActive ? "Active" : "Inactive"}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// styles
const card = {
  background: "#f5f5f5",
  padding: "20px",
  margin: "20px auto",
  width: "350px",
  borderRadius: "10px",
};

const input = {
  width: "100%",
  padding: "8px",
  margin: "8px 0",
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "green",
  color: "white",
  border: "none",
};

const recordCard = {
  background: "white",
  padding: "10px",
  margin: "10px 0",
};

export default App;