// Abstract class for TodoItemFormatter
class To-doItemFormatter {
  formatTask(task) {
    return task.length > 14 ? task.slice(0, 14) + "..." : task;
  }

  formatDueDate(dueDate) {
    return dueDate || "No due date";
  }

  formatStatus(completed) {
    return completed ? "Completed" : "Pending";
  }
}

// Class responsible for managing Todo items
class To-doManager {
  constructor(to-doItemFormatter) {
    this.to-dos = JSON.parse(localStorage.getItem("todos")) || [];
    this.to-doItemFormatter = to-doItemFormatter;
  }

  addTo-do(task, dueDate) {
    const newTo-do = {
      id: this.getRandomId(),
      task: this.to-doItemFormatter.formatTask(task),
      dueDate: this.to-doItemFormatter.formatDueDate(dueDate),
      completed: false,
      status: "pending",
    };
    this.to-dos.push(newTo-do);
    this.saveToLocalStorage();
    return newTo-do;
  }

  editTo-do(id, updatedTask) {
      const to-do = this.to-dos.find((t) => t.id === id);
      if (to-do) {
        to-do.task = updatedTask;
        this.saveToLocalStorage();
      }
      return to-do;
    }
  
    deleteTo-do(id) {
      this.to-dos = this.to-dos.filter((to-do) => to-do.id !== id);
      this.saveToLocalStorage();
    }
  
    toggleTo-doStatus(id) {
      const to-do = this.to-dos.find((t) => t.id === id);
      if (to-do) {
        to-do.completed = !to-do.completed;
        this.saveToLocalStorage();
      }
    }
  
    clearAllTo-dos() {
      if (this.to-dos.length > 0) {
        this.to-dos = [];
        this.saveToLocalStorage();
      }
    }
  
    filterTo-dos(status) {
      switch (status) {
        case "all":
          return this.to-dos;
        case "pending":
          return this.to-dos.filter((to-do) => !to-do.completed);
        case "completed":
          return this.to-dos.filter((to-do) => to-do.completed);
        default:
          return [];
      }
    }
  
    getRandomId() {
      return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
      );
    }
  
    saveToLocalStorage() {
      localStorage.setItem("to-dos", JSON.stringify(this.to-dos));
    }
}

// Class responsible for managing the UI and handling events
class UIManager {
  constructor(to-doManager, to-doItemFormatter) {
    this.to-doManager = to-doManager;
    this.to-doItemFormatter = to-doItemFormatter;
    this.taskInput = document.querySelector("input");
    this.dateInput = document.querySelector(".schedule-date");
    this.addBtn = document.querySelector(".add-task-button");
    this.to-dosListBody = document.querySelector(".to-dos-list-body");
    this.alertMessage = document.querySelector(".alert-message");
    this.deleteAllBtn = document.querySelector(".delete-all-btn");

  this.addEventListeners();
  this.showAllTo-dos();
  }

  addEventListeners() {
      // Event listener for adding a new todo
      this.addBtn.addEventListener("click", () => {
          this.handleAddTo-do();
      });

      // Event listener for pressing Enter key in the task input
      this.taskInput.addEventListener("keyup", (e) => {
          if (e.keyCode === 13 && this.taskInput.value.length > 0) {
              this.handleAddTo-do();
          }
      });

      // Event listener for deleting all todos
      this.deleteAllBtn.addEventListener("click", () => {
          this.handleClearAllTodos();
      });

      // Event listeners for filter buttons
      const filterButtons = document.querySelectorAll(".to-dos-filter li");
      filterButtons.forEach((button) => {
          button.addEventListener("click", () => {
              const status = button.textContent.toLowerCase();
              this.handleFilterTodos(status);
          });
      });
  }

  handleAddTo-do() {
    const task = this.taskInput.value;
    const dueDate = this.dateInput.value;
    if (task === "") {
      this.showAlertMessage("Please enter a task", "error");
    } else {
      const newTo-do = this.to-doManager.addTo-do(task, dueDate);
      this.showAllTodos();
      this.taskInput.value = "";
      this.dateInput.value = "";
      this.showAlertMessage("Task added successfully", "success");
    }
  }

  handleClearAllTo-dos() {
    this.todoManager.clearAllTo-dos();
    this.showAllTo-dos();
    this.showAlertMessage("All to-dos cleared successfully", "success");
  }

