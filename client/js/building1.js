$(document).ready(function () {


  $('.room-link').click(function (event) {
    startDate = sessionStorage.getItem('startDate');
    endDate = sessionStorage.getItem('endDate');
    buildingName = sessionStorage.getItem('buildingName');

    var href = $(this).attr('name'); // Get the href attribute value
    var roomId = getRoomIdFromUrl(href); // Extract room ID from href
    window.location.href = '/details_form?room=' + roomId + '&date=' + sessionStorage.getItem('startDate') + '&building=building1';
  });
  console.log("buildingId-1", buildingId);

  function getRoomIdFromUrl(url) {
    var urlParams = new URLSearchParams(url.split('?')[1]);
    return urlParams.get('room');
  }
});


$(document).ready(function () {
  // Data containing building information
  const buildingData = {
    buildingName: 'Building1',
  };

  // Send a POST request to save building information
  $.ajax({
    type: 'POST',
    url: '/saveBuildingInfo',
    contentType: 'application/json',
    data: JSON.stringify(buildingData),
    success: function (response) {
      console.log('Building data saved:', response);
      // Handle success if needed
    },
    error: function (err) {
      console.error('Error saving building data:', err);
      // Handle error if needed
    }
  });
});