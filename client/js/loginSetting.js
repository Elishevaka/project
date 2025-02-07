$(function () {
    $('#change-email-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission
        
        const newEmail = $('#new-email').val(); // Get the new email entered by the user
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            $('#error-message').text('Please enter a valid email address.');
            return;
        }
        
        $.ajax({
            url: '/update-email',  // Endpoint to update email
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ newEmail }),
            success: function (response) {
                $('#error-message').text('');
                alert('המייל עודכן בהצלחה');
                window.location.href = '/home'; // Replace with your homepage URL

            },
            error: function (xhr, textStatus, error) {
                const errorMessage = xhr.responseJSON?.message || 'An error occurred while updating the email.';
                $('#error-message').text(errorMessage);
            }
        });
    });
});