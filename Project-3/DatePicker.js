'use strict';
/* Class: DatePicker
 * Constructor for DatePicker:
 * Arguments:
 *           elementID : ID of the element where datepicker will be created.
 *           callBack  : Function that would be called on when a date from the valid month
 *                       is selected.
 *
 * Note:
 *       the render method has been added to this class below (please scroll)
 * */

function DatePicker (elementID, callBack) {
  this.callBack = callBack;
  this.elementID = elementID;
}



/* Class: DatePicker
 * Method: customeProperties
 * Arguments : None
 *
 * Purpose: Extending the Date class from javascript library to get some date related computations
 *          as separate place and avoid clutter in the render method of DatePicker
 *
 * Returns:
 *         A dictionary containing following properties wrt to date object:
 *         -     lastDay: -> Last day of the month wrt
 *         -     monthStart -> The date where the month page display starts (i.e. date of Sunday in the first week)
 *         -     monthEnd   -> The date where the month page display should end (i.e. date of the Saturday of the last week)
 *         -     month:     -> Three letter abriviation of the month in the date object
 *         -     day        -> FullName of the day
 *         -     date       -> copy of the date object being extended
 *         -     pageLength -> Number of rows to be displayed (i.e. number of weeks the month of current date spans
 */

Date.prototype.customeProperties = function () {
  var lastDay = new Date(this);
  var monthStart = new Date(this);
  lastDay.setDate(1);
  lastDay.setMonth(this.getMonth()+1);
  lastDay.setDate(lastDay.getDate() -1);

  monthStart.setDate(1);
  var monthStartDay = monthStart.getDay();

  while (monthStart.getDay() !== 0) {
    monthStart.setDate(monthStart.getDate() - 1);
  }

  var monthEnd = new Date(lastDay);
  while (monthEnd.getDay() !== 6) {
    monthEnd.setDate(monthEnd.getDate() + 1);
  }

  // Number of weeks the month spans is start day (where the month start) + length of the month / 7 => Greatest Integer
  var pageLength = ((lastDay.getDate() + monthStartDay) % 7 !== 0 ) ?  Math.floor((lastDay.getDate() + monthStartDay)/7) + 1: (lastDay.getDate() + monthStartDay)/7;
  //console.log(pageLength, pageLength2);
  const monthArray = ["Jan", "Feb", "Mar",
                    "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep",
                    "Oct", "Nov", "Dec"];
  const dayArray= ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return {
    lastDay:lastDay,
    monthStart:monthStart,
    monthEnd:monthEnd,
    month:monthArray[this.getMonth()],
    day:dayArray[this.getDay()],
    date:this,
    pageLength:pageLength
  };

};


/* Class: DatePicker
 * Method: render
 * Aregument: A date which will be shown in the default view of the calender
 *
 * Returns: Nothing
 * */

