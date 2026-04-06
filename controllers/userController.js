const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.create({
      name,
      email,
      password, // 👈 plain password (model will hash)
      role
    });

    res.status(201).json(user);

  } catch (error) {
    console.log("REGISTER ERROR:", error);
   res.status(500).json({ message: error.message }); // 👈 SHOW REAL ERROR
  }
};
exports.login = async (req, res) => {
  try {
    console.log("JWT:", process.env.JWT_SECRET);
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check active
    if (!user.isActive) {
      return res.status(403).json({ message: "User is inactive" });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    console.log("LOGIN ERROR:", error); // 👈 IMPORTANT
    res.status(500).json({ message: error.message });
  }
};
// Get all users
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Update role
exports.updateRole = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true }
  );
  res.json(user);
};

// Activate / Deactivate
exports.toggleStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isActive = !user.isActive;
  await user.save();
  res.json(user);
};