$(document).ready(function () {
    // Function to handle form submission
    $("#registrationForm").submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        var formData = {
            name: $("#name").val(),
            email: $("#email").val(),
            phone: $("#phone").val()
        };

        // Perform form validation
        if (formData.name.trim() === '' || formData.phone.trim() === '') {
            $("#registrationMessage").html("<div class='alert alert-danger'>All fields are required.</div>");
        }

        // Simulate registration process (replace with your actual registration logic)
        // Here, we'll assume the registration is successful
        var registrationSuccessful = true;

        // Show registration message based on the result
        if (registrationSuccessful) {
            $("#registrationMessage").html("<div class='alert alert-success'>Registration successful!</div>");
        } else {
            $("#registrationMessage").html("<div class='alert alert-danger'>Registration failed. Please try again later.</div>");
        }
    });
});