
$(function() {  
    $('#RoomManager').click(function () {
        window.location.href = '/roomMng';
    });
        
    $('#RoomReservations').click(function () {
        window.location.href = '/pickDate';
    });

    $('#dailyOccupancy').click(function () {
        window.location.href = '/dailyOccupancy';
    });

    $('#Reports').click(function () {
        window.location.href = '/reports';
    });

    $('#Client').click(function () {
        window.location.href = '/clientMng';
    });

    $('#Order').click(function () {
        window.location.href = '/orderMng';
    });

    $('#DiningRoom').click(function () {
        window.location.href = '/diningRoom';
    });
});

