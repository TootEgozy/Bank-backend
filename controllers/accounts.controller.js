const accountModel = require('../models/account.model');
const transactionModel = require('../models/transaction.model');
const userModel = require('../models/user.model');
const usersController = require('./users.controller');

//helper function for createAccountAndAddToUser
const createAccount = async(req, res)=> {
    try {
        const ownerIdMongo = req.params.id;
        const {credit, cash, isActive} = req.body;

        const reversedCredit = credit * (-1);
        if(cash < reversedCredit) return {Error: "debt cannot acceed credit"};        

        const account = new accountModel({
            credit: credit,
            cash: cash,
            isActive: isActive
        });
        
        account.ownerIdMongo.push(ownerIdMongo);
        
        account.save();

        return account;
    }
    catch(e) {
        return {error: e};
    }
}

const createAccountAndAddToUser = async(req, res)=> {
    const user = await userModel.findById({_id: req.params.id});

    //if user exist, create an account for her
    if(user.name) {
        const account = await createAccount(req, res);

        //if the account was successfully created, add it to the user's accounts array
        if(account.ownerIdMongo) {
            const accountId = account._id;

            await user.accounts.push(accountId);
            
            user.save();

            return res.json({"success": user})
        }
    }
    return res.json({"Error": "could not create an account for user" +req.params.id});
}

const getAllAccounts = async(req, res) => {
    try {
        const allAccounts = await accountModel.find({});

        return res.send(allAccounts);
    }
    catch(e) {
        return res.status(400).send(e);
    }
}

const getAccountById = async(req, res)=> {
    try {
        const account = await accountModel.find({_id: req.params.id});
    
        res.send(account); 
    }
    catch(e) {
        return res.status(400).send({"Error": e});
    }
}

const getAccountsByActiveStatus = async(req, res)=> {
    try {

        console.log(req.params.isActive);
        const accounts = await accountModel.find({isActive : req.params.isActive});
        return res.send(accounts);

    }
    catch (e) {
        return res.send(e);
    }
}

const deleteAccount = async(req, res)=> {
    try{

        //find the account, get the owner id, find the owner, 
        //pull out this accound from the owner's accounts array
        const account = await accountModel.find({_id: req.params.id});

        const ownerId = account[0].ownerIdMongo[0];

        const owner = await userModel.findById(ownerId);

        const ownerAccounts = owner.accounts;

        const deletedAccountIndex = ownerAccounts.indexOf(req.params.id);

        await owner.accounts.splice(deletedAccountIndex, 1);

        owner.save();

        const deletedAccount = await accountModel.findByIdAndDelete(req.params.id);

        return res.send(deletedAccount);
    }
    catch(e) {
        return res.status(400).send(e);
    }
}

const changeAccountMoney = async(req, res)=> {
    try {
        const id = req.params.id;
        const amount = req.body.cash;

        const account = await accountModel.findById(id);

        const originalCash = account.cash;
        const negativeCredit = (-1) * account.credit;

        const newCash = originalCash + amount;

        if(newCash < negativeCredit) {
            return res.status(400).send("Error: debt cannot acceed credit");
        }

        account.cash = newCash;
        account.save();

        return res.send(account);
    }
    catch(e) {
        return res.status(400).send(e);
    }
}

const updateCredit = async(req, res)=> {
    try {
        const account = await accountModel.findById(req.params.id);

        const originalCredit = account.credit;

        const newCredit = originalCredit+req.body.credit;

       const negativeCredit = (-1) * newCredit;

        const cash = account.cash;

        if(cash < negativeCredit) {

             return res.status(400).send("Error: debt cannot acceed credit");
        }
        
        account.credit = newCredit;
        await account.save();

        return res.send(account);
    }
    catch(e) {
        return res.status(400).send(e);
    }
}

const transact = async(req, res) => {
    try{
        const fromId = req.params.fromId;
        const toId = req.params.toId;
    
        const from = await accountModel.findById(fromId);
        const to = await accountModel.findById(toId);
    
        if(from == null || to == null) {
            return res.status(404).send("account not found");
        }

        const cash = req.body.cash;

        if(cash < 0) {
            return res.status(400).send("Error: negative sum deposit");
        }

        const originalCash = from.cash;
        const negativeCredit = (-1) * from.credit;

        const newCash = originalCash - cash;

        if(newCash < negativeCredit) {
            return res.status(400).send("Error: debt cannot acceed credit");
        }

        const newTransaction = new transactionModel({
            fromId: fromId,
            toId: toId,
            cash: cash
        });

        newTransaction.save();

        from.cash = newCash;
        from.transactions.push(newTransaction._id);
        from.save();
        
        to.cash = to.cash + cash;
        to.transactions.push(newTransaction._id);
        to.save();

        return res.send(newTransaction);        
    }
    catch(e) {
        return res.status(400).send({Error: e})
    }
}

module.exports = {
   createAccountAndAddToUser, createAccountAndAddToUser,
   getAllAccounts: getAllAccounts,
   getAccountById: getAccountById,
   getAccountsByActiveStatus: getAccountsByActiveStatus,
   deleteAccount: deleteAccount,
   changeAccountMoney: changeAccountMoney,
   updateCredit: updateCredit,
   transact: transact
}
