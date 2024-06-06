
$(document).ready(function () {
  //The start date will be less than or equal to the end date
  $("#datepickerStart").datepicker({
    dateFormat: 'dd/mm/yy',
    onSelect: function (selectedDate) {
      var startDate = $.datepicker.parseDate('dd/mm/yy', selectedDate);
      $("#datepickerEnd").datepicker("option", "minDate", startDate);
    }
  });

  $("#datepickerEnd").datepicker({
    dateFormat: 'dd/mm/yy',
    beforeShow: function (input, inst) {
      var startDate = $("#datepickerStart").datepicker("getDate");
      if (startDate) {
        $(this).datepicker("option", "minDate", startDate);
      }
    }
  });
  $("#selectDates").click(function () {
    const startDate = $("#datepickerStart").val(); // Get start date
    const endDate = $("#datepickerEnd").val(); // Get end date
    
    if (new Date(endDate.split('/').reverse().join('/')) <= new Date(startDate.split('/').reverse().join('/'))) {
      alert("End date must be greater than start date");
      return;
    }

    // Save start and end dates to sessionStorage
    sessionStorage.setItem('startDate', startDate);
    sessionStorage.setItem('endDate', endDate);

    $("#dateDisplay").text("Selected Dates: " + startDate + " - " + endDate);
  });

  $("#addButton").click(function () {
    window.location.href = "/roomMaps";
  });
});
