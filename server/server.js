var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var bodyParser = require('body-parser');
var utils = require('./utility');
var db = require('./db/database');
var Room = require('./db/models/roomModel');
var User = require('./db/models/userModel');
require('newrelic');


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

io.sockets.on('connection', function (socket) {
  socket.on('init', function (room) {
    socket.join('/' + room);
    socket.emit('joinedRoom', room);
    console.log('joined room: ', room);
  });

    socket.on('userData', function (userInfo) {
    //userInfo is an array that contains info about the user/room ---> userInfo = [$scope.user, roomName]
      if(!userInfo) {
        console.log('user is undefined');
      }
      else {
        utils.updateOrCreateUser(userInfo, function(err, user){
          if(err) {
            console.log('error updating/creating user: ', err);
          } else {
            //user exists & user wants to join a different room
            utils.updateOrCreateRoom(user, function (err, room) {
              if(err){
                console.log('error updating/creating room', err);

              } else {
                io.sockets.in('/' + room.roomName).emit('serverData', room);
                // console.log('emiting serverData after receiving userData', room.roomName);
              }
            });
          }
        });
      }
    });

    socket.on('venues', function (roomAndVenues) {
      //find room and add venues to roomDoc
      utils.addVenuesToRoom(roomAndVenues, function (err, updatedRoom) {
        if(err) {
          console.log('error adding venues to room');
        } else {
          //emit serverData with room info
          io.sockets.in('/' + updatedRoom.roomName).emit('serverData', updatedRoom);
        }
      });
    });

    socket.on('venueVote', function (roomAndVenues) {
      utils.updateVenues(roomAndVenues, function (err, updatedRoom) {
        if(err) {
          console.log('error adding venues to room');
        } else {
          io.sockets.in('/' + updatedRoom.roomName).emit('serverData', updatedRoom);
        }
      });
    });

    socket.on('venueSelected', function (roomAndSelection) {
      utils.setSelectedVenue(roomAndSelection, function (err, updatedRoom) {
        if(err) {
          console.log('error adding venues to room');
        } else {
          io.sockets.in('/' + updatedRoom.roomName).emit('serverData', updatedRoom);
          console.log('room after venue selection: ', updatedRoom.venues);
        }
      });
    });

    socket.on('logout', function (userInfo) {
      console.log('logout params: ', userInfo);
      utils.removeUserFromRoom(userInfo[0], userInfo[1], function (err, updatedRoom) {
        if(err) {
          console.log('error removing user from room: ', err);
        } else {
          socket.emit('serverData', room);
        }
      });
      socket.leave('/' + room);
    });

  });
// });


module.exports = app;
