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
  $scope.roomDetails;

  // $scope.roomCode = (parseInt(Math.random()*10000000)).toString();

  $scope.intervalFunc;

  $scope.locationCheck = function () {
    console.log('locationCheck called');
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
      socket.emit('userData', [$scope.user, $scope.roomName]);
      console.log('userData emitted');
    };
    navigator.geolocation.getCurrentPosition(geoSuccess);

  };

  socket.on('serverData', function (roomInfo) {
    $scope.$apply(function() {
      $scope.roomDetails = roomInfo;
      console.log('roomDetails from serverData: ', $scope.roomDetails);
    });
  });

  socket.on('joinedRoom', function (room) {
    $scope.locationCheck();
  });

  $scope.logOut = function (fb) {
    $interval.cancel($scope.intervalFunc);
    socket.emit('logout', [$scope.user, $scope.roomName]);
    if (fb) {
      $openFB.logout();
    }
  };

  $scope.init = function () {
    //if isCreator is true, set roomName to equal a random roomCode
    if($scope.user.isCreator) {
      $scope.roomName = (parseInt(Math.random()*10000000)).toString();
    } else {
    //otherwise, roomName is equal to what the user entered in the input field (UserHelper.rooms[0])
      $scope.roomName = UserHelper.rooms[0];
    }
    //tells server that user wants to join specified room
    socket.emit('init', $scope.roomName);
    // $scope.intervalFunc = $interval($scope.locationCheck, 3000);
  };
// }])
// .controller('preferenceController', ['$scope', 'UserHelper', function ($scope, UserHelper) {

  $scope.prefs = {};
  $scope.send = function () {
    // var roomDetails = UserHelper.getRoomDetails();
    $scope.prefs.location = $scope.roomDetails.midPoint;
    $scope.prefs.rating = parseFloat($scope.prefs.rating).toFixed(1);
    UserHelper.sendPrefs($scope.prefs)
    .then(function (businesses) {
      $scope.places = businesses;
      UserHelper.setVenues($scope.places);
    });
  };


  $scope.$on('mapInitialized', function (event, map) {
    $scope.map = map;
    console.log('when does mapInitialized happen?');
  });

  $scope.showInfoWindow = function (event, place) {
    var infowindow = new google.maps.InfoWindow();
    var center = new google.maps.LatLng(place.venue.location.lat, place.venue.location.lng);
    var name = place.venue.name || '';
    var rating = place.venue.rating || '';
    var address = place.venue.location.address || '';
    var phone = place.venue.contact.formattedPhone || '';
    var url = place.venue.url || '';

    infowindow.setContent(
      '<h5 class="name">' + name + ' // ' + rating +'</h5>' +
      '<p class="address">' + address + '</p>' +
      '<p class="phone">' + phone + '</p>' +
      '<a class="link" href="' + url +'">' + url + '</p>');

    infowindow.setPosition(center);
    infowindow.open($scope.map);
  };

}]);

