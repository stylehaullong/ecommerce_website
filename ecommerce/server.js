var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./models/user');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejs_mate = require('ejs-mate');
var session = require('express-session');
var cookie = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo/es5')(session);
var passport = require('passport');

var secret = require('./config/secret');
var User = require('./models/user');

var app = express();


mongoose.connect(secret.database, function(err) {
  if (err) {
    console.log(err);

  } else {
    console.log('Connected to database');
  }
})


//Middleware
app.use(flash());
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('ejs', ejs_mate);
app.set('view engine', 'ejs');
app.use(cookie());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');


app.use(mainRoutes);
app.use(userRoutes);


app.listen(secret.port, function(err) {
  if (err) throw err;
  console.log('Server is running on ' + secret.port);
});
