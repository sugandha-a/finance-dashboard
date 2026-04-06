const Record = require("../models/record");

// ✅ CREATE RECORD
exports.createRecord = async (req, res) => {
  try {
    const { amount, type, category, notes } = req.body;

    // Validation
    if (!amount || !type || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const record = await Record.create({
      amount,
      type,
      category,
      notes
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: "Error creating record" });
  }
};

// ✅ GET RECORDS (FILTER + SEARCH + PAGINATION + SOFT DELETE)
exports.getRecords = async (req, res) => {
  try {
    const { type, category, date, search, page = 1, limit = 5 } = req.query;

    let filter = { isDeleted: false };

    // Filter by type
    if (type) filter.type = type;

    // Filter by category
    if (category) filter.category = category;

    // Search (category)
    if (search) {
      filter.category = {
        $regex: search,
        $options: "i"
      };
    }

    // Filter by date (single day)
    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);

      filter.date = {
        $gte: selectedDate,
        $lt: nextDay
      };
    }

    const records = await Record.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching records" });
  }
};

// ✅ UPDATE RECORD
exports.updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record || record.isDeleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    const updated = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating record" });
  }
};

// ✅ SOFT DELETE RECORD
exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record || record.isDeleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Soft delete
    record.isDeleted = true;
    await record.save();

    res.json({ message: "Record deleted (soft delete)" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting record" });
  }
};