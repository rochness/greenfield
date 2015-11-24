var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  _id: String,
  userName: String,
  userPic: String,
  latitude: String,
  longitude: String,
  isCreator: Boolean,
  roomName: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;