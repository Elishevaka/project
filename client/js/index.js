
$(document).ready(function () {

  $("#datepickerStart").datepicker(); // Datepicker for start date
  $("#datepickerEnd").datepicker(); // Datepicker for end date
  $("#selectDates").click(function () {

    const startDate = $("#datepickerStart").val(); // Get start date
    const endDate = $("#datepickerEnd").val(); // Get end date

    // Save start and end dates to sessionStorage
    sessionStorage.setItem('startDate', startDate);
    sessionStorage.setItem('endDate', endDate);

    $("#dateDisplay").text("Selected Dates: " + startDate + " - " + endDate);
    
  });
  $("#addButton").click(function () {
    window.location.href = "/roomMaps"
  });
});