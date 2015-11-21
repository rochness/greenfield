var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var bodyParser = require('body-parser');

// foursquare setup
var client_id = 'A5JM0WSUSW01TCZ35IA3NFNE211T5OQLUO5ZOSBKZAVSXN0B';
var client_secret = 'A1TTNAAWPGCPIWTXI1F0VSQBUB5PZ5RDR0VP2WVMJC3JVSXZ';
var foursquare = require('foursquarevenues')(client_id, client_secret);
var API = require('./api-handler');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client'));

server.listen(port);

var storage = {};

app.get('/google53b80a8d8629a34b.html', function (req, res) {
  res.sendFile('/../client/app/google/google53b80a8d8629a34b.html');
});

app.post('/api/search', function (req, res, next) {

  // building options for our initial api query
  var options = {};
  options.query = req.body.query;
  options.ll = req.body.location.join(', ');

  // defining what we want to filter and sort by
  var rating = req.body.rating;
  var price = req.body.price;

  foursquare.exploreVenues(options, function(err, data) {
    if (err) return res.status(400).send(err);

    // sending back a filtered + sorted list of venues
    res.status(200).send({ results: API.processResults(req, data, price, rating) });
  });

});

var getMidPoint = function (users) {
  var longSum = 0;
  var latSum = 0;
  var totalUsers = 0;
  for(var user in users) {
    console.log('object type of longitude: ', users);
    longSum += users[user].longitude;
    latSum += users[user].latitude;
    totalUsers++;
  }

  return [latSum / totalUsers, longSum / totalUsers];
};

io.on('connection', function (socket) {
  socket.on('init', function (room) {
    socket.join('/' + room);
    if(!storage[room]) {
      storage[room] = {
        users: {},
        midPoint: []
      };
    }
    
    socket.on('userData', function (user) {
      if(!user) {
        console.log('user is undefined');
      }
      else {
        storage[room]['users'][user.id] = user;
        storage[room]['midPoint'] = getMidPoint(storage[room].users);
        socket.emit('serverData', storage[room]);
      }
    });

    socket.on('logout', function (userId) {
      delete storage[room][users][userId];
      storage[room][midPoint] = getMidPoint(storage[room][users]);
      socket.leave('/' + room);
      socket.emit('serverData', storage[room]);
    });
  });
});

// setInterval(function(){console.log('storage', storage)}, 5000);

module.exports = app;
