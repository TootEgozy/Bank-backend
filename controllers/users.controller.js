const userModel = require('../models/user.model');

const getAllUsers = async(req, res) =>{
    try {
        const users = await userModel.find({});
        return res.send(users);
    }
    catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
} 

const getUsersByActiveStatus = async(req, res)=> {
    try {
        const users = await userModel.find({isActive : req.params.isActive});
        return res.send(users);

    }
    catch (e) {
        return res.send(e);
    }
}

const getUserById = async(req, res)=> {
    try {
        const user = await userModel.find({_id: req.params.id});
    
        res.send(user);
    }
    catch(e) {
        return res.status(400).send("Error: could not find user");
    }
}

const createUser = (req, res) => {

    let id = req.params.id;
    const {name, phoneNumber, email, isActive} = req.body;



    const user = new userModel({
        id: id,
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        isActive: isActive
    });

    user.save((err) => {
        if (err) return res.status(400).send(err);
        return res.send({"success": user});
    });
}

const deleteUser = async(req, res)=> {
    try{
        const user = await userModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('Could not find user');
        }
        return res.send(user);
    }
    catch(e) {
        return res.status(400).send(e);
    }
}

const editUser = async(req, res)=> {
    try {
        const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        console.log(req.body);
        console.log(user);
        if(!user) {
            return res.status(404).send('user not found');
        }
        return res.send(user);
        
    }
    catch(e) {
        return res.status(400).send(e);
    }
}

const addAccountToUser = async(req, res)=> {
   try {
    const newAccount = req.body.id;
    const user = await userModel.find({_id: req.params.id});

    const accounts = await user[0].accounts;

    if(!accounts.includes(newAccount)) {
        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {$push: {accounts: [newAccount]}});

        return res.send(updatedUser);
    }
    return res.send(`Account ${newAccount} is already attached to user ${req.params.id}`)

   }
   catch(e) {
    return res.status(400).sent(e);
   }

}

const removeAccountFromUser = async(req, res)=> {
   try {
    const removedAccount = req.body.id;
    const user = await userModel.find({_id: req.params.id});
    console.log(user);

    // const accounts = await user[0].accounts;

    // const index = accounts.lastIndexOf(removedAccount);
    // console.log(index);
    const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {$pull: {accounts: {$in: [removedAccount]}}});

    console.log(updatedUser);

    return res.send(updatedUser);
   }
   catch(e) {
    return res.status(400).sent(e);
   }

}

module.exports = {
    createUser: createUser,
    getAllUsers: getAllUsers,
    getUsersByActiveStatus: getUsersByActiveStatus,
    getUserById: getUserById,
    deleteUser: deleteUser,
    editUser: editUser,
    addAccountToUser: addAccountToUser,
    removeAccountFromUser: removeAccountFromUser,
}
