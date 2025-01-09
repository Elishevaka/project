$(function () {
    // Generate options from 1 to 10
    let options = '';
    for (let i = 1; i <= 10; i++) {
        options += `<option value="${i}">${i}</option>`;
    }
    $('#numberOfSeats').html(options);

    // Fetch all tables from MongoDB and display them
    function fetchTables(selectedDiningRoom = 'all') {
        $.ajax({
            url: '/getAllTables',
            type: 'GET',
            success: function (tables) {
                $('#tableList').empty();
                const filteredTables = selectedDiningRoom === 'all'
                    ? tables
                    : tables.filter(table => table.diningRoom.toString() === selectedDiningRoom);

                if (filteredTables.length === 0) {
                    $('#tableList').append(`
                    <tr>
                        <td colspan="6" style="text-align: center;">אין שולחנות להצגה</td>
                    </tr>
                `);
                } else {
                    filteredTables.forEach(function (table) {
                        const displayedTableNumber = table.tableNumber.split('_')[1] || table.tableNumber;

                        $('#tableList').append(`
                        <tr id="table-${table._id}">
                            <td class="diningRoom">${table.diningRoom}</td>
                            <td class="tableNumber">${displayedTableNumber}</td>
                            <td class="numberOfSeats">${table.numberOfSeats}</td>
                            <td class="nearWindow">${table.nearWindow ? 'כן' : 'לא'}</td>
                            <td class="nearDoor">${table.nearDoor ? 'כן' : 'לא'}</td>
                            <td>
                                <span class="icon editTable" data-table-id="${table._id}">
                                    <i class="fas fa-edit" title="Edit Table"></i>
                                </span>
                            </td>
                        </tr>
                    `);
                    });
                }
            },
            error: function (xhr) {
                alert('שגיאה באחזור השולחנות: ' + xhr.responseJSON.error);
            }
        });
    }
    fetchTables(); // Load tables when the page loads

    $('#filterDiningRoom').change(function () {
        const selectedDiningRoom = $(this).val();
        fetchTables(selectedDiningRoom);
    });

    //Show the modal to add a new table
    $('#addTableBtn').click(function () {
        //$('#addTableModal').show();
        window.location.href = "/addTable";

    });

    // Add a new table to the database
    $('#addTableForm').submit(function (event) {
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
                fetchTables();
            },
            error: function (xhr) {
                alert('שגיאה בהוספת שולחן: ' + xhr.responseJSON.error);
            }
        });
    });

    // Edit a table (convert to input fields)
    $(document).on('click', '.editTable', function () {
        const row = $(this).closest('tr');
        const tableId = $(this).data('table-id');
        const tableNumber = row.find('.tableNumber').text();
        const numberOfSeats = row.find('.numberOfSeats').text();
        const diningRoom = row.find('.diningRoom').text();
        const nearWindow = row.find('.nearWindow').text() === 'כן';  // Assuming the "כן"/"לא" value is displayed
        const nearDoor = row.find('.nearDoor').text() === 'כן';  // Assuming the "כן"/"לא" value is displayed
        console.log("row, tableId, tableNumber, numberOfSeats, diningRoom, nearWindow, nearDoor\n", row, tableId, tableNumber, numberOfSeats, diningRoom, nearWindow, nearDoor);

        // Remove the part after the "_" for displaying the table number
        const tableNumberDisplay = tableNumber.split('_')[1];

        row.find('.tableNumber').html(`<input type="number" class="form-control tableNumberInput" value="${tableNumberDisplay}">`);

        row.find('.numberOfSeats').html(`
            <select class="form-control numberOfSeatsInput">
                ${[...Array(10).keys()].map(i => `<option value="${i + 1}" ${numberOfSeats == i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}
            </select>
        `);

        row.find('.diningRoom').html(`
            <select class="form-control diningRoomInput">
                <option value="1" ${diningRoom == 1 ? 'selected' : ''}>חדר אוכל 1</option>
                <option value="2" ${diningRoom == 2 ? 'selected' : ''}>חדר אוכל 2</option>
            </select>
        `);

        row.find('.nearWindow').html(`
            <select class="form-control nearWindowInput">
                <option value="true" ${nearWindow ? 'selected' : ''}>כן</option>
                <option value="false" ${!nearWindow ? 'selected' : ''}>לא</option>
            </select>
        `);

        row.find('.nearDoor').html(`
            <select class="form-control nearDoorInput">
                <option value="true" ${nearDoor ? 'selected' : ''}>כן</option>
                <option value="false" ${!nearDoor ? 'selected' : ''}>לא</option>
            </select>
        `);

        // Replace the edit button with a save button
        $(this).replaceWith(`<span class="icon saveTable" data-table-id='${tableId}'><i class="fas fa-save" title="Save Table"></i></span>`);
    });

    // Save updated table data
    $(document).on('click', '.saveTable', function () {
        const row = $(this).closest('tr');
        const tableId = $(this).data('table-id');

        // Get updated values
        const updatedTableData = {
            tableNumber: row.find('.tableNumberInput').val() + '_' + row.find('.diningRoomInput').val(), // Table number including dining room part
            numberOfSeats: row.find('.numberOfSeatsInput').val(),
            diningRoom: row.find('.diningRoomInput').val(),
            nearWindow: row.find('.nearWindowInput').val() === 'true',
            nearDoor: row.find('.nearDoorInput').val() === 'true'
        };

        $.ajax({
            url: `/updateTable/${tableId}`,
            type: 'PUT',
            data: JSON.stringify(updatedTableData),
            contentType: 'application/json',
            success: function () {
                alert('השולחן עודכן בהצלחה');
                fetchTables();  // Refresh the table list after update
            },
            error: function (xhr) {
                alert('שגיאה בעדכון השולחן: ' + xhr.responseJSON.error);
            }
        });
    });
    // Redirect to the home page when "עמוד הבית" is clicked
    $('#menu').click(function () {
        window.location.href = '/home'; // Replace with your homepage URL
    });
    $('#arrangeTablesBtn').click(function() {
        window.location.href = '/pickDateToTables';
    });
});