const uuid = require("uuid");

export const CREDIT = "CREDIT"
export const DEBIT = "DEBIT"

class Account {
    constructor(id, num, bal){
        this.idOwner = id;
        this.number = num;
        this.initialBalance = bal;
        this.operations = [];

        this.addOperation = this.addOperation.bind(this);
    }

    addOperation(operation){
        this.operations.push(operation);
    }

    balance(toDate){
        let balance = this.initialBalance;
        for(let i = 0; i < this.operations.length; i++){
            if(this.operations[i].date <= toDate){
                switch(this.operations[i].type){
                    case CREDIT:
                        balance = balance + this.operations[i].amount;
                        break;
                    case DEBIT:
                        balance = balance - this.operations[i].amount;
                        break;
                    default:
                        break;
                }
            }
        }
        return balance;
    }

    findOperations(filter){
        return this.operations.filter(filter);
    }

    removeOperation(id){
        this.operations = this.operations.filter(o => o.idOperation != id);
    }
}

class Operation {
    constructor(idOperation, amount, date, type, label, account = null){
        this.idOperation = idOperation;
        this.amount = parseFloat(amount);
        this.account = account;
        this.date = date;
        this.type = type;
        this.label = label;
    }
}

class Accounts {
    constructor(){
        this.accountList = [
            new Account(12345, "1", 1000),
            new Account(12345, "2", 2000),
            new Account(54231, "3", 1500)
        ];
        this.transfert = this.transfert.bind(this);
    }

    accountExists(num){
        return !!this.accountList.find(acc => acc.num == num);
    }

    findAccounts(idOwner){
        return this.accountList.filter(acc => acc.idOwner == idOwner);
    }

    findAccount(num, idUser){
        return this.accountList.find(acc => acc.number == num && acc.idOwner == idUser);
    }

    getBalance(num, toDate){
        const account = this.accountList.find(acc => acc.num == num);
        if(account){
            return account.balance(toDate);
        } else {
            throw new Exception("Account not found");
        }
    }

    withdraw(num, amount, date, label){
        const account = this.accountList.find(acc => acc.num == num);
        if(account){
            account.addOperation(new Operation(uuid(), amount, date, DEBIT, label));
        } else {
            throw new Exception("Account not found");
        }
    }

    transfert(from, to, amount, date, label, idUser){
        const fromAccount = this.findAccount(from, idUser);
        const toAccount = this.findAccount(to, idUser);
        const idOperation = uuid();
        if(fromAccount && toAccount){
            fromAccount.addOperation(new Operation(idOperation, amount, date, DEBIT, label, to));
            toAccount.addOperation(new Operation(idOperation, amount, date, CREDIT, label, from));
        } else {
            throw new Exception("Account not found");
        }
    }

    cancelOperation(idOperation){
        for(let i = 0; i < this.accountList.length; i++){
            this.accountList[i].cancelOperation(idOperation);
        }
    }
}

export const accounts = new Accounts();