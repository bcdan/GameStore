const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');

exports.getLoginPage = ((req,res)=>{
	res.render('login',{title:'Login'});
});
exports.getRegisterPage = ((req,res)=>{
	res.render('register',{title:'Register'});
});

exports.registerUser = ((req, res) => {
	const { firstName, lastName, email, password, password2 } = req.body;
	let errors = [];

	if (!firstName || !lastName || !email || !password || !password2) {
		errors.push({ msg: 'Please enter all fields' });
	}

	if (password != password2) {
		errors.push({ msg: 'Passwords do not match' });
	}

	if (password.length < 6) {
		errors.push({ msg: 'Password must be at least 6 characters' });
	}

	if (errors.length > 0) {
		res.render('register', {
			title:'Register',
			errors,
			firstName,
			lastName,
			email,
			password,
			password2
		});
	} else {
		User.findOne({ email: email }).then(user => {
			if (user) {
				errors.push({ msg: 'Email already exists' });
				res.render('register', {
					title:'Register',
					errors,
					firstName,
					lastName,
					email,
					password,
					password2
				});
			} else {
				const newUser = new User({
					firstName,
					lastName,
					email,
					password
				});

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser
							.save()
							.then(() => {
								req.flash(
									'success_msg',
									'You are now registered and can log in'
								);
								res.redirect('/users/login');
							})
							.catch(err => console.log(err));
					});
				});
			}
		});
	}
});

exports.handleLogin = ((req,res,next)=>{
	passport.authenticate('local', function(err, user,info) {
		let errors = [];
		if (err) {
			errors.push({msg:info.message});
			return res.status(401).render('login',{title:'Login',errors});
		}
		if (!user) {
			errors.push({msg:info.message});
			return res.status(401).render('login',{title:'Login',errors});
		}
		req.logIn(user, function(err) {
			if (err) {
				errors.push({msg:info.message});
				return res.status(401).render('login',{title:'Login',errors});
			}
			req.session.save(function(){ // Known error using express session -> this solves the issue
				return res.status(200).redirect('/dashboard');
			});
		});
	})(req, res, next);
});

exports.handleLogout = ((req, res) => {
	req.logOut();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

