'use strict';

cs142App.controller('UserCommentsController', ['$scope', '$routeParams', '$resource',
  function($scope, $routeParams, $resource) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;


    if ($scope.user === undefined) {
        $scope.user = {};
    }

    var count = 0;

    $scope.allComments = {};
    $scope.userName = {};
    $scope.profilePicAll = {};


    var User = $resource("http://localhost:3000/user/:id", {id: '@id'});
    var Profile = $resource("http://localhost:3000/profile/:id", {id: '@id'});
    var UserPhotos = $resource("http://localhost:3000/comments");


    // Variables used in templates



    UserPhotos.get({}, function(userPhotoList) {
       userPhotoList=JSON.parse(JSON.stringify(userPhotoList));
       var photosCommented= userPhotoList[userId].photosCommented;
       $scope.user.Photos = photosCommented;
       $scope.userImages = photosCommented;
    });

    Profile.get({id: userId}, function (profileData){
      $scope.profilePic = profileData.file_name;
    });

    User.get({id: userId}, function (info){
      $scope.user_name = info.first_name + ' ' + info.last_name;
      $scope.main.currentView = "Photos with comments of " +  $scope.user_name;
    });


    $scope.getUserName = function (uid) {
       return $scope.userName[uid];
    };

    User.get({id: userId}, function(userInfo) {
      $scope.userName[userId] = userInfo.first_name + ' ' + userInfo.last_name;
    });

  }]);
