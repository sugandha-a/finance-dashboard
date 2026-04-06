const Record = require("../models/record");

exports.getSummary = async (req, res) => {
  try {
    const records = await Record.find();

    let income = 0;
    let expense = 0;

    let categoryTotals = {};
    let monthlyData = {};

    records.forEach((r) => {
      // Income / Expense
      if (r.type === "income") income += r.amount;
      else expense += r.amount;

      // Category-wise
      if (!categoryTotals[r.category]) {
        categoryTotals[r.category] = 0;
      }
      categoryTotals[r.category] += r.amount;

      // Monthly Trends
      const month = new Date(r.date).toLocaleString("default", {
        month: "short"
      });

      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += r.amount;
    });

    // Recent activity (last 5)
    const recent = await Record.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
      categoryTotals,
      monthlyData,
      recent
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating summary" });
  }
};