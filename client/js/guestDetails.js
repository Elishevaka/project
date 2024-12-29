// $(document).ready(function () {
//     // Retrieve room details from sessionStorage (can now handle multiple rooms)
//     const selectedRooms = JSON.parse(sessionStorage.getItem('selectedRooms') || '[]');
//     const startDate = sessionStorage.getItem('startDate');
//     const endDate = sessionStorage.getItem('endDate');

//     // Display selected rooms and dates
//     const roomList = $("#roomList");
//     selectedRooms.forEach(room => {
//         const roomInfo = `<li>Room Number: ${room.roomNumber}, Building: ${room.buildingName}</li>`;
//         roomList.append(roomInfo);
//     });

//     $("#bookingDates").text(`${startDate} - ${endDate}`);

//     // Handle form submission
//     $("#guestForm").submit(function (event) {
//         event.preventDefault();

//         // Collect guest details
//         const guestDetails = {
//             guestName: $("#guestName").val(),
//             guestId: $("#guestId").val(),
//             guestEmail: $("#guestEmail").val(),
//             phoneNumber: $("#phoneNumber").val(),
//             roomIds: selectedRooms.map(room => room.roomId), // Send an array of room IDs
//             startDate: startDate,
//             endDate: endDate
//         };

//         // Create email content dynamically for multiple rooms
//         let roomDetails = '';
//         selectedRooms.forEach(room => {
//             roomDetails += `<p>Room Number: ${room.roomNumber}, Building: ${room.buildingName}</p>`;
//         });

//         const emailContent = `
//         <div style="direction: rtl; text-align: right;">
//             <p>Dear ${guestDetails.guestName},</p>
//             <p>Your rooms have been booked!</p>
//             ${roomDetails}
//             <p>Dates: ${startDate} - ${endDate}</p>
//             <p>Thank you for choosing us!</p>
//             <p>Washington Hill Team</p>
//         </div>
//         `;

//         const mailData = {
//             recipientEmail: guestDetails.guestEmail,
//             subject: "Booking Confirmation",
//             html: emailContent
//         };

//         // Send booking data to the server
//         $.ajax({
//             url: "/api/bookRoom",
//             method: "POST",
//             contentType: "application/json",
//             data: JSON.stringify(guestDetails),
//             success: function () {
//                 alert("Rooms successfully booked!");
//                 // Send email after successful booking
//                 $.ajax({
//                     url: "/api/sendMail",
//                     method: "POST",
//                     contentType: "application/json",
//                     data: JSON.stringify(mailData),
//                     success: function () {
//                         alert("Confirmation email sent!");
//                         window.location.href = "/roomReservations";
//                     },
//                     error: function (error) {
//                         console.error("Error sending email:", error);
//                         alert("Rooms booked, but failed to send confirmation email.");
//                         window.location.href = "/roomReservations";
//                     }
//                 });
//                 window.location.href = "/roomReservations";
//             },
//             error: function (error) {
//                 console.error("Error booking rooms:", error);
//                 alert("Failed to book rooms. Please try again.");
//             }
//         });
//     });

//     $('#menu').click(function () {
//         window.location.href = "/home";
//     });
// });


$(document).ready(function () {
    // Retrieve room details from sessionStorage (can now handle multiple rooms)
    const selectedRooms = JSON.parse(sessionStorage.getItem('selectedRooms') || '[]');
    const startDate = sessionStorage.getItem('startDate');
    const endDate = sessionStorage.getItem('endDate');
    const extraMattresses = parseInt((selectedRooms.map(room => room.extraMattresses)));
    const hasBabyBed = selectedRooms.map(room => room.babyBed);
    const babyBed = hasBabyBed.some(value => value === true);

    // Display selected rooms and dates
    const roomList = $("#roomList");
    selectedRooms.forEach(room => {
        const roomInfo = `<li>Room Number: ${room.roomNumber}, Building: ${room.buildingName}</li>`;
        roomList.append(roomInfo);
    });

    $("#bookingDates").text(`${startDate} - ${endDate}`);

    // Handle form submission
    $("#guestForm").submit(function (event) {
        event.preventDefault();

        // Collect guest details
        const guestDetails = {
            guestName: $("#guestName").val(),
            guestId: $("#guestId").val(),
            guestEmail: $("#guestEmail").val(),
            phoneNumber: $("#phoneNumber").val(),
            city: $("#city").val(),
            zipCode: $("#zipCode").val(),
            address: $("#address").val(),
            specialRequests: $("#specialRequests").val(),
            roomIds: selectedRooms.map(room => room.roomId), // Send an array of room IDs
            startDate: startDate,
            endDate: endDate,
            extraMattresses: extraMattresses,
            babyBed: babyBed
        };

        // Create email content dynamically for multiple rooms
        let roomDetails = '';
        selectedRooms.forEach(room => {
            roomDetails += `<p>Room Number: ${room.roomNumber}, Building: ${room.buildingName}</p>`;
        });

        const emailContent = `
        <div style="direction: rtl; text-align: right;">
            <p>Dear ${guestDetails.guestName},</p>
            <p>Your rooms have been booked!</p>
            ${roomDetails}
            <p>Dates: ${startDate} - ${endDate}</p>
            <p>City: ${guestDetails.city}, Zip Code: ${guestDetails.zipCode}</p>
            <p>Address: ${guestDetails.address}</p>
            <p>Special Requests: ${guestDetails.specialRequests}</p>
            <p>Thank you for choosing us!</p>
            <p>Washington Hill Team</p>
        </div>
        `;

        const mailData = {
            recipientEmail: guestDetails.guestEmail,
            subject: "Booking Confirmation",
            html: emailContent
        };
        console.log("I here");
        
        // Send booking data to the server
        $.ajax({
            url: "/api/bookRoom",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(guestDetails),
            success: function () {
                alert("Rooms successfully booked!");
                // Send email after successful booking
                $.ajax({
                    url: "/api/sendMail",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(mailData),

                    success: function (response) {
                        console.log(response);
                        alert("Confirmation email sent!");
                        window.location.href = "/roomReservations";
        
                    },
                    error: function (error) {
                        console.log(error);
                        alert("Rooms booked, but failed to send confirmation email.");
                    }
                });
            },
            error: function (error) {
                console.error("Error booking rooms:", error);
                alert("Failed to book rooms. Please try again.");
            }
        });
    });

    $('#menu').click(function () {
        window.location.href = "/home";
    });
});
