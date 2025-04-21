document.addEventListener("DOMContentLoaded", () => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const taskInput    = document.getElementById("taskInput");
  const taskList     = document.getElementById("taskList");
  const progressBar  = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const addBtn       = document.getElementById("addBtn");

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateProgress() {
    const total     = tasks.length;
    const completed = tasks.filter(t => t.done).length;
    const percent   = total === 0 ? 0 : (completed / total) * 100;

    progressBar.style.width  = `${percent}%`;
    progressText.textContent = `${completed} of ${total} tasks completed`;
  }

  function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, i) => {
      const li = document.createElement("li");
      li.className = "task" + (task.done ? " done" : "");

      // Task text
      const span = document.createElement("span");
      span.className   = "task-text";
      span.textContent = task.text;
      span.onclick     = () => toggleDone(i);

      // Actions
      const actions = document.createElement("div");
      actions.className = "actions";
      const editBtn = document.createElement("button");
      editBtn.textContent = "✎";
      editBtn.onclick     = () => editTask(i);
      const delBtn = document.createElement("button");
      delBtn.textContent  = "🗑";
      delBtn.onclick       = () => deleteTask(i);
      actions.append(editBtn, delBtn);

      // ✔ mark on the right
      const mark = document.createElement("span");
      mark.className   = "check-mark";
      mark.textContent = task.done ? "✔" : "";

      // Assemble
      li.append(span, actions, mark);
      taskList.appendChild(li);
    });

    updateProgress();
    saveTasks();
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    tasks.push({ text, done: false });
    taskInput.value = "";
    renderTasks();
  }

  function toggleDone(i) {
    tasks[i].done = !tasks[i].done;
    renderTasks();
  }

  function editTask(i) {
    const updated = prompt("Edit your task:", tasks[i].text);
    if (updated && updated.trim()) {
      tasks[i].text = updated.trim();
      renderTasks();
    }
  }

  function deleteTask(i) {
    tasks.splice(i, 1);
    renderTasks();
  }

  addBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
  });

  renderTasks();
});
