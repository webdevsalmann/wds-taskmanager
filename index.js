class Category {
    constructor(catName = "New Category") {
        this.catName = catName;
        this.catId = Date.now();
        this.tasks = [];
    }

    addTask(taskDesc) {
        this.tasks.push(new Task(taskDesc));
    }
} // CHECKED

class Task {
    constructor(taskDesc) {
        this.taskId = Date.now() + 1;
        this.taskDesc = taskDesc;
        this.complete = false;
    }
} // CHECKED

function addCat() {
    const catInput = document.getElementById("cat-input");
    const value = catInput.value
    if (value.trim() !== '') {
        dm.addCategory(value);
        catInput.value = '';
    }
} // CHECKED

function addTask() {
    const taskInput = document.getElementById("task-input");
    const value = taskInput.value;
    const catId = document.querySelectorAll(".sidebar .cat-name.active")[0].dataset.catId;
    if (catId && value.trim() !== '') {
        dm.addTask(catId, value);
        taskInput.value = '';
    }
} // CHECKED


class DataManager {
    constructor() {
        this.datas = this.loadFromLocalStorage();
    } // CHECKED

    loadFromLocalStorage() {
        return JSON.parse(localStorage.getItem('tm.datas')) || [{ catName: "My Tasks", catId: Date.now(), tasks: [] }];
    } // CHECKED

    saveToLocalStorage() {
        localStorage.setItem('tm.datas', JSON.stringify(this.datas));
    } // CHECKED

    addCategory(categoryName) {
        this.datas.push(new Category(categoryName));
        this.saveToLocalStorage();
        this.renderCategory();
        setFirstCatActive()
    } // CHECKED

    editCategory(catId, newCatName) {
        const selectedCategory = this.datas.find(item => item.catId == catId);
        if (selectedCategory) {
            // console.log(selectedCategory.catName)
            selectedCategory.catName = newCatName;
            this.saveToLocalStorage();
            this.renderCategory();
        }
    } // CHECKED

    deleteCategory(catId) {
        this.datas = this.datas.filter(category => category.catId !== catId);
        this.saveToLocalStorage();
        this.renderCategory();
        setFirstCatActive()
    } // CHECKED

    addTask(catId, taskDesc) {
        const selectedCategory = this.datas.find(item => item.catId == catId);
        if (selectedCategory) {
            selectedCategory.tasks.push(new Task(taskDesc));
            this.saveToLocalStorage();
            this.renderTasksByCatId(catId);
        }
    } // CHECKED

    editTask(catId, taskId, newTaskDesc) {
        const selectedCategory = this.datas.find(item => item.catId == catId);
        if (selectedCategory) {
            const selectedTask = selectedCategory.tasks.find(task => task.taskId == taskId);
            console.log(selectedCategory, selectedTask)
            if (selectedTask) {
                selectedTask.taskDesc = newTaskDesc;
                this.saveToLocalStorage();
                this.renderTasksByCatId(catId);
            }
        }
    } // CHECKED

    deleteTask(catId, taskId) {
        const selectedCategory = this.datas.find(item => item.catId == catId);
        if (selectedCategory) {
            selectedCategory.tasks = selectedCategory.tasks.filter(task => task.taskId !== taskId);
            this.saveToLocalStorage();
            this.renderTasksByCatId(catId);
        }
    } // CHECKED

    toggleTaskComplete(catId, taskId) {
        const selectedCategory = this.datas.find(item => item.catId == catId);
        if (selectedCategory) {
            const selectedTask = selectedCategory.tasks.find(task => task.taskId == taskId);
            if (selectedTask) {
                selectedTask.complete = !selectedTask.complete;
                this.saveToLocalStorage();
                this.renderTasksByCatId(catId);
            }
        }
    } // CHECKED

    deleteCompletedTasks(catId) {
        const selectedCategory = this.datas.find(item => item.catId == catId);
        if (selectedCategory) {
            selectedCategory.tasks = selectedCategory.tasks.filter(task => !task.complete);
            this.saveToLocalStorage();
            this.renderTasksByCatId(catId);
        }
    }

