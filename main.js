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
const addTaskForm = document.querySelector("form#addTaskForm");
const editTaskForm = document.querySelector("form#editTaskForm");
const deleteTaskBtn = document.querySelector("#deleteTaskBtn");
const confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");
const deleteAllDoneTasksBtn = document.querySelector("#deleteAllDoneTasksBtn");
const unfinishedTasksContainer = document.querySelector(
  "#unfinishedTasksContainer"
);
const finishedTasksContainer = document.querySelector(
  "#finishedTasksContainer"
);
// Stworzenie swojego bootstrapowego modalu, żeby można nim było operować tutaj, nie tylko w HTMLu
const deleteTaskModal = new bootstrap.Modal(
  document.querySelector("#deleteModal")
);
const editTaskModal = new bootstrap.Modal(document.querySelector("#editModal"));

const UNFINISHED_TASKS = "unfinished-tasks"; // nazwa elementu w localStorage dla tablicy nieukończonych tasków
const FINISHED_TASKS = "finished-tasks"; // nazwa elementu w localStorage dla tablicy ukończonych tasków
const TIME_UNTIL_DELETION = 1000 * 60 * 60 * 24; // czas po jakim ukończone zadanie powinno zostać usunięte (godzina w milisekundach)

// Stworzenie pustych tablic, do której będziemy dodawać nieukończone i ukończone taski
let unfinishedTasks = [];
let finishedTasks = [];

// Sprawdzenie czy w localStorage są zapisane jakieś nieukończone taski
if (localStorage.getItem(UNFINISHED_TASKS)) {
  unfinishedTasks = JSON.parse(localStorage.getItem(UNFINISHED_TASKS)); // Przypisanie tasków z localStorage do tablicy
  showUnfinishedTasks(); // Wyświetlenie nieukończonych tasków
}

// Sprawdzenie czy w localStorage są zapisane jakieś ukończone taski
if (localStorage.getItem(FINISHED_TASKS)) {
  finishedTasks = JSON.parse(localStorage.getItem(FINISHED_TASKS)); // Przypisanie tasków z localStorage do tablicy
  filterDeletedTasks(); // Odfiltrowanie tasków, których termin usunięcia minął (opis funkcji niżej)
}

// Uruchomienie funkcji filtrującej ukończone taski co minutę (w milisekundach)
setInterval(function () {
  filterDeletedTasks();
}, 1000 * 60);

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
    localStorage.setItem(UNFINISHED_TASKS, JSON.stringify(unfinishedTasks)); // Zapisanie tej tablicy w localStorage (localStorage przechowuje tylko dane typu string, dlatego zamieniamy tablicę na string wykorzystując JSON.stringify())
    showUnfinishedTasks(); // wywołanie funkcji showUnfinishedTasks (opis niżej)
    addTaskForm.reset(); // zresetowanie forma, żeby po dodaniu taska nie było widać tego co wpisaliśmy
  }
});

// Nasłuchiwanie na event "click" na unfinishedTasksContainer i wykonanie funkcji
unfinishedTasksContainer.addEventListener("click", function (e) {
  // zdobycie indexu klikniętego taska w tablicy
  // (iterujemy przez wszystkie taski w tablicy i sprawdzamy czy ich id zgadza się z id elementu, na który kliknęlismy)
  const index = unfinishedTasks.findIndex(function (value) {
    return +value.id === +e.target.parentElement.id; // '+' przed wartością, konwertują ją na typ number
  });

  // sprawdzenie, czy click był wykonany na buttonie z id deleteTaskBtn
  if (e.target.id === "deleteTaskBtn") {
    deleteTaskModal.show(); // otworzenie bootstrapowego modalu
    // przypisanie funkcji, która ma się wykonać po kliknięciu na button w modalu
    confirmDeleteBtn.onclick = function () {
      unfinishedTasks.splice(index, 1); // usunięcie tego elementu z tablicy
      localStorage.setItem(UNFINISHED_TASKS, JSON.stringify(unfinishedTasks)); // Zapisanie tablicy w localStorage
      showUnfinishedTasks(); // update tego co jest na ekranie, czyli ponowne wyświetlenie listy tasków, tym razem bez tego, co usunęliśmy
      deleteTaskModal.hide(); // schowanie bootstrapowego modalu
    };
  }

  // sprawdzenie, czy click był wykonany na buttonie z id editTaskBtn
  if (e.target.id === "editTaskBtn") {
    editTaskModal.show();
    editTaskForm.elements["title"].value = unfinishedTasks[index].title; // Uzupełnienie forma aktualną nazwą taska
    editTaskForm.elements["description"].value =
      unfinishedTasks[index].description; // Uzupełnienie forma aktualnym opisem zadania

    // Przypisanie funkcji, która ma się wykonać po wydarzeniu submit na formie editTaskForm
    editTaskForm.onsubmit = function (event) {
      event.preventDefault();
      const editedTask = {
        title: editTaskForm.elements["title"].value,
        description: editTaskForm.elements["description"].value,
      };

      // Update taska - tworzymy nowy obiekt wykorzystując spread operator (...), najpierw kopiując wartości z unfinishedTasks[index], potem z editedTask
      // (Aby wartości z editedTask nadpisały te poprzednie, jeśli jakieś się zmieniły, ale zachowane zostały wartości, które się nie zmieniły)
      unfinishedTasks[index] = { ...unfinishedTasks[index], ...editedTask };
      editTaskModal.hide();
      showUnfinishedTasks();
    };
  }

  // sprawdzenie, czy click był wykonany na checkboxie z wartością true, czyli czy go zaznaczamy
  if (e.target.type === "checkbox" && e.target.checked === true) {
    // zdobycie indexu klikniętego taska w tablicy - ponownie, ponieważ checkbox jest bardziej zagnieżdżony w HTMLowym elemencie (stąd 3 razy parentElement)
    const index = unfinishedTasks.findIndex(function (value) {
      return (
        +value.id === +e.target.parentElement.parentElement.parentElement.id
      );
    });
    // Dodanie taska do tablicy ze skończonymi taskami
    finishedTasks.push({
      ...unfinishedTasks[index],
      deletionTime: Date.now() + TIME_UNTIL_DELETION, // Zapisujemy datę (w milisekundach), po której ten konkretny task powinien zostać usunięty (teraz + 1 dzień)
    });
    unfinishedTasks.splice(index, 1); // Usunięcie taska z tablicy z nieskończonymi taskami
    localStorage.setItem(FINISHED_TASKS, JSON.stringify(finishedTasks)); // Zapisanie skończonych tasków w localStorage
    localStorage.setItem(UNFINISHED_TASKS, JSON.stringify(unfinishedTasks)); // Zapisanie nieskońćzonych tasków w localStorage
    showUnfinishedTasks();
    showFinishedTasks();
  }
});

