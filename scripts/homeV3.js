import {Task, User} from "../utils/classes.js"

let currentUser = JSON.parse(localStorage.getItem("currentUser"));


// let currentUser = new User
// (
//    'Tevel',
//     "test@gmail.com",
//      "123"
// )
// localStorage.setItem("currentUser", JSON.stringify(currentUser))
function updateUI() {
    if (currentUser.name !="") {
        console.log(currentUser.name);
        document.getElementById("loginBtn").textContent = "Logout";
        document.getElementById("loggedInUser").innerText = `Logged in as ${currentUser.name}`;
        document.getElementById("signInBtn").style.display="none";
    }
    else {
        document.getElementById("loginBtn").textContent = "Login";
        document.getElementById("loggedInUser").innerText = ``;
        document.getElementById("signInBtn").style.display="flex";
    }
}
updateUI();
  
$("#loginBtn").click(()=>
{
    if(document.getElementById("loginBtn").textContent == "Login") 
    {
        window.location.href="./loginPage.html";
    }
    else {
        localStorage.setItem("currentUser",JSON.stringify({ name: "" }));
        window.location.reload();
    }
        updateUI();
    }
);

$("#signInBtn").click(()=>
{
    window.location.href="./registerPage.html";

})

  $(document).ready(function () {
    renderTaskColumns();
    displayTasks();
  
    $("#addBtn").click(() => {
        if(currentUser.name != "")
            {
          $("#addModal").show();
  
          $("#addModal").html(`
              <div class="modal-content p-4 bg-white rounded shadow">
                <h2 id="titleAddTask">Add Task</h2>
                <div class="mb-2">
                  <label>Day</label>
                  <select id="day" class="form-control">
                    <option value="">Select Day</option>
                    <option value="1">Sunday</option>
                    <option value="2">Monday</option>
                    <option value="3">Tuesday</option>
                    <option value="4">Wednesday</option>
                    <option value="5">Thursday</option>
                    <option value="6">Friday</option>
                  </select>
                </div>
          
                <div class="mb-2">
                  <label>Time</label>
                  <input type="time" id="time" class="form-control" />
                </div>
          
                <div class="mb-2">
                  <label>Details</label>
                  <input type="text" id="taskDetails" class="form-control" />
                </div>
          
                <div class="mb-2">
                  <label>Priority</label>
                  <select id="priority" class="form-control">
                    <option value="">Select Priority</option>
                    <option value="green">Low</option>
                    <option value="yellow">Medium</option>
                    <option value="red">High</option>
                  </select>
                </div>
          
                <div class="mb-2">
                  <label>Owner</label>
                  <input type="text" id="taskOwner" class="form-control" />
                </div>
          
                <div class="d-flex justify-content-between">
                  <button id="addTask" class="btn btn-success">Add Task</button>
                  <button id="closeModal" class="btn btn-secondary">Cancel</button>
                </div>
              </div>
            `);
        
            $("#closeModal").click(() => {
              $("#addModal").hide();
            });
      
          $("#addTask").click(() => {
            let time = $("#time").val();
            let details = $("#taskDetails").val();
            let priority = $("#priority").val();
            let day = $("#day").val();
            let owner = $("#taskOwner").val();
        
            if (!time || !details || !priority || !day || !owner) {
              alert("Please fill all the fields");
              return;
            }
        
            const [hours] = time.split(":");
            if (parseInt(hours) < 8 || parseInt(hours) >= 18) {
              alert("Select a time between 08:00 and 18:00");
              return;
            }
        
            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        
            const timeTaken = tasks.some((task) => task.time === time && task.day === day && task.createdBy == currentUser.name);
            if (timeTaken) {
              alert("Time already taken for this day");
              return;
            }
        
            let newTask = new Task(details, time, false, owner, priority, day, currentUser.name);
            tasks.push(newTask);
            localStorage.setItem("tasks", JSON.stringify(tasks));
        
            $("#addModal").hide();
            clearForm();
            displayTasks();
          });
      }
      else
      {
          alert("You need to sign in to create a new task");
          return;
      }
    });
  
  });
  
  function renderTaskColumns() {
    
    
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    $("#container").empty();
  
    days.forEach((day, index) => {
      $("#container").append(`
        <div class="todo-card card" data-day="${index + 1}">
          <h5 class="text-center">${day}</h5>
          <div class="tab">
            <button class="tablinks active" data-filter="all" data-day="${index + 1}">All</button>
            <button class="tablinks" data-filter="active" data-day="${index + 1}">Active</button>
            <button class="tablinks" data-filter="completed" data-day="${index + 1}">Completed</button>
          </div>
          <ul class="taskList list-group" id="taskList${index + 1}"></ul>
        </div>
      `);
    });
  
    $(document).on("click", ".tablinks", function () {
      let day = $(this).data("day");
      let filter = $(this).data("filter");
  
      $(this).closest(".tab").find(".tablinks").removeClass("active");
      $(this).addClass("active");
  
      displayTasks(day, filter);
    });
  }
  
  function displayTasks(dayFilter = null, statusFilter = "all") {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      let userName = currentUser.name;
      if(userName == "")
      {
          $("#container").text(`You need to sign in to create a tasks`);
          document.getElementById("container").style.display = "flex";
          document.getElementById("container").style.justifyContent = "center";
          document.getElementById("container").style.alignItems = "center";
          document.getElementById("container").style.fontSize = "25px";

      }

    tasks.sort((a, b) => {
        if (a.day === b.day) {
          return a.time.localeCompare(b.time);
        }
        return a.day - b.day;
      });

      if (dayFilter === null) {
        for (let i = 1; i <= 6; i++) {
          $(`#taskList${i}`).empty();
        }
      } else {
        $(`#taskList${dayFilter}`).empty();
      }
  
    tasks.forEach((task) => {
        if (task.createdBy !== userName) return;
      const day = parseInt(task.day);
      if (dayFilter !== null && day !== parseInt(dayFilter)) return;
    
   
    const showThisTask = 
      statusFilter === "all" || 
      (statusFilter === "active" && !task.isCompleted) || 
      (statusFilter === "completed" && task.isCompleted);
    
    if (showThisTask) {
      $(`#taskList${day}`).append(renderTaskItem(task));
    }
    });
  
    $(".form-check-input").off().on("change", function () {
      const index = $(this).data("task-id");
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      const taskIndex = tasks.findIndex(task => task.id === index);
    if (taskIndex !== -1) {
        const parentCard = $(this).closest(".todo-card");
        const day = parentCard.data("day");
        const activeFilter = parentCard.find(".tablinks.active").data("filter");
      tasks[taskIndex].isCompleted = !tasks[taskIndex].isCompleted;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      displayTasks(day, activeFilter); 
    }
    });
  
    $(".delete-task").off().on("click", function () {
      const index = $(this).data("task-id");
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      const taskIndex = tasks.findIndex(task => task.id === index);
    if (taskIndex !== -1) {
        const parentCard = $(this).closest(".todo-card");
        const day = parentCard.data("day");
        const activeFilter = parentCard.find(".tablinks.active").data("filter");  
      tasks.splice(taskIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      displayTasks(day, activeFilter); 
    }
    });
  
    $(document).on("click", ".edit-task", function () {
        const index = $(this).data("task-id");
        const day = $(this).data("day");
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        
        const taskIndex = tasks.findIndex(task => task.id === index);
        if (taskIndex !== -1) 
        {
        const task = tasks[taskIndex];
    
        // Show edit modal
        $("#addModal").show();
        $("#addModal").html(`
            <div class="modal-content p-4 bg-white rounded shadow">
                <h4>Edit Task</h4>
                <div class="mb-2">
                    <label>Day</label>
                    <select id="editDay" class="form-control">
                        <option value="1" ${task.day == 1 ? 'selected' : ''}>Sunday</option>
                        <option value="2" ${task.day == 2 ? 'selected' : ''}>Monday</option>
                        <option value="3" ${task.day == 3 ? 'selected' : ''}>Tuesday</option>
                        <option value="4" ${task.day == 4 ? 'selected' : ''}>Wednesday</option>
                        <option value="5" ${task.day == 5 ? 'selected' : ''}>Thursday</option>
                        <option value="6" ${task.day == 6 ? 'selected' : ''}>Friday</option>
                    </select>
                </div>
    
                <div class="mb-2">
                    <label>Time</label>
                    <input type="time" id="editTime" class="form-control" value="${task.time}" />
                </div>
    
                <div class="mb-2">
                    <label>Details</label>
                    <input type="text" id="editDetails" class="form-control" value="${task.details}" />
                </div>
    
                <div class="mb-2">
                    <label>Priority</label>
                    <select id="editPriority" class="form-control">
                        <option value="green" ${task.priorityColor == "green" ? 'selected' : ''}>Low</option>
                        <option value="yellow" ${task.priorityColor == "yellow" ? 'selected' : ''}>Medium</option>
                        <option value="red" ${task.priorityColor == "red" ? 'selected' : ''}>High</option>
                    </select>
                </div>

                <div class="mb-2">
                    <label>Owner</label>
                    <input type="text" id="editOwner" class="form-control" value="${task.owner}" />
                </div>
    
                <div class="d-flex justify-content-between">
                    <button id="saveEditBtn" class="btn btn-success" data-task-id="${task.id}">Save</button>
                    <button id="closeEditModal" class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        `);

        $(this).closest(".todo-card").data("current-filter", 
        $(this).closest(".todo-card").find(".tablinks.active").data("filter"));
        }
    });
    

    $(document).on("click", "#closeEditModal", function () {
        $("#addModal").hide();
      });
    
    // Save edits
    $(document).on("click", "#saveEditBtn", function () {
        const index = $(this).data("task-id");
        const originalDay = $(this).data("original-day");
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    

        const taskIndex = tasks.findIndex(task => task.id === index);
        if (taskIndex !== -1) {
        tasks[taskIndex].day = $("#editDay").val();
        tasks[taskIndex].time = $("#editTime").val();
        tasks[taskIndex].details = $("#editDetails").val();
        tasks[taskIndex].priority = $("#editPriority").val();
        tasks[taskIndex].owner = $("#editOwner").val();
    
        localStorage.setItem("tasks", JSON.stringify(tasks));
        $("#addModal").hide();
        if ($("#editDay").val() !== originalDay) {
            displayTasks(); 
          } else {
            const filter = $(`.todo-card[data-day="${originalDay}"]`).find(".tablinks.active").data("filter");
            displayTasks(originalDay, filter);
          }
        }
    });
    
  }
  
  function renderTaskItem(task, index) {
    return `
<li class="list-group-item d-flex align-items-center justify-content-between ${task.priority}">
        <div class="d-flex align-items-center gap-2">
          <input type="checkbox" class="form-check-input" data-task-id="${task.id}" ${task.isCompleted ? "checked" : ""}>
          <div class="${task.isCompleted ? "strikethrough" : ""}">
            <strong>${task.time}</strong> 
             <br/> ${task.details}<br/>
            <small>By: ${task.owner}</small>
          </div>
        </div>
        <div>
          <button id="editBtn" class="btn btn-sm btn-warning edit-task" data-task-id="${task.id}"><i class="fa fa-edit"></i></button>
          <button id="deleteBtn" class="btn btn-sm btn-danger delete-task" data-task-id="${task.id}"><i class="fa fa-trash"></i></button>
        </div>
      </li>
    `;
  }
  
  function clearForm() {
    $("#time").val("");
    $("#taskDetails").val("");
    $("#priority").val("");
    $("#day").val("");
    $("#taskOwner").val("");
  }
  




  