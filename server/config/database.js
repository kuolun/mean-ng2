
var mongoose = require('mongoose');

var dbURI = "mongodb://kuolun:kuolun@ds159767.mlab.com:59767/mean276";

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error ' + err);
});
