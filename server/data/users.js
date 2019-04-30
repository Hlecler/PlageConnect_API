export class User {
    constructor(id, pwd){
        this.id = id;
        this.pwd = pwd;
    }
}

class Users {
    constructor(){
        this.users = [
            new User("12345", "1"),
            new User("54231", "9876")
        ]
        this.findByLogin = this.findByLogin.bind(this);
    }

    findByLogin(id, pwd){
        return this.users.find(u => u.id == id && u.pwd == pwd);
    }

    findById(id){
        return this.users.find(u => u.id == id);
    }

    add(user){
        this.users.push(user);
    }

    remove(id){
        this.users = this.users.filter(u => u.id != id);
    }

    update(id, newUser){
        this.removeUser(id);
        this.addUser(newUser);
    }
}

export const users = new Users();