const pool = require("../config/pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerSchema } = require("../utils/validation");

exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const { email, password } = req.body;

    // Basic Validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users(email, password) VALUES($1,$2) RETURNING id, email",
      [email, hashed],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ msg: "User already exists" });
    }
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    const user = result.rows[0];

    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    console.log("Entered:", password);
    console.log("DB Hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Match:", isMatch);

    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, email FROM users WHERE id=$1", [
      req.user,
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
