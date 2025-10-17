const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");

// Fetch tasks on load
async function fetchTasks() {
  const res = await fetch("/tasks");
  const tasks = await res.json();
  displayTasks(tasks);
}

// Display tasks in list
function displayTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <span onclick="toggleTask(${task.id}, ${!task.completed})">${task.title}</span>
      <button onclick="deleteTask(${task.id})">🗑</button>
    `;

    taskList.appendChild(li);
  });
}

// Add task
async function addTask() {
  const title = taskInput.value.trim();
  if (!title) return alert("Enter a task!");
  await fetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  taskInput.value = "";
  fetchTasks();
}

// Toggle task completion
async function toggleTask(id, completed) {
  await fetch(`/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  fetchTasks();
}

// Delete task
async function deleteTask(id) {
  await fetch(`/tasks/${id}`, { method: "DELETE" });
  fetchTasks();
}

// Initial load
fetchTasks();
