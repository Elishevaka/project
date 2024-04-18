$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    $('#roomId').val(urlParams.get('room'));
    $('#buildingId').val(urlParams.get('building'));
    $('#startDate').val(urlParams.get('date'));

    $('#roomForm').submit(function (event) {
        // Prevent the default form submission
        event.preventDefault();

        // Gather the form data
        var formData = {
            clientId: $('#clientId').val(),
            name: $('#name').val(),
            email: $('#email').val(),
            phoneNumber: $('#phoneNumber').val()
        };
        // Send an AJAX POST request to the server
        $.ajax({
            type: 'POST',
            url: '/client', // Route to handle client data creation
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (data) {
                // Handle success response
                console.log('Client data created:', data);
                alert("User successfully added to MongoDB!")
                window.location.href = '/main'; // Redirect to main page
            },
            error: function (xhr, status, error) {
                // Handle error response
                console.error('Error:', error);
                alert('this user is alrady exist( maybe id, email, or phone)');
            }
        });
    });
});
