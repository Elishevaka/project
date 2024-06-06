$(document).ready(function () {
    var currentURL = window.location.href;
    var buildingNameFromUrl = currentURL.split('/').pop().split('_')[0];

    // Define an object to store the number of rooms for each building
    const buildingRooms = {
        gefen: 30,
        dekel: 7,
        brosh: 10,
        vered: 9,
        alon: 5,
        savion: 16,
        calanit: 16,
        rimon: 8,
        shaked: 8,
        havatzelet: 8,
        duvdevan: 2,
        hadas: 8,
        zait: 9,
        nurit: 16,
        rakefet: 20,
        tehena: 13
    };

    // Data containing building information including number of rooms
    const buildingData = {
        buildingName: buildingNameFromUrl,
        numberOfRooms: buildingRooms[buildingNameFromUrl], // Default to 0 if building not found
    };

    // Send a POST request to save building information
    $.ajax({
        type: 'POST',
        url: '/saveBuildingInfo',
        contentType: 'application/json',
        data: JSON.stringify(buildingData),
        success: function (response) {
            console.log('Building data saved:', response);
            // Handle success if needed
            // Fetch or create room data for the building
            $.ajax({
                type: 'POST',
                url: '/getOrCreateRooms',
                contentType: 'application/json',
                data: JSON.stringify({ buildingName: buildingNameFromUrl }),
                success: function (data) {
                    console.log('Room data fetched/created:', data);
                    // Handle success - display the rooms as buttons or any other UI logic
                    //displayRooms(response.rooms);
                },
                error: function (err) {
                    console.error('Error fetching/creating room data:', err);
                }
            });
        },
        error: function (err) {
            console.error('Error saving building data:', err);
            // Handle error if needed
        }
    });

    $('#rooms_in_buildings').click(function () {

        for (let i = 1; i <= buildingData.numberOfRooms; i++) {
            window.location.href = 'details_form'
        }
    });


});

