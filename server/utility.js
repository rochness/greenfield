var User = require('./db/models/userModel');
var Room = require('./db/models/roomModel');
var mongoose = require('mongoose');



exports.getMidPoint = function (users) {
  var longSum = 0;
  var latSum = 0;
  var totalUsers = 0;

  if(users.length === 0){
    return [];
  }

  for(var i = 0; users.length; i++) {
    longSum += users[i].longitude;
    latSum += users[i].latitude;
    totalUsers++;
  }

  return [latSum / totalUsers, longSum / totalUsers];
};

exports.removeUserFromRoom = function (user, room, cb) {

};

var updateUserInRoom = function (roomUsers, user) {
  var result = roomUsers.slice();
  var found = false;
  for(var i = 0; i < roomUsers.length; i++){
    if(roomUsers[i] === user){
      found = true;
      result[i] = user;
    }
  }
  if(found === false){
    result.push(user);
  }
  return result;
};

exports.updateOrCreateRoom = function (user, cb) {
  Room.find({roomName: user.roomName}).exec(function(err, room) {
    if(err) {
      console.log('error finding room: ', err);
    } else {
      if(room.length === 0){
        //create new room
        var newRoom = Room({
          roomName: user.roomName,
          users: [user],
          midPoint: [user.latitude, user.longitude]
        });

        newRoom.save(function(err, room){
          if(err) {
            // console.log('error saving room: ', err);
            cb(err, room);
          } else {
            cb(err, room);
          }
        });

      } else {
        room.users = updateUserInRoom(room.users, user);
        room.midPoint = getMidPoint(room.users);
        room.save(function(err, room) {
          if(err){
            cb(err);
          } else {
            cb(room);
          }
        });
      }
    }
  });
};

exports.updateOrCreateUser = function (userInfo, cb) {
  User.find({_id: userInfo[0].id}).exec(function(err, foundUser) {
    if(err) {
      cb(err);
    } else {
      if(foundUser.length === 0){
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
        console.log(foundUser);
        foundUser.longitude = userInfo[0].longitude;
        foundUser.latitude = userInfo[0].latitude;
        console.log('foundUser when found: ', foundUser);
        foundUser.save(function(err, updatedUser) {
          if(err) {
            cb(err);
          } else {
            cb(updatedUser);
          }
        });
      }
    }
  });
};



