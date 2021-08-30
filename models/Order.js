const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
	user:{
		type:mongoose.Schema.Types.ObjectId, 
		ref:'User'
	},
	cart:{
		type: Object,
		required:true
	},
	address : {
		type:String , 
		required:true
	},
	name:{
		type:String , 
		required:true
	},
	paymentId: {
		type:String,
		required:true
	},
	
	
});


const Order = mongoose.model('Order',OrderSchema);

module.exports = Order;
