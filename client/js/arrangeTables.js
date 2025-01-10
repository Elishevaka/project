$(document).ready(function () {
    let date = sessionStorage.getItem('date');

    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // Set endDate to the next day

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);
    console.log(date, startDate, startDateFormatted);

    // Fetch all orders
    $.get(`/orders?startDate=${startDateFormatted}&endDate=${endDateFormatted}`, function (orders) {
        console.log("all orders\n", orders);
        $('#unassignedReservationsTable tbody').empty();
        //const unassignedOrders = orders.filter(order => order.tableId == null); // Orders with no assigned tables
        const unassignedOrders = orders.filter(order => !order.tableIds || order.tableIds.length === 0);
        console.log("unassignedOrders\n", unassignedOrders);

        if (unassignedOrders.length === 0) {
            $('#unassignedReservationsTable tbody').append(`
                    <tr>
                        <td colspan="4" class="text-center">אין הזמנות להצגה</td>
                    </tr>
                `);
        } else {
            // Display unassigned orders
            unassignedOrders.forEach(order => {
                $('#unassignedReservationsTable tbody').append(`
                    <tr>
                        <td>${order.clientId}</td>
                        <td>${new Date(order.startDate).toLocaleDateString()} - ${new Date(order.endDate).toLocaleDateString()}</td>
                        <td>${JSON.stringify(order.tablePreferences)}</td>
                        <td><button class="associateOrderBtn" data-order-id="${order._id}">בחר הזמנה</button></td>
                    </tr>
                `);
            });
        }
        // Save unassigned orders for later use
        window.unassignedOrders = unassignedOrders;

        // Fetch all tables and reservations after the orders have been fetched
        $.ajax({
            url: '/getAllTables',
            type: 'GET',
            success: function (tables) {
                if (tables.length === 0) {
                    $('#availableTablesTable').append(`
                            <tr>
                                <td colspan="6" style="text-align: center;">אין שולחנות להצגה</td>
                            </tr>
                        `);
                    return; // Stop execution here as no tables are available
                }
                console.log("tables\n", tables);

                $('#availableTablesTable tbody').empty();
                $.ajax({
                    url: `/getReservationsForDate?date=${startDateFormatted}`,
                    type: 'GET',
                    success: function (reservations) {

                        let tablesFree = []; // Array to store available tables
                        console.log("lala reservations\n", reservations)
                        if (reservations.length === 0) {
                            tablesFree = tables.filter(function (table) {
                                let isOrdered = false;
                                console.log(orders);

                                // Check if table is ordered in all orders (including unassigned)
                                orders.forEach(function (order) {
                                    if (Array.isArray(order.tableIds)) {
                                        order.tableIds.forEach(function (orderTable) {
                                            if (order.tableId != null && orderTable._id.toString() === order.tableId.toString()) {
                                                isOrdered = true; // Table is ordered
                                                return; // No need to check further if already ordered
                                            }
                                        });
                                    }
                                });

                                return !isOrdered; // If not ordered, push to free tables
                            });
                        } else {
                            // Loop through each table and check if it exists in the reservations or orders
                            tables.forEach(function (table) {
                                let isReserved = false;
                                let isOrdered = false;

                                // Check if table is reserved in reservations
                                reservations.forEach(function (reservation) {
                                    if (table._id.toString() === reservation.diningTableId._id.toString()) {
                                        isReserved = true; // Table is reserved
                                        return; // No need to check further if already reserved
                                    }
                                });

                                // Check if table is ordered in all orders (including unassigned)
                                orders.forEach(function (order) {
                                    if (Array.isArray(order.tableIds)) {
                                        order.tableIds.forEach(function (orderTable) {
                                            if (order.tableId != null && orderTable._id.toString() === order.tableId.toString()) {
                                                isOrdered = true; // Table is ordered
                                                return; // No need to check further if already ordered
                                            }
                                        });
                                    }
                                });

                                // If the table is neither reserved nor ordered, add it to the tablesFree array
                                if (!isReserved && !isOrdered) {
                                    tablesFree.push(table);
                                }
                            });
                        }
                        console.log("tablesFree:", tablesFree);

                        // Clear the table before populating
                        $('#availableTablesTable tbody').empty();

                        if (tablesFree.length === 0) {
                            $('#availableTablesTable tbody').append(`
                            <tr>
                                <td colspan="6" style="text-align: center;">אין שולחנות פנויים להציג</td>
                            </tr>
                        `);
                            return; // Stop if no available tables
                        }

                        // Display available tables
                        tablesFree.forEach(function (table) {
                            const displayedTableNumber = table.tableNumber.split('_')[1] || table.tableNumber;
                            $('#availableTablesTable tbody').append(`
                            <tr id="table-${table._id}">
                                <td class="diningRoom">${table.diningRoom}</td>
                                <td class="tableNumber">${displayedTableNumber}</td>
                                <td class="numberOfSeats">${table.numberOfSeats}</td>
                                <td class="nearWindow">${table.nearWindow ? 'כן' : 'לא'}</td>
                                <td class="nearDoor">${table.nearDoor ? 'כן' : 'לא'}</td>
                                <td><input type="checkbox" class="tableCheckbox" data-table-id="${table._id}"></td>
                            </tr>
                        `);
                        });
                    },
                    error: function (xhr) {
                        alert('שגיאה באחזור ההזמנות: ' + xhr.responseJSON.error);
                    }
                });
            },
            error: function (xhr) {
                alert('שגיאה באחזור השולחנות: ' + xhr.responseJSON.error);
            }
        });
    });
    //});
    let selectedOrderId = null;
    let selectedTables = []; // To store multiple selected tables

    // Click event for selecting a reservation
    $(document).on('click', '.associateOrderBtn', function () {
        selectedOrderId = $(this).data('order-id');
        selectedTables = []; // Reset selected tables when a new order is chosen
        alert('הזמנה נבחרה, כעת אנא בחר שולחן מהטבלה למטה. תוכל לבחור יותר משולחן אחד.');
    });

    $(document).on('change', '.tableCheckbox', function () {
        const tableId = $(this).data('table-id');

        if ($(this).is(':checked')) {
            if (!selectedTables.includes(tableId)) {
                selectedTables.push(tableId);
            }
        } else {
            selectedTables = selectedTables.filter(id => id !== tableId);
        }
    });

    // Assign the selected tables to the order
    $(document).on('click', '#assignTablesBtn', function () {
        if (!selectedOrderId) {
            alert('אנא בחר הזמנה');
            return;
        }
        if (selectedTables.length === 0) {
            alert('אנא בחר לפחות שולחן אחד');
            return;
        }

        //const date = $('#date').val();

        $.ajax({
            url: `/assignTableToOrder`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ orderId: selectedOrderId, tableIds: selectedTables, date }),
            success: function () {
                alert('השולחנות שויכו בהצלחה!');
                //$('#loadDataBtn').click(); // Reload data
                selectedOrderId = null; // Clear selected order
                selectedTables = []; // Clear selected tables
                window.location.href = '/pickDateToTables';
            },
            error: function () {
                alert('שגיאה בשיוך השולחנות להזמנה.');
            }
        });
    });
    $('#menu').on('click', function () {
        window.location.href = "/home";
    });
});
