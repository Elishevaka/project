
$(document).ready(function () {

    $('.addRoom').click(function () {
        const buildingName = $('#buildingName').val();
        const roomNumber = $('#roomNumber').val();
        const numOfRooms = $('#numOfRooms').val();
        const numBeds = $('#numBeds').val();
        const floor = $('#floor').val();

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
                window.location.href = "/home";

            },
            error: function (xhr) {
                alert(xhr.responseJSON.error);
            }
        });
    });
});