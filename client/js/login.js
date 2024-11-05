// // $(document).ready(function () {
// //     $('#login-form').submit(function (event) {
// //         event.preventDefault();

// //         const formData = $(this).serializeArray();
// //         const username = formData.find(item => item.name === 'username').value;
// //         const password = formData.find(item => item.name === 'password').value;

// //         $.ajax({
// //             url: '/login',
// //             method: 'POST',
// //             contentType: 'application/json',
// //             data: JSON.stringify({ username, password }),
// //             success: function (data) {
// //                 alert("Login successful!");
// //                 window.location.href = '/main'; // Redirect to main page
// //             },
// //             error: function (xhr, textStatus, error) {
// //                 console.error('Error:', error);
// //                 alert('An error occurred. Please try again.');
// //             }
// //         });
// //     });
// // });



// $(document).ready(function () {
//     // Enable form validation feedback
//     (function () {
//         'use strict';
//         window.addEventListener('load', function () {
//             var forms = document.getElementsByClassName('needs-validation');
//             for (var i = 0; i < forms.length; i++) {
//                 forms[i].addEventListener('submit', function (event) {
//                     if (this.checkValidity() === false) {
//                         event.preventDefault();
//                         event.stopPropagation();
//                     }
//                     this.classList.add('was-validated');
//                 }, false);
//             }
//         }, false);
//     })();

//     $('#login-form').submit(function (event) {
//         event.preventDefault();

//         const formData = $(this).serializeArray();
//         const username = formData.find(item => item.name === 'username').value;
//         const password = formData.find(item => item.name === 'password').value;

//         $.ajax({
//             url: '/login',
//             method: 'POST',
//             contentType: 'application/json',
//             data: JSON.stringify({ username, password }),
//             success: function (data) {
//                 alert("Login successful!");
//                 window.location.href = '/main'; // Redirect to main page
//             },
//             error: function (xhr, textStatus, error) {
//                 const errorMessage = xhr.responseJSON?.message || 'An error occurred. Please try again.';
//                 $('#error-message').text(errorMessage);
//                 console.error('Error:', error);
//             }
//         });
//     });
// });


$(document).ready(function () {
    // Enable form validation feedback
    (function () {
        'use strict';
        window.addEventListener('load', function () {
            var forms = document.getElementsByClassName('needs-validation');
            for (var i = 0; i < forms.length; i++) {
                forms[i].addEventListener('submit', function (event) {
                    if (this.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    this.classList.add('was-validated');
                }, false);
            }
        }, false);
    })();

    $('#login-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        const username = $('#username').val(); 
        const password = $('#password').val(); 

        $.ajax({
            url: '/login', // POST request to /login
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }), // Send username and password
            success: function (data) {
                alert("Login successful!");
                window.location.href = '/home'; // Redirect to main page on success
            },
            error: function (xhr, textStatus, error) {
                const errorMessage = xhr.responseJSON?.message || 'An error occurred. Please try again.';
                $('#error-message').text(errorMessage); // Display error message
                console.error('Error:', error);
            }
        });
    });
});
