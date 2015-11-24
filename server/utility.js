var User = require('./db/models/userModel');
var Room = require('./db/models/roomModel');
var mongoose = require('mongoose');



var getMidPoint = function (users) {
  var longSum = 0;
  var latSum = 0;
  var totalUsers = 0;

  if(users.length === 0){
    return [];
  }

  for(var i = 0; i < users.length; i++) {
    longSum += Number(users[i].longitude);
    latSum += Number(users[i].latitude);
    totalUsers++;
  }

  return [latSum / totalUsers, longSum / totalUsers];
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

exports.removeUserFromRoom = function (user, room, cb) {
  Room.findOne({roomName: room.roomName}).exec(function(err, room) {
    var indexOfUser = getUserIndex(room.users, user._id);
    var newUsers = room.users.splice(indexOfUser,1);
    Room.update({_id: room._id}, { $set: {users: newUsers}}, function (err, updatedRoom) {
      if(err){
        cb(err, updatedRoom);
      } else {
        cb(err, updatedRoom);
      }
    });
  });
};

exports.updateOrCreateRoom = function (user, cb) {
  Room.findOne({roomName: user.roomName}).exec(function(err, room) {
    if(err) {
      console.log('error finding room: ', err);
    } else {
      if(room === null){
        //create new room
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



