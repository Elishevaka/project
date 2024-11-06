
$(document).ready(function () {
    const startDate = sessionStorage.getItem('startDate');
    const endDate = sessionStorage.getItem('endDate');

    if (!startDate || !endDate) {
        alert("No dates selected. Please go back and select dates.");
        window.location.href = "/pickDate"; 
        return;
    }

    // Display the selected dates
    $("#selectedDates").text(`Selected Dates: ${startDate} - ${endDate}`);


    // Fetch available rooms based on dates
    $.ajax({
        url: "/api/getAvailableRooms",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ startDate, endDate }),
        success: function (rooms) {
            // Populate table with available rooms
            const table = $("#availableRoomsTable tbody");
            table.empty(); // Clear existing rows

            rooms.forEach(room => {
                const row = `<tr>
                    <td>${room.roomNumber}</td>
                    <td>${room.buildingName}</td>
                    <td>${room.numBeds}</td>
                    <td>${room.floor}</td>
                </tr>`;
                table.append(row);
            });
        },
        error: function (error) {
            console.error("Error fetching available rooms:", error);
            alert("Failed to load available rooms. Please try again later.");
        }
    });

});