const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors()); 

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/records", require("./routes/recordRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

module.exports = app;