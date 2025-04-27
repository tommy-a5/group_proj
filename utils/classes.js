
export class User 
{
    constructor(name, password, email) {
        this.name = name;
        this.password = password;
        this.email = email;
    }
}

export class Task
{
    constructor(details, time, isCompleted, owner, priority, day)
    {
        this.details = details;
        this.time = time;
        this.isCompleted = isCompleted;
        this.owner = owner;
        this. priority = priority;
        this.day = day;
    }
}