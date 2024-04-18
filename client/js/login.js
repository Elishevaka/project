$(document).ready(function () {
    $('#login-form').submit(function (event) {
        event.preventDefault();

        const formData = $(this).serializeArray();
        const username = formData.find(item => item.name === 'username').value;
        const password = formData.find(item => item.name === 'password').value;

        $.ajax({
            url: '/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function (data) {
                alert("Login successful!");
                window.location.href = '/main'; // Redirect to main page
            },
            error: function (xhr, textStatus, error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    });
});
