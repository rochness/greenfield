var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

var server = require('http').createServer(app);
var io = require('socket.io')(server);

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
