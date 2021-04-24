const accountModel = require('../models/account.model');
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
//  const createAccount = (req, res) => {

//      let id = req.params.id;
//      const {name, phoneNumber, email, isActive} = req.body;



//      const user = new userModel({
//          id: id,
//          name: name,
//          phoneNumber: phoneNumber,
//          email: email,
//         isActive: isActive
//     });

//      user.save((err) => {
//          if (err) return res.status(400).send(err);
//          return res.send({"success": user});
//      });
//  }

// const getAllUsers = async(req, res) =>{
//     try {
//         const users = await userModel.find({});
//         return res.send(users);
//     }
//     catch (e) {
//         console.log(e);
//         return res.status(400).json(e);
//     }
//     // userModel.find({})
//     // .then(users=> {
//     //     return res.send(users)
//     // })
//     // .catch(e=> {
//     //     return res.send(e)
//     // })
// } 

// const getUsersByActiveStatus = async(req, res)=> {
//     try {
//         const users = await userModel.find({isActive : req.params.isActive});
//         return res.send(users);

//     }
//     catch (e) {
//         return res.send(e);
//     }
// }

// const getUserById = async(req, res)=> {
//     try {
//         const user = await userModel.find({_id: req.params.id});
    
//         res.send(user);
//     }
//     catch(e) {
//         return res.status(400).send("Error: could not find user");
//     }
// }



// const deleteUser = async(req, res)=> {
//     try{
//         const user = await userModel.findByIdAndDelete(req.params.id);
//         if (!user) {
//             return res.status(404).send('Could not find user');
//         }
//         return res.send(user);
//     }
//     catch(e) {
//         return res.status(400).send(e);
//     }
// }

// const editUser = async(req, res)=> {
//     try {
//         const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
//         console.log(req.body);
//         console.log(user);
//         if(!user) {
//             return res.status(404).send('user not found');
//         }
//         return res.send(user);
        
//     }
//     catch(e) {
//         return res.status(400).send(e);
//     }
// }

module.exports = {
   createAccountAndAddToUser, createAccountAndAddToUser,
   getAllAccounts: getAllAccounts,
   getAccountById: getAccountById,
   getAccountsByActiveStatus: getAccountsByActiveStatus,
}
