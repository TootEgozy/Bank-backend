const express = require('../node_modules/express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const accountController = require('../controllers/accounts.controller');
const userModal = require('../models/user.model');
const accountModal = require('../models/account.model');

router.get('/', (req, res)=> {
    res.send("in homepage");
})

//Users
router.get('/users', (req, res)=> {
   userController.getAllUsers(req, res);
})

router.get('/users/active/:isActive', (req, res)=> {
   userController.getUsersByActiveStatus(req, res);
})

router.get('/users/user/:id', (req, res)=> {
    userController.getUserById(req, res);
})

router.post('/users/addUser/:id', (req, res)=> {
  userController.createUser(req, res);
})

router.delete('/users/deleteUser/:id', (req, res)=> {
   userController.deleteUser(req, res);
})

router.put('/users/editUser/:id', (req, res)=> {
    userController.editUser(req, res);
})

router.put('/users/editUserAccounts/add/:id', (req, res)=> {
    userController.addAccountToUser(req, res);
})

router.put('/users/editUserAccounts/remove/:id', (req, res)=> {
    userController.removeAccountFromUser(req, res);
})

//Accounts
router.get('/accounts', (req, res)=> {
    accountController.getAllAccounts(req, res);
})

router.get('/accounts/active/:isActive', (req, res)=> {
    accountController.getAccountsByActiveStatus(req, res);
})

router.get('/accounts/:id', (req, res)=> {
    accountController.getAccountById(req, res);
})

router.delete('/accounts/:id', (req, res)=> {
    res.send('delete account by the account id');
})

router.post('/accounts/createAccount/:id', (req, res)=> {
   accountController.createAccountAndAddToUser(req, res);
})

router.put('/accounts/withdraw/:id', (req, res)=> {
    res.send('withdraw money from an account by id (sum in body)');
})

router.put('/accounts/deposit/:id', (req, res)=> {
    res.send('deposit money for an account by id (sum in body)');
})

router.put('/accounts/updateCredit/:id', (req, res)=> {
    res.send('update the credit for an account by id. get new credit from req.body');
})

router.put('/accounts/transact/:fromId/:toId', (req, res)=> {
    res.send('transaction of cash between two accounts');
})








// router.delete('/deleteProduct', (req, res)=> {
//     productController.deleteProductByProp(req, res);
// })

// router.get('/getActive', (req, res)=> {
//     productController.getAllActives(req,res);
// })

// router.get('/getByPriceRange', (req, res)=> {
//     productController.getPriceRange(req, res);
// })

// router.put('/updateProduct/:id', (req, res)=> {
//     productController.updateProduct(req, res);
// })

// router.delete('/deleteProduct/:id', (req, res)=> {
//     productController.deleteProduct(req, res);
// })


module.exports = router;