let addTaskForm = document.querySelector("form#addTaskForm");
let editTaskForm = document.querySelector("form#editTaskForm");
let deleteTaskBtn = document.querySelector("#deleteTaskBtn");
let confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");
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

// ODHACZANIE
// 1. refactoring funkcji do wyświetlania tasków
// ----
// 2. dodać finished tasks container w htmlu
// 3. stworzyć finishedTasks tablicę
// -- > łapka w teamsach
// 4. do event listenera na unfinishedTasksContainer dodać warunek (checkbox i checkbox.value === true)
// w tym warunku
// 5. dodajemy taska do tablicy finishedTasks
// 6. usuwamy taska z tablicy unfinishedTasks
// 7. wyświetlamy obie tablice
// 8. wyświetlać Delete all done tasks button tylko wtedy, kiedy mamy jakieś skończone taski

// EDYTOWANIE
// 1. stworzenie bootstrapowego modalu
// 2. event handler na przycisk edycji (warunek - przycisk musi mieć id=editTaskBtn)
// w tym warunku
// 3. pokazać modal
// 4. wypełnić value forma w modalu, value z taska
// -----
// 5. przypisać funkcję do confirmEditTask, która zedytuje taska
// w tej funkcji
// 6. stworzyć nowy obiekt editedTask z wartościami z forma
// -- > łapka w teamsach / wstępny czas do 17:20
// 7. przypisać go do aktualnego taska
// 8. schować modal
// 9. wyświetlić tablicę (showUnfinishedTasks())

function showUnfinishedTasks() {
  unfinishedTasksContainer.innerHTML = "";
  for (const task of unfinishedTasks) {
    const newTaskElement = createCardElement(task);
    unfinishedTasksContainer.appendChild(newTaskElement);
  }
}

function showFinishedTasks() {
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
          value=""
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
