// const Task = require("../models/Task");
// const { taskSchema } = require("../utils/validation");

// exports.createTask = async (req, res, next) => {
//   try {
//     const { error } = taskSchema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ msg: error.details[0].message });
//     }

//     const newTask = await Task.create({
//       ...req.body,
//       userId: req.user.toString(),
//     });

//     res.status(201).json(newTask);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getTasks = async (req, res, next) => {
//   try {
//     const tasks = await Task.find({ userId: req.user.toString() }); // 🔥 fix

//     res.json(tasks);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getTaskById = async (req, res, next) => {
//   try {
//     const task = await Task.findById(req.params.id); // 🔥 correct query

//     if (!task) {
//       return res.status(404).json({ msg: "Task not found" });
//     }

//     if (task.userId.toString() !== req.user.toString()) {
//       return res.status(403).json({ msg: "Forbidden" });
//     }

//     res.json(task);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.updateTask = async (req, res, next) => {
//   try {
//     let task = await Task.findById(req.params.id);

//     if (!task) {
//       return res.status(404).json({ msg: "Task not found" });
//     }

//     if (task.userId.toString() !== req.user.toString()) {
//       return res.status(403).json({ msg: "Forbidden" });
//     }

//     task = await Task.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true },
//     );

//     res.json(task);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.deleteTask = async (req, res, next) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     if (!task) {
//       return res.status(404).json({ msg: "Task not found" });
//     }

//     if (task.userId.toString() !== req.user.toString()) {
//       return res.status(403).json({ msg: "Forbidden" });
//     }

//     await task.deleteOne();

//     res.json({ msg: "Task deleted" });
//   } catch (err) {
//     next(err);
//   }
// };

const Task = require("../models/Task");
const { taskSchema } = require("../utils/validation");

const {
  scheduleReminder,
  cancelReminder,
} = require("../services/reminderService");
const sendWebhook = require("../services/webhookService");

exports.createTask = async (req, res, next) => {
  try {
    const { error } = taskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const newTask = await Task.create({
      ...req.body,
      userId: req.user.toString(),
    });

    scheduleReminder(newTask);

    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { category, tags } = req.query;

    let filter = { userId: req.user.toString() };

    if (category) filter.category = category;
    if (tags) filter.tags = { $in: tags.split(",") };

    const tasks = await Task.find(filter);

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

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

exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.userId.toString() !== req.user.toString()) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    cancelReminder(task._id.toString());

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    if (updatedTask.dueDate && updatedTask.status !== "completed") {
      scheduleReminder(updatedTask);
    }

    if (updatedTask.status === "completed") {
      sendWebhook({
        taskId: updatedTask._id,
        title: updatedTask.title,
        completedAt: new Date(),
        userId: updatedTask.userId,
      });
    }

    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.userId.toString() !== req.user.toString()) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    cancelReminder(task._id.toString());

    await task.deleteOne();

    res.json({ msg: "Task deleted" });
  } catch (err) {
    next(err);
  }
};
