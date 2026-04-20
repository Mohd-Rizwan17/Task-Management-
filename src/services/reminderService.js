const scheduledJobs = new Map();

const scheduleReminder = (task) => {
  console.log("⏳ Scheduling reminder for:", task.title);

  const delay = new Date(task.dueDate).getTime() - Date.now() - 30 * 60 * 1000;

  const timeout = setTimeout(() => {
    console.log(`🔔 Reminder: Task "${task.title}" is due soon`);
  }, delay);

  scheduledJobs.set(task._id.toString(), timeout);
};

const cancelReminder = (taskId) => {
  if (scheduledJobs.has(taskId)) {
    clearTimeout(scheduledJobs.get(taskId));
    scheduledJobs.delete(taskId);
  }
};

module.exports = { scheduleReminder, cancelReminder };
