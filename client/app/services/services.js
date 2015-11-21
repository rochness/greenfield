angular.module('app.services', [])

.factory('UserHelper', function ($http){
  var users = [];
  var rooms = [];
  var venues = [];
  var roomData = [];
  var roomDetails;

  var getFBdata = function (val) {
    users.push(val);
  };

  var getRoom = function (val) {
    rooms[0] = val;
  };

  var getRoomData = function (socketResponse) {
    roomData = socketResponse;
  };

  var getVenues = function (foursquareLocations) {
    venues = foursquareLocations;
    console.log(venues);
  };

  var sendPrefs = function (prefs) {
      return $http({
        method: 'POST',
        url: '/api/search',
        data: prefs
      }).then(function (resp) {
          return resp.data.results;
        }).catch(function (err) {
          console.error(err);
        });
    };

  socket.on('serverData', function (roomInfo) {
    roomDetails = roomInfo;
  });

  var getRoomDetails = function () {
    return roomDetails;
  };

  return {
    users : users,
    rooms : rooms,
    venues : venues,
    roomData : roomData,
    getFBdata : getFBdata,
    getRoom : getRoom,
    getRoomData : getRoomData,
    getVenues : getVenues,
    sendPrefs : sendPrefs,
    getRoomDetails : getRoomDetails
  };

});
