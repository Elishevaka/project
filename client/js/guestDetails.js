$(function() {
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
            payment: $('#payment').val(), // Get the selected payment method
            roomIds: selectedRooms.map(room => room.roomId), // Send an array of room IDs
            startDate: startDate,
            endDate: endDate,
            extraMattresses: extraMattresses,
            babyBed: babyBed
        };
        // Validate ID format
        const idPattern = /^\d{9}$/;
        if (!idPattern.test(guestDetails.guestId)) {
            alert("פורמט תעודת זהות לא חוקי. אנא הזן תעודת זהות תקין בן 9 ספרות.");
            return;
        }
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
                alert("חדרים הוזמנו בהצלחה!");
                // Send email after successful booking
                $.ajax({
                    url: "/api/sendMail",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(mailData),

                    success: function (response) {
                        console.log(response);
                        alert("מייל אישור נשלח!");
                        window.location.href = "/home";
        
                    },
                    error: function (error) {
                        console.log(error);
                        alert("החדרים הוזמנו, אך לא הצליחו לשלוח דוא'ל אישור.");
                    }
                });
            },
            error: function (error) {
                console.error("שגיאה בהזמנת חדרים:", error);
                alert("הזמנת החדרים נכשלה. אנא נסה שוב.");
            }
        });
    });

    $('#menu').click(function () {
        window.location.href = "/home";
    });
});
