//const { SendMail } = require("../../server/routes/conference");

$(document).ready(function () {
    const roomId = sessionStorage.getItem('roomId');
    const roomNumber = sessionStorage.getItem('roomNumber');
    const buildingName = sessionStorage.getItem('buildingName');
    const startDate = sessionStorage.getItem('startDate');
    const endDate = sessionStorage.getItem('endDate');

    // Display selected room and dates
    $("#roomNumber").text(roomNumber);
    $("#buildingName").text(buildingName);
    $("#bookingDates").text(`${startDate} - ${endDate}`);

    // Handle form submission
    $("#guestForm").submit(function (event) {
        event.preventDefault();
        const guestDetails = {
            guestName: $("#guestName").val(),
            guestId: $("#guestId").val(),
            guestEmail: $("#guestEmail").val(),
            phoneNumber: $("#phoneNumber").val(),
            roomId: roomId,
            startDate: startDate,
            endDate: endDate
        };

        const emailContent = `
        <div style="direction: rtl; text-align: right;">
            <p>לכבוד ${guestDetails.guestName},</p>
            <p>החדר שלך הוזמן!</p>
            <p>חדר מספר ${roomNumber} בבניין ${buildingName}</p>
            <p>בתאריכים: ${startDate} - ${endDate}</p>
            <p>תודה שבחרת בנו!</p>
            <p>צוות גבעת וושינגטון</p>
        </div>
        `;

        const mailData = {
            recipientEmail: guestDetails.guestEmail,
            subject: "אישור הזמנה",
            //html: `from ${guestDetails.guestName}\nYour room booking is confirmed!\nRoom Number: ${roomNumber}\n Building: ${buildingName}\nDates: ${startDate} - ${endDate} \nThank you for choosing us!`
            html: emailContent
            };
        // Send booking data to server
        $.ajax({
            url: "/api/bookRoom",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(guestDetails),
            success: function () {
                alert("Room successfully booked!");
                // Send email after successful booking
                $.ajax({
                    url: "/api/sendMail",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(mailData),
                    success: function () {
                        alert("Confirmation email sent!");
                        window.location.href = "/roomReservations";
                    },
                    error: function (error) {
                        console.error("Error sending email:", error);
                        alert("Room booked, but failed to send confirmation email.");
                        window.location.href = "/roomReservations";
                    }
                });

                window.location.href = "/roomReservations";
            },
            error: function (error) {
                console.error("Error booking room:", error);
                alert("Failed to book room. Please try again.");
            }
        });
    });
    $('#menu').click(function () {
        window.location.href = "/home";
    });
});
