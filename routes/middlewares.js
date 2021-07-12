const Game = require('../models/Game');
const User = require('../models/User');
const Cart = require('../models/Cart');

//generates random cdkeys
function generateKeys (game,howMany){

	let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';
	let blockLen = 5;
	let numOfBlocks = 3;
	let keysToGenerate = howMany;

	for(let k=0;k<keysToGenerate;k++){
		let keyString= '';
		keyString += game.game_id+'-';
		for(let i=0;i<numOfBlocks;i++){
			for(let j=0;j<blockLen;j++){
				let rnum = Math.floor(Math.random()* chars.length);
				keyString+= chars.substring(rnum,rnum+1);
			}
			if(i!=numOfBlocks-1)
				keyString+='-';
		}
		game.inventory.push({cdkey:keyString});
	}
	return game;

}

//finds a game in DB by ID
module.exports = {
	getGame: async function (req, res, next) {
		let game;
		try {
			game = await Game.findById(req.params.id);
			if (game == null) {
				return res.status(404).json({ msg: 'Cannot find game' });
			}
		} catch (err) {
			return res.status(500).redirect('/');
		}

		res.game = game;
		next();
	},
	//Finds a user in DB by ID

	getUser:async function (req, res, next) {
		let user;
		try{
			user = await User.findById(req.params.id);
			if(user == null){
				return res.status(404).json({msg: 'Cannot find user'});
			}
		}catch(err){
			return res.status(500).json({msg:err.message});
		}
		res.user=user;
		next();
	},
	//Fill games' inventory currently in cart
	fillInventory:async function (req,res,next){
		const defaultAmount = 10;
		const limit =50;
		try{
			res.dbGames.forEach(async elem=>{
				if(elem == null)
					return res.status(404).json({msg: 'Couldnt find game'});
				if(elem.game.inventory.length<limit){
					generateKeys(elem.game,defaultAmount);
				}
			});
		}catch(err){
			return res.status(500).json({ msg: err.message });
		}
		next();
	},

	fillSingleInventory:async function (req,res,next){
		const defaultAmount = 10;
		const limit =50;
		try{
			if(res.game.inventory.length<limit){
				generateKeys(res.game,defaultAmount);
				res.game.save();
			}

		}catch(err){
			return res.status(500).json({ msg: err.message });
		}
		next();
	},

	getGamesFromCart:async function (req, res, next) {
		let dbGames = [];
		try {
			let products = new Cart(req.session.cart).generateArray();
			for(let i =0 ; i<products.length;i++){
				let singleGame = await Game.findById(products[i].item._id);
				if(singleGame == null){
					return res.status(404).json({ msg: 'Cannot find game in DB' });
				}
				dbGames.push({game:singleGame,qty:products[i].qty});

			}
		} catch (err) {
			return res.status(500).redirect('/');
		}
		res.dbGames=dbGames;
		next();
	}
};
