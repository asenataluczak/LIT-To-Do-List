// DEKLAROWANIE ZMIENNYCH
// var nazwa1 = 'wartosc';
// let nazwa1 = 'wartosc';
// const nazwa2 = 'wartosc';

// DOM - DOCUMENT OBJECT MODEL
// DOM properties !== HTML attributes
// console.log(element); -> element
// console.dir(element); -> przedstawienie elementu w DOM

// DOM EVENT - interakcje użytkownika, które mogą wydarzyć się na stronie

// REAGOWANIE NA DOM EVENTS
// 1. element.addEventListener("eventJakiegoNasluchujemy", funkcjaKtoraMaSieWtedyWykonac)
// 2. element.eventJakiegoNasluchujemy = funkcjaKtoraMaSieWtedyWykonac

// TWORZENIE FUNKCJI
// 1. function name() {}

// STRINGS IN JAVASCRIPT
// "text" === 'text' === `text`
// `text ${zmienna}`

// EVENT DELEGATION
// dajemy event listenera na parent element i potem sprawdzamy jaki jest event.target

// = przypisanie
// == porównanie wartości z zamianą typów
// === porównanie wartości bez zamiany typów

// METODA -> funkcja, która jest własnością jakiegoś obiektu

// Wyselektowanie potrzebnych elementów z HTMLa
let addTaskForm = document.querySelector("form#addTaskForm");
let deleteTaskBtn = document.querySelector("#deleteTaskBtn");
let confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");
let unfinishedTasksContainer = document.querySelector(
  "#unfinishedTasksContainer"
);
// Stworzenie swojego bootstrapowego modalu, żeby można nim było operować tutaj, nie tylko w HTMLu
let deleteTaskModal = new bootstrap.Modal(
  document.querySelector("#deleteModal")
);

// Stworzenie pustej tablicy, do której będziemy dodawać nieukończone taski
let unfinishedTasks = [];

// Nasłuchiwanie na event "submit" na addTaskForm i wykonanie funkcji
addTaskForm.addEventListener("submit", function (event) {
  event.preventDefault(); // form domyslnie chce odswiezyc strone, to polecenie to blokuje
  // walidacja - poniższy kod wykona się tylko jeśli wartość "title" z forma zwróci true, czyli będzie wypełniona
  if (addTaskForm.elements["title"].value) {
    // utworzenie obiekt taska, który własnie jest dodawany, z wartościami "title" i "description" wziętymi z forma
    const newTask = {
      title: addTaskForm.elements["title"].value,
      description: addTaskForm.elements["description"].value,
      id: Date.now(), // punkt w czasie w milisekundach, żeby id było unikalne i niepowtarzalne
    };
    unfinishedTasks.push(newTask); // dodanie obiektu newTask na koniec tablicy unfinishedTasks
    showUnfinishedTasks(); // wywołanie funkcji showUnfinishedTasks (opis niżej)
    addTaskForm.reset(); // zresetowanie forma, żeby po dodaniu taska nie było widać tego co wpisaliśmy
  }
});

// Nasłuchiwanie na event "click" na unfinishedTasksContainer i wykonanie funkcji
unfinishedTasksContainer.addEventListener("click", function (e) {
  // sprawdzenie, czy click był wykonany na buttonie z id deleteTaskBtn
  if (e.target.id === "deleteTaskBtn") {
    deleteTaskModal.show(); // otworzenie bootstrapowego modalu
    // zdobycie indexu klikniętego taska w tablicy
    // (iterujemy przez wszystkie taski w tablicy i sprawdzamy czy ich id zgadza się z id elementu, na który kliknęlismy)
    const index = unfinishedTasks.findIndex(function (value) {
      return +value.id === +e.target.parentElement.id; // '+' przed wartością, konwertują ją na typ number
    });
    // przypisanie funkcji, która ma się wykonać po kliknięciu na button w modalu
    confirmDeleteBtn.onclick = function () {
      unfinishedTasks.splice(index, 1); // usunięcie tego elementu z tablicy
      showUnfinishedTasks(); // update tego co jest na ekranie, czyli ponowne wyświetlenie listy tasków, tym razem bez tego, co usunęliśmy
      deleteTaskModal.hide(); // schowanie bootstrapowego modalu
    };
  }
});

// Wyświetlenie wszystkich elementów tablicy unfinishedTasks
function showUnfinishedTasks() {
  unfinishedTasksContainer.innerHTML = ""; // reset zawartosć containera, żeby przy kolejnych wywołaniach funkcji taski nam się nie powtarzały
  // pętla iteruje przez wszystkie elemnty tablicy, zmienna task umożliwia odwołanie się do poszczególnego elementu
  for (let task of unfinishedTasks) {
    let newTaskElement = document.createElement("div"); // utworzenie diva
    newTaskElement.className = "card mb-3"; // nadanie mu bootstrapowych klas
    // dodanie HTMLa do tego diva, z przypisaniem wartości id, title, description
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
    unfinishedTasksContainer.appendChild(newTaskElement); // dodanie elementu do containera
  }
}
