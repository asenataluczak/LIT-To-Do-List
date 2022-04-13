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

let addTaskForm = document.querySelector("form#addTaskForm");

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

function showUnfinishedTasks() {
    
}
