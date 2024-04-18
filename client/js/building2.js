$(document).ready(function () {

    var currentURL = window.location.href;
    var buildingNameFromUrl = currentURL.split('/').pop().split('_')[0];
    alert(buildingNameFromUrl)
    // Data containing building information
    const buildingData = {
        buildingName: buildingNameFromUrl,
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
        },
        error: function (err) {
            console.error('Error saving building data:', err);
            // Handle error if needed
        }
    });

    // Navigate to the specific room page when a room button is clicked
    $("#bulding2_room1").click(function () {
        // window.location.href = "building1_room1.html";
    });

    $("#bulding2_room2").click(function () {
        // window.location.href = "building1_room2.html";
    });


    //calanit rooms:
    $("#calanit_room1").click(function () {
        // window.location.href = "building1_room1.html";
    });

    $("#calanit_room2").click(function () {
        // window.location.href = "building1_room2.html";
    });



    //dekel rooms:
    $("#dekel_room1").click(function () {
        //window.location.href = "building1_room1.html";
    });

    $("#dekel_room2").click(function () {
        //window.location.href = "building1_room2.html";
    });

    //gefen rooms:
    $("#gefen_room1").click(function () {
        // window.location.href = "building1_room1.html";
    });

    $("#gefen_room2").click(function () {
        // window.location.href = "building1_room2.html";
    });


    //alon rooms:
    $("#alon_room1").click(function () {
        // window.location.href = "building1_room1.html";
    });

    $("#alon_room2").click(function () {
        // window.location.href = "building1_room2.html";
    });

    //brosh rooms:
    $("#brosh_room1").click(function () {
        //window.location.href = "building1_room1.html";
    });

    $("#brosh_room2").click(function () {
        //window.location.href = "building1_room2.html";
    });

    //havatzelet rooms:
    $("#havatzelet_room1").click(function () {
        // window.location.href = "building1_room1.html";
    });

    $("#havatzelet_room2").click(function () {
        // window.location.href = "building1_room2.html";
    });

    //rimon rooms:
    $("#rimon_room1").click(function () {
        // window.location.href = "building1_room1.html";
    });

    $("#rimon_room2").click(function () {
        // window.location.href = "building1_room2.html";
    });

    //savion rooms:
    $("#savion_room1").click(function () {
        // window.location.href = "building1_room1.html";
    });

    $("#savion_room2").click(function () {
        // window.location.href = "building1_room2.html";
    });

    //shaked rooms:
    $("#shaked_room1").click(function () {
        // window.location.href = "building1_room1.html";
    });

    $("#shaked_room2").click(function () {
        // window.location.href = "building1_room2.html";
    });

    //tamar rooms:
    $("#tamar_room1").click(function () {
        // window.location.href = "building1_room1.html";
    });

    $("#tamar_room2").click(function () {
        // window.location.href = "building1_room2.html";
    });

    //vered rooms:
    $("#vered_room1").click(function () {
        // window.location.href = "building1_room1.html";
    });

    $("#vered_room2").click(function () {
        // window.location.href = "building1_room2.html";
    });
    // function getBuildingNameFromURL() {
    //     var url = window.location.pathname;
    //     return url;
    // }
});

