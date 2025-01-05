$(function () {

    const fullNamePattern = /^[א-ת]+( [א-ת]+)+$/;

    // Function to validate the full name
    function validateFullName(name) {
        if (!fullNamePattern.test(name)) {
            alert("השם לא תקני. יש להכניס שם פרטי ושם משפחה בלבד.");
            return false;
        }
        return true;
    }

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

    // Create loader element
    const loader = $('<div id="loader" style="display:none;"><div class="spinner"></div><p>שולח מייל, אנא המתן...</p></div>');
    $('body').append(loader);

    // Add loader CSS
    $('<style>').prop('type', 'text/css').html(`
        #loader {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            text-align: center;
        }
        .spinner {
            border: 16px solid #f3f3f3;
            border-top: 16px solid #3498db;
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `).appendTo('head');

    // Handle form submission
    $("#guestForm").submit(function (event) {
        event.preventDefault();
        const guestName = $("#guestName").val();

        if (!validateFullName(guestName)) {
            return;
        }

        const guestDetails = {
            guestName: guestName,
            guestId: $("#guestId").val(),
            guestEmail: $("#guestEmail").val(),
            phoneNumber: $("#phoneNumber").val(),
            city: $("#city").val(),
            zipCode: $("#zipCode").val(),
            address: $("#address").val(),
            specialRequests: $("#specialRequests").val(),
            payment: $('#payment').val(),
            roomIds: selectedRooms.map(room => room.roomId),
            startDate: startDate,
            endDate: endDate,
            extraMattresses: extraMattresses,
            babyBed: babyBed
        };

        const idPattern = /^\d{9}$/;
        if (!idPattern.test(guestDetails.guestId)) {
            alert("פורמט תעודת זהות לא חוקי. אנא הזן תעודת זהות תקין בן 9 ספרות.");
            return;
        }

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

        $('#loader').show();

        $.ajax({
            url: "/api/bookRoom",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(guestDetails),
            success: function () {
                //alert("חדרים הוזמנו בהצלחה!");
                $.ajax({
                    url: "/api/sendMail",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(mailData),
                    success: function (response) {
                        //alert("מייל אישור נשלח!");
                        $('#loader').hide();
                        window.location.href = "/home";
                    },
                    error: function (error) {
                        alert("החדרים הוזמנו, אך לא הצליחו לשלוח דוא'ל אישור.");
                        $('#loader').hide();
                    }
                });
            },
            error: function (error) {
                alert("הזמנת החדרים נכשלה. אנא נסה שוב.");
                $('#loader').hide();
            }
        });
    });

    $('#menu').click(function () {
        window.location.href = "/home";
    });
});
