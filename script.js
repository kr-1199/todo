document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
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

  li.innerHTML = `
    <span onclick="toggleComplete(this)">${taskText}</span>
    <div class="task-actions">
      <button onclick="deleteTask(this)">❌</button>
    </div>
  `;
  return li;
}

function deleteTask(button) {
  const li = button.parentElement.parentElement;
  li.remove();
  saveTasks();
}

function toggleComplete(span) {
  span.parentElement.classList.toggle("completed");
  saveTasks();
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