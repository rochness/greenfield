angular.module('app.room', ['ngOpenFB'])
.controller('RoomController', ['$scope', '$openFB', '$interval', 'UserHelper', function ($scope, $openFB, $interval, UserHelper) {
  // methods to be used inside map.html
  $scope.user = {};
  $scope.user.id = UserHelper.users[0].id;
  $scope.user.userName = UserHelper.users[0].name;
  $scope.user.userPic = UserHelper.users[0].picture;
  $scope.user.latitude = '';
  $scope.user.longitude = '';
  $scope.user.isCreator = UserHelper.isCreator;

  $scope.locations = [];
  $scope.roomName = "";
  $scope.roomDetails;
  $scope.intervalFunc;

  socket.on('serverData', function (roomInfo) {
    $scope.roomDetails = roomInfo;
  });

  $scope.locationCheck = function () {
    if (navigator.geolocation) {
      console.log('Geolocation is supported!');
    } else {
      console.log('Geolocation is not supported for this Browser/OS version yet.');
    }

    var startPos;
    var geoSuccess = function (position) {
      startPos = position;
      $scope.user.latitude = startPos.coords.latitude;
      $scope.user.longitude = startPos.coords.longitude;
      socket.emit('userData', $scope.user);
    };
    navigator.geolocation.getCurrentPosition(geoSuccess);
  };
  $scope.locationCheck();

  $scope.logOut = function (fb) {
    $interval.cancel($scope.intervalFunc);
    socket.emit('logout', $scope.user.id);
    if (fb) {
      $openFB.logout();
    }
  };

  $scope.init = function () {
    $scope.roomName = UserHelper.rooms[0];
    socket.emit('init', UserHelper.rooms[0]);
    $scope.intervalFunc = $interval($scope.locationCheck, 3000);
  };
}]);
