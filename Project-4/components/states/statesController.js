/**
 * Define StatesController for the states component of CS142 project #4
 * problem #2.  The model data for this view (the states) is available
 * at window.cs142models.statesModel().
 */

cs142App.controller('StatesController', ['$scope', function($scope) {

  var allStates = window.cs142models.statesModel();

  if ($scope.search === undefined) {
    $scope.search={};
  }

  $scope.search.filterStates = function() {
    if ($scope.search.str === undefined || $scope.search.str === "" ) {
       $scope.search.mess = "No substring Entered ... Showing full list of states:";
    }
    else {
       $scope.search.mess =" List of states matching: " + "\"" + $scope.search.str +  "\"";
    }
    var flist = [];
    var re = new RegExp($scope.search.str, "i");
    for (var i in allStates) {
      if (allStates[i].match(re)) {
        flist.push(allStates[i]);
      }
    }
    return flist;
  };





   // Replace this with the code for CS142 Project #4, Problem #2
   console.log('window.cs142models.statesModel()', window.cs142models.statesModel());

}]);
