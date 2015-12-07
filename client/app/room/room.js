angular.module('app.room', ['ngOpenFB'])
.controller('RoomController', ['$scope','$openFB', '$interval', 'UserHelper', function ($scope, $openFB, $interval, UserHelper) {
  // methods to be used inside map.html
  $scope.user = {};
  $scope.user.id = UserHelper.users[0].id;
  $scope.user.userName = UserHelper.users[0].name;
  $scope.user.userPic = UserHelper.users[0].picture;
  $scope.user.latitude = '';
  $scope.user.longitude = '';
  $scope.user.isCreator = UserHelper.isCreator;
  $scope.roomDetails;
  $scope.hideBtn = true;
  $scope.venuesAdded = false;
  $scope.hideChoice = true;
  $scope.isDisabled = false;
  $scope.resultsDisabled = false;
  $scope.chooseDisabled = true;

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
    console.log('received serverData');
    $scope.$apply(function() {

      $scope.roomDetails = roomInfo;

      if(roomInfo.venues.length !== 0) {
        $scope.places = roomInfo.venues;
        $scope.placeMarkers = $scope.places;
        $scope.venuesAdded = true;
      }

      if(roomInfo.selectedVenue) {
        $scope.placeMarkers = [roomInfo.selectedVenue];
        $scope.hideChoice = false;
      }

      if(roomInfo.venues[0].votes !== 0) {
        $scope.chooseDisabled = false;
      }

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
  };

  $scope.prefs = {};
  $scope.send = function () {
    $scope.prefs.location = $scope.roomDetails.midPoint;
    $scope.prefs.rating = 7;
    console.log('markers: ', $scope.map.markers);
    UserHelper.sendPrefs($scope.prefs)
    .then(function (businesses) {
      $scope.places = [];
      for (var i = 0; i < businesses.slice(0,3).length; i++) {
        var business = {venue:{}};
        business.venue.name = businesses[i].venue.name;
        business.venue.rating = businesses[i].venue.rating;
        business.venue.location = businesses[i].venue.location;
        business.venue.contact = businesses[i].venue.contact;
        business.venue.url = businesses[i].venue.url;
        business.votes = 0;
        $scope.places.push(business);
      }
      $scope.placeMarkers = $scope.places;
      // UserHelper.setVenues($scope.places);
      //emit data to server with roomName and venues
      socket.emit('venues', [$scope.roomName, $scope.places]);
      console.log($scope.places);
    }).then(function () {
      $scope.resultsDisabled = true;
    });
    // if ($scope.venuesAdded) {
    //   $scope.hideBtn = false;
    // }
  };

  $scope.$on('mapInitialized', function (event, map) {
    $scope.map = map;
  });

 $scope.updatePosition = function (event) {
    console.log('dragged: ', [event.latLng.lat(), event.latLng.lng()]);
    $scope.user.latitude = event.latLng.lat();
    $scope.user.longitude = event.latLng.lng();
    socket.emit('userData', [$scope.user, $scope.roomName]);
  };

  $scope.vote = function (){
    socket.emit('venueVote', [$scope.roomName, $scope.places]);
    $scope.isDisabled = true;
  };

  $scope.canDrag = function(roomUser) {
    console.log('roomUser: ', roomUser);
    console.log('user: ', $scope.user);
    if(roomUser.id === $scope.user.id) {
      return true;
    } else {
      return false;
    }
  }

  $scope.showInfoWindow = function (event, place) {
    var infowindow = new google.maps.InfoWindow();
    var center = new google.maps.LatLng(place.venue.location.lat, place.venue.location.lng);
    var name = place.venue.name || '';
    var rating = place.venue.rating || '';
    var address = place.venue.location.address || '';
    var phone = place.venue.contact.formattedPhone || '';
    var url = place.venue.url || '';

    infowindow.setContent(
      '<h5 class="name">' + name + ' // </h5>' +
      '<p class="rating">Foursquare Rating: ' + rating + '</p>' +
      '<p class="address">' + address + '</p>' +
      '<p class="phone">' + phone + '</p>' +
      '<a class="link" href="' + url +'">' + url + '</p>');

    infowindow.setPosition(center);
    infowindow.open($scope.map);
  };

  $scope.selected = {};
  $scope.choose = function () {
    socket.emit('venueSelected', [$scope.selected, $scope.roomName]);
    $scope.hideChoice = false;
    socket.emit('venueSelected', [$scope.roomName, $scope.selected]);
  };
}]);

