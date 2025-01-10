
$(function() {
    $('#addRoom').click(function () {
        const buildingName = $('#buildingName').val();
        const roomNumber = $('#roomNumber').val();
        const numOfRooms = $('#numOfRooms').val() || 1; // Default to 1 if not provided
        const numBeds = $('#numBeds').val();
        const floor = $('#floor').val() || 1; // Default to 1 if not provided
        const price = $('#price').val(); // New field
        //alert(floor)
        if (!buildingName || !roomNumber || !numBeds) {
            alert(" לא נבחר שם בניין או מספר חדר או מספר מיטות או מחיר לחדר");
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
                floor: floor,
                price: price
            }),
            success: function (response) {
                alert('החדר הוסף בהצלחה');
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