class Task {
    constructor(details, time, isCompleted, owner, priority, day) {
      this.details = details;
      this.time = time;
      this.isCompleted = isCompleted;
      this.owner = owner;
      this.priority = priority;
      this.day = day;
    }
  }
  
  $(document).ready(function () {
    renderTaskColumns();
    displayTasks();
  
    $("#addBtn").click(() => {
      $("#addModal").show();
    });
  
    $("#closeModal").click(() => {
      $("#addModal").hide();
    });

    $("#addModal").html(`
        <div class="modal-content p-4 bg-white rounded shadow">
          <h4>Add Task</h4>
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
  
      const timeTaken = tasks.some((task) => task.time === time && task.day === day);
      if (timeTaken) {
        alert("Time already taken for this day");
        return;
      }
  
      let newTask = new Task(details, time, false, owner, priority, day);
      tasks.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(tasks));
  
      $("#addModal").hide();
      clearForm();
      displayTasks();
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
  
      $(this).siblings().removeClass("active");
      $(this).addClass("active");
  
      displayTasks(day, filter);
    });
  }
  
  function displayTasks(dayFilter = null, statusFilter = "all") {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    for (let i = 1; i <= 6; i++) {
      $(`#taskList${i}`).empty();
    }
  
    tasks.forEach((task, idx) => {
      const day = parseInt(task.day);
      if (!dayFilter || day === parseInt(dayFilter)) {
        if (
          statusFilter === "all" ||
          (statusFilter === "active" && !task.isCompleted) ||
          (statusFilter === "completed" && task.isCompleted)
        ) {
          $(`#taskList${day}`).append(renderTaskItem(task, idx));
        }
      }
    });
  
    $(".form-check-input").off().on("change", function () {
      const index = $(this).data("index");
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      tasks[index].isCompleted = !tasks[index].isCompleted;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      displayTasks();
    });
  
    $(".delete-task").off().on("click", function () {
      const index = $(this).data("index");
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      displayTasks();
    });
  
    $(document).on("click", ".edit-task", function () {
        const index = $(this).data("index");
        const day = $(this).data("day");
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        let task = tasks[index];
    
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
                    <input type="text" id="editOwner" class="form-control" value="${task.taskOwner}" />
                </div>
    
                <div class="d-flex justify-content-between">
                    <button id="saveEditBtn" class="btn btn-success" data-index="${index}">Save</button>
                    <button id="closeModal" class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        `);
    });
    
    // Save edits
    $(document).on("click", "#saveEditBtn", function () {
        const index = $(this).data("index");
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
        tasks[index].day = $("#editDay").val();
        tasks[index].time = $("#editTime").val();
        tasks[index].details = $("#editDetails").val();
        tasks[index].priorityColor = $("#editPriority").val();
        tasks[index].taskOwner = $("#editOwner").val();
    
        localStorage.setItem("tasks", JSON.stringify(tasks));
        $("#addModal").hide();
        displayTasks();
    });
    
  }
  
  function renderTaskItem(task, index) {
    return `
      <li class="list-group-item d-flex align-items-center justify-content-between ${task.priority}">
        <div class="d-flex align-items-center gap-2">
          <input type="checkbox" class="form-check-input" data-index="${index}" ${task.isCompleted ? "checked" : ""}>
          <div class="${task.isCompleted ? "strikethrough" : ""}">
            <strong>${task.time}</strong> - ${task.details}<br/>
            <small>By: ${task.owner}</small>
          </div>
        </div>
        <div>
          <button class="btn btn-sm btn-warning edit-task" data-index="${index}"><i class="fa fa-edit"></i></button>
          <button class="btn btn-sm btn-danger delete-task" data-index="${index}"><i class="fa fa-trash"></i></button>
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
  




  