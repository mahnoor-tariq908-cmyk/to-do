import "./style.css";


// ===============================
// GET ELEMENTS
// ===============================

const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

const searchInput = document.getElementById("searchInput");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const progressBar = document.getElementById("progressBar");
const progressCircle = document.getElementById("progressCircle");
const circleInner = document.getElementById("circleInner");

const percent = document.getElementById("percent");
const progressText = document.getElementById("progressText");


// ===============================
// LOAD TASKS
// ===============================

let tasks = JSON.parse(
    localStorage.getItem("todoTasks")
) || [];


// ===============================
// SAVE TASKS
// ===============================

function saveTasks() {

    localStorage.setItem(
        "todoTasks",
        JSON.stringify(tasks)
    );

}


// ===============================
// ADD TASK
// ===============================

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


// ===============================
// DELETE TASK
// ===============================

function deleteTask(id) {

    const confirmDelete = confirm(
        "Do you want to delete this task?"
    );


    if (!confirmDelete) {

        return;

    }


    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    renderTasks();

}


// ===============================
// EDIT TASK
// ===============================

function editTask(id) {

    const task = tasks.find(function(task) {

        return task.id === id;

    });


    if (!task) {

        return;

    }


    const newText = prompt(
        "Update your task:",
        task.text
    );


    if (newText === null) {

        return;

    }


    const updatedText = newText.trim();


    if (updatedText === "") {

        alert("Task cannot be empty.");

        return;

    }


    task.text = updatedText;

    saveTasks();

    renderTasks();

}


// ===============================
// COMPLETE TASK
// ===============================

function completeTask(id) {

    const task = tasks.find(function(task) {

        return task.id === id;

    });


    if (!task) {

        return;

    }


    task.completed = !task.completed;

    saveTasks();

    renderTasks();

}


// ===============================
// CREATE TASK CARD
// ===============================

function createTask(task) {

    const box = document.createElement("div");


    box.className = `
        flex
        items-center
        gap-3

        p-4

        rounded-2xl

        bg-white
        dark:bg-slate-800

        text-slate-800
        dark:text-white

        border
        border-violet-200
        dark:border-slate-600

        shadow-md
        dark:shadow-black/30

        transition-all
        duration-300

        hover:-translate-y-1
    `;


    box.innerHTML = `

        <!-- CHECK BUTTON -->

        <button

            class="
                completeBtn

                w-9
                h-9

                shrink-0

                rounded-full

                border-2
                border-violet-500

                flex
                items-center
                justify-center

                text-white

                ${
                    task.completed
                    ? "bg-violet-600"
                    : "bg-transparent dark:bg-slate-700"
                }

                hover:bg-violet-500

                transition

                duration-200
            "

            title="Complete task"
        >

            ${
                task.completed
                ? '<i class="fa-solid fa-check"></i>'
                : ''
            }

        </button>



        <!-- TASK TEXT -->

        <span

            class="
                taskText

                flex-1

                break-words

                font-medium

                text-slate-800
                dark:text-white
            "
        >

            ${escapeHTML(task.text)}

        </span>



        <!-- EDIT BUTTON -->

        <button

            class="
                editBtn

                w-9
                h-9

                shrink-0

                rounded-lg

                flex
                items-center
                justify-center

                text-violet-600
                dark:text-violet-300

                hover:bg-violet-100
                dark:hover:bg-violet-900/60

                transition
            "

            title="Edit task"
        >

            <i class="fa-solid fa-pen"></i>

        </button>



        <!-- DELETE BUTTON -->

        <button

            class="
                deleteBtn

                w-9
                h-9

                shrink-0

                rounded-lg

                flex
                items-center
                justify-center

                text-red-500

                hover:bg-red-100
                dark:hover:bg-red-900/40

                transition
            "

            title="Delete task"
        >

            <i class="fa-solid fa-trash"></i>

        </button>

    `;


    // ===============================
    // COMPLETED TASK STYLE
    // ===============================

    if (task.completed) {

        box
            .querySelector(".taskText")
            .classList.add(
                "line-through",
                "opacity-50"
            );

    }


    // ===============================
    // COMPLETE BUTTON
    // ===============================

    box
        .querySelector(".completeBtn")
        .addEventListener(
            "click",
            function() {

                completeTask(task.id);

            }
        );


    // ===============================
    // EDIT BUTTON
    // ===============================

    box
        .querySelector(".editBtn")
        .addEventListener(
            "click",
            function() {

                editTask(task.id);

            }
        );


    // ===============================
    // DELETE BUTTON
    // ===============================

    box
        .querySelector(".deleteBtn")
        .addEventListener(
            "click",
            function() {

                deleteTask(task.id);

            }
        );


    taskList.appendChild(box);

}


// ===============================
// RENDER TASKS
// ===============================

function renderTasks() {

    taskList.innerHTML = "";


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredTasks =
        tasks.filter(function(task) {

            return task.text
                .toLowerCase()
                .includes(search);

        });


    if (filteredTasks.length === 0) {

        emptyState.classList.remove("hidden");

    }

    else {

        emptyState.classList.add("hidden");


        filteredTasks.forEach(
            function(task) {

                createTask(task);

            }
        );

    }


    updateProgress();

}


// ===============================
// UPDATE PROGRESS
// ===============================

function updateProgress() {

    const totalTasks = tasks.length;


    const completedTasks =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    // ===============================
    // NO TASKS
    // ===============================

    if (totalTasks === 0) {

        progressBar.style.width = "0%";

        percent.textContent = "0%";

        progressText.textContent =
            "0 tasks completed";


        progressCircle.style.background =
            `
            conic-gradient(
                #8b5cf6 0deg,
                #ddd6fe 0deg
            )
            `;

        return;

    }


    // ===============================
    // CALCULATE PERCENTAGE
    // ===============================

    const percentage =
        Math.round(
            (completedTasks / totalTasks) * 100
        );


    // ===============================
    // PROGRESS BAR
    // ===============================

    progressBar.style.width =
        percentage + "%";


    // ===============================
    // PERCENTAGE
    // ===============================

    percent.textContent =
        percentage + "%";


    // ===============================
    // PROGRESS TEXT
    // ===============================

    progressText.textContent =
        completedTasks +
        " of " +
        totalTasks +
        " tasks completed";


    // ===============================
    // PROGRESS CIRCLE
    // ===============================

    const degree =
        percentage * 3.6;


    const isDark =
        document.documentElement.classList.contains(
            "dark"
        );


    const emptyColor =
        isDark
        ? "#334155"
        : "#ddd6fe";


    progressCircle.style.background =
        `
        conic-gradient(
            #ec4899 0deg,
            #8b5cf6 ${degree}deg,
            ${emptyColor} ${degree}deg
        )
        `;

}


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    function() {

        renderTasks();

    }
);


// ===============================
// ADD BUTTON
// ===============================

addBtn.addEventListener(
    "click",
    function() {

        addTask();

    }
);


// ===============================
// ENTER KEY
// ===============================

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            addTask();

        }

    }
);


// ===============================
// DARK THEME
// ===============================

function darkTheme() {

    // Add dark class to HTML

    document.documentElement.classList.add(
        "dark"
    );


    // Theme icon

    themeIcon.className =
        "fa-solid fa-sun text-yellow-300";


    // Circle center

    circleInner.className = `
        w-16
        h-16

        rounded-full

        bg-slate-900

        text-white

        flex
        items-center
        justify-center
    `;


    // Save theme

    localStorage.setItem(
        "todoTheme",
        "dark"
    );


    // Update circle

    updateProgress();

}


// ===============================
// LIGHT THEME
// ===============================

function lightTheme() {

    // Remove dark class

    document.documentElement.classList.remove(
        "dark"
    );


    // Theme icon

    themeIcon.className =
        "fa-solid fa-moon text-violet-700";


    // Circle center

    circleInner.className = `
        w-16
        h-16

        rounded-full

        bg-white

        text-violet-700

        flex
        items-center
        justify-center
    `;


    // Save theme

    localStorage.setItem(
        "todoTheme",
        "light"
    );


    // Update circle

    updateProgress();

}


// ===============================
// THEME BUTTON
// ===============================

themeBtn.addEventListener(
    "click",
    function() {

        const currentTheme =
            localStorage.getItem(
                "todoTheme"
            );


        if (currentTheme === "dark") {

            lightTheme();

        }

        else {

            darkTheme();

        }

    }
);


// ===============================
// LOAD SAVED THEME
// ===============================

const savedTheme =
    localStorage.getItem(
        "todoTheme"
    );


if (savedTheme === "light") {

    lightTheme();

}

else {

    darkTheme();

}


// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}


// ===============================
// FIRST LOAD
// ===============================

renderTasks();