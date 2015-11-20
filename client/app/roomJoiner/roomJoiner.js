angular.module('app.joiner', ['ngOpenFB'])
.controller('RoomJoinerController', ['$scope','$openFB','$location', 'UserHelper', function ($scope, $openFB, $location, UserHelper) {
  $scope.roomName = '';

  $scope.setRoom= function () {
    UserHelper.getRoom($scope.roomName);
    UserHelper.isCreator = false;
    $location.path('/room');
  };

  $scope.logout = function () {
    $openFB.logout();
  };
}]);