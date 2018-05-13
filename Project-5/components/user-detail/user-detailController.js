'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;
    var userName =  window.cs142models.userModel(userId).first_name + ' ' +  window.cs142models.userModel(userId).last_name;
    $scope.main.currentView = "Profile of " + userName;
    if ($scope.user === undefined) {
        $scope.user = {};
    }
    $scope.user=window.cs142models.userModel(userId);
    $scope.user.profilePic = window.cs142models.photoOfUserModel(userId)[0].file_name;

    console.log('UserDetail of ', userId);

    console.log('window.cs142models.userModel($routeParams.userId)',
        window.cs142models.userModel(userId));

  }]);