DatePicker.prototype.render = function (dateIn) {
  const dayArray= ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  //Get the extended properties from the given date
  var dateInExtented =  dateIn.customeProperties();


  //Get the target elemen
  var targetElement = document.getElementById(this.elementID);
  var self=this;


  // Create and add elements to draw
  var leftMargin = document.createElement("Left_Margin");
  var monthDisplay = document.createElement("Month_Title");
  var prevButton = document.createElement("prevMonth");
  var nextButton = document.createElement("nextMonth");

  // Properties are set using attributes
  // To avoid id name based collisons
  // ids are only set for elements which are dynamic
  // i.e. require some update in response to an event
  leftMargin.setAttribute("isLeftMargin", "True");
  monthDisplay.setAttribute("isMonthDisplay", "True");
  prevButton.setAttribute("isPrevButton", "True");
  nextButton.setAttribute("isNextButton", "True");

  var leftMarginId = this.elementID + '_' + 'Left_Margin';
  var MonthbarId = this.elementID + '_' + 'Month_Bar';
  leftMargin.id=leftMarginId;
  monthDisplay.id=MonthbarId;



  targetElement.setAttribute("isDatePane","True");


  targetElement.appendChild(leftMargin);
  targetElement.appendChild(monthDisplay);
  targetElement.appendChild(prevButton);
  targetElement.appendChild(nextButton);

  /*
   * Function: setLefMargin
   *
   * Argument: id: ID of the Margin Element
   *         : Number of weeks that current month spans
   *
   * Retruns: Nothing
   *
   * Purpose:
   *          To set the height of the left margin as per the number of weeks to be displayed.
   *
   * */

  function setLefMargin(id, pageLength) {
     document.getElementById(id).style.height=pageLength*30+60+"px";
  }

  /*
   * Function :  setMonthBar
   *
   * Argument : id of the month div
   *
   * Retruns: Nothing
   *
   * Purpose:
   *          To set the text of the month display div according to the month being displayed.
   */
  function setMonthBar (id, extDateIn) {
     document.getElementById(id).textContent= extDateIn.month + " " +  extDateIn.date.getFullYear();
  }


   /*
   * Function :  setWeeksBar
   *
   * Argument : id of the datePicker div
   *
   * Retruns: Nothing
   *
   * Purpose:
   *          To set the Week Display
   *
   * Note:    Week is also rendered as boxes arranged in a row.
   *          Same as dates will be.
   *          This code could have written without a function, since it is does need to respond to any event.
   *          And is not dynamically created.
   *          But Choice of enclosing in this function is for partitioning reasons.
   */
  function setWeeksBar (id) {
    //Drawing the Week Day Names
    var topOffset=30; //Week bar will always start at this position
    var leftOffset=100 ;
    var day;
    for (var d in dayArray) {
        day = document.createElement(dayArray[d]);
        day.setAttribute("isDay", "True");
        day.textContent = dayArray[d];
        day.style.left=leftOffset + "px";
        day.style.top=topOffset + "px";
        document.getElementById(id).append(day);
        leftOffset+=30;
    }
  }

  /*
   * Function :  setCallBack
   *
   * Argument :
   *         dayElement : the day element, on which the call back will be set.
   *         cur_date   : current date (corresponding to this day.)
   *         enableCallBack: A boolean value, true only if this day belongs to month being displayed.
   *
   * Retruns: Nothing
   *
   * Purpose:
   *          Adds two event listener.
   *
   *          mouseover -> To display the date in the left margin as the use hover over the date.
   *                       Utterly useless, but added just for the heck.
   *          click     -> to respond to the selection of the  date.
   *                       callback function passed to the constructor will be passed to the event listener.
   *
   *          This function is REQUIRED in order to address the problem shown in for-loop example in the class.
   *          If the event listener is in the upper scope, since call back is set in the loop
   *          Due the closure seen by it alway get the last day and it's properites as inputs.
   *          By creating a function and passing the day as argument, we are isolating this value from the closure
   *          of the upper level.
   *
   */


  var setCallBack = function (dayElement, cur_date, enableCallback) {
        var cdate = {day:cur_date.getDate(),
                                           month: cur_date.getMonth()+1,
                                           year: cur_date.getFullYear()};
        var edate = new Date(cur_date).customeProperties();
        if (enableCallback) {
          dayElement.addEventListener("click", function() {
            self.callBack(targetElement.id, cdate);
          });
        }
        dayElement.addEventListener("mouseover", function() {
          document.getElementById(leftMarginId).textContent=edate.day + ",\r\n" + edate.month + " " + edate.date.getDate() + ",\r\n" + edate.date.getFullYear();
        });
  };


  /* Function :  renderDates
   *
   * Argument :
   *         baseElementID : the ID of the element where the datePicker has to rendered.
   *         startDate   :   date input to the render function.
   * Purpose:
   *          Draws all the dates displayed.
   *          Takes care fo the styling and sets callback appropriately.
   *          It makes use of the customeProperties method to doing all date related manipulation.
   *          Except incrementing from monthStart to monthEnd.
   */


  function renderDates (baseElementID, startDate) {
    var extDateIn =  startDate.customeProperties();
    var cur_date = extDateIn.monthStart;
    //console.log(extDateIn);
    var targetElement = document.getElementById(baseElementID);
    var h =extDateIn.pageLength;

    targetElement.style.height=h*30 + 60 + "px";

    var leftOffset=100;
    var topOffset=60;
    var col = "grey";
    var count = 0;
    var dayId;
    var day;


    while (true) {
      // Construct the id for each date
      dayId=baseElementID+ '_' + "date"+count;
      // If the element with this id does not exist; create it
      // And add to the tree
      if (document.getElementById(dayId) !== null) {
        targetElement.removeChild(document.getElementById(dayId));
        if (topOffset === h*30 + 60 ) {
          count+=1;
          continue;
        }
      }
      else if (topOffset === h*30 + 60 ) {
           break;
      }
      day = document.createElement("d");
      day.setAttribute("isDate", "True");
      day.id=dayId;
      targetElement.append(day);

      // Search the tree with id
      day = document.getElementById(dayId);
      setCallBack(day, cur_date, (cur_date.getMonth() === extDateIn.date.getMonth()));

      col = (cur_date.getMonth() === extDateIn.date.getMonth()) ? 'black' : 'grey';

      day.textContent = cur_date.getDate();
      day.style.left=leftOffset + "px";
      day.style.top=topOffset + "px";
      day.style.color=col;

      leftOffset+=30;
      if (leftOffset === 310) {
        leftOffset=100;
        topOffset+=30;
      }


      cur_date.setDate(cur_date.getDate() + 1);
      count+=1;
    }
  }


  // Default call to the bulding blocks
  var startDate=new Date(dateIn);
  setLefMargin(leftMarginId, dateInExtented.pageLength);
  setMonthBar(MonthbarId, dateInExtented);
  setWeeksBar(this.elementID);
  renderDates(this.elementID,startDate);

  //Adding event listeners to the forward and back buttons

  prevButton.addEventListener("click", function() {
    startDate.setMonth(startDate.getMonth()-1);
    startDate.setDate(1);
    setMonthBar(MonthbarId, startDate.customeProperties());
    setLefMargin(leftMarginId, startDate.customeProperties().pageLength);
    renderDates(self.elementID, startDate);
  });
  nextButton.addEventListener("click", function() {
    startDate.setMonth(startDate.getMonth()+1);
    startDate.setDate(1);
    setMonthBar(MonthbarId, startDate.customeProperties());
    setLefMargin(leftMarginId, startDate.customeProperties().pageLength);
    renderDates(self.elementID, startDate);
  });

};
