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

    $('#menu').on('click', function () {
        window.location.href = "/home";
    });
});
