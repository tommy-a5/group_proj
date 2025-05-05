
import { User } from "../utils/classes.js";

$("#registerBtn").click((event)=>
{
    event.preventDefault();
    let name = $("#name").val();
    let email = $("#email").val();
    let password = $("#password").val();
    
    if(!name || !email || !password)
    {
    alert("You need to fill all the fields");
    return;
    }

    let newUser = new User(name, password, email);
    let users= JSON.parse(localStorage.getItem("Users"));
    if(users)
    {
        users.push(newUser);
        localStorage.setItem("Users", JSON.stringify(users))
    }
    else
    {
        localStorage.setItem("Users", JSON.stringify([newUser]));
    }

    alert(`Hello ${name}`);
    window.location.href="./loginPage.html";
})