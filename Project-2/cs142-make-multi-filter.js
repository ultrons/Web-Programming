'use strict';

/* Requirement:
 *
 * A global function named cs142MakeMultiFilter that takes an array (originalArray) as a parameter and returns a function that can be used to filter the elements of this array.
 * The returned function (arrayFilterer) internally keeps track of a notion called currentArray. Initially, currentArray is set to be identical to originalArray.
 * The arrayFilterer function takes two functions as parameters. They are:

 *     - filterCriteria - A function that takes an array element as a parameter and returns a boolean.
 *                        This function is called on every element of currentArray and currentArray is updated to reflect the results of the filterCriteria function.
 *                        If the filterCriteria function returns false for an element, that element should be removed from currentArray.
 *                        Otherwise, it is left in currentArray.
 *                        If filterCriteria is not a function, the returned function (arrayFilterer) should immediately return the value of currentArray with no filtering performed.

 *     - callback -       A function that will be called when the filtering is done.
 *                        callback takes the value of currentArray as an argument. Accessing this inside the callback function should reference the value of originalArray.
 *                        If callback is not a function, it should be ignored. callback does not have a return value.
 *
 *
 *     The arrayFilterer function should return itself unless the filterCriteria parameter is not specified in which case it should return the currentArray.
 *     It must be possible to have multiple arrayFilterer functions operating at the same time.
 *
 *
 * */


function cs142MakeMultiFilter (originalArray) {
  var i;
  var currentArray = [];
  // Creating copy of the orignal array,
  // better  ways during jquery.extends are possiblem but not sure I could use them
  for (i=0; i<originalArray.length; i++) {
    currentArray.push(originalArray[i]);
  }
  /* function :  arrayFilterer
   * arguments:  filterCritera (type = function)
   * arguments:  callBack      (type = function)
   *
   * Synopsys: Applies the arrayFilter as filtering criteria to currentArray.
   *           elements failing the criteria are removed.
   *
   *           if arrayFilterer is unspecified it returns the value of currentArray.
   *           else it returns itself, after dealing with callback.
   *
   *           callback is executed after filtering is finished.
   *           binding 'this' inside the callback to the original array as specified in the problem.
   *           if no callback specified nothing is done about the callback.
   *
   *
   */
  function arrayFilterer (filterCriteria, callback) {
    if (filterCriteria !== undefined ) {
      currentArray=currentArray.filter(filterCriteria);
      if (typeof callback === 'function') {
        callback.call(originalArray, currentArray);
      }
      return arrayFilterer;
    }
    else {
       return currentArray;
    }
  }
  return arrayFilterer;
}
