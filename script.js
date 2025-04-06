let tasks = [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateCounts();
}

function loadTasks() {
  const stored = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = stored;
  renderTasks("all");
}

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  document.getElementById("showDashboard").addEventListener("click", () => {
    setActiveTab("showDashboard");
    renderTasks("all");
  });
  document.getElementById("showPending").addEventListener("click", () => {
    setActiveTab("showPending");
    renderTasks("pending");
  });
  document.getElementById("showCompleted").addEventListener("click", () => {
    setActiveTab("showCompleted");
    renderTasks("completed");
  });
});

function setActiveTab(id) {
  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const due = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;
  if (!text) return;
  tasks.push({ text, due, priority, completed: false });
  saveTasks();
  renderTasks("all");
  document.getElementById("taskInput").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("priority").value = "Low";
}

function renderTasks(filter) {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach((task, index) => {
    if ((filter === "pending" && task.completed) || (filter === "completed" && !task.completed)) return;
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
      <div>
        <strong>${task.text}</strong> <br/>
        <small>Due: ${task.due || 'N/A'} | Priority: ${task.priority}</small>
      </div>
      <div class="task-actions">
        <button onclick="toggleComplete(${index})">✔️</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="confirmDelete(${index})">❌</button>
      </div>
    `;
    list.appendChild(li);
  });
  updateCounts();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks("all");
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText;
    saveTasks();
    renderTasks("all");
  }
}

function confirmDelete(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks("all");
  }
}

function updateCounts() {
  document.getElementById("totalCount").innerText = tasks.length;
  document.getElementById("pendingCount").innerText = tasks.filter(t => !t.completed).length;
  document.getElementById("completedCount").innerText = tasks.filter(t => t.completed).length;
}

function filterTasksBySearch(query) {
  const filtered = tasks.filter(task => task.text.toLowerCase().includes(query.toLowerCase()));
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
      <div>
        <strong>${task.text}</strong><br/>
        <small>Due: ${task.due || 'N/A'} | Priority: ${task.priority}</small>
      </div>
      <div class="task-actions">
        <button onclick="toggleComplete(${index})">✔️</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="confirmDelete(${index})">❌</button>
      </div>
    `;
    list.appendChild(li);
  });
}
