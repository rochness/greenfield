angular.module('app.services', [])

.factory('UserHelper', function ($http){
  var users = [];
  var rooms = [];
  var venues = [];
  var roomData = [];

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

  var sendPrefs = function (prefs) {
      return $http({
        method: 'POST',
        url: '/api/search',
        data: prefs
      }).then(function (resp) {
          // $scope.places = resp.results;
          // getVenues($scope.places);
          return resp.results;
          console.log('IN promise');
        }).catch(function (err) {
          console.log('ERRRRR');
          console.error(err);
        });
    };

    var roomDetails;
    socket.on('serverData', function (roomInfo) {
        roomDetails = roomInfo;
    });

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
    roomDetails : roomDetails
  };

});
