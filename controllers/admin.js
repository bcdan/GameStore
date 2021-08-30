const Game = require('../models/Game');
const User = require('../models/User');


exports.getProductForm = (req, res) => {
	res.render('add-product', { title: 'Add Product' });
};

exports.getAdminPage = (req, res) => {
	res.render('admin', { title: 'Admin Page', name: req.user.firstName });
};

//post game
exports.postProduct = (async (req, res) => {

	Game.findOne( { game_id: req.body.game_id } ).then(existing=>{
		if( existing ) {
			req.flash('error_msg', 'ID Already exists');
		}
		else {
			const game = new Game({
				game_id: req.body.game_id,
				title: req.body.title,
				picture: req.body.picture,
				price: req.body.price,
				description: req.body.description,
				genre:req.body.genre,
				publisher:req.body.publisher
			});
			game.save();
			req.flash('success_msg','Game added');
		}
		res.status(201).redirect('/admin/games');
	}).catch(err=>res.status(400).json({ message: err.message }));



});

//get all games
exports.getAllGames = (async (req, res) => {
	try {
		const games = await Game.find();
		const gameArray = [];
		games.forEach(agame => {
			gameArray.push(agame);
		});

		res.render('games-manager', { title: 'Admin game list', products: gameArray });

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});



//get one game
exports.getSingleGame = (req, res) => {
	res.send(res.game);
};

exports.getEditProductPage = (req, res) => {
	let game;
	try{
		game=res.game;
		res.render('edit-product', { title: 'Edit', product: game});
	}catch(err){
		res.status(400).json({ message: err.message });
	}
};

//Update one game
exports.editGame = (async (req, res) => {
	if (req.body.title != null) {
		res.game.title = req.body.title;
	}
	if (req.body.cdkey != null) {
		res.game.cdkey = req.body.cdkey;
	}
	if (req.body.picture != null) {
		res.game.picture = req.body.picture;
	}
	if (req.body.price != null) {
		res.game.price = req.body.price;
	}
	if (req.body.description != null) {
		res.game.description = req.body.description;
	}
	if (req.body.publisher != null) {
		res.game.publisher = req.body.publisher;
	}
	if (req.body.genre != null) {
		res.game.genre = req.body.genre;
	}
	try {
		await res.game.save();
		req.flash('success_msg','Game updated');
		res.redirect('/admin/games');
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});



//Delete one game
exports.deleteGame = (async (req, res) => {
	try {
		await res.game.remove();
		req.flash('error_msg','Game deleted');
		res.redirect('/admin/games');
	} catch (err) {
		res.status(500).json({ msg: err.message });
	}

});

exports.adminFillInventory = (async (req,res)=>{
	req.flash('success_msg','Game inventory filled');
	res.redirect('/admin/games');
});


exports.viewInventory = (req,res)=>{
	let game;
	try{
		game = res.game;
		if(game == null)
			return res.status(404).json({msg: 'Couldnt find game'});
	}catch(err){
		return res.status(500).json({ msg: err.message });
	}
	res.render('inventory-admin', { title: game.title, products: game.inventory ,id:game.id});

};




exports.getUsersList = (async (req,res)=>{
	try {
		const users = await User.find();
		const usersArr = [];
		users.forEach(auser => {
			usersArr.push(auser);
		});
		res.render('users-list', { title: 'Users list', users: usersArr});


	} catch (err) {
		res.status(500).json({ message: err.message });

	}
});


exports.getUser = (async (req,res)=>{
	res.send(res.user);
});



exports.changeRole = (async (req,res)=>{
	try {
		res.user.role == true ? (res.user.role=false) : (res.user.role=true);
		await res.user.save();
		req.flash('success_msg','Role changed');
		res.redirect('/admin/get-users');
	} catch (err) {
		res.status(400).json({ message: err.message });
	}

});
