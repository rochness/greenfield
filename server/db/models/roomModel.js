var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
  roomName: String,
  midPoint: [Number, Number],
  users: {}
});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;