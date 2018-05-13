'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;
    if ($scope.user === undefined) {
        $scope.user = {};
    }
    var userName =  window.cs142models.userModel(userId).first_name + ' ' +  window.cs142models.userModel(userId).last_name;
    $scope.main.currentView = "Photos of " + userName;
    $scope.userImages=window.cs142models.photoOfUserModel(userId);
    $scope.user.currentPic = window.cs142models.photoOfUserModel(userId)[0].file_name;
    var count = 0;

    $scope.showNextImage = function() {
      count = count+1;
      if (count === $scope.userImages.length) {
        count = 0;
      }
      $scope.user.currentPic = window.cs142models.photoOfUserModel(userId)[count].file_name;
    };

    $scope.showPrevImage = function() {
      count = count-1;
      if (count === -1 ) {
        count = $scope.userImages.length-1;
      }
      $scope.user.currentPic = window.cs142models.photoOfUserModel(userId)[count].file_name;
    };

    $scope.setCurrent = function(id) {
        for(var i=0; i<$scope.userImages.length; i++) {
          if ($scope.userImages[i]._id === id) {
            count=i;
            break;
          }
        }
      $scope.user.currentPic = window.cs142models.photoOfUserModel(userId)[count].file_name;

    };
    if ($scope.currentComments === undefined) {
       $scope.currentComments = {} ;

    }
    $scope.getCurrentComments = function() {
       return window.cs142models.photoOfUserModel(userId)[count].comments;
    };
    $scope.profilePic = function (com) {
      return {image:window.cs142models.photoOfUserModel(com.user._id)[0].file_name,
              name:com.user.first_name+' '+com.user.last_name,
              id:com.user._id
      };
    };



    console.log('UserPhoto of ', $routeParams.userId);

    console.log('window.cs142models.photoOfUserModel($routeParams.userId)',
       window.cs142models.photoOfUserModel(userId));

  }]);
