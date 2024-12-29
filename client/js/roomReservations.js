$(document).ready(function () {
    const startDate = sessionStorage.getItem('startDate');
    const endDate = sessionStorage.getItem('endDate');

    if (!startDate || !endDate) {
        alert("לא נבחרו תאריכים. נא לבחור תאריכים.");
        window.location.href = "/pickDate";
        return;
    }

    const start = parseDateString(startDate);
    const end = parseDateString(endDate);

    if (start >= end) {
        alert('התאריכים שגויים, אנא בחר שוב');
        window.location.href = "/pickDate";
        return;
    }

    $("#selectedDates").text(`בחר תאריכים: ${startDate} - ${endDate}`);

    // Fetch available rooms based on dates
    $.ajax({
        url: "/api/getAvailableRooms",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ startDate, endDate }),
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
                                        <th>Select</th>
                                        <th>Room Number</th>
                                        <th>Number of Beds</th>
                                        <th>Floor</th>
                                        <th>Number of Rooms</th>
                                        <th>Extra Mattresses</th>
                                        <th>Baby Bed</th>
                                    </tr>
                                </thead>
                                <tbody id="roomDetails-${buildingName}">
                                    ${buildingRooms.map(room => `
                                        <tr>
                                            <td><input type="checkbox" class="select-room" 
                                                data-room-id="${room._id}" 
                                                data-room-number="${room.roomNumber}" 
                                                data-building-name="${room.buildingName}">
                                            <td>${room.roomNumber}</td>
                                            <td>${room.numBeds}</td>
                                            <td>${room.floor}</td>
                                            <td>${room.numOfRooms}</td>
                                            <td>
                                                <input type="number" class="extra-mattress"
                                                   value="${room.extraMattresses || 0}" min="0">
                                            </td>
                                            <td>
                                                <input type="checkbox" class="baby-bed"
                                                    ${room.babyBed ? 'checked' : false}>
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

            $('#reserveSelectedRooms').click(function () {
                //const $row = $(this).closest('td'); // Get the closest <tr> for the checked checkbox
                const selectedRooms = [];
                $('.select-room:checked').each(function () {
                    selectedRooms.push({
                        roomId: $(this).data('room-id'),
                        roomNumber: $(this).data('room-number'),
                        buildingName: $(this).data('building-name'),
                        // Capture extra mattress and baby bed selection for each room
                        extraMattresses: parseInt($(this).closest('tr').find('.extra-mattress').val()) || 0,
                        babyBed: $(this).closest('tr').find('.baby-bed').is(':checked') ? true : false
                    });
                });

                if (selectedRooms.length === 0) {
                    alert('לא נבחרו חדרים. אנא בחר לפחות חדר אחד.');
                    return;
                }

                // Save selected rooms in sessionStorage
                sessionStorage.setItem('selectedRooms', JSON.stringify(selectedRooms));
                sessionStorage.setItem('startDate', startDate);
                sessionStorage.setItem('endDate', endDate);

                // Navigate to guest details page
                window.location.href = "/guestDetails";
            });
        },
        error: function (error) {
            console.error("Error fetching available rooms:", error);
            alert("טעינת החדרים הזמינים נכשלה. אנא נסה שוב מאוחר יותר.");
        }
    });
    $('#menu').click(function () {
        window.location.href = "/home";
    });
});

function parseDateString(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);

    if (!day || !month || !year) throw new Error('Invalid date format');
    return new Date(year, month - 1, day); // Month is zero-indexed
}