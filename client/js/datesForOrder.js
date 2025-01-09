$(function () {
    // Fetch orders based on date range
    sessionStorage.clear();

    $('#fetchOrders').click(function(){
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();

        // Ensure dates are selected
        if(startDate && endDate){
            // Save dates in sessionStorage
            sessionStorage.setItem('startDate', startDate);
            sessionStorage.setItem('endDate', endDate);

            // Redirect to the table page
            window.location.href = '/orderMng';
        } else {
            alert("בחר תאריכים בבקשה");
        }
    });
    $('#menu').on('click', function () {
        window.location.href = "/home";
    });
});
