'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams', '$resource',
  function ($scope, $routeParams, $resource) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;
    if ($scope.user === undefined) {
        $scope.user = {};
    }

    var User = $resource("http://localhost:3000/user/:id", {id: '@id'});
    var Profile = $resource("http://localhost:3000/profile/:id", {id: '@id'});
    User.get({id: userId}, function(userInfo) {
      $scope.userName = userInfo.first_name + ' ' + userInfo.last_name;
      $scope.main.currentView = "Profile of " + $scope.userName;
      $scope.user = userInfo;
    });

    Profile.get({id: userId}, function(profileData) {
        $scope.user.profilePic = profileData.file_name;
    });
  }]);
