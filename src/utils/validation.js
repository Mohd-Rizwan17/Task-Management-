const Joi = require("joi");

// User Register validation
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Task validation
const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  category: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()),
  // dueDate: Joi.date().iso().required(),
  dueDate: Joi.date().iso().optional(),
  status: Joi.string().valid("pending", "completed"),
});

module.exports = { registerSchema, taskSchema };
