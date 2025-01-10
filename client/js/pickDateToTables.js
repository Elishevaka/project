$(document).ready(function(){
    $('#loadDataBtn').click(function(){
        let date = $('#date').val();

        // Ensure dates are selected
        if(date){
            // Save dates in sessionStorage
            sessionStorage.setItem('date', date);

            // Redirect to the table page
            window.location.href = '/arrangeTables';
        } else {
            alert("בחר תאריך בבקשה");
        }
    });
        // Home page button
        $("#menu").click(function () {
            window.location.href = "/home";
        });
});