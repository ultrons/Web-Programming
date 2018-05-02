'use strict';
/* Class: TableTemplate
 * Arguments: None
 * Returns: None
 * */

function TableTemplate () {

}

/* Class: TableTemplate
 * Static Method: fillIn
 * Arguments:
 *          tableID -> ID of the table object
 *          propDict -> Dictionary property, value pairs
 *          columnName -> Input column to be replaced.
 *
 * Requires: Cs142TemplateProcessor.js
 *
 * Purpose: parses the table, and replaces the {{property}} with value of property key in the propDict
 *          Works only on the column name if one is provided.
 *          Else works on the whole table.
 *
 *          No error handling done on asbsence of tableID and propDict
 *
 * */
TableTemplate.fillIn  = function (tableID, propDict, columnName) {
  var tableObj = document.getElementById(tableID);
  var rows = tableObj.getElementsByTagName("tr"); // This the collection of all the rows
  var columns;
  var r, c, targetCol;
  var templBuffer;
  targetCol = -1;
  for (r=0; r< rows.length; r++) {
    columns = rows[r].getElementsByTagName("td");
    for (c=0; c<columns.length; c++) {
      templBuffer= new Cs142TemplateProcessor(columns[c].textContent);
      templBuffer.fillIn(propDict);
      if ( r === 0) { // Parsing header
        columns[c].textContent = templBuffer.template;
        if (templBuffer.template === columnName) {
          targetCol = c;
        }
      }
      else if (columnName === undefined || targetCol === c) {
        columns[c].textContent = templBuffer.template;
      }
    }
  }
  tableObj.style.visibility="visible";
};
