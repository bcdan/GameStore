const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
// const bodyparser = require('body-parser');
const PORT = process.env.PORT || 5000;

//passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').mongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Mongo DB connected successfully'))
	.catch(err => console.log(err));


//EJS

app.use(expressLayouts);

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//Static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'assets')));



app.set('view engine', 'ejs');



//Express session
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 600000000 },

	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		autoRemove: 'interval',
		autoRemoveInterval: 60 * 24 * 2 // In minutes. Default
	})
}));


//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.session = req.session;
	res.locals.user = req.user;
	next();
});


//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/admin', require('./routes/admin'));

//404 page
app.use((req, res) => {
	res.status(404).render('404', { title: 'Page Not found!',status: req.user });
});


app.listen(PORT, console.log(`server started on port ${PORT}`));
