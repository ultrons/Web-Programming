/**
 * Define StatesController for the states component of CS142 project #4
 * problem #2.  The model data for this view (the states) is available
 * at window.cs142models.statesModel().
 */

cs142App.controller('HeaderController', ['$scope', function($scope) {
    $scope.init =  function (id) {
      $scope.problemID = id;
    }
   // Replace this with the code for CS142 Project #4, Problem #2
   //console.log('window.cs142models.statesModel()', window.cs142models.statesModel());
}]);
