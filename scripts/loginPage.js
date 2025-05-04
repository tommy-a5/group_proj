
$("#loginBtn").click((event)=>
{
    event.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();

    if(!email || !password)
    {
        alert("Please enter Email and Password");
        return;
    }
    
    let users = JSON.parse(localStorage.getItem("Users"));
    if(users)
    {
        for(let i in users)
        {
            let user= users[i];
            if(user.email == email)
            {
                if(user.password == password)
                {
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    window.location.href="./homeV3.html";
                    return;
                }
                else
                {
                    alert("Invalid password");
                    return;
                }
            }
        }
        alert("No User found");
    }


})