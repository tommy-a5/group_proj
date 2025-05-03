

/* <ul class="list-group mb-0">
    <li class="list-group-item d-flex align-items-center border-0 mb-2 rounded"
        style="background-color: #f4f6f7;">
        <input class="form-check-input me-2" type="checkbox" value="" aria-label="..." checked />
        <s>Cras justo odio</s>
    </li>

</ul> */

import { Task } from "../utils/classes.js";

$("#addTask").click(()=>
{
    $("#addModal").show();
    $("#addTaskDiv").append(
        `
        <div>
                <select id="day">
                    <option value="">Select Day</option>
                    <option value="1">Sunday</option>
                    <option value="2">Monday</option>
                    <option value="3">Tuesday</option>
                    <option value="4">Wednesday</option>
                    <option value="5">Thursday</option>
                    <option value="6">Friday</option>
                </select>
        </div>
        <div>
            <label for="selectTime">Select a time:</label>
            <input type="time" id="time">
        </div>

        <p>Details</p>
        <input type="text" id="taskDetails" class="form-control" />
        <div>
                <select id="priority">
                    <option value="">Select Priority</option>
                    <option value="green">Low</option>
                    <option value="yellow">Medium</option>
                    <option value="red">High</option>
                </select>
        </div>
        <p>Owner</p>
        <input type="text" id="taskOwner" class="form-control" />
        <button data-mdb-button-init data-mdb-ripple-init class="btn btn-info ms-2" id="addTaskBtn">Add Task</button>
        `
    );
    
});

$(document).on("click", "#addTaskBtn", function() 
{
    console.log("task add");
    let time = $("#time").val();
    let details= $("#taskDetails").val();
    let priorityColor = $("#priority").val();
    let day = $("#day").val();
    let taskOwner = $("#taskOwner").val();
    if(time == "" || details == "" || priorityColor == "" || day == "" || taskOwner == "")
    {
        alert("Please fill all the details");
        return;
    }
    
    const [hours, minutes] = time.split(":");
    if(Number(hours) < 8 || Number(hours) >=18)
    {
        alert("You can only select a time between 08:00 and 18:00");
        return;
    }

    let newTask = new Task(details, time, false, taskOwner, priorityColor, day);
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    
    if(tasks)
    {
        for(let i in tasks)
        {
            let task = tasks[i];
            if(task.time == time)
            {
                alert("Please choose another time, this time is taken");
                return;
            }
        }
        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        console.log(newTask);
        alert("Your task has been added successfully");
        $("#addModal").hide();
        return;
    }
    else
    {

        localStorage.setItem("tasks", JSON.stringify([newTask]));
        console.log(newTask);
        alert("Your task has been added successfully");
        $("#addModal").hide();
        return;
    }
    
})
$(document).ready(function() {
    displayTasks();
});

function displayTasks()
{
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (!tasks || tasks.length == 0) {
        $("#content").append('<p>No tasks found</p>');
        return;
    }
    $("#container").empty();
    for(let i=0; i<6; i++)
    {
        $("#container").append(
            `
            <div class="todo-card card">
                <div class="tab">
                    <button class="tablinks" id="allTab${i}">All</button>
                    <button class="tablinks" id="activeTab${i}">Active</button>
                    <button class="tablinks" id="completedTab${i}">Completed</button>
                </div>
                <div id="taskList${i}"></div>
            </div>
            
            `
        );
    }
    $(document).on("click", `.tablinks`, function()
    {
        let tabId = $(this).attr("id");
        let i = parseInt(tabId.split("Tab")[1]);
        console.log(i);
        $(`#taskList${i}`).empty();

        for(let j in tasks)
        {
            let task = tasks[j];
            console.log(task.day);
            if (parseInt(task.day) == i+1)  
            {
                if (tabId.includes("allTab")) 
                {
                    displayTask(task, i);
                } 
                else if (tabId.includes("activeTab") && !task.isCompleted) 
                {
                    displayTask(task, i);
                } 
                else if (tabId.includes("completedTab") && task.isCompleted) 
                {
                    displayTask(task, i);
                }
                console.log(task);
            }

        }
    })
    
    
    
    
    function displayTask(task, index)
    {
        $(`#taskList${index}`).append(
            `
            <li class="list-group-item d-flex align-items-center border-0 mb-2 rounded"
                style="background-color: #f4f6f7;">
            <input class="form-check-input me-2" type="checkbox" value="" aria-label="..." ${task.isCompleted ? 'checked' : ''} />  
             <p class="task-text ${task.isCompleted ? 'strikethrough' : ''}">${task.details}</p>
            <button style="font-size:20px; border: none;" id="editTask" onclick="editTask(${task}, ${index})"><i class="fa fa-edit"></i></button>             
            <button style="font-size:20px; color:red; border: none;" id="deleteTask" onclick="deleteTask(${task}, ${index})"><i class="fa fa-trash-o"></i></button>
            </li>
           
            `
        )
        
    }
    $(document).on('change', '.form-check-input', function() {
        $(this).closest('li').find('.task-text').toggleClass('strikethrough');
    });
}

function EditTask(task, index)
{
    $('#editModal').modal("show");
}

function deleteTask(task, index)
{

}

