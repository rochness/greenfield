var User = require('./db/models/userModel');
var Room = require('./db/models/roomModel');
var mongoose = require('mongoose');
var _ = require('underscore');

var dataPoints = [];

// calculates the median value of a given data set
var medianCalc = function (set) {
  var length = set.length;
  return length % 2 === 1 ? set[(length - 1) / 2] : (set[(length / 2) - 1] + set[length / 2]) / 2;
};

// finds the outlier in a group of 3 or 4 users
var maxDist = function (users) {
  var length = users.length;
  var median = medianCalc(dataPoints);
  var dist1 = Math.abs(dataPoints[0] - median);
  var dist2 = dataPoints[length - 1] - median;

  if (dist1 > dist2) {
    users[0].outlier = true;
  } else {
    users[length - 1].outlier = true;
  }
};

// finds all outliers in a group of users exceeding 4 people using a boxplot
var boxPlot = function (data) {
  var min = data[0];
  var max = data[data.length - 1];
  var median = medianCalc(data);
  var medIndex = Math.floor((data.length - 1) / 2);
  var Q1, Q3, IQR;

  // determines first and third quartiles based on group size (odd or even)
  if (data.length % 2 === 1) {
    Q1 = medianCalc(data.slice(0, medIndex));
    Q3 = medianCalc(data.slice(medIndex + 1));
  } else {
    Q1 = medianCalc(data.slice(0, medIndex + 1));
    Q3 = medianCalc(data.slice(medIndex + 1));
  }

  // interquartile range
  IQR = Q3 - Q1;

  // assigns outlier property to user if data point is outside the quartile fences
  _.map(users, function (user) {
    if (user.dataPoint < (Q1 - (1.5 * IQR)) || user.dataPoint > (Q3 + (1.5 * IQR))) {
      user.outlier = true;
    }
  });
};

// finds midpoint location for venue query using group size and weighted means based on outlier status
var getMidPoint = function (users) {
  var longWeight = 0;
  var latWeight = 0;
  var weightedLongSum = 0;
  var weightedLatSum = 0;

  if (users.length === 0) {
    return [];
  }

  // calculates unique data point for each user using both latitude and longitude
  _.map(users, function (user) {
    user.dataPoint = Math.abs(user.longitude + user.latitude);
    dataPoints.push(user.dataPoint);
  });

  dataPoints = dataPoints.sort(function (x, y) {
    return x - y;
  });

  // only use boxplot for groups larger than 4
  if (users.length > 2 && users.length <= 4) {
    maxDist(users);
  } else if (users.length > 4) {
    boxPlot(dataPoints);
  }

  // weighted mean calculation based on user's outlier status
  for (var i = 0; i < users.length; i++) {
    if (users[i].outlier) {
      weightedLongSum += Number(users[i].longitude);
      longWeight++;
      weightedLatSum += Number(users[i].latitude);
      latWeight++;
    } else {
      weightedLongSum += (Number(users[i].longitude) * 2);
      longWeight += 2;
      weightedLatSum += (Number(users[i].latitude) * 2);
      latWeight += 2;
    }
  }
  return [weightedLatSum / latWeight, weightedLongSum / longWeight];
};

var updateUserInRoom = function (roomUsers, user) {
  var result = roomUsers.slice();
  var found = false;
  for(var i = 0; i < roomUsers.length; i++){
    if(roomUsers[i]._id === user._id){
      found = true;
      result[i] = user;
    }
  }
  if(found === false){
    result.push(user);
  }
  return result;
};

var getUserIndex = function(roomUsers, userId) {
  for(var i = 0; i < roomUsers.length; i++) {
    if(roomUsers[i]._id == userId){
      return i;
    }
  }
  return null;
};

exports.removeUserFromRoom = function (user, roomName, cb) {
  Room.findOne({roomName: roomName}).exec(function(err, room) {
    if(err){
      cb(err, room);
    } else {
      var indexOfUser = getUserIndex(room.users, user._id);
      room.users.splice(indexOfUser,1);
      room.save(function (err, updatedRoom) {
        if(err){
          cb(err, updatedRoom);
        } else {
          cb(err, updatedRoom);
        }
      });
    }
  });
};

