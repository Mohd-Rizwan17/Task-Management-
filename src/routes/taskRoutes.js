const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controller/taskController");

router.use(auth);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
