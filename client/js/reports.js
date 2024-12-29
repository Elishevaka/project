// $(document).ready(function () {
//     function fetchBuildingList() {
//         $.ajax({
//             url: '/api/reports/building-list', // Backend endpoint to fetch buildings
//             method: 'GET',
//             success: function (data) {
//                 // Clear the dropdown
//                 $('#buildingList').empty();
//                 // Add a default option
//                 $('#buildingList').append('<option value="">בחר בניין:</option>');

//                 // Populate the dropdown with building data from the response
//                 data.forEach(building => {
//                     $('#buildingList').append(
//                         `<option value="${building._id}">${building.buildingName}</option>`
//                     );
//                 });
//             },
//             error: function (error) {
//                 alert('Error fetching building list. Please try again.');
//                 console.error(error);
//             }
//         });
//     }

//     // Show/hide the dropdown and fetch building data
//     $('#chooseBuildingBtn').click(function () {
//         $('#buildingListContainer').toggle();
//         fetchBuildingList();
//     });

//     // Generate a report for the selected building
//     $('#generateReportBtn').click(function () {
//         const buildingId = $('#buildingList').val();
//         console.log("buildingId: ", buildingId);

//         if (!buildingId) {
//             alert('Please select a building.');
//             return;
//         }

//         // Trigger report generation
//         $.ajax({
//             url: `/api/reports/building`, // General route
//             method: 'GET',
//             data: { buildingId }, // Sending buildingId as a query parameter
//             success: function (data) {
//                 alert('Report generated successfully!');
//                 // Assuming the backend returns a downloadable file URL
//                 const downloadLink = document.createElement('a');
//                 downloadLink.href = data.fileUrl; // URL provided by the backend
//                 downloadLink.download = ''; // Empty download attribute to trigger automatic download
//                 downloadLink.click();
//             },
//             error: function (error) {
//                 alert('Error generating report. Please try again.');
//                 console.error(error);
//             }
//         });
//     });
// });

$(document).ready(function () {

    function fetchBuildingList() {
        $.ajax({
            url: '/api/reports/building-list', // Backend endpoint to fetch buildings
            method: 'GET',
            success: function (data) {
                $('#buildingList').empty();
                $('#buildingList').append('<option value="">בחר בניין</option>');

                data.forEach(building => {
                    $('#buildingList').append(
                        `<option value="${building._id}">${building.buildingName}</option>`
                    );
                });
            },
            error: function (error) {
                alert('Error fetching building list. Please try again.');
                console.error(error);
            }
        });
    }

    // Show/hide the dropdown and fetch building data
    $('#chooseBuildingBtn').click(function () {
        $('#buildingListContainer').toggle();
        fetchBuildingList();
    });


    // Generate a report for the selected building and date
    $('#generateReportBtn').click(function () {
        const buildingId = $('#buildingList').val();
        const reportDate = $('#reportDate').val();

        if (!buildingId || !reportDate) {
            alert('Please select both a building and a date.');
            return;
        }

        // Trigger report generation
        $.ajax({
            url: `/api/reports/building`, // Adjusted route
            method: 'GET',
            data: { buildingId, reportDate }, // Sending both buildingId and date
            success: function (data) {
                alert('Report generated successfully!');
                const downloadLink = document.createElement('a');
                downloadLink.href = data.fileUrl;
                downloadLink.download = `${data.buildingName}_Report_${reportDate}.xlsx`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            },
            error: function (error) {
                alert('Error generating report. Please try again.');
                console.error(error);
            }
        });
    });
    $('#menu').click(function () {
        window.location.href = "/home";
    });
});