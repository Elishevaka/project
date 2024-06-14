$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);

    // Retrieve start and end dates from sessionStorage
    var startDate = sessionStorage.getItem('startDate');
    var endDate = sessionStorage.getItem('endDate');
    var buildingNameFromUrl = sessionStorage.getItem('buildingNameFromUrl');
    var roomNumber = sessionStorage.getItem('roomNumber');


    function parseDate(dateString) {
        const [day, month, year] = dateString.split('/');
        return new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date
    }

    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);

    //let rooms = Room.find({ buildingId: building._id });
    // Set the form values
    $('#startDate').val(startDate);
    $('#endDate').val(endDate);

    $("#submit").click(function () {
        // Gather the form data
        var formData = {
            buildingName: buildingNameFromUrl,
            roomNumber: roomNumber,
            clientId: $('#clientId').val(),
            name: $('#name').val(),
            email: $('#email').val() || null,
            phoneNumber: $('#phoneNumber').val(),
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            guestsNum: $('#guestsNum').val(),
            nightNumbers: calculateNightNumbers(startDate, endDate),
            isFree: $('#isFree').is(':checked')
        };
        // Send an AJAX POST request to the server
        $.ajax({
            type: 'POST',
            url: '/submitOrder',  // The endpoint to handle form submission
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function (response) {
                alert('Order submitted successfully!');
                // Redirect or take any other action
            },
            error: function (error) {
                console.error('Error submitting order:', error);
                alert('Failed to submit order. Please try again.');
            }
        });
    });

    function calculateNightNumbers(start, end) {
        var startDate = new Date(start.split('/').reverse().join('-'));
        var endDate = new Date(end.split('/').reverse().join('-'));
        var timeDiff = endDate.getTime() - startDate.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    }
});
