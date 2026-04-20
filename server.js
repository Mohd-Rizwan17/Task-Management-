require("dotenv").config();
const express = require("express");

const connectMongo = require("./src/config/db");
const errorHandler = require("./src/middleware/errorMiddleware");

const app = express();

app.use(express.json());

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/tasks", require("./src/routes/taskRoutes"));
app.use("/api/categories", require("./src/routes/categoryRoutes"));

connectMongo();
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API running 🚀");
});

app.listen(5000, () => {
  console.log("Server started on port http://localhost:5000");
});
