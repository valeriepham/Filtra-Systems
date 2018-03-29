require('dotenv').load();
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let mongoose = require('mongoose');
let session = require('express-session');
let flash = require('connect-flash');
let passport = require('passport');
let User = require('./models/user');
let Cart = require('./models/cart');

let MongoStore = require('connect-mongo')(session);

let bcrypt = require('bcrypt');
let index = require('./routes/index');
let users = require('./routes/users');
let products = require('./routes/products');
let catalog = require('./routes/catalog');

// setup database connection
mongoose.connect('mongodb://michael:michael1@ds127139.mlab.com:27139/soba-filtra');
var db = mongoose.connection;

// check for successful connection
db.on('error', function (msg) {
  console.log('Mongoose connection error %s', msg);
});
db.once('open', function () {
  console.log('Mongoose connection established');
});

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function getDatabaseUrl() {
  if (process.env.NODE_ENV === "production") {
    return process.env.PRODUCTION_DATABASE_URL;
  } else {
    return process.env.TEST_DATABASE_URL;
  }
}

const days = 24 * 60 * 60 * 1000;
app.use(session({
  secret: process.env.APP_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1 * days },
  store: new MongoStore({ mongooseConnection: db }),
}));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.message = req.flash();
  next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.session = req.session;
  next();
});


app.use('/', index);
app.use('/products', products);
app.use('/catalog', catalog);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;