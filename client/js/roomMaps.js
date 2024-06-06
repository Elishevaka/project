
$(document).ready(function () {
    let startDate, endDate;

    startDate = sessionStorage.getItem('startDate');
    endDate = sessionStorage.getItem('endDate');
    // Display the selected dates
    $("#dateDisplay").text("Selected Dates: " + startDate + " - " + endDate);

    // Object containing building names and their corresponding routes
    const buildings = {
        'building1_building': '/building1_building',
        'building2_building': '/building2_building',
        'gefen_building': '/gefen_building',
        'dekel_building': '/dekel_building',
        'brosh_building': '/brosh_building',
        'vered_building': '/vered_building',
        'alon_building': '/alon_building',
        'savion_building': '/savion_building',
        'calanit_building': '/calanit_building',
        'rimon_building': '/rimon_building',
        'shaked_building': '/shaked_building',
        'havatzelet_building': '/havatzelet_building',
        'duvdevan_building': '/duvdevan_building',
        'hadas_building': '/hadas_building',
        'zait_building': '/zait_building',
        'nurit_building': '/nurit_building',
        'rakefet_building': '/rakefet_building',
        'tehena_building': '/tehena_building'
    };

    $('.building-btn').click(function () {
        buildingName = $(this).attr('id').replace('_btn', '_building'); // Extract building name from button ID
        //send to building the Items
        sessionStorage.setItem('buildingName', buildingName);
        sessionStorage.setItem('startDate', startDate);
        sessionStorage.setItem('endDate', endDate);

        const route = buildings[buildingName]; // Get the corresponding route from the object
        if (route) {
            window.location.href = route; // Redirect to the selected building route
        } else {
            console.error('Route not found for building:', buildingName);
        }
    });
});


