angular.module('app.maker', ['ngOpenFB'])
.controller('RoomMakerController', ['$scope','$openFB','$location', 'UserHelper', function ($scope, $openFB, $location, UserHelper) {
  $scope.roomName = '';

  $scope.setup = function () {
    UserHelper.getRoom($scope.roomName);
    UserHelper.isCreator = true;
    $location.path('/room');
  };

  $scope.logout = function () {
    $openFB.logout();
  };
}]);
