
$(document).ready(function () {

    $('#addRoom').click(function () {
        const buildingName = $('#buildingName').val();
        const roomNumber = $('#roomNumber').val();
        const numOfRooms = $('#numOfRooms').val() || 1; // Default to 1 if not provided
        const numBeds = $('#numBeds').val();
        const floor = $('#floor').val() || 1; // Default to 1 if not provided
        //alert(floor)
        if (!buildingName || !roomNumber || !numBeds) {
            alert("לא נבחר שם בניין או מספר חדר או מספר מיטות");
            return
        }
        $.ajax({
            url: '/addRoom',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                roomNumber: roomNumber,
                buildingName: buildingName,
                numOfRooms: numOfRooms,
                numBeds: numBeds,
                floor: floor
            }),
            success: function (response) {
                alert(response.message);
                window.location.href = "/roomMng";

            },
            error: function (xhr) {
                alert(xhr.responseJSON.error);
            }
        });
    });
    $('#menu').click(function () {
        window.location.href = "/home";
    });
});