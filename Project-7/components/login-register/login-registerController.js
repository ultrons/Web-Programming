'use strict';

cs142App.controller('LoginRegisterController', ['$scope', '$routeParams', '$location', '$resource', '$rootScope', '$route',  function( $scope, $routeParams, $location, $resource, $rootScope, $route) {
    if ($scope.lf === undefined) {
      $scope.lf = {};
      $scope.lf.formData = {};
    }
   if ($scope.reg === undefined) {
      $scope.reg = {};
      $scope.reg.formData = {};
    }
    $scope.REG_SUCCESS = "FALSE";
    $scope.REG_BANNER = "_NONE_";
    $scope.main.view = "CS142 Photo App";
    var login=$resource('/admin/login');
    $scope.lf.submit =function () {
       login.save({
         login_name: $scope.lf.formData.login,
         password:$scope.lf.formData.password },
         function (response, headers) {
            console.log('#!/user/'+ response._id);
            $rootScope.$broadcast('userLoggedIn', {
              loggedIn:"TRUE",
              user_id:response._id,
              login_name:$scope.lf.formData.login,
              first_name:response.first_name
            });
            $location.path('/users/'+ response._id);
         },
         function(err){
           console.log(err); }
       );

         };

      $scope.reg.form_error="FALSE";
      $scope.reg.form_invalid="FALSE";
      $scope.reg.submit =function () {
       $scope.reg.form_error="FALSE";
       $scope.reg.form_invalid="FALSE";
       $scope.reg.warningMessages=[];
       if ($scope.reg.formData.password !== $scope.reg.formData.password_2) {
            $scope.reg.warningMessages.push("Passwords Don't Match!!!");
            $scope.reg.form_error="TRUE";
            $scope.registrationForm.password.$valid=false;
       }
       if (!$scope.reg.formData.login_name) {
            $scope.reg.warningMessages.push("Invalid Login Name!!!");
            $scope.reg.form_error="TRUE";
       }
       if (!$scope.reg.formData.password) {
            $scope.reg.warningMessages.push("Invalid password!!!");
            $scope.reg.form_error="TRUE";
       }
       if (!$scope.reg.formData.first_name) {
            $scope.reg.warningMessages.push("Invalid first_name!!!");
            $scope.reg.form_error="TRUE";
       }
       if (!$scope.reg.formData.last_name) {
            $scope.reg.warningMessages.push("Invalid last_name!!!");
            $scope.reg.form_error="TRUE";
       }
       if (!$scope.reg.formData.occupation) {
            $scope.reg.warningMessages.push("Invalid occupation!!!");
            $scope.reg.form_error="TRUE";
       }
       if (!$scope.reg.formData.location) {
            $scope.reg.warningMessages.push("Invalid location!!!");
            $scope.reg.form_error="TRUE";
       }
       if (!$scope.reg.formData.description) {
            $scope.reg.warningMessages.push("Invalid description!!!");
            $scope.reg.form_error="TRUE";
       }
       console.log($scope.reg.formData.password , $scope.reg.formData.password_2, $scope.reg.warningMessages );
      if ($scope.reg.form_error === "TRUE") {
            $scope.reg.form_invalid = "TRUE";
            $scope.reg.formData={};
      }

       if ($scope.reg.form_invalid !== "TRUE") {
       var user=$resource('/user');
       user.save({
         login_name: $scope.reg.formData.login_name,
         first_name: $scope.reg.formData.first_name,
         last_name: $scope.reg.formData.last_name,
         password: $scope.reg.formData.password,
         location: $scope.reg.formData.location,
         description: $scope.reg.formData.description,
         occupation: $scope.reg.formData.occupation
       },
         function (response, headers) {
             if (response.user_id !== undefined) {
               $scope.REG_SUCCESS = "TRUE";
               $scope.REG_BANNER = response.mess + " Please Login ->"  ;

             }
             console.log("DEBUG@@@@@", response);
         },
         function(err){
            if (err) {
            $scope.reg.warningMessages.push("User Name Already exists!!!");
            $scope.reg.form_invalid="TRUE";
            $scope.REG_SUCCESS = "FALSE";
            $scope.reg.formData={};
         }


           //console.log(err);
         }
       );
       }
      };



}]);