exports.updateOrCreateRoom = function (user, cb) {
  // console.log('user.roomName in update/createRoom util: ', user.roomName);
  Room.findOne({roomName: user.roomName}).exec(function(err, room) {
    if(err) {
      console.log('error finding room: ', err);
    } else {
      if(room === null){
        //create new room
        // console.log('room is null? ', user.roomName);
        var newRoom = Room({
          roomName: user.roomName,
          users: [user],
          midPoint: [user.latitude, user.longitude]
        });

        newRoom.save(function(err, room){
          if(err) {
            console.log('error saving room: ', err);
            cb(err, room);
          } else {
            cb(err, room);
          }
        });

      } else {
        var updatedUsers = updateUserInRoom(room.users, user);
        var updatedMid = getMidPoint(updatedUsers);
        room.users = updatedUsers;
        room.midPoint = updatedMid;
        room.save( function (err, room) {
          if(err){
            cb(err, room);
          } else {
            cb(err, room);
          }
        });
      }
    }
  });
};

exports.addVenuesToRoom = function(roomAndVenues, cb) {
  Room.findOne({roomName: roomAndVenues[0]}).exec(function(err, room) {
    if(err) {
      console.log('error finding room: ', err);
  } else {
      room.venues = roomAndVenues[1];
      room.save( function (err, room) {
        if(err){
          cb(err, room);
        } else {
          cb(err, room);
        }
      });
    }
  });
};

exports.updateVenues = function (roomAndVenues, cb) {
  console.log('updateVenues called');
  Room.findOne({roomName: roomAndVenues[0]}).exec(function(err, room) {
    if(err) {
      console.log('error finding room: ', err);
  } else {
      for (var i = 0; i < 3; i++) {
        console.log('before adding vote, venue: ' + room.venues[i].venue.name + ' votes: ' + room.venues[i].votes);
        room.venues[i].votes += Number(roomAndVenues[1][i].votes); 
        console.log('adding: ', Number(roomAndVenues[1][i].votes));
        console.log('after adding vote, venue: ' + room.venues[i].venue.name + ' votes: ' + room.venues[i].votes);
      }
      room.markModified('venues');
      room.save( function (err, room) {
        if(err){
          cb(err, room);
        } else {
          cb(err, room);
        }
      });
    }
  });
};

exports.setSelectedVenue = function (roomAndSelection, cb) {
  Room.findOne({roomName: roomAndSelection[0]}).exec(function(err, room) {
    if(err) {
      console.log('error finding room: ', err);
  } else {
      //find the venue object given the selection venue name from client side
      for(var i = 0; i < room.venues.length; i++) {
        if(room.venues[i].venue.name === roomAndSelection[1].name) {
          room.selectedVenue = room.venues[i];
        }
      }
      room.save( function (err, room) {
        if(err){
          cb(err, room);
        } else {
          cb(err, room);
        }
      });
    }
  });
};

exports.updateOrCreateUser = function (userInfo, cb) {
  User.findOne({_id: userInfo[0].id}).exec(function(err, foundUser) {
    if(err) {
      cb(err);
    } else {
      if(foundUser === null){
        //create new user
        var newUser = User({
                _id: userInfo[0].id,
                userName: userInfo[0].userName,
                userPic: userInfo[0].userPic,
                latitude: userInfo[0].latitude,
                longitude: userInfo[0].longitude,
                isCreator: userInfo[0].isCreator,
                roomName: userInfo[1]
              });
        newUser.save(function(err, newUser) {
          if(err) {
            cb(err, newUser);
          } else {
            cb(err, newUser);
          }
        });
      } else {
        //update user's long & lat
        foundUser.roomName = userInfo[1];
        foundUser.longitude = userInfo[0].longitude;
        foundUser.latitude = userInfo[0].latitude;
        foundUser.save(function(err, newUser) {
          if(err) {
            cb(err, newUser);
          } else {
            cb(err, newUser);
          }
        });
      }
    }
  });
};



