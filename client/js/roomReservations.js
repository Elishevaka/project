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
    alert('התאריכים שגויים, אנא בחר שוב' );
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
            const table = $("#availableRoomsTable tbody");
            table.empty();

            rooms.forEach(room => {
                const row = `<tr>
                    <td>${room.buildingName}</td>
                    <td>${room.roomNumber}</td>
                    <td>${room.numBeds}</td>
                    <td>${room.floor}</td>
                    <td>
                        <button class="btn btn-primary reserveRoom" data-room-id="${room._id}" data-room-number="${room.roomNumber}" data-building-name="${room.buildingName}">
                            בחר
                        </button>
                    </td>
                </tr>`;
                table.append(row);
            });

            // Handle Reserve button click
            $('.reserveRoom').click(function () {
                const roomId = $(this).data('room-id');
                const roomNumber = $(this).data('room-number');
                const buildingName = $(this).data('building-name');

                // Store room details in session storage for later use
                sessionStorage.setItem('roomId', roomId);
                sessionStorage.setItem('roomNumber', roomNumber);
                sessionStorage.setItem('buildingName', buildingName);

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