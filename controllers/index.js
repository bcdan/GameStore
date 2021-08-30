/* eslint-disable no-unused-vars */
const Game = require('../models/Game');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

//Render shop
exports.getShop = async (req, res) => {
	const gameList = [];
	try {
		const games = await Game.find();
		games.forEach((agame) => {
			gameList.push(agame);
		});
	} catch (err) {
		res.status(500).json({message: err.message});
	}
	res.render('store', {title: 'GameStore', products: gameList});
};

//GET single game page
exports.getGamePage = (req, res) => {
	res.render('game', {title: res.game.title, game: res.game});
};

//GET Paymentpage - checkout
exports.getCheckoutPage = (req, res) => {
	if (!req.session.cart) {
		return res.redirect('/cart');
	}
	let cart = new Cart(req.session.cart);
	res.render('shopping/checkout', {title: 'Checkout', total: cart.totalPrice, products: cart.generateArray()});
};

// POST Payment page - checkout
exports.postCheckoutPage = async (req, res) => {
	let gameInCart;
	for (let i = 0; i < res.dbGames.length; i++) {
		gameInCart = res.dbGames[i];
		while (gameInCart.qty--) {
			req.user.inventory.games.push({cdkey: gameInCart.game.inventory.pop().cdkey, title: gameInCart.game.title});
		}
		await res.dbGames[i].game.save();
		await req.user.save();
	}
	let order = new Order({
		user: req.user,
		cart: req.session.cart,
		address: req.body.address,
		name: req.body.firstname,
		paymentId: getRandomPaymentID(),
	});
	await order.save((err, result) => {
		req.session.cart = null;
		res.render('shopping/thankyou', {title: 'Thank you!'});
	});
};

function getRandomPaymentID() {
	let ID = '';
	const maxID = 5,
		rangeMin = 1,
		rangeMax = 10;
	for (let index = 0; index < maxID; index++) {
		ID += getRandomInt(rangeMin, rangeMax);
	}
	return ID;
}
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getDashboard = (req, res) => {
	res.render('dashboard', {
		title: 'My profile',
		name: req.user.firstName,
		inventory: req.user.inventory,
	});
};
//
exports.addToCart = (req, res) => {
	let cart = new Cart(req.session.cart ? req.session.cart : {});
	cart.add(res.game, res.game.id);
	req.session.cart = cart;
	res.redirect('/');
};

exports.getCart = (req, res) => {
	if (!req.session.cart) {
		return res.status(200).render('shopping/cart', {title: 'My Cart', products: null});
	}
	let cart = new Cart(req.session.cart);
	let arr = cart.generateArray();
	res.status(200).render('shopping/cart', {title: 'My Cart', products: arr, totalPrice: cart.totalPrice});
};

exports.reduceByOne = (req, res) => {
	let cart = new Cart(req.session.cart ? req.session.cart : {});
	if (cart.items[res.game.id] == null) {
		return res.status(200).redirect('/cart');
	}
	cart.reduceByOne(res.game.id);
	cart.totalQty == 0 ? (req.session.cart = null) : (req.session.cart = cart);
	res.status(200).redirect('/cart');
};

exports.removeFromCart = (req, res) => {
	let cart = new Cart(req.session.cart ? req.session.cart : {});
	if (cart.items[res.game.id] == null) {
		return res.status(200).redirect('/cart');
	}
	cart.removeItem(res.game.id);
	cart.totalQty == 0 ? (req.session.cart = null) : (req.session.cart = cart);
	res.status(200).redirect('/cart');
};

exports.myInventory = (req, res) => {
	res.json({inventory: req.user.inventory});
};

exports.getGamesJson = async (req, res) => {
	try {
		const games = await Game.find();
		const gameArray = [];
		games.forEach((product) => {
			gameArray.push({id: product._id, title: product.title, picture: product.picture});
		});
		res.send(gameArray);
	} catch (err) {
		res.status(500).json({message: err.message});
	}
};
