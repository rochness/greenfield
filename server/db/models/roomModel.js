var mongoose = require('mongoose');


var roomSchema = mongoose.Schema({
  roomName: String,
  midPoint: [Number, Number],
  users: [mongoose.model('User').schema],
  venues: { type : Array , "default" : [] },
  selectedVenue: {}
});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;