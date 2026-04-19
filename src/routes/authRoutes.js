const router = require("express").Router();

const { register, login, getProfile } = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, getProfile);

module.exports = router;
