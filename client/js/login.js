$(function () {
    // When the login form is submitted
    $('#login-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission
        $('#error-message').text('');
        const username = $('#username').val(); // Get username entered by user
        const password = $('#password').val(); // Get password entered by user

        $.ajax({
            url: '/login',  // Send login request to the server
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function ({otpReturn, mailOptions}) {
                console.log(otpReturn, mailOptions);
                
                alert("שם משתמש וסיסמא נכונים");
                $('#loader').show();
                // const mailOptions = {
                //     from: 'gw025867014@gmail.com',
                //     to: 'gw025867014@gmail.com',
                //     subject: 'הסיסמה החד פעמית שלך (OTP)',
                //     text: `הסיסמא החד פעמית שלך היא:\n ${otpReturn}`
                // };
                $.ajax({
                    url: "/api/sendMail",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(mailOptions),
                    success: function (response) {
                        $('#loader').hide();
                        
                        $('#login-form').hide(); // Hide the login form
                        $('#otp-form').show(); // Show OTP form

                        // When the OTP form is submitted
                        $('#otp-form').submit(function (event) {
                            event.preventDefault(); // Prevent default form submission

                            const otp = $('#otp').val(); // Get OTP entered by user
                            otpUser = parseInt(otp)
                            $.ajax({
                                url: '/validate-otp', // Send OTP validation request to the server
                                method: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify({ otpReturn, otpUser }), // Send OTP to the server
                                success: function (data) {
                                    $('#error-message1').text('');
                                    window.location.href = '/home'; // Redirect to home page on success
                                },
                                error: function (xhr, textStatus, error) {
                                        const errorMessage = xhr.responseJSON?.message || 'An error occurred. Please try again.';
                                        $('#error-message1').text(errorMessage); // Display error message
                                    }
                            });
                        });
                    },
                    error: function (error) {
                        alert("שגיאה בשליחת סיסמא חד פעמית");
                        $('#loader').hide();
                    }
                });
            },
            error: function (xhr, textStatus, error) {
                const errorMessage = xhr.responseJSON?.message || 'An error occurred. Please try again.';
                $('#error-message').text(errorMessage); // Display error message
                console.error('Error:', error);
            }
        });
    });
});
