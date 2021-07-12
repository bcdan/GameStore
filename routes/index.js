const express = require('express');
const router = express.Router();
const ShopController = require('../controllers/index');
const { ensureAuthenticated } = require('../config/auth');
const {getGame, fillInventory, getGamesFromCart} = require('./middlewares');

//Home page
router.get('/', ShopController.getShop); // Home page / general store

//get game page
router.get('/game/:id', getGame,ShopController.getGamePage); // single game page

//Profile page
router.get('/dashboard', ensureAuthenticated, ShopController.getDashboard);

//Payment/checkout page
router.get('/checkout/', ensureAuthenticated,  ShopController.getCheckoutPage);

//Post payment / checkout page
router.post('/checkout/', ensureAuthenticated, getGamesFromCart,fillInventory,ShopController.postCheckoutPage);

//GET add to cart with ID - > adds an item to cart
router.get('/add-to-cart/:id',ensureAuthenticated,getGame,ShopController.addToCart);

//remove one item from cart - > reducing by one
router.get('/reduce-from-cart/:id',ensureAuthenticated,getGame,ShopController.reduceByOne);

//remove all items of same type -> by quantity and id
router.get('/remove-from-cart/:id',ensureAuthenticated,getGame,ShopController.removeFromCart);

//GET cart review page
router.get('/cart',ensureAuthenticated,ShopController.getCart);

//GET user's inventory
router.get('/dashboard/inventory',ensureAuthenticated,ShopController.myInventory);

//GET all games -> json
router.get('/games',ShopController.getGamesJson);


module.exports = router;
