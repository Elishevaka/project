$(function () {
    $.ajax({
        url: '/getAllCustomers', // Fetch all customers
        type: 'GET',
        success: function (customers) {
            // Clear the table
            $('#customerList').empty();
            customers.forEach(function (customer) {

                // Add the row for the customer
                $('#customerList').append(`
                    <tr id="customer-${customer._id}">
                        <td>${customer.name}</td>
                        <td>${customer.clientId}</td>
                        <td>${customer.email}</td>
                        <td>${customer.phoneNumber}</td>
                        <td>${customer.city}</td>
                        <td>${customer.address}</td>
                        <td>${customer.zipCode}</td>
                        <td>
                            <span class="icon editCustomer" data-customer-id="${customer._id}">
                                <i class="fas fa-edit" title="Edit Customer"></i>
                            </span>
                        </td>
                         <!-- <td>
                              <span class="icon deleteCustomer" data-customer-id="${customer._id}">
                                <i class="fas fa-trash" title="Delete Customer"></i>
                             </span>
                          </td>-->
                    </tr>
                `);
            });

            $('#clientSearch').on('input', function () {
                let searchValue = $(this).val().toLowerCase();
                $('#customerList tr').each(function () {
                    const name = $(this).find('td:nth-child(1)').text().toLowerCase();
                    const clientId = $(this).find('td:nth-child(2)').text().toLowerCase();
                    const email = $(this).find('td:nth-child(3)').text().toLowerCase();
                    const phone = $(this).find('td:nth-child(4)').text().toLowerCase();
            
                    // Show row if any field matches the search input
                    $(this).toggle(
                        name.includes(searchValue) ||
                        clientId.includes(searchValue) ||
                        email.includes(searchValue) ||
                        phone.includes(searchValue)
                    );
                });
            });

            // Edit customer action
            $('.editCustomer').click(function () {
                const _id = $(this).data('customer-id');
                console.log('Customer ID:', _id); // Check if this logs the correct ID
                const row = $(this).closest('tr');
                // Convert cells to input fields
                const name = row.find('td:nth-child(1)').text();
                const clientId = row.find('td:nth-child(2)').text();
                const email = row.find('td:nth-child(3)').text();
                const phone = row.find('td:nth-child(4)').text();
                const city = row.find('td:nth-child(5)').text();
                const address = row.find('td:nth-child(6)').text();
                const zipCode = row.find('td:nth-child(7)').text();

                row.find('td:nth-child(1)').html(`<input type="text" class="form-control nameInput" value="${name}">`);
                row.find('td:nth-child(2)').html(`<input type="number" class="form-control clientIdInput" value="${clientId}">`);
                row.find('td:nth-child(3)').html(`<input type="email" class="form-control emailInput" value="${email}">`);
                row.find('td:nth-child(4)').html(`<input type="tel" class="form-control phoneInput" value="${phone}">`);
                row.find('td:nth-child(5)').html(`<input type="text" class="form-control cityInput" value="${city}">`);
                row.find('td:nth-child(6)').html(`<input type="text" class="form-control addressInput" value="${address}">`);
                row.find('td:nth-child(7)').html(`<input type="text" class="form-control zipCodeInput" value="${zipCode}">`);

                // Replace edit icon with save button
                $(this).replaceWith(`<span class="icon saveCustomer" data-customer-id="${_id}"><i class="fas fa-save" title="Save Customer"></i></span>`);

                // Save customer action
                $('.saveCustomer').off('click').click(function () {
                    const updatedCustomerData = {
                        name: row.find('.nameInput').val(),
                        clientId: row.find('.clientIdInput').val(),
                        email: row.find('.emailInput').val(),
                        phone: row.find('.phoneInput').val(),
                        city: row.find('.cityInput').val(),
                        address: row.find('.addressInput').val(),
                        zipCode: row.find('.zipCodeInput').val()
                    };
                    console.log("updatedCustomerData\n", updatedCustomerData);
                    
                    // Update customer in the database
                    $.ajax({
                        url: `/updateCustomer/${_id}`,
                        type: 'PUT',
                        data: updatedCustomerData,
                        success: function () {
                            alert('הלקוח עודכן בהצלחה');
                            location.reload();
                        },
                        error: function (xhr) {
                            alert('שגיאה בעדכון הלקוח: ' + xhr.responseJSON.error);
                        }
                    });
                });
            });
        },
        error: function () {
            //alert('שגיאה באחזור לקוחות:' + xhr.responseJSON.error);
            alert("שגיאה באחזור לקוחות")
        }
    });

    // Go back to home page button
    $('#menu').click(function () {
        window.location.href = "/home";
    });
});
