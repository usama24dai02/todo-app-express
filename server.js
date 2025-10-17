const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const FILE_PATH = "./tasks.json";

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // Serve frontend files

// Helper: Read tasks from JSON file
function readTasks() {
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
}

// Helper: Write tasks to JSON file
function writeTasks(tasks) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

// 🟢 Get all tasks
app.get("/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// 🟢 Add new task
app.post("/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title: req.body.title,
    completed: false,
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// 🟢 Update task (toggle completed or edit title)
app.put("/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.title = req.body.title || task.title;
  task.completed = req.body.completed ?? task.completed;
  writeTasks(tasks);
  res.json(task);
});

// 🟢 Delete task
app.delete("/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const updatedTasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  writeTasks(updatedTasks);
  res.json({ message: "Task deleted" });
});

// 🟢 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
