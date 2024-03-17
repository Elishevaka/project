$(document).ready(function () {

    var roomStatus = {
        "room1": "free",      // Change to "free" or "occupied" as needed
        "room2": "occupied"   // Change to "free" or "occupied" as needed
    };

    $(".room-btn").click(function () {
        
        var roomId = $(this).data("room-id");
        alert("Room " + roomId );
        if (roomStatus[roomId] === "free") {
            window.location.href = '/details_form';
            roomStatus[roomId] = "occupied";
        } else {

            //alert("Room " + roomId + " is occupied. Occupant details will be displayed here.");
        }
    });
});


// $(document).ready(function () {
    
// var roomStatus = {
//     "room1": "occupied",      // Change to "free" or "occupied" as needed
//     "room2": "free"   // Change to "free" or "occupied" as needed
// };

// function updateButtonColors() {
//     $(".room-btn").each(function () {
//         var roomId = $(this).data("room-id");
//         if (roomStatus[roomId] === "free") {
//             $(this).removeClass("btn-danger").addClass("btn-success");
//         } else {
//             $(this).removeClass("btn-success").addClass("btn-danger");
//         }
//     });
// }

//     alert("Room " + roomId);
//     // Initial call to update button colors
//     updateButtonColors();

//     $(".room-btn").click(function () {
//         var roomId = $(this).data("room-id");
//         if (roomStatus[roomId] === "free") {
//             roomStatus[roomId] = "occupied"; // Update room status
//             // Redirect to the details form page
//             window.location.href = '/details_form';
//         } else {
//             // Handle if room is occupied
//             alert("Room " + roomId + " is occupied. Occupant details will be displayed here.");
//         }
//     });
// });
