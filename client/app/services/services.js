angular.module('app.services', [])

.factory('UserHelper', function ($http){
  var users = [];
  var rooms = [];
  var isCreator = false;

  var getFBdata = function (val) {
    users.push(val);
  };

  var getRoom = function (val) {
    rooms[0] = val;
  };

  var getLocations = function (location, preferences) {
    

  };


  return {
    users : users,
    rooms : rooms,
    getFBdata : getFBdata,
    getRoom : getRoom,
    getLocations: getLocations,
    isCreator: isCreator
  };

});
