$(document).ready(function () {
    $('#roomForm').submit(function (event) {
        // Prevent the default form submission
        event.preventDefault();

        // Gather the form data
        var formData = {
            name: $('#name').val(),
            email: $('#email').val()
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
                //$('#success-message').show();
                alert("User successfully added to MongoDB!")
                 window.location.href = '/main'; // Redirect to main page
            },
            error: function (xhr, status, error) {
                // Handle error response
                console.error('Error:', error);
                // Optionally, you can display an error message to the user
                // $('#error-message').text('An error occurred. Please try again.');
            }
        });
    });
});
