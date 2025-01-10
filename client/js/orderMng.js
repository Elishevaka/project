$(function () {
    // Fetch orders based on date range
    // $('#fetchOrders').click(function () {
        $('#orderTable').fadeIn();
        const startDate = sessionStorage.getItem('startDate');
        const endDate = sessionStorage.getItem('endDate');

        $.get(`/orders?startDate=${startDate}&endDate=${endDate}`, function (orders) {
            $('#orderTable tbody').empty();
            orders.forEach(order => {
                let paymentMethodHebrew;
                switch (order.paymentBy) {
                    case 'Credit':
                        paymentMethodHebrew = 'אשראי';
                        break;
                    case 'Cash':
                        paymentMethodHebrew = 'מזומן';
                        break;
                    case 'Check':
                        paymentMethodHebrew = "צ'ק";
                        break;
                    default:
                        paymentMethodHebrew = 'לא שולם';
                }
                $('#orderTable tbody').append(`
                    <tr id="order-${order._id}">
                        <td>${order.clientId}</td>
                        <td>${order.startDate.split('T')[0]}</td>
                        <td>${order.endDate.split('T')[0]}</td>
                        <td>${order.amount}</td>
                        <td>${paymentMethodHebrew}</td>
                        <td><button class="editOrder" data-id="${order._id}">ערוך</button></td>
                        <td><button class="deleteOrder" data-id="${order._id}">מחק</button></td>
                    </tr>
                `);
            });
        });
    // });

    // Delete order
    $(document).on('click', '.deleteOrder', function () {
        const orderId = $(this).data('id');
        if (confirm('האם אתה בטוח שברצונך למחוק הזמנה זו?')) {
            $.ajax({
                url: `/deleteOrder/${orderId}`,
                type: 'DELETE',
                success: function () {
                    alert('ההזמנה נמחקה בהצלחה');
                    location.reload();
                }
            });
        }
    });

    // Update order - Edit Mode
    $(document).on('click', '.editOrder', function () {
        const orderId = $(this).data('id');
        const row = $(this).closest('tr');

        // Convert cells into editable fields
        const clientId = row.find('td:nth-child(1)').text();
        const startDate = row.find('td:nth-child(2)').text();
        const endDate = row.find('td:nth-child(3)').text();
        const amount = row.find('td:nth-child(4)').text();
        const paymentBy = row.find('td:nth-child(5)').text();

        row.find('td:nth-child(1)').html(`<input type="number" class="clientIdInput" value="${clientId}">`);
        row.find('td:nth-child(2)').html(`<input type="date" class="startDateInput" value="${startDate}">`);
        row.find('td:nth-child(3)').html(`<input type="date" class="endDateInput" value="${endDate}">`);
        row.find('td:nth-child(4)').html(`<input type="number" class="amountInput" value="${amount}">`);
        row.find('td:nth-child(5)').html(`
            <select class="paymentByInput">
                <option value="No payment" ${paymentBy === 'No payment' ? 'selected' : ''}>לא שולם</option>
                <option value="Credit" ${paymentBy === 'Credit' ? 'selected' : ''}>אשראי</option>
                <option value="Check" ${paymentBy === 'Check' ? 'selected' : ''}>צ'ק</option>
                <option value="Cash" ${paymentBy === 'Cash' ? 'selected' : ''}>מזומן</option>
            </select>
        `);

        // Change "Edit" button to "Save"
        row.find('.editOrder').replaceWith(`<button class="saveOrder" data-id="${orderId}">שמור</button>`);
    });

    // Save updated order
    $(document).on('click', '.saveOrder', function () {
        const orderId = $(this).data('id');
        const row = $(this).closest('tr');

        const updatedOrderData = {
            clientId: row.find('.clientIdInput').val(),
            startDate: row.find('.startDateInput').val(),
            endDate: row.find('.endDateInput').val(),
            amount: row.find('.amountInput').val(),
            paymentBy: row.find('.paymentByInput').val()
        };

        if (confirm('האם אתה בטוח שברצונך לעדכן הזמנה זו?')) {
            $.ajax({
                url: `/updateOrder/${orderId}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(updatedOrderData),
                success: function () {
                    alert('ההזמנה עודכנה בהצלחה');
                    location.reload();
                },
                error: function (xhr) {
                    alert('שגיאה בעדכון ההזמנה: ' + xhr.responseJSON.error);
                }
            });
        }
    });
    $('#menu').on('click', function () {
        window.location.href = "/home";
    });
});
