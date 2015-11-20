var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});

app.use(express.static(__dirname + '/../client'));

var yelp = require("node-yelp");
var keys = require("../keys.js");

var yelpClient = yelp.createClient({
  oauth: {
    consumer_key: keys.yelp.consumer_key,
    consumer_secret: keys.yelp.consumer_secret,
    token: keys.yelp.token,
    token_secret: keys.yelp.token_secret
  }
});

app.get('/api/yelp', function(req, res, next) {

  var options = {};
  options.term = req.body.term;
  options.ll = req.body.location.join(", ");
  options.is_closed = "false";

  yelpClient.search(options)
  .then(function(results) {
    res.status(200).json({results: results});
  })
  .catch(function(err) {
    res.status(400).send(err);
  })

})

server.listen(port);

var storage = {};

io.on('connection', function (socket) {
  socket.on('init', function (room) {
    socket.join('/' + room);
    storage[room] = {};
    socket.on('userData', function (user) {
      storage[room][user.id] = user;
      socket.emit('serverData', storage[room]);
    });
    socket.on('logout', function (user) {
      delete storage[room][user];
      socket.leave('/' + room);
      socket.emit('serverData', storage[room]);
    });
  });
});

module.exports = app;
