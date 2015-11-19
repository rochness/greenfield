angular.module('app.maker', ['ngOpenFB'])
.controller('RoomMakerController', ['$scope','$openFB','$location', 'UserHelper', function ($scope, $openFB, $location, UserHelper) {
  $scope.roomName = '';

  $scope.setup = function () {
    console.log($scope.roomName);
    UserHelper.getRoom($scope.roomName);
    $location.path('/room');
  };

  $scope.logout = function () {
    $openFB.logout();
  };
}]);
