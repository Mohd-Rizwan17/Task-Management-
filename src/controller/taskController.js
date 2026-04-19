const Task = require("../models/Task");
const { taskSchema } = require("../utils/validation");

// ✅ CREATE TASK
exports.createTask = async (req, res, next) => {
  try {
    const { error } = taskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const newTask = await Task.create({
      ...req.body,
      userId: req.user.toString(), // 🔥 always string
    });

    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
};

// ✅ GET ALL TASKS
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.toString() }); // 🔥 fix

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// ✅ GET SINGLE TASK
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id); // 🔥 correct query

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.userId.toString() !== req.user.toString()) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

// ✅ UPDATE TASK
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.userId.toString() !== req.user.toString()) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    res.json(task);
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE TASK
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.userId.toString() !== req.user.toString()) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    await task.deleteOne();

    res.json({ msg: "Task deleted" });
  } catch (err) {
    next(err);
  }
};
