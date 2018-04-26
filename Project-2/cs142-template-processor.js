'use strict';

/* Requirement:
 *
 * A template processor class (Cs142TemplateProcessor) that is constructed with a string parameter template and has a method fillIn.
 * When invoked with an argument of a dictionary object, fillIn returns a string with the template filled in with values from the dictionary object.
 * Cs142TemplateProcessor should be written using the standard JavaScript constructor and prototype structure.

 * The fillIn method returns the template string with any text of the form {{property}} replaced with the corresponding property of the dictionary object passed to the function.

 * If the template specifies a property that is not defined in the dictionary object, the property should be replaced with an empty string.
 * If the property is between two words, you'll notice that replacing the property with an empty string will result in two consecutive whitespaces.
 * Example: "This {{undefinedProperty}} is cool" -> "This  is cool". This is fine. You do not have to worry about getting rid of the extra whitespace.

 * Your system need only handle properly formatted properties. Its behavior can be left undefined in the following cases as we will not be checking explicitly for them.

      nested properties - {{foo {{bar}}}} or {{{{bar}}}} or {{{bar}}}
      unbalanced brackets - {{bar}}}
      stray brackets in any property string - da{y or da}y
 * */


function Cs142TemplateProcessor (template) {
  this.template = template;
}
/* function :  fillIn
   * arguments:  dictionary  containing key-value pairs where
   *                  key points to the string to be replace i.e. all patterns matching {{<key>}} 
   *                  is the target string
   *                  value is the string that will replace the target string
   *
   * Synopsys: Function's purpose is self-explanatory.
   *           It has been defined using proto-type to keep it dynamic.
   *           without copying it with every instance.
   */

Cs142TemplateProcessor.prototype.fillIn = function (replaceDict) {
  /* Applying a function in the replacement string 
     seemed to be the cleanest solution for this problem.
     Eventually following link explained how to accomplished that:
     Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter
  */
  function replacer (match, p1, string) {
    return (replaceDict[p1] !== undefined) ? replaceDict[p1] : "";
  }
  this.template=this.template.replace(/{{(\w+)}}/g,replacer);
  return this.template;
};

