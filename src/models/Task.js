// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   userId: String,
// });

// module.exports = mongoose.model("Task", taskSchema);

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    userId: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "Personal",
    },

    tags: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Task", taskSchema);
