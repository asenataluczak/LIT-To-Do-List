let addTaskForm = document.querySelector("form#addTaskForm");
let editTaskForm = document.querySelector("form#editTaskForm");
let deleteTaskBtn = document.querySelector("#deleteTaskBtn");
let confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");
let deleteAllDoneTasksBtn = document.querySelector("#deleteAllDoneTasksBtn");
let unfinishedTasksContainer = document.querySelector(
  "#unfinishedTasksContainer"
);
let finishedTasksContainer = document.querySelector("#finishedTasksContainer");
let deleteTaskModal = new bootstrap.Modal(
  document.querySelector("#deleteModal")
);
let editTaskModal = new bootstrap.Modal(document.querySelector("#editModal"));

let unfinishedTasks = [];
let finishedTasks = [];

addTaskForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (addTaskForm.elements["title"].value) {
    const newTask = {
      title: addTaskForm.elements["title"].value,
      description: addTaskForm.elements["description"].value,
      id: Date.now(),
    };
    unfinishedTasks.push(newTask);
    showUnfinishedTasks();
    addTaskForm.reset();
  }
});

unfinishedTasksContainer.addEventListener("click", function (e) {
  const index = unfinishedTasks.findIndex(function (value) {
    return +value.id === +e.target.parentElement.id;
  });
  if (e.target.id === "deleteTaskBtn") {
    deleteTaskModal.show();
    confirmDeleteBtn.onclick = function () {
      unfinishedTasks.splice(index, 1);
      showUnfinishedTasks();
      deleteTaskModal.hide();
    };
  }
  if (e.target.id === "editTaskBtn") {
    editTaskModal.show();
    editTaskForm.elements["title"].value = unfinishedTasks[index].title;
    editTaskForm.elements["description"].value =
      unfinishedTasks[index].description;
    editTaskForm.onsubmit = function (event) {
      event.preventDefault();
      const editedTask = {
        title: editTaskForm.elements["title"].value,
        description: editTaskForm.elements["description"].value,
      };
      // ...spread operator
      unfinishedTasks[index] = { ...unfinishedTasks[index], ...editedTask };
      editTaskModal.hide();
      showUnfinishedTasks();
    };
  }
  if (e.target.type === "checkbox" && e.target.checked === true) {
    const index = unfinishedTasks.findIndex(function (value) {
      return (
        +value.id === +e.target.parentElement.parentElement.parentElement.id
      );
    });
    finishedTasks.push(unfinishedTasks[index]);
    unfinishedTasks.splice(index, 1);
    showUnfinishedTasks();
    showFinishedTasks();
  }
});

finishedTasksContainer.addEventListener("click", function (e) {
  if (e.target.id === "deleteTaskBtn") {
    const index = finishedTasks.findIndex(function (value) {
      return +value.id === +e.target.parentElement.id;
    });
    finishedTasks.splice(index, 1);
    showFinishedTasks();
  }

  if (e.target.type === "checkbox" && e.target.checked === false) {
    const index = finishedTasks.findIndex(function (value) {
      return (
        +value.id === +e.target.parentElement.parentElement.parentElement.id
      );
    });
    unfinishedTasks.push(finishedTasks[index]);
    finishedTasks.splice(index, 1);
    showUnfinishedTasks();
    showFinishedTasks();
  }
});

deleteAllDoneTasksBtn.addEventListener("click", function () {
  finishedTasks = [];
  showFinishedTasks();
});

function showUnfinishedTasks() {
  unfinishedTasksContainer.innerHTML = "";
  for (const task of unfinishedTasks) {
    const newTaskElement = createCardElement(task);
    unfinishedTasksContainer.appendChild(newTaskElement);
  }
}

function showFinishedTasks() {
  if (!finishedTasks.length) {
    deleteAllDoneTasksBtn.classList.remove("d-block");
    deleteAllDoneTasksBtn.classList.add("d-none");
  } else {
    deleteAllDoneTasksBtn.classList.add("d-block");
    deleteAllDoneTasksBtn.classList.remove("d-none");
  }
  finishedTasksContainer.innerHTML = "";
  for (const task of finishedTasks) {
    const newTaskElement = createCardElement(task, true);
    finishedTasksContainer.appendChild(newTaskElement);
  }
}

function createCardElement(task, finished = false) {
  const newTaskElement = document.createElement("div");
  newTaskElement.className = "card mb-3";
  newTaskElement.innerHTML = `       
  <div class="card-body d-flex ${finished && "text-muted bg-light"}" id="${
    task.id
  }">
    <div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          ${finished && "checked"}
          id="flexCheckDefault"
        />
        <label class="form-check-label" for="flexCheckDefault">
          <h5 class="card-title ms-3">${task.title}</h5>
        </label>
      </div>
      <p class="card-text">
        ${task.description}
      </p>
    </div>
    <i
      id="editTaskBtn"
      class="bi-pencil-square fs-5 btn text-secondary ms-auto ${
        finished && "d-none"
      }"
    ></i>
    <i
      id="deleteTaskBtn"
      class="bi-trash-fill fs-5 btn text-secondary ${finished && "ms-auto"}"
    ></i>
  </div>`;
  return newTaskElement;
}