  showAllTo-dos() {
    const to-dos = this.to-doManager.filterTo-dos("all");
    this.displayTo-dos(todos);
  }

  displayTo-dos(to-dos) {

      this.to-dosListBody.innerHTML = "";
      
      if (to-dos.length === 0) {
          this.to-dosListBody.innerHTML = `<tr><td colspan="5" class="text-center">No task found</td></tr>`;
          return;
        }
        
      to-dos.forEach((to-do) => {
        this.to-dosListBody.innerHTML += `
          <tr class="to-do-item" data-id="${to-do.id}">
            <td>${this.to-doItemFormatter.formatTask(to-do.task)}</td>
            <td>${this.to-doItemFormatter.formatDueDate(to-do.dueDate)}</td>
            <td>${this.to-doItemFormatter.formatStatus(to-do.completed)}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="uiManager.handleEditTo-do('${
                to-do.id
              }')">
                <i class="bx bx-edit-alt bx-bx-xs"></i>    
              </button>
              <button class="btn btn-success btn-sm" onclick="uiManager.handleToggleStatus('${
                to-do.id
              }')">
                <i class="bx bx-check bx-xs"></i>
              </button>
              <button class="btn btn-error btn-sm" onclick="uiManager.handleDeleteTo-do('${
                to-do.id
              }')">
                <i class="bx bx-trash bx-xs"></i>
              </button>
            </td>
          </tr>
        `;
      });
    }
    

  
handleEditTo-do(id) {
  const to-do = this.to-doManager.to-dos.find((t) => t.id === id);
  if (to-do) {
    this.taskInput.value = to-do.task;
    this.to-doManager.deleteTo-do(id);

    const handleUpdate = () => {
      this.addBtn.innerHTML = "<i class='bx bx-plus bx-sm'></i>";
      this.showAlertMessage("To-do updated successfully", "success");
      this.showAllTo-dos();
      this.addBtn.removeEventListener("click", handleUpdate);
    };

    this.addBtn.innerHTML = "<i class='bx bx-check bx-sm'></i>";
    this.addBtn.addEventListener("click", handleUpdate);
  }
}


handleToggleStatus(id) {
this.to-doManager.toggleTo-doStatus(id);
this.showAllTo-dos();
}

handleDeleteTo-do(id) {
this.to-doManager.deleteTo-do(id);
this.showAlertMessage("To-do deleted successfully", "success");
this.showAllTo-dos();
}


handleFilterTo-dos(status) {
  const filteredTo-dos = this.to-doManager.filterTo-dos(status);
  this.displayTo-dos(filteredTo-dos);
}


showAlertMessage(message, type) {
const alertBox = `
  <div class="alert alert-${type} shadow-lg mb-5 w-full">
    <div>
      <span>${message}</span>
    </div>
  </div>
`;
this.alertMessage.innerHTML = alertBox;
this.alertMessage.classList.remove("hide");
this.alertMessage.classList.add("show");
setTimeout(() => {
  this.alertMessage.classList.remove("show");
  this.alertMessage.classList.add("hide");
}, 3000);
}
}

// Class responsible for managing the theme switcher
class ThemeSwitcher {
constructor(themes, html) {
  this.themes = themes;
  this.html = html;
  this.init();
}

init() {
  const theme = this.getThemeFromLocalStorage();
  if (theme) {
    this.setTheme(theme);
  }

  this.addThemeEventListeners();
}

addThemeEventListeners() {
  this.themes.forEach((theme) => {
    theme.addEventListener("click", () => {
      const themeName = theme.getAttribute("theme");
      this.setTheme(themeName);
      this.saveThemeToLocalStorage(themeName);
    });
  });
}

setTheme(themeName) {
  this.html.setAttribute("data-theme", themeName);
}

saveThemeToLocalStorage(themeName) {
  localStorage.setItem("theme", themeName);
}

getThemeFromLocalStorage() {
  return localStorage.getItem("theme");
}
}



// Instantiating the classes
const todoItemFormatter = new TodoItemFormatter();
const todoManager = new TodoManager(todoItemFormatter);
const uiManager = new UIManager(todoManager, todoItemFormatter);
const themes = document.querySelectorAll(".theme-item");
const html = document.querySelector("html");
const themeSwitcher = new ThemeSwitcher(themes, html);
