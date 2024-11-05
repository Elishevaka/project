$(document).ready(function () {
    $.ajax({
        url: '/getAllRooms', // Fetch all rooms and buildings from MongoDB
        type: 'GET',
        success: function (rooms) {
            // Group rooms by building name
            const groupedRooms = {};
            rooms.forEach(function (room) {
                if (!groupedRooms[room.buildingName]) {
                    groupedRooms[room.buildingName] = [];
                }
                groupedRooms[room.buildingName].push(room);
            });

            // Clear the table
            $('#roomList').empty();

            // Display grouped rooms with edit and delete icons
            Object.keys(groupedRooms).forEach(function (buildingName) {
                const buildingRooms = groupedRooms[buildingName];

                // Add the row for the building
                $('#roomList').append(`
                    <tr class="building-row" data-toggle="rooms-${buildingName}">
                        <td><span class="toggle-arrow">&#9654;</span> ${buildingName}</td>
                        <td></td>
                    </tr>
                    <tr id="rooms-${buildingName}" class="room-details" style="display: none;">
                        <td colspan="6">
                            <table class="table table-sm table-bordered">
                                <thead>
                                    <tr>
                                        <th>Room Number</th>
                                        <th>Number of Beds</th>
                                        <th>Floor</th>
                                        <th>Number of Rooms</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody id="roomDetails-${buildingName}">
                                    ${buildingRooms.map(room => `
                                        <tr>
                                            <td class="roomNumber">${room.roomNumber}</td>
                                            <td class="numBeds">${room.numBeds}</td>
                                            <td class="floor">${room.floor}</td>
                                            <td class="numOfRooms">${room.numOfRooms}</td>
                                            <td>
                                                <span class="icon editRoom" data-room-id="${room._id}">
                                                    <i class="fas fa-edit" title="Edit Room"></i>
                                                </span>
                                            </td>
                                            <td>
                                                <span class="icon deleteRoom" data-room-id="${room._id}">
                                                    <i class="fas fa-trash" title="Delete Room"></i>
                                                </span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                `);
            });

            // Toggle rooms visibility
            $('.building-row').click(function () {
                const target = $(this).data('toggle');
                const arrow = $(this).find('.toggle-arrow');
                $(`#${target}`).toggle();
                arrow.html(arrow.html() === '&#9654;' ? '&#9660;' : '&#9654;');
            });

            // Edit room action
            $('.editRoom').click(function () {
                const row = $(this).closest('tr');
                const roomId = $(this).data('room-id');

                alert(roomId, " -roomId");
                
                // Convert cells to input fields
                const roomNumber = row.find('.roomNumber').text();
                const numBeds = row.find('.numBeds').text();
                const floor = row.find('.floor').text();
                const numOfRooms = row.find('.numOfRooms').text();

                row.find('.roomNumber').html(`<input type="text" class="form-control roomNumberInput" value="${roomNumber}">`);
                row.find('.numBeds').html(`<input type="number" class="form-control numBedsInput" value="${numBeds}">`);
                row.find('.floor').html(`<input type="number" class="form-control floorInput" value="${floor}">`);
                row.find('.numOfRooms').html(`<input type="number" class="form-control numOfRoomsInput" value="${numOfRooms}">`);

                // Replace edit icon with save button
                $(this).replaceWith(`<span class="icon saveRoom" data-room-id="${roomId}"><i class="fas fa-save" title="Save Room"></i></span>`);

                // Save room action
                $('.saveRoom').off('click').click(function () {
                    const updatedRoomData = {
                        roomNumber: row.find('.roomNumberInput').val(),
                        numBeds: row.find('.numBedsInput').val(),
                        floor: row.find('.floorInput').val(),
                        numOfRooms: row.find('.numOfRoomsInput').val()
                    };

                    // Update room in the database
                    $.ajax({
                        url: `/updateRoom/${roomId}`,
                        type: 'PUT',
                        data: updatedRoomData,
                        success: function () {
                            alert('Room updated successfully');
                            location.reload();
                        },
                        error: function (xhr) {
                            alert('Error updating room: ' + xhr.responseJSON.error);
                        }
                    });
                });
            });

            // Delete room action
            $('.deleteRoom').click(function () {
                const roomId = $(this).data('room-id');
                if (confirm('Are you sure you want to delete this room?')) {
                    $.ajax({
                        url: `/deleteRoom/${roomId}`,
                        type: 'DELETE',
                        success: function (response) {
                            alert('Room deleted successfully');
                            location.reload(); // Reload the page to refresh the table
                        },
                        error: function (xhr) {
                            alert('Error deleting room: ' + xhr.responseJSON.error);
                        }
                    });
                }
            });
        },
        error: function (xhr) {
            alert('Error fetching rooms: ' + xhr.responseJSON.error);
        }
    });

    // Add room button action
    $('#addRoom').click(function () {
        window.location.href = "/addRoom"; // Redirect to the add room page
    });
});