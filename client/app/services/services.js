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

  var setVenues = function (foursquareLocations) {
    venues = foursquareLocations;
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

  return {
    users : users,
    rooms : rooms,
    venues : venues,
    roomData : roomData,
    getFBdata : getFBdata,
    getRoom : getRoom,
    getRoomData : getRoomData,
    sendPrefs : sendPrefs,
    roomDetails : roomDetails,
    setVenues : setVenues
  };

});