finishedTasksContainer.addEventListener("click", function (e) {
  // Usunięcie skończonego taska
  if (e.target.id === "deleteTaskBtn") {
    const index = finishedTasks.findIndex(function (value) {
      return +value.id === +e.target.parentElement.id;
    });
    finishedTasks.splice(index, 1);
    localStorage.setItem(FINISHED_TASKS, JSON.stringify(finishedTasks));
    showFinishedTasks();
  }

  // Cofnięcie zaliczenia zadania
  // sprawdzenie, czy click był wykonany na checkboxie z wartością false, czyli czy go odznaczamy
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

// Usunięcie wszystkich skończonych tasków
deleteAllDoneTasksBtn.addEventListener("click", function () {
  finishedTasks = []; // Nadpisanie tablicy z taskami pustą tablicą, czyli usunięcie wszystkich skończonych tasków
  localStorage.setItem(FINISHED_TASKS, JSON.stringify(finishedTasks));
  showFinishedTasks();
});

// Odfiltrowywanie tasków, których termin usunięcia minął
function filterDeletedTasks() {
  // Funkcja filter() sprawdza, czy czas usunięcia taska jest większy (jest póżniej) niż aktualna data i zwraca go tylko jeśli to prawda
  finishedTasks = finishedTasks.filter(function (task) {
    return Date.now() < task.deletionTime;
  });
  localStorage.setItem(FINISHED_TASKS, JSON.stringify(finishedTasks));
  showFinishedTasks();
}

function showUnfinishedTasks() {
  unfinishedTasksContainer.innerHTML = ""; // reset zawartosć containera, żeby przy kolejnych wywołaniach funkcji taski nam się nie powtarzały
  // pętla iteruje przez wszystkie elemnty tablicy, zmienna task umożliwia odwołanie się do poszczególnego elementu
  for (const task of unfinishedTasks) {
    const newTaskElement = createCardElement(task); // Przypisanie do newTaskElement diva, stworzonego w createCardElement()
    unfinishedTasksContainer.appendChild(newTaskElement); // dodanie elementu do containera
  }
}

function showFinishedTasks() {
  // Wykorzystanie TERNARY OPERATOR (? :), aby przycisk do usuwania wszystkich skończonych tasków był widoczny tylko wtedy, jeśli takie są
  // Jeśli są jakieś taski w tablicy finishedTasks, usuń klasę d-none, w przeciwnym razie usuń klasę d-block
  deleteAllDoneTasksBtn.classList.remove(
    finishedTasks.length ? "d-none" : "d-block"
  );
  // Jeśli są jakieś taski w tablicy finishedTasks, dodaj klasę d-block, w przeciwnym razie dodaj klasę d-none
  deleteAllDoneTasksBtn.classList.add(
    finishedTasks.length ? "d-block" : "d-none"
  );
  finishedTasksContainer.innerHTML = ""; // reset zawartosć containera, żeby przy kolejnych wywołaniach funkcji taski nam się nie powtarzały
  // pętla iteruje przez wszystkie elemnty tablicy, zmienna task umożliwia odwołanie się do poszczególnego elementu
  for (const task of finishedTasks) {
    const newTaskElement = createCardElement(task, true); // Przypisanie do newTaskElement diva, stworzonego w createCardElement(), drugi argument to true, ponieważ task jest skończony
    finishedTasksContainer.appendChild(newTaskElement); // dodanie elementu do containera
  }
}

// Tworzenie HTMLowego elementu dla taska, w zależności czy jest to task skończony, czy nie
function createCardElement(task, finished = false) {
  const newTaskElement = document.createElement("div"); // utworzenie diva
  newTaskElement.className = "card mb-3"; // nadanie mu bootstrapowych klas

  // finished && "checked" <- jeśli finished === true (jeśli task jest skończony), zwróć "checked" (w tym wypadku -> jeśli task jest skończony, to checkbox ma być zaznaczony)

  // Dodanie do tego diva HTMLa, z przypisaniem wartości id, title, description
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
