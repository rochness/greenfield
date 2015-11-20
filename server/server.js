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

app.get('/google53b80a8d8629a34b.html', function (req, res) {
  res.sendFile('/../client/app/google/google53b80a8d8629a34b.html');
});

var getMidPoint = function (users) {
  var longSum = 0;
  var latSum = 0;
  var totalUsers = 0;
  for(var user in users) {
    longSum += user.longitude;
    latSum += user.latitude;
    totalUsers++;
  }
  return [latSum / totalUsers, longSum / totalUsers];
};

io.on('connection', function (socket) {
  socket.on('init', function (room) {
    socket.join('/' + room);
    storage[room] = {
      users: {},
      midPoint: []
    };
    socket.on('userData', function (user) {
      storage[room][users][user.id] = user;
      storage[room][midPoint] = getMidPoint(storage[room][users]);
      socket.emit('serverData', storage[room]);
    });
    socket.on('logout', function (userId) {
      delete storage[room][users][userId];
      storage[room][midPoint] = getMidPoint(storage[room][users]);
      socket.leave('/' + room);
      socket.emit('serverData', storage[room]);
    });
  });
});

module.exports = app;
