$(document).ready(function() {
  // Fetch room status from server and update UI
  $.ajax({
    url: '/building1',
    method: 'GET',
    success: function(rooms) {
      rooms.forEach(function(room) {
        // Update button color based on room status
        if (room.status === 'occupied') {
          $('#' + room.roomNumber).addClass('occupied');
        } else {
          $('#' + room.roomNumber).addClass('free');
        }
      });
    },
    error: function(err) {
      console.error('Error fetching room status:', err);
    }
  });

  // Handle room button click
  $('.room-btn').click(function(event) {
    var roomId = $(this).data('room-id');
    $.ajax({
      url: '/checkAvailability/' + roomId,
      method: 'GET',
      success: function(response) {
        if (response.available) {
          window.location.href = '/details_form?room=' + roomId;
          // Optionally, you can update the room status to "occupied" here
          // UpdateRoomStatus(roomId);
        } else {
          alert('Room is not available!');
        }
      },
      error: function(err) {
        console.error('Error checking room availability:', err);
      }
    });
  });

  // Redirect to registration form when room link is clicked
  $('.room-link').click(function(event) {
    event.preventDefault();
    var room = $(this).attr('href');
    window.location.href = room;
  });

  // Function to update room status to "occupied" (optional)
  function UpdateRoomStatus(roomId) {
    $.ajax({
      url: '/updateRoomStatus/' + roomId,
      method: 'PUT',
      success: function(response) {
        console.log('Room status updated:', response);
      },
      error: function(err) {
        console.error('Error updating room status:', err);
      }
    });
  }
});
