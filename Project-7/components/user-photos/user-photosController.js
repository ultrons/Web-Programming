'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', '$resource', '$location', '$route', '$rootScope',
  function($scope, $routeParams, $resource, $location, $route, $rootScope) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;

   //
       console.log("Reloading ...", $scope.main.AppState);
    if (!$scope.main.AppState) {
       console.log("LOadding State from Local Storage");
       $scope.main.AppState = JSON.parse(window.localStorage.getItem('loginState'));
    }


    if ($scope.user === undefined) {
        $scope.user = {};
    }

    var count = 0;

    $scope.profilePicAll = {};
    $scope.allComments = {};
    $scope.userName = {};
    $scope.commentState = {};
    $scope.commentString = {};

    var User = $resource("http://localhost:3000/user/:id", {id: '@id'});
    var Profile = $resource("http://localhost:3000/profile/:id", {id: '@id'});
    var UserPhotos = $resource("http://localhost:3000/photosOfUser/:id", {id: '@id'});


    // Variables used in templates

    $scope.processComment = function (photo) {
       if ($scope.commentState[photo._id] === 'submit') {
       if ($scope.commentString[photo._id] === undefined || $scope.commentString[photo._id] === "") return;
       var com = {
           comment: $scope.commentString[photo._id],
           date_time: Date.now(),
           user_id:$scope.main.AppState.user_id
         };
       $resource('/commentsOfPhoto/'+photo._id).save(
         com,
         function (response, headers) {
            console.log(response);
            $scope.allComments.push(com);
            $route.reload();
         },
         function(err) {

         }
       );
         $scope.commentState[photo._id] = "Add Comment";
       } else {
         $scope.commentState[photo._id] = "submit";
       }




    };


    UserPhotos.query({id: userId}, function(userPhotoList) {
       $scope.user.Photos = JSON.parse(JSON.stringify(userPhotoList));
       $scope.userImages = JSON.parse(JSON.stringify(userPhotoList));
       $scope.user.profilePic = $scope.user.Photos[0];
       $scope.user.currentPic = $scope.user.Photos[0].file_name;
          console.log("$DEBUG", userPhotoList, userPhotoList.length);
       for (var i = 0; i < userPhotoList.length; i++) {
         $scope.commentState[userPhotoList[i]._id]="Add Comment";
         $scope.allComments=userPhotoList[i].comments;
         for( var j = 0; j< userPhotoList[i].comments.length; j++) {
          var callBack =  function(uid) {
            return function(ProfileData) {
               $scope.profilePicAll[uid] = ProfileData.file_name;
               $scope.userName[uid] = ProfileData.user_name;
            };
          };
          console.log("$DEBUG", userPhotoList[i].comments);
          console.log("$$DEBUG", i, j);
          Profile.get({id: userPhotoList[i].comments[j].user._id}, callBack(userPhotoList[i].comments[j].user._id));
         }
       }
    });

    $scope.profilePic = function (uid) {
          return $scope.profilePicAll[uid];
    };

    $scope.getUserName = function (uid) {
       return $scope.userName[uid];
    };

    var updateTitle= function() {
      User.get({id: userId}, function(userInfo) {
           $scope.userName[userId] = userInfo.first_name + ' ' + userInfo.last_name;
          $scope.main.currentView = "Photos of " + $scope.userName[userId];
    });};
    updateTitle();



    $scope.showNextImage = function() {
      count = count+1;
      if (count === $scope.user.Photos.length) {
        count = 0;
      }
      $scope.user.currentPic = $scope.user.Photos[count].file_name;
    };

    $scope.showPrevImage = function() {
      count = count-1;
      if (count === -1 ) {
        count = $scope.user.Photos.length-1;
      }
      $scope.user.currentPic = $scope.user.Photos[count].file_name;
    };

    $scope.setCurrent = function(id) {
        for(var i=0; i<$scope.user.Photos.length; i++) {
          if ($scope.user.Photos[i].user_id === id) {
            count=i;
            break;
          }
        }
      $scope.user.currentPic = $scope.user.Photos[count].file_name;

    };
    $scope.getCurrentComments = function() {
       if ($scope.user.Photos === undefined) {
          return;
       }
       return $scope.user.Photos[count].comments;
    };
  }]);
