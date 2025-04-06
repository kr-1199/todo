document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);

  document.getElementById("showDashboard").addEventListener("click", () => filterTasks("all"));
  document.getElementById("showPending").addEventListener("click", () => filterTasks("pending"));
  document.getElementById("showCompleted").addEventListener("click", () => filterTasks("completed"));

  document.querySelectorAll(".sidebar ul li").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".sidebar ul li").forEach(li => li.classList.remove("active"));
      item.classList.add("active");
    });
  });
});

function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();
  if (taskText === "") return;

  const li = createTaskElement(taskText);
  document.getElementById("taskList").appendChild(li);

  saveTasks();
  input.value = "";
}

function createTaskElement(taskText, completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = taskText;
  span.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  const actions = document.createElement("div");
  actions.classList.add("task-actions");
  actions.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(actions);

  return li;
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").innerText,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    const li = createTaskElement(task.text, task.completed);
    document.getElementById("taskList").appendChild(li);
  });

  const theme = localStorage.getItem("theme");
  if (theme === "light") {
    document.body.classList.add("light");
  }
}

function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
}

function filterTasks(type) {
  const allTasks = document.querySelectorAll("#taskList li");
  allTasks.forEach(task => {
    const isCompleted = task.classList.contains("completed");
    if (type === "all") {
      task.style.display = "flex";
    } else if (type === "pending" && isCompleted) {
      task.style.display = "none";
    } else if (type === "completed" && !isCompleted) {
      task.style.display = "none";
    } else {
      task.style.display = "flex";
    }
  });
}
