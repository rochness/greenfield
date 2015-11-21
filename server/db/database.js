var mongoose = require('mongoose');

// mongoURI = 'mongodb://localhost/lancealot';
mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/converge';
mongoose.connect(mongoURI);

// Run in seperate terminal window using 'mongod'
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
 console.log('Mongodb connection open');
});

module.exports = db;