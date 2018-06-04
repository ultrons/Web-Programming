'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial', 'ngResource']);

cs142App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/users', {
                templateUrl: 'components/user-list/user-listTemplate.html',
                controller: 'UserListController'
            }).
            when('/users/:userId', {
                templateUrl: 'components/user-detail/user-detailTemplate.html',
                controller: 'UserDetailController'
            }).
            when('/photos/:userId', {
                templateUrl: 'components/user-photos/user-photosTemplate.html',
                controller: 'UserPhotosController'
            }).
             when('/allcomments/:userId', {
                templateUrl: 'components/user-comments/user-commentsTemplate.html',
                controller: 'UserCommentsController'
            }).
             when('/login-register', {
                templateUrl: 'components/login-register/login-registerTemplate.html',
                controller: 'LoginRegisterController'
            }).
            otherwise({
                redirectTo: '/login-register'
            });
    }]);

cs142App.controller('MainController', ['$scope', '$resource', '$rootScope', '$location', '$http',
    function ($scope, $resource, $rootScope, $location, $http ) {
        $scope.main = {};
        $scope.main.title = 'Users';

        $rootScope.$on('userLoggedIn', function (event, args) {
           $scope.main.loggedInUser = args.login_name;
           $scope.main.user_id = args.user_id;
           $scope.main.loggedIn = args.loggedIn;
           $scope.main.loggedInUserFirstName = args.first_name;
           $scope.main.userLoggedIn = "TRUE";
           $scope.main.AppState = {
               loggedInUser : args.login_name,
               user_id : args.user_id,
               loggedIn : args.loggedIn,
               loggedInUserFirstName : args.first_name,
               userLoggedIn : "TRUE"

           };
           $rootScope.$broadcast('updateList',  {updateView: 'TRUE'} );
           window.localStorage.setItem('loginState', JSON.stringify($scope.main.AppState));

        });

      var testInfo = $resource("/test/info");
      testInfo.get(function(testString) {
        $scope.versionNumber = testString.version;


      });

      $scope.main.logOut = function () {
           $scope.main.AppState.userLoggedIn = "FALSE";
           window.localStorage.removeItem('loginState');
           $location.path('/admin/logOut');


      };


      //// Photo Upload Code ///////
  var selectedPhotoFile;   // Holds the last file selected by the user

// Called on file selection - we simply save a reference to the file in selectedPhotoFile
$scope.inputFileNameChanged = function (element) {
    selectedPhotoFile = element.files[0];
};

// Has the user selected a file?
$scope.inputFileNameSelected = function () {
    return !!selectedPhotoFile;
};


// Upload the photo file selected by the user using a post request to the URL /photos/new
$scope.uploadPhoto = function () {
    if (!$scope.inputFileNameSelected()) {
        console.error("uploadPhoto called will no selected file");
        return;
    }
    console.log('fileSubmitted', selectedPhotoFile);

    // Create a DOM form and add the file to it under the name uploadedphoto
    var domForm = new FormData();
    domForm.append('uploadedphoto', selectedPhotoFile);

    // Using $http to POST the form
    $http.post('/photos/new', domForm, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    }).then(function successCallback(response){
        // The photo was successfully uploaded. XXX - Do whatever you want on success.
    }, function errorCallback(response){
        // Couldn't upload the photo. XXX  - Do whatever you want on failure.
        console.error('ERROR uploading photo', response);
    });

};

    if (!$scope.main.AppState) {
       $scope.main.AppState = JSON.parse(window.localStorage.getItem('loginState'));
    }

    }]);
