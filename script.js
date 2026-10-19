
const $ = (id) => document.getElementById(id);

$("today").textContent = new Date().toLocaleDateString("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric"
});

let schedules = JSON.parse(localStorage.getItem("sm_schedules") || "[]");
let assignments = JSON.parse(localStorage.getItem("sm_assignments") || "[]");
let exams = JSON.parse(localStorage.getItem("sm_exams") || "[]");

function saveData() {
  localStorage.setItem("sm_schedules", JSON.stringify(schedules));
  localStorage.setItem("sm_assignments", JSON.stringify(assignments));
  localStorage.setItem("sm_exams", JSON.stringify(exams));
}

function addItem(listId, text, onDelete, extra = "") {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = text + extra;

  const button = document.createElement("button");
  button.textContent = "Delete";
  button.type = "button";
  button.addEventListener("click", onDelete);

  li.append(span, button);
  $(listId).appendChild(li);
}

function renderSchedules() {
  $("scheduleList").replaceChildren();

  schedules.forEach((item, index) => {
    addItem("scheduleList", `${item.subject} — ${item.time}`, () => {
      schedules.splice(index, 1);
      saveData();
      renderAll();
    });
  });
}

function renderAssignments() {
  $("assignmentList").replaceChildren();

  assignments.forEach((item, index) => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.style.flex = "none";
    checkbox.style.minWidth = "auto";
    checkbox.style.marginRight = "10px";

    checkbox.addEventListener("change", () => {
      item.done = checkbox.checked;
      saveData();
      renderAll();
    });

    const text = document.createElement("span");
    text.textContent = `${item.name} — Due: ${item.due}`;

    if (item.done) text.style.textDecoration = "line-through";

    label.append(checkbox, text);
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.gap = "8px";
    label.style.flex = "1";

    const button = document.createElement("button");
    button.textContent = "Delete";
    button.type = "button";
    button.addEventListener("click", () => {
      assignments.splice(index, 1);
      saveData();
      renderAll();
    });

    li.append(label, button);
    $("assignmentList").appendChild(li);
  });
}

function renderExams() {
  $("examList").replaceChildren();

  exams.forEach((item, index) => {
    addItem("examList", `${item.subject} — Date: ${item.date}`, () => {
      exams.splice(index, 1);
      saveData();
      renderAll();
    });
  });
}

function renderAll() {
  renderSchedules();
  renderAssignments();
  renderExams();

  $("assignmentCount").textContent = assignments.length;
  $("completedCount").textContent =
    assignments.filter(item => item.done).length;
  $("examCount").textContent = exams.length;
}

$("scheduleForm").addEventListener("submit", (event) => {
  event.preventDefault();

  schedules.push({
    subject: $("scheduleSubject").value.trim(),
    time: $("scheduleTime").value
  });

  $("scheduleForm").reset();
  saveData();
  renderAll();
});

$("assignmentForm").addEventListener("submit", (event) => {
  event.preventDefault();

  assignments.push({
    name: $("assignmentName").value.trim(),
    due: $("assignmentDue").value,
    done: false
  });

  $("assignmentForm").reset();
  saveData();
  renderAll();
});

$("examForm").addEventListener("submit", (event) => {
  event.preventDefault();

  exams.push({
    subject: $("examSubject").value.trim(),
    date: $("examDate").value
  });

  $("examForm").reset();
  saveData();
  renderAll();
});

renderAll();
