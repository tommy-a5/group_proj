

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
                <p>Day</p>
                <select id="day">
                    <option value="">Select Day</option>
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                </select>
        </div>
        <div>
            <p>Time</p>
            <label for="selectTime">Select a time:</label>
            <input type="time" id="time">
        </div>

        <p>Details</p>
        <input type="text" id="taskDetails" class="form-control" />
        <div>
                <p>Priority</p>
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
    $("#addModal").hide();
    let time = $("#time").val();
    let details= $("#taskDetails").val();
    let priorityColor = $("#priority").val();
    let day = $("#day").val();
    let taskOwner = $("#taskOwner").val();
    let newTask = new Task(details, time, false, taskOwner, priorityColor, day);
    if(JSON.parse(localStorage.getItem("tasks")))
    {
        localStorage.setItem("tasks", JSON.stringify(newTask));
        console.log(newTask);
        return;
    }
    else
    {
        localStorage.setItem("tasks", JSON.stringify([newTask]));
        console.log(newTask);
        return;
    }
})
