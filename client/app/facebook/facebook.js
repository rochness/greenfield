angular.module('app.facebook', ['ngOpenFB'])
.controller('FacebookController', ['$scope', '$openFB', 'UserHelper', '$location', function ($scope, $openFB, UserHelper, $location) {
    $scope.me = {};
    $scope.hideJoin = true;

    $scope.showJoin = function () {
      $scope.hideJoin = false;
      console.log("CALLED ", $scope.hideJoin)
    };

    $scope.setRoom= function () {
      UserHelper.getRoom($scope.roomName);
      UserHelper.isCreator = false;
      $location.path('/roomGuest');
    };

    $scope.logout = function () {
      $openFB.logout();
    };

    $openFB.init({appId: '1618252011782684'}); // theirs: 909462752470016 / ours: 1618252011782684 / test: 1861162570794799

    $openFB.login({scope: 'email, user_friends'})
    .then(function (res) {
      $openFB.api({path: '/me'})
      .then(function (res) {
        angular.extend($scope.me, res);
      }, function (err) {
        console.log(err);
      });

      $openFB.api({path: '/me/friends'})
      .then(function (res) {
        angular.extend($scope.me, res);
      }, function (err) {
        console.log(err);
      });

      $openFB.api({
        path: '/me/picture',
        params: {
          redirect: false,
          height: 50,
          width: 50
        }
      }).then(function (res) {
          angular.extend($scope.me, {picture: res.data.url});
          UserHelper.getFBdata($scope.me);
        }).then(function () {
          $location.path('/facebook');
        });
    });
  }
]);
