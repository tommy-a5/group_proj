
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
    constructor(details, time, isCompleted, owner, priority, day, createdBy)
    {
        this.id = Date.now() + Math.random().toString(36).substr(2, 9); // Generate unique ID
        this.details = details;
        this.time = time;
        this.isCompleted = isCompleted;
        this.owner = owner;
        this. priority = priority;
        this.day = day;
        this.createdBy = createdBy;
    }
}