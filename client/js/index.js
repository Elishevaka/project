
$(document).ready(function() {
  
  $("#datepicker").datepicker(); // function in jQuary that select a date from a popup or inline calendar

  // Event listener for submit button
  $("#submitDate").click(function() {

    const selectedDate = $("#datepicker").val();// selectedDate = to the choose date.

    $("#dateDisplay").text("Selected Date: " + selectedDate);//need to remove - after chose date and click submit, apeare the data- need to show the map by data
  });

  $("#addButton").click(function() {
    window.location.href = "/roomMaps"
  });

});