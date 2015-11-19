angular.module('app.services', [])

.factory('UserHelper', function ($http){
  var users = [];
  var rooms = [];

  var getFBdata = function (val) {
    users.push(val);
  };

  var getRoom = function (val) {
    rooms[0] = val;
  };

  return {
    users : users,
    rooms : rooms,
    getFBdata : getFBdata,
    getRoom : getRoom
  };

});
