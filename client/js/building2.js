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
        duvsevan: 2,
        hadas: 8,
        zait: 9,
        nurit: 16,
        rakefet: 20, 
        tehena: 13
    };

    // Data containing building information including number of rooms
    const buildingData = {
        buildingName: buildingNameFromUrl,
        numberOfRooms: buildingRooms[buildingNameFromUrl] || 0, // Default to 0 if building not found
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

///#todo - check this code is working.
    // Navigate to the specific room page when a room button is clicked
    for (let i = 1; i <= buildingData.numberOfRooms; i++) {
        $(`#${buildingNameFromUrl}_room${i}`).click(function () {
            // window.location.href = `${buildingNameFromUrl}_room${i}.html`;
        });
    }
//     // Navigate to the specific room page when a room button is clicked
//     $("#bulding2_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#bulding2_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });


//     //calanit rooms:
//     $("#calanit_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#calanit_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });



//     //dekel rooms:
//     $("#dekel_room1").click(function () {
//         //window.location.href = "building1_room1.html";
//     });

//     $("#dekel_room2").click(function () {
//         //window.location.href = "building1_room2.html";
//     });

//     //gefen rooms:
//     $("#gefen_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#gefen_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });


//     //alon rooms:
//     $("#alon_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#alon_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });

//     //brosh rooms:
//     $("#brosh_room1").click(function () {
//         //window.location.href = "building1_room1.html";
//     });

//     $("#brosh_room2").click(function () {
//         //window.location.href = "building1_room2.html";
//     });

//     //havatzelet rooms:
//     $("#havatzelet_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#havatzelet_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });

//     //rimon rooms:
//     $("#rimon_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#rimon_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });

//     //savion rooms:
//     $("#savion_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#savion_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });

//     //shaked rooms:
//     $("#shaked_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#shaked_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });

//     //duvdevan rooms:
//     $("#duvdevan_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#duvdevan_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });

//     //hadas rooms:
//     $("#hadas_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#hadas_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });

//       //zait rooms:
//       $("#zait_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#zait_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });

//       //nurit rooms:
//       $("#nurit_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#nurit_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });

//       //rakefet rooms:
//       $("#rakefet_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#rakefet_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });

//       //tehena rooms:
//       $("#tehena_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#tehena_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });
//     //vered rooms:
//     $("#vered_room1").click(function () {
//         // window.location.href = "building1_room1.html";
//     });

//     $("#vered_room2").click(function () {
//         // window.location.href = "building1_room2.html";
//     });
   
});

