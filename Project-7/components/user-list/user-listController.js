'use strict';

cs142App.controller('UserListController', ['$scope', '$resource', '$rootScope', '$route', '$window',
    function ($scope, $resource, $rootScope, $route, $window) {
        $scope.main.title = 'Users';
      if ($scope.db === undefined) {
          $scope.db = {};

      }
    if ($scope.search === undefined ) {
        $scope.search= {};
    }
    if ($scope.photoCount === undefined ) {
        $scope.photoCount= {};
    }
    if ($scope.photoCommented === undefined ) {
        $scope.photoCommented= {};
    }

    var UserList = $resource("http://localhost:3000/user/list");
    var UserComments = $resource("http://localhost:3000/comments");

     // Get the list of users from the response text
      // Also implements the user search functions
      // Although it was required, but the feature may be useful in future
    var userCount = 0;
    $scope.listOfUsers = UserList.query ();
    $scope.db.allUsers = $scope.listOfUsers;
    console.log( $scope.db.allUsers);
    $scope.search.filterUsers = function() {
      if ($scope.search.str === undefined || $scope.search.str === "" ) {
         $scope.search.mess = "All users:";
      }
      else {
         $scope.search.mess =" List of users matching: " + "\"" + $scope.search.str +  "\"";
      }

      var flist = [];
      var re = new RegExp($scope.search.str, "i");

      for (var i=0 ; i<$scope.listOfUsers.length; i++) {
        userCount = i;
        var userName = $scope.db.allUsers[i].first_name + ' ' + $scope.db.allUsers[i].last_name;
        if (userName.match(re)) {
          flist.push($scope.db.allUsers[i]);
        }

      }
      return flist;
    };

    UserComments.get({}, function(listResponse) {
      listResponse=JSON.parse(JSON.stringify(listResponse));
      var idList = Object.keys(listResponse);
      for (var j=0; j<idList.length; j++) {
         $scope.photoCount[idList[j]] = listResponse[idList[j]].photosCount;
         $scope.photoCommented[idList[j]] = listResponse[idList[j]].photosCommentsCount;
      }
    });
       $rootScope.$on ('updateList', function(event, args) {
             $scope.main.AppState.userLoggedIn = "TRUE";
             console.log("DEBUG@#$...");
            // $route.reload();
            $window.location.reload();
       });

    }]);

