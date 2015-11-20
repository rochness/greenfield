angular.module('app.services', [])

.factory('UserHelper', function ($http){
  var users = [];
  var rooms = [];
  var venues = [];
  var roomData [];

  var getFBdata = function (val) {
    users.push(val);
  };

  var getRoom = function (val) {
    rooms[0] = val;
  };

  var getRoomData = function (socketResponse) {
    roomData = socketResponse;
  }

  var getVenues = function (foursquareLocations) {
    venues = foursquareLocations;
  };

  return {
    users : users,
    rooms : rooms,
    venues : venues,
    roomData : roomData,
    getFBdata : getFBdata,
    getRoom : getRoom,
    getRoomData : getRoomData,
    getVenues: getVenues
  };

});
