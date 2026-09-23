/* ================================
   ELEMENTS
================================ */

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const progressBar = document.getElementById("progressBar");
const progressCircle = document.getElementById("progressCircle");
const progressText = document.getElementById("progressText");
const percent = document.getElementById("percent");

const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");


/* ================================
   DATA
================================ */

let tasks = [];


/* ================================
   LOAD TASKS
================================ */

const savedTasks = localStorage.getItem("todoTasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);
}


/* ================================
   SAVE TASKS
================================ */

function saveTasks() {

    localStorage.setItem(
        "todoTasks",
        JSON.stringify(tasks)
    );

}


/* ================================
   ADD TASK
================================ */

function addTask() {

    const text = taskInput.value.trim();


    if (text === "") {

        alert("Please write a task first.");

        return;
    }


    tasks.push({

        id: Date.now(),

        text: text,

        completed: false

    });


    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();

}


/* ================================
   COMPLETE
================================ */

function toggleTask(id) {

    const task = tasks.find(
        item => item.id === id
    );


    if (!task) return;


    task.completed = !task.completed;


    saveTasks();

    renderTasks();

}


/* ================================
   DELETE
================================ */

function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmDelete) return;


    tasks = tasks.filter(
        item => item.id !== id
    );


    saveTasks();

    renderTasks();

}


/* ================================
   EDIT
================================ */

function editTask(id) {

    const task = tasks.find(
        item => item.id === id
    );


    if (!task) return;


    const newText = prompt(
        "Update task:",
        task.text
    );


    if (newText === null) return;


    const text = newText.trim();


    if (text === "") {

        alert("Task cannot be empty.");

        return;
    }


    task.text = text;


    saveTasks();

    renderTasks();

}


/* ================================
   CREATE TASK
================================ */

function createTask(task) {

    const div = document.createElement("div");


    div.className = `
        flex
        items-center
        gap-3

        p-4

        rounded-xl

        bg-white

        border
        border-purple-200

        text-purple-900

        shadow-sm

        dark:bg-white/10
        dark:border-white/25
        dark:text-white
    `;


    div.innerHTML = `

        <button
            class="
                completeBtn

                w-8
                h-8

                shrink-0

                rounded-full

                border-2
                border-violet-500

                flex
                items-center
                justify-center

                ${
                    task.completed
                    ? "bg-violet-600 text-white"
                    : "text-transparent"
                }
            "
        >
            <i class="fa-solid fa-check text-xs"></i>
        </button>


        <span
            class="
                flex-1
                break-words

                ${
                    task.completed
                    ? "line-through opacity-50"
                    : ""
                }
            "
        >
            ${escapeHTML(task.text)}
        </span>


        <button
            class="
                editBtn

                w-8
                h-8

                rounded-lg

                text-gray-500

                hover:text-violet-600

                transition
            "
        >
            <i class="fa-solid fa-pen"></i>
        </button>


        <button
            class="
                deleteBtn

                w-8
                h-8

                rounded-lg

                text-gray-500

                hover:text-red-500

                transition
            "
        >
            <i class="fa-solid fa-trash"></i>
        </button>

    `;


    div.querySelector(".completeBtn")
        .addEventListener(
            "click",
            () => toggleTask(task.id)
        );


    div.querySelector(".editBtn")
        .addEventListener(
            "click",
            () => editTask(task.id)
        );


    div.querySelector(".deleteBtn")
        .addEventListener(
            "click",
            () => deleteTask(task.id)
        );


    taskList.appendChild(div);

}


/* ================================
   RENDER
================================ */

function renderTasks() {

    taskList.innerHTML = "";


    const search = searchInput.value
        .toLowerCase()
        .trim();


    const filteredTasks = tasks.filter(
        task =>
            task.text
                .toLowerCase()
                .includes(search)
    );


    if (filteredTasks.length === 0) {

        emptyState.classList.remove("hidden");

    } else {

        emptyState.classList.add("hidden");


        filteredTasks.forEach(
            task => createTask(task)
        );

    }


    updateProgress();

}


/* ================================
   PROGRESS
================================ */

/*
   Har ADD par progress increase hogi.

   1 task  = 25%
   2 tasks = 50%
   3 tasks = 75%
   4 tasks = 100%

   4 se zyada tasks hon to 100% par rahegi.
*/

function updateProgress() {

    const total = tasks.length;


    const percentage = Math.min(
        total * 25,
        100
    );


    /* BAR */

    progressBar.style.width =
        `${percentage}%`;


    /* TEXT */

    percent.textContent =
        `${percentage}%`;


    progressText.textContent =
        `${total} task${total === 1 ? "" : "s"} added`;


    /* CIRCLE */

    const degrees =
        percentage * 3.6;


    progressCircle.style.background =
        `conic-gradient(
            #f472b6 0deg,
            #a855f7 ${degrees}deg,
            rgba(255,255,255,0.18) ${degrees}deg
        )`;

}


/* ================================
   SEARCH
================================ */

searchInput.addEventListener(
    "input",
    renderTasks
);


/* ================================
   ADD BUTTON
================================ */

addBtn.addEventListener(
    "click",
    addTask
);


/* ================================
   ENTER
================================ */

taskInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            addTask();

        }

    }
);


/* ================================
   THEME
================================ */

function setTheme(theme) {

    if (theme === "light") {

        document.documentElement.classList.remove("dark");

        document.body.className = `
            min-h-screen

            bg-gradient-to-br
            from-pink-50
            via-white
            to-violet-100

            text-purple-950

            transition-all
            duration-300
        `;


        themeIcon.className =
            "fa-solid fa-moon text-violet-600";

    } else {

        document.documentElement.classList.add("dark");

        document.body.className = `
            min-h-screen

            bg-gradient-to-br
            from-purple-900
            via-violet-900
            to-fuchsia-900

            text-white

            transition-all
            duration-300
        `;


        themeIcon.className =
            "fa-solid fa-sun text-yellow-300";

    }


    localStorage.setItem(
        "todoTheme",
        theme
    );

}


/* ================================
   THEME TOGGLE
================================ */

themeBtn.addEventListener(
    "click",
    function () {

        const isDark =
            document.documentElement.classList.contains("dark");


        if (isDark) {

            setTheme("light");

        } else {

            setTheme("dark");

        }

    }
);


/* ================================
   LOAD THEME
================================ */

const savedTheme =
    localStorage.getItem("todoTheme");


if (savedTheme === "light") {

    setTheme("light");

} else {

    setTheme("dark");

}


/* ================================
   START
================================ */

renderTasks();