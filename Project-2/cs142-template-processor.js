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

Cs142TemplateProcessor.prototype.fillIn = function (replaceDict) {
  //Is this the most efficient way to loop over a dictionary?
  var keys = Object.keys(replaceDict);
  var i;
  for (i=0; i<keys.length; i++) {
    var targetRegExp = new RegExp("{{"+keys[i]+"}}", "g");
    this.template=this.template.replace(targetRegExp, replaceDict[keys[i]]);
  }
  return this.template;
};

