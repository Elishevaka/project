$(function() {
  sessionStorage.clear();// Clean sessionStorage
  var startDate = 0;
  var endDate = 0;

  // Initialize the start date picker
  $("#datepickerStart").datepicker({
    dateFormat: 'dd/mm/yy',
    onSelect: function (selectedDate) {
      startDate = $.datepicker.parseDate('dd/mm/yy', selectedDate);
      // Enable the end date picker and set the minDate option
      $("#datepickerEnd").datepicker("option", "minDate", startDate).prop("disabled", false);
    }
  });

  // Initialize the end date picker but disable it initially
  $("#datepickerEnd").datepicker({
    dateFormat: 'dd/mm/yy',
    beforeShow: function (input, inst) {
      endDate = $("#datepickerStart").datepicker("getDate");
      if (endDate) {
        $(this).datepicker("option", "minDate", endDate);
      }
    }
  }).prop("disabled", true);

  $("#selectDates").click(function () {
    startDate = $("#datepickerStart").val(); // Get start date
    endDate = $("#datepickerEnd").val(); // Get end date

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    if (new Date(endDate.split('/').reverse().join('/')) <= new Date(startDate.split('/').reverse().join('/'))) {
      alert("End date must be greater than start date");
      return;
    }

    // Save start and end dates to sessionStorage
    sessionStorage.setItem('startDate', startDate);
    sessionStorage.setItem('endDate', endDate);

    $("#dateDisplay").text("Selected Dates: " + startDate + " - " + endDate);

    $("#addButton").click(function () {
      window.location.href = "/roomMaps";
    });
  });

  $("#addButton").click(function () {
    if (0 === startDate || 0 == endDate) {
      alert("please choose dates")
    }
  });

});
