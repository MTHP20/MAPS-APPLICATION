function addTask() {
    const taskInput = document.getElementById("taskInput");
    const task = taskInput.value;
    if (task != "") {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        taskInput.value = "";
        displayTask();
    }
}

function displayTask() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    for (let i =0; i < tasks.length; i++) {
        const task = tasks[i];
        const li = document.createElement("li");
        li.textContent = task;
        li.addEventListener("click", () => removeTask(i));
        taskList.appendChild(li);
    }
}

function removeTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTask();
}

function clearTasks() {
    localStorage.removeItem("tasks");
    displayTask();
}