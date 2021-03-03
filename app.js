const express = require('express'); // server software
const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login');// authorization

const User = require(__dirname + '/models/user.js'); // User Model

var charactersRouter = require(__dirname + '/routes/characters');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure Sessions Middleware
app.use(session({
  secret: 's9q,-&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Configure Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(User.model.createStrategy());

// To use with sessions
passport.serializeUser(User.model.serializeUser());
passport.deserializeUser(User.model.deserializeUser());

// Route to Homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

// Route to Login Page
app.get('/mustlogin', (req, res) => {
  res.send(`Hello friend, you really must be logged in to see this.<br><br>
  <a href="login">Log In</a>`);
});

// Route to Login Page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/static/login.html');
});

// Route to Dashboard
app.get('/dashboard', connectEnsureLogin.ensureLoggedIn('/mustlogin'), (req, res) => {
  User.incrementVisits(req.user.username);
  res.send(`Hello ${req.user.username}, this is your ${req.user.visits} visit. <br>Your session ID is ${req.sessionID} 
  and your session expires in ${req.session.cookie.maxAge} 
  milliseconds.<br>
  <a href="characters">Click here to access the API</a>
  <br><br>
  <a href="logout">Log Out</a><br>`);
});

// Route to Log out
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

// Post Route: /login
app.post('/login', passport.authenticate('local', { failureRedirect: '/failed' }),  function(req, res) {
	// console.log(req.user)
	res.redirect('/dashboard');
});

app.get('/failed', (req, res) => {
  res.send(`Wrong username or password.<br><br>
    <a href="login">Log In</a>`);
});

// Route to Users
app.use('/characters', charactersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('Error!');
});

module.exports = app;
