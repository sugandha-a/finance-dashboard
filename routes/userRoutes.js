const router = require("express").Router();
const { register, login } = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);

module.exports = router;

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  getUsers,
  updateRole,
  toggleStatus
} = require("../controllers/userController");

router.get("/", auth, role("admin"), getUsers);
router.put("/:id/role", auth, role("admin"), updateRole);
router.put("/:id/status", auth, role("admin"), toggleStatus);

router.post("/register", async (req, res) => {
  const bcrypt = require("bcryptjs");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  res.json({ hashedPassword });
});