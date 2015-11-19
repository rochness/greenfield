angular.module('app', [
  'app.facebook',
  'app.home',
  'app.room',
  'app.maker',
  'app.services',
  'ngRoute',
  'ngMap'
])
.config(function ($routeProvider, $httpProvider) {

  $routeProvider
    .when('/', {
      redirectTo: '/home'
    })
    .when('/home', {
      templateUrl: 'app/home/home.html',
      controller: 'HomeController'
    })
    .when('/facebook', {
      templateUrl: 'app/facebook/facebook.html',
      controller: 'FacebookController'
    })
    .when('/room', {
      templateUrl: 'app/room/room.html',
      controller: 'RoomController'
    })
    .when('/roomMaker', {
      templateUrl: 'app/roomMaker/roomMaker.html',
      controller: 'RoomMakerController'
    })
    .when('/logout', {
      redirectTo: '/home'
    })
    .otherwise({
      redirectTo: '/home'
    });

});