    renderCategory() {
        const catContainer = document.getElementById("cat-container");
        removeChildrensById("cat-container");

        this.datas.forEach(item => {
            const catElem = document.createElement('li');
            catElem.classList.add("cat-name", "flex-between", "flex-center");
            catElem.dataset.catId = item.catId;

            const categoryName = document.createElement('span');
            categoryName.textContent = item.catName;

            catElem.appendChild(categoryName);

            if (item.catName !== "My Tasks") {
                const btnWrapper = document.createElement('div');
                btnWrapper.classList.add("btn-wrapper");

                const checkbox = document.createElement('input');
                checkbox.classList.add("cb");
                checkbox.type = "checkbox";

                const btnBox = document.createElement('div');
                btnBox.classList.add("btn-box");

                const editButton = document.createElement('button');
                editButton.classList.add("btn", "btn-outline");
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => editCategory(item.catId));

                const deleteButton = document.createElement('button');
                deleteButton.classList.add("btn", "btn-outline");
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => this.deleteCategory(item.catId));

                btnBox.appendChild(editButton);
                btnBox.appendChild(deleteButton);

                btnWrapper.appendChild(checkbox);
                btnWrapper.appendChild(btnBox);

                catElem.appendChild(btnWrapper);
            }
            const catElemDivider = document.createElement('hr');
            catElemDivider.classList.add("cat-divider");

            catContainer.appendChild(catElem);
            catContainer.appendChild(catElemDivider);
        });
    } // CHECKED

    renderTasksByCatId(catId) {
        const tasksHeader = document.getElementById("tasks-header");
        const tasksContainer = document.getElementById("tasks-container");
        removeChildrensById("tasks-header");
        removeChildrensById("tasks-container");

        const category = this.datas.find(item => item.catId == catId);

        // Count completed and remaining tasks
        const completedTasks = category.tasks.filter(task => task.complete).length;
        const remainingTasks = category.tasks.length - completedTasks;

        const heading = document.createElement("h2");
        heading.classList.add("heading");
        heading.textContent = category.catName;

        const deleteTasksButton = document.createElement("button");
        // Add classes and attributes to the button
        deleteTasksButton.classList.add("btn", "btn-ghost");
        // deleteTasksButton.dataset.catId = catId;
        deleteTasksButton.textContent = "Delete Completed Tasks";
        deleteTasksButton.addEventListener('click', () => {
            // this.toggleTaskComplete(catId, item.taskId);
            this.deleteCompletedTasks(catId);
        });

        const taskCounter = document.createElement("span");
        taskCounter.classList.add("task-counter")
        taskCounter.textContent = ` ${remainingTasks} out of ${category.tasks.length} remaining`;

        // if(completedTasks.length)

        tasksHeader.appendChild(heading);
        if (completedTasks > 0) {
            tasksHeader.appendChild(deleteTasksButton);
        }
        tasksHeader.appendChild(taskCounter);

        category.tasks.forEach(item => {
            const taskElem = document.createElement('li');
            taskElem.classList.add("task", "flex-between", "flex-center", `${item.complete && "complete"}`);

            const indicatorBoxElem = document.createElement("span");
            indicatorBoxElem.classList.add("indicator-box");

            const cbElem = document.createElement("input");
            cbElem.type = "checkbox";
            cbElem.classList.add("indicator");
            cbElem.checked = item.complete;
            cbElem.addEventListener('change', () => {
                this.toggleTaskComplete(catId, item.taskId);
            });

            const taskDesc = document.createElement('p');
            taskDesc.classList.add("task-desc");
            taskDesc.textContent = item.taskDesc;

            const btnWrapper = document.createElement('div');
            btnWrapper.classList.add("btn-wrapper");

            const checkbox = document.createElement('input');
            checkbox.classList.add("cb");
            checkbox.type = "checkbox";

            const btnBox = document.createElement('div');
            btnBox.classList.add("btn-box");

            const editButton = document.createElement('button');
            editButton.classList.add("btn", "btn-outline");
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editTask(catId, item.taskId));

            const deleteButton = document.createElement('button');
            deleteButton.classList.add("btn", "btn-outline");
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => this.deleteTask(catId, item.taskId));

            indicatorBoxElem.appendChild(cbElem);

            btnBox.appendChild(editButton);
            btnBox.appendChild(deleteButton);

            btnWrapper.appendChild(checkbox);
            btnWrapper.appendChild(btnBox);

            taskElem.appendChild(indicatorBoxElem);
            taskElem.appendChild(taskDesc);
            taskElem.appendChild(btnWrapper);

            tasksContainer.appendChild(taskElem);
        });
    } // CHECKED 
}


// Add event listener for editing a category
function editCategory(catId) {
    if (catId) {
        const newCatName = prompt("Enter the new category name:");
        if (newCatName !== null && newCatName.trim() !== '') {
            dm.editCategory(catId, newCatName);
        }
    }
} // CHECKED

// Add event listener for editing a task
function editTask(catId, taskId) {
    if (catId && taskId) {
        const newTaskDesc = prompt("Enter the new task description:");
        if (newTaskDesc !== null && newTaskDesc.trim() !== '') {
            dm.editTask(catId, taskId, newTaskDesc);
        }
    }
}  // CHECKED

// Add event listener for deleting a task
function deleteTask() {
    const catId = document.querySelector(".sidebar .cat-name.active").dataset.catId;
    const taskId = document.querySelector(".tasks-container .task.active").dataset.taskId;
    if (catId && taskId) {
        dm.deleteTask(catId, taskId);
    }
}  // CHECKED

// =================================================================================
// HELPER FUNCTION 
// =================================================================================

// set active category
const catContainer = document.querySelector("#cat-container");
catContainer.addEventListener("click", (event) => {
    const clickedElement = event.target;
    if (clickedElement.classList.contains("cat-name")) {
        const catNames = document.querySelectorAll(".sidebar .cat-name");
        catNames.forEach(item => {
            item.classList.remove("active");
        });
        clickedElement.classList.add("active");
        dm.renderTasksByCatId(clickedElement.dataset.catId);
    }
}); // CHECKED

function setFirstCatActive() {
    const elem = document.querySelectorAll("#cat-container .cat-name")
    elem[0].click();
} // CHECKED

function removeChildrensById(id) {
    const parentElement = document.getElementById(id);
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }
} // CHECKED

document.getElementById("cat-input").addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.keyCode === 13) && e.ctrlKey) {
        addCat()
    }
}) // CHECKED

document.getElementById("task-input").addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.keyCode === 13) && e.ctrlKey) {
        addTask()
    }
}) // CHECKED


function calcAndSetSidebarHeight() {
    var sidebar = document.querySelector('#sidebar');
    var windowWidth = window.innerWidth;
    if (windowWidth < 767) {
        var sidebarHeight = sidebar.clientHeight;
        sidebar.style.setProperty('--sidebar-height', sidebarHeight + 'px');
    } else {
        sidebar.style.setProperty('--sidebar-height', '0');
    }
} window.addEventListener('resize', calcAndSetSidebarHeight);

// ================================== INITIAL CALL =====================================
calcAndSetSidebarHeight();
const dm = new DataManager(); // CHECKED
dm.renderCategory(); // CHECKED
setFirstCatActive() // CHECKED