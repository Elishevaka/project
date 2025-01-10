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

    function closeAllContainers() {
        $('#clientListContainer').hide();
        $('#allCustomersReportContainer').hide();
        $('#buildingListContainer').hide();
        $('#orderListContainer').hide();
        $('#enteringDateSelectionContainer').hide();
        $('#leavingDateSelectionContainer').hide();
        $('#revenueByDateContainer').hide();
        $('#revenueByPaymentTypeContainer').hide();
        $('#diningRoomFilterContainer').hide();
    }

    function toggleContainer(containerId) {
        if ($(containerId).is(':visible')) {
            // אם ה-div פתוח, נסגור אותו
            $(containerId).hide();
        } else {
            // אם ה-div סגור, נסגור את כל השאר ונפתח אותו
            closeAllContainers();
            $(containerId).show();
        }
    }

    // Show/hide the dropdown and fetch building data
    $('#chooseBuildingBtn').click(function () {
        toggleContainer('#buildingListContainer');
        if ($('#buildingListContainer').is(':visible')) {
            fetchBuildingList();
        }
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
        toggleContainer('#clientListContainer');
        if ($('#clientListContainer').is(':visible')) {
            fetchClientList();
        }
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
        toggleContainer('#allCustomersReportContainer');
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
        toggleContainer('#orderListContainer');
        if ($('#orderListContainer').is(':visible')) {
            fetchOrderList(); // Fetch the order list
        }
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
        toggleContainer('#enteringDateSelectionContainer');
        if ($('#enteringDateSelectionContainer').is(':visible')) {
            $('#enteringGenerateReportDateBtn').off('click').on('click', function () {
                generateReport('entering');
            });
        }
    });

    // When clicking the "Rooms Leaving" button, show the date input
    $('#leavingOnDateBtn').click(function () {
        toggleContainer('#leavingDateSelectionContainer');
        if ($('#leavingDateSelectionContainer').is(':visible')) {
            $('#leavingGenerateReportDateBtn').off('click').on('click', function () {
                generateReport('leaving');
            });
        }
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
    // Show/hide the date range container for revenue by date
    $('#chooseRevenueByDateBtn').click(function () {
        toggleContainer('#revenueByDateContainer');
    });

    // Generate revenue by date report
    $('#generateRevenueByDateBtn').click(function () {
        const startDate = $('#revenueStartDate').val();
        const endDate = $('#revenueEndDate').val();

        if (!startDate || !endDate) {
            alert('אנא בחר טווח תאריכים.');
            return;
        }

        $.ajax({
            url: '/api/revenueByDate',
            method: 'GET',
            data: { startDate, endDate },
            success: function (data) {
                alert('הדוח נוצר בהצלחה!');
                const downloadLink = document.createElement('a');
                downloadLink.href = data.fileUrl;
                downloadLink.download = `Revenue_Report_${startDate}_to_${endDate}.xlsx`;
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

    // Show/hide the payment type container for revenue by payment type
    $('#chooseRevenueByPaymentTypeBtn').click(function () {
        toggleContainer('#revenueByPaymentTypeContainer');
    });

    // Generate revenue by payment type report
    $('#generateRevenueByPaymentTypeBtn').click(function () {
        const startDate = $('#startDate1').val();
        const endDate = $('#endDate1').val();
        const paymentType = $('#paymentTypeList').val();
    
        if (!paymentType || !startDate || !endDate) {
            alert('אנא בחר סוג תשלום או תאיריכם.');
            return;
        }

        $.ajax({
            url: '/api/revenueByPaymentType',
            method: 'GET',
            data: { startDate, endDate, paymentType },
            success: function (data) {
                alert('הדוח נוצר בהצלחה!');
                const downloadLink = document.createElement('a');
                downloadLink.href = data.fileUrl;
                downloadLink.download = `Revenue_Report_By_Payment_${paymentType}.xlsx`;
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
    $('#chooseDiningRoomBtn').click(function () {
        toggleContainer('#diningRoomFilterContainer');
    });

    $('#generateDiningRoomReportBtn').click(function () {
        const diningRoom = $('#diningRoomList').val();
        const nearWindow = $('#nearWindow').is(':checked');
        const nearDoor = $('#nearDoor').is(':checked');
        const date = $('#date2').val();
        
        if (!diningRoom || ! startDate || !endDate) {
            alert('אנא בחר חדר אוכל ותאריכים.');
            return;
        }
        
        // const nearWindowText = nearWindow ? 'כן' : '';
        // const nearDoorText = nearDoor ? 'כן' : '';
        
        $.ajax({
            url: '/api/reports/dining-room', // Backend endpoint
            method: 'GET',
            data: { diningRoom, nearWindow ,nearDoor, date },
            success: function (data) {
                alert('הדוח נוצר בהצלחה!');
                const downloadLink = document.createElement('a');
                downloadLink.href = data.fileUrl;
                downloadLink.download = `Dining_Room_Report_${diningRoom}.xlsx`;
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
    ///
    $('#menu').on('click', function () {
        window.location.href = "/home";
    });
});