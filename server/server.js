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
