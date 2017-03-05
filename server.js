var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var cors = require('cors');

const path = require('path');
var morgan = require('morgan');

require('./server/config/database');

var bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(cors());

// FB authentication
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// 設定passport及route
require('./server/config/passport')(passport);

// read cookies (needed for auth)
app.use(cookieParser());

//for application/json type request
app.use(bodyParser.json());


//for postman x-www-form-urlencoded type request
app.use(bodyParser.urlencoded({
  extended: true
}));

//=====================
//==Passport Setting===
//=====================
// required for passport
app.use(session({
  secret: 'ilovekk',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());

var apiRoutes = require('./server/api/api');


//static file
app.use(express.static(__dirname + '/server/public'));

//ag2 static file
app.use(express.static(path.join(__dirname, 'dist')));

//localos:3000/api/xxxxx
app.use('/api', apiRoutes);

//routes
require('./server/app/routes')(app, passport);



//launch==================================================
app.listen(port, function () {
  console.log('Server is running on port ' + port + '..........');

});
