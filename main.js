// DEKLAROWANIE ZMIENNYCH
// var nazwa1 = 'wartosc';
// let nazwa1 = 'wartosc';
// const nazwa2 = 'wartosc';

// DOM - DOCUMENT OBJECT MODEL
// DOM properties !== HTML attributes
// console.log(element); -> element
// console.dir(element); -> przedstawienie w DOM

// DOM EVENT

// TWORZENIE FUNKCJI
// 1. function name() {}

// STRINGS IN JAVASCRIPT
// "text" === 'text' === `text`
// `text ${zmienna}`

// EVENT DELEGATION

// = przypisanie
// == porównanie wartości ze zmianą typów
// === porównanie wartości bez zmiany typów

let addTaskForm = document.querySelector("form#addTaskForm");
let deleteTaskBtn = document.querySelector("#deleteTaskBtn");
let confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");
let unfinishedTasksContainer = document.querySelector(
  "#unfinishedTasksContainer"
);
let deleteTaskModal = new bootstrap.Modal(
  document.querySelector("#deleteModal")
);

let unfinishedTasks = [];

console.dir(addTaskForm);

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
    console.log(unfinishedTasks);
  }
});

unfinishedTasksContainer.addEventListener("click", function (e) {
  if (e.target.id === "deleteTaskBtn") {
    deleteTaskModal.show();
    const index = unfinishedTasks.findIndex(function (value) {
      return +value.id === +e.target.parentElement.id;
    });
    confirmDeleteBtn.onclick = function () {
        unfinishedTasks.splice(index, 1);
        showUnfinishedTasks(unfinishedTasks[index]);
        deleteTaskModal.hide();
    };
  }
});

function showUnfinishedTasks() {
  unfinishedTasksContainer.innerHTML = "";
  for (let task of unfinishedTasks) {
    let newTaskElement = document.createElement("div");
    newTaskElement.className = "card mb-3";
    newTaskElement.innerHTML = `       
  <div class="card-body d-flex" id="${task.id}">
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
      class="bi-pencil-square fs-5 btn text-secondary ms-auto"
      data-bs-toggle="modal"
      data-bs-target="#editModal"
    ></i>
    <i
      id="deleteTaskBtn"
      class="bi-trash-fill fs-5 btn text-secondary"
    ></i>
  </div>`;
    unfinishedTasksContainer.appendChild(newTaskElement);
  }
}
