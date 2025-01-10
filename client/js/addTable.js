$(document).ready(function() {
    let options = '';
    for (let i = 1; i <= 10; i++) {
        options += `<option value="${i}">${i}</option>`;
    }
    $('#numberOfSeats').html(options); // Set the options in the select element

    // Handle form submission for adding a table
    $('#addTable').click(function(event) {
            event.preventDefault();
            const newTableData = {
                tableNumber: $('#tableNumber').val(),
                numberOfSeats: $('#numberOfSeats').val(),
                diningRoom: $('#diningRoom').val(),
                nearWindow: $('#nearWindow').is(':checked'),
                nearDoor: $('#nearDoor').is(':checked')
            };
            console.log("newTableData\n ", newTableData);
    
            $.ajax({
                url: '/createTable',
                type: 'POST',
                data: JSON.stringify(newTableData),
                contentType: 'application/json',
                success: function () {
                    alert('שולחן נוסף בהצלחה');
                    $('#addTableModal').hide();
                    window.location.href = "/diningRoom"
                },
                error: function (xhr) {
                    alert('שגיאה בהוספת שולחן: ' + xhr.responseJSON.error);
                }
            });    
    });

    // Redirect to the home page when "עמוד הבית" is clicked
    $('#menu').click(function() {
        window.location.href = '/home'; // Replace with your homepage URL
    });
});