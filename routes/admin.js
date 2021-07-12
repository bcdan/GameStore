const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin');
const { ensureAuthenticatedAdmin } = require('../config/auth');
const { getGame, getUser, fillSingleInventory } = require('./middlewares');



//Admin page
router.get('/', ensureAuthenticatedAdmin, AdminController.getAdminPage);
//Games list via admin page
router.get('/games', ensureAuthenticatedAdmin, AdminController.getAllGames);
//Add product to DB
router.post('/add-product', ensureAuthenticatedAdmin, AdminController.postProduct);
//Get a single game from DB by ID
router.get('/games/:id', ensureAuthenticatedAdmin, getGame, AdminController.getSingleGame);
//Edit a game by ID
router.get('/edit-product/:id', ensureAuthenticatedAdmin, getGame, AdminController.getEditProductPage);
//Fill game's inventory by ID
router.get('/fill-product/:id', ensureAuthenticatedAdmin, getGame, fillSingleInventory, AdminController.adminFillInventory);
//View game's inventory by ID
router.get('/view-inventory/:id',ensureAuthenticatedAdmin, getGame, AdminController.viewInventory);
//Post-edit game by ID
router.post('/edit-product/:id', ensureAuthenticatedAdmin, getGame, AdminController.editGame);
//Delete game by ID
router.post('/delete-product/:id', ensureAuthenticatedAdmin,getGame, AdminController.deleteGame);
//Get users list via admin page
router.get('/get-users', ensureAuthenticatedAdmin, AdminController.getUsersList);
//Get a single user by ID from DB
router.get('/get-users/:id', ensureAuthenticatedAdmin, getUser, AdminController.getUser);
//Change a user's role by ID
router.post('/get-users/:id', ensureAuthenticatedAdmin, getUser, AdminController.changeRole);


module.exports = router;
