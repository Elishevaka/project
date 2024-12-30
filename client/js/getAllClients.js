// $(document).ready(function () {
//     $.ajax({
//         url: '/api/clients',
//         method: 'GET',
//         success: function (data) {
//             const tableBody = $('#clientTable tbody');
//             data.forEach(client => {
//                 const row = `
//                     <tr>
//                         <td>${client.name}</td>
//                         <td>${client.clientId}</td>
//                         <td>${client.email}</td>
//                         <td>${client.phoneNumber}</td>
//                         <td>${client.City}</td>
//                         <td>${client.Address}</td>
//                         <td>${client.ZipCode}</td>
//                     </tr>
//                 `;
//                 tableBody.append(row);
//             });
//         },
//         error: function (error) {
//             alert('Error fetching client data.');
//             console.error(error);
//         }
//     });
// });

$(document).ready(function () {
    $.ajax({
        url: '/api/clients',
        method: 'GET',
        success: function (data) {
            const tableBody = $('#clientTable tbody');
            data.forEach(client => {
                const row = `
                    <tr>
                        <td>
                            <a href="#" class="client-name" data-id="${client.clientId}">
                                ${client.name}
                            </a>
                        </td>
                        <td>${client.clientId}</td>
                    </tr>
                    <tr class="details-row" id="details-${client.clientId}" style="display: none;">
                        <td colspan="2">
                            <strong>Email:</strong> ${client.email}<br>
                            <strong>Phone Number:</strong> ${client.phoneNumber}<br>
                            <strong>City:</strong> ${client.City}<br>
                            <strong>Address:</strong> ${client.Address}<br>
                            <strong>Zip Code:</strong> ${client.ZipCode}
                        </td>
                    </tr>
                `;
                tableBody.append(row);
            });

            // Toggle the display of details when the client name is clicked
            $('.client-name').on('click', function (e) {
                e.preventDefault();
                const clientId = $(this).data('id');
                $(`#details-${clientId}`).toggle();
            });
        },
        error: function (error) {
            alert('Error fetching client data.');
            console.error(error);
        }
    });
});
