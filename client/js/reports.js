$(function () {
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
                alert('שגיאה באחזור רשימת הבניינים. אנא נסה שוב.');
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
            alert('אנא בחר גם בניין וגם תאריך.');
            return;
        }

        // Trigger report generation
        $.ajax({
            url: '/api/reports/building', // Adjusted route
            method: 'GET',
            data: { buildingId, reportDate }, // Sending both buildingId and date
            success: function (data) {
                alert('הדוח נוצר בהצלחה!');
                const downloadLink = document.createElement('a');
                downloadLink.href = data.fileUrl;
                downloadLink.download = `${data.buildingName}_Report_${reportDate}.xlsx`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            },
            error: function (error) {
                alert('שגיאה ביצירת דוח. אנא נסה שוב.');
                console.error(error);
            }
        });
    });

    // Toggle client list visibility and load clients
    $('#chooseClientBtn').click(function () {
        $('#clientListContainer').toggle();
        fetchClientList();
    });

    // Fetch and display client options
    function fetchClientList(searchQuery = '') {
        $.ajax({
            url: '/api/reports/client-list',
            method: 'GET',
            data: { searchQuery }, // Sending the search query for filtering
            success: function (data) {
                $('#clientList').empty().append('<option value="">בחר לקוח</option>');
                data.forEach(client => {
                    $('#clientList').append(
                        `<option value="${client.clientId}">${client.name} - ${client.clientId}</option>`
                    );
                });
            },
            error: function (error) {
                alert('שגיאה באחזור רשימת הלקוחות. אנא נסה שוב.');
                console.error(error);
            }
        });
    }

    // Client search functionality
    $('#clientSearch').on('input', function () {
        let searchValue = $(this).val().toLowerCase();
        $('#clientList option').each(function () {
            const clientText = $(this).text().toLowerCase();
            $(this).toggle(clientText.includes(searchValue));
        });
    });

    // Generate report by client
    $('#generateClientReportBtn').click(function () {
        const clientId = $('#clientList').val();
        if (!clientId) {
            alert('אנא בחר לקוח.');
            return;
        }

        $.ajax({
            url: `/api/reports/client`,
            method: 'GET',
            data: { clientId },
            success: function (data) {
                alert('הדוח נוצר בהצלחה!');
                const downloadLink = document.createElement('a');
                downloadLink.href = data.fileUrl;
                downloadLink.download = `Client_Report_${data.clientName}.xlsx`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            },
            error: function (error) {
                alert('שגיאה ביצירת דוח. אנא נסה שוב.');
                console.error(error);
            }
        });
    });

    // Show/hide the date range container for all customers
    $('#chooseAllCustomersBtn').click(function () {
        $('#allCustomersReportContainer').toggle();
    });

    // Generate report for all customers within the selected date range
    $('#generateAllCustomersReportBtn').click(function () {
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();

        if (!startDate || !endDate) {
            alert('אנא בחר טווח תאריכים.');
            return;
        }

        $.ajax({
            url: '/api/reports/all-customers', // New endpoint for fetching report
            method: 'GET',
            data: { startDate, endDate }, // Sending date range for filtering
            success: function (data) {
                alert('הדוח נוצר בהצלחה!');
                const downloadLink = document.createElement('a');
                downloadLink.href = data.fileUrl;
                downloadLink.download = `All_Customers_Report_${startDate}_to_${endDate}.xlsx`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            },
            error: function (error) {
                alert('שגיאה ביצירת דוח. אנא נסה שוב.');
                console.error(error);
            }
        });
    });

    // Show/hide the order search container
    $('#chooseOrderBtn').click(function () {
        $('#orderListContainer').toggle();
        fetchOrderList(); // Fetch the order list
    });

    // Fetch order list from backend
    function fetchOrderList() {
        $.ajax({
            url: '/api/reports/order-list', // Adjusted endpoint to fetch all orders
            method: 'GET',
            success: function (data) {
                $('#orderList').empty().append('<option value="">בחר הזמנה</option>');
                data.forEach(order => {
                    $('#orderList').append(
                        `<option value="${order._id}">${order.clientName} - ${order._id} - ${order.clientId}</option>`
                    );
                });
            },
            error: function (error) {
                alert('שגיאה באחזור רשימת ההזמנות. אנא נסה שוב.');
                console.error(error);
            }
        });
    }

    // Generate report for selected order
    $('#generateOrderReportBtn').click(function () {
        const orderId = $('#orderList').val();
        if (!orderId) {
            alert('אנא בחר הזמנה.');
            return;
        }

        $.ajax({
            url: `/api/reports/order`, // Adjusted route for generating order report
            method: 'GET',
            data: { orderId },
            success: function (data) {
                alert('הדוח נוצר בהצלחה!');
                const downloadLink = document.createElement('a');
                downloadLink.href = data.fileUrl;
                downloadLink.download = `Order_Report_${orderId}.xlsx`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            },
            error: function (error) {
                alert('שגיאה ביצירת דוח. אנא נסה שוב.');
                console.error(error);
            }
        });
    });
    ////
    // When clicking the "Rooms Entering" button, show the date input
    $('#enteringOnDateBtn').click(function () {
        $('#dateSelectionContainer').show();
        $('#generateReportDateBtn').off('click').on('click', function () {
            generateReport('entering');
        });
    });

    // When clicking the "Rooms Leaving" button, show the date input
    $('#leavingOnDateBtn').click(function () {
        $('#dateSelectionContainer').show();
        $('#generateReportDateBtn').off('click').on('click', function () {
            generateReport('leaving');
        });
    });

    // Generate report based on the selected date and the report type
    function generateReport(reportType) {
        const selectedDate = $('#reportDate1').val();
        if (!selectedDate) {
            alert('אנא בחר תאריך');
            return;
        }

        let url = '';
        if (reportType === 'entering') {
            url = `/api/reports/entering-on-date`;
        } else if (reportType === 'leaving') {
            url = `/api/reports/leaving-on-date`;
        }
        $.ajax({
            url: url,
            method: 'GET',
            data: { selectedDate },
            success: function (data) {
                alert('הדוח נוצר בהצלחה!');
                const downloadLink = document.createElement('a');
                downloadLink.href = data.fileUrl;
                downloadLink.download = `Rooms_${reportType.charAt(0).toUpperCase() + reportType.slice(1)}_${selectedDate}_Report.xlsx`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            },
            error: function (error) {
                alert('שגיאה ביצירת דוח. אנא נסה שוב.');
                console.error(error);
            }
        });
    }

    ///
    $('#menu').on('click', function () {
        window.location.href = "/home";
    });
});

