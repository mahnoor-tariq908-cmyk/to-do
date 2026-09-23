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

    // Task cards dark in both themes
    box.className = `
        flex
        items-center
        gap-3
        p-4

        rounded-xl

        bg-gray-900
        text-white

        border-2
        border-violet-500

        shadow-md
    `;


    box.innerHTML = `

        <!-- CHECK BUTTON -->

        <button
            class="
                completeBtn

                w-8
                h-8

                shrink-0

                rounded-full

                border-2
                border-pink-400

                flex
                items-center
                justify-center

                hover:bg-pink-500

                transition
            "
        >

            ${
                task.completed
                ? '<i class="fa-solid fa-check text-white"></i>'
                : ''
            }

        </button>


        <!-- TASK TEXT -->

        <span
            class="
                taskText
                flex-1
                break-words
            "
        >
            ${escapeHTML(task.text)}
        </span>


        <!-- EDIT -->

        <button
            class="
                editBtn

                w-9
                h-9

                rounded-lg

                text-gray-300

                hover:bg-violet-700

                transition
            "
        >

            <i class="fa-solid fa-pen"></i>

        </button>


        <!-- DELETE -->

        <button
            class="
                deleteBtn

                w-9
                h-9

                rounded-lg

                text-gray-300

                hover:bg-red-600

                transition
            "
        >

            <i class="fa-solid fa-trash"></i>

        </button>

    `;


    // Completed task

    if (task.completed) {

        box
            .querySelector(".taskText")
            .classList.add(
                "line-through",
                "opacity-50"
            );

    }


    // Complete

    box
        .querySelector(".completeBtn")
        .addEventListener("click", function() {

            completeTask(task.id);

        });


    // Edit

    box
        .querySelector(".editBtn")
        .addEventListener("click", function() {

            editTask(task.id);

        });


    // Delete

    box
        .querySelector(".deleteBtn")
        .addEventListener("click", function() {

            deleteTask(task.id);

        });


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

    } else {

        emptyState.classList.add("hidden");

        filteredTasks.forEach(function(task) {

            createTask(task);

        });

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


    // No tasks

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


    // Progress according to completed tasks

    const percentage =
        Math.round(
            (completedTasks / totalTasks) * 100
        );


    // Progress bar

    progressBar.style.width =
        percentage + "%";


    // Percentage

    percent.textContent =
        percentage + "%";


    // Progress text

    progressText.textContent =
        completedTasks +
        " of " +
        totalTasks +
        " tasks completed";


    // Circle

    const degree =
        percentage * 3.6;


    progressCircle.style.background =
        `
        conic-gradient(
            #ec4899 0deg,
            #8b5cf6 ${degree}deg,
            #ddd6fe ${degree}deg
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

    document.body.className = `
        min-h-screen

        bg-gradient-to-br
        from-purple-900
        via-violet-900
        to-fuchsia-900

        text-white

        transition-colors
        duration-300
    `;


    themeIcon.className =
        "fa-solid fa-sun text-yellow-300";


    circleInner.className = `
        w-16
        h-16

        rounded-full

        bg-purple-950

        text-white

        flex
        items-center
        justify-center
    `;


    // Borders light in dark theme

    document
        .querySelectorAll("section, input")
        .forEach(function(element) {

            element.classList.remove(
                "border-gray-700"
            );

            element.classList.add(
                "border-white/30"
            );

        });


    // Text back to white

    document
        .querySelectorAll(
            "section h1, section h2, section h3, section p"
        )
        .forEach(function(element) {

            element.classList.remove(
                "text-gray-900"
            );

            element.classList.add(
                "text-white"
            );

        });


    // Input text

    document
        .querySelectorAll("input")
        .forEach(function(input) {

            input.classList.remove(
                "text-gray-900",
                "placeholder-gray-500"
            );

            input.classList.add(
                "text-white",
                "placeholder-white/60"
            );

        });


    localStorage.setItem(
        "todoTheme",
        "dark"
    );

}


// ===============================
// LIGHT THEME
// ===============================

function lightTheme() {

    document.body.className = `
        min-h-screen

        bg-gradient-to-br
        from-pink-100
        via-white
        to-violet-100

        text-gray-900

        transition-colors
        duration-300
    `;


    themeIcon.className =
        "fa-solid fa-moon text-violet-700";


    circleInner.className = `
        w-16
        h-16

        rounded-full

        bg-gray-900

        text-white

        flex
        items-center
        justify-center
    `;


    // =================================
    // DARK BORDERS IN LIGHT THEME
    // =================================

    document
        .querySelectorAll("section, input")
        .forEach(function(element) {

            element.classList.remove(
                "border-white/30"
            );

            element.classList.add(
                "border-gray-700"
            );

        });


    // =================================
    // DARK TEXT IN LIGHT THEME
    // =================================

    document
        .querySelectorAll(
            "section h1, section h2, section h3, section p"
        )
        .forEach(function(element) {

            element.classList.remove(
                "text-white"
            );

            element.classList.add(
                "text-gray-900"
            );

        });


    // =================================
    // INPUT TEXT DARK
    // =================================

    document
        .querySelectorAll("input")
        .forEach(function(input) {

            input.classList.remove(
                "text-white",
                "placeholder-white/60"
            );

            input.classList.add(
                "text-gray-900",
                "placeholder-gray-500"
            );

        });


    localStorage.setItem(
        "todoTheme",
        "light"
    );

}


// ===============================
// THEME BUTTON
// ===============================

themeBtn.addEventListener(
    "click",
    function() {

        const currentTheme =
            localStorage.getItem("todoTheme");


        if (currentTheme === "dark") {

            lightTheme();

        } else {

            darkTheme();

        }

    }
);


// ===============================
// LOAD SAVED THEME
// ===============================

const savedTheme =
    localStorage.getItem("todoTheme");


if (savedTheme === "light") {

    lightTheme();

} else {

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