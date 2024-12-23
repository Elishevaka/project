
$(document).ready(function () {
    // Initialize jQuery UI datepickers
    $("#datepicker1").datepicker({
        dateFormat: "dd/mm/yy"
    });

    $("#datepicker2").datepicker({
        dateFormat: "dd/mm/yy",
        onSelect: function (dateText) {
            $("#dateDisplay").text(`Selected End Date: ${dateText}`);
        }
    });

    // Show or hide the second date picker based on option selection
    $("#dateOption").change(function () {
        const option = $(this).val();
        if (option === "range") {
            $("#datepicker2").show();
        } else {
            $("#datepicker2").hide();
        }
    });

    // Confirm date button
    $("#selectDate").click(function () {
        const option = $("#dateOption").val();
        const startDate = $("#datepicker1").val();
        const endDate = $("#datepicker2").val();

        if (option === "single" && !startDate) {
            alert("Please select a date first!");
            return;
        } else if (option === "range" && (!startDate || !endDate)) {
            alert("Please select both start and end dates!");
            return;
        }
        // Prepare the data object based on the selection
        //let requestData = option === "single" ? { date: startDate } : { startDate: startDate, endDate: endDate };
        if (option === "single") {
            const start = parseDateString(startDate);
            alert("start: " + start + " and startDate: " + startDate)
            $.ajax({
                url: "/api/getDailyOccupancy",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ date: start }),
                success: function (data) {
                    //if (option === "single") {
                    // Option 1: Display only the occupancy percentage as a number
                    const { date, occupiedCount, totalRooms } = data;
                    if (totalRooms === 0) {
                        alert("No rooms available for this date.");
                        return;
                    }

                    const occupancyPercentage = ((occupiedCount / totalRooms) * 100).toFixed(2);
                    alert(`On ${date}, the occupancy percentage is ${occupancyPercentage}%`);
                },
                error: function (err) {
                    console.error("Error fetching occupancy:", err);
                }
            });
        }
        else if (option === "range") {
            // Date Range Option
            const labels = [];
            const percentages = [];
            const start = parseDateString(startDate);
            const end = parseDateString(endDate);
            alert("start: " + start)
            for (let currentDate = start; currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
                const formattedDate = currentDate.toISOString().split('T')[0];
                labels.push(formattedDate);

                $.ajax({
                    url: "/api/getDailyOccupancy",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({ date: currentDate }),
                    success: function (data) {
                        const { date, occupiedCount, totalRooms } = data;
                        const occupancyPercentage = totalRooms > 0 ? Number(((occupiedCount / totalRooms) * 100).toFixed(2)) : 0;
                        percentages.push(occupancyPercentage);
                    },
                    error: function (err) {
                        console.error(`Error fetching occupancy for ${formattedDate}:`, err);
                        percentages.push(0); // Push 0 if there's an error
                    }
                });
            }
            console.log("labels: ", labels);
            console.log("percentages: ", percentages);

            // Render Bar Chart
            document.body.innerHTML = "";
            const container = document.createElement('div');
            container.classList.add('container', 'mt-4');
            container.innerHTML = `
                <h3>אחוז תפוסה בין התאריכים:</h3>
                <canvas id="occupancyChartRange" width="800" height="400"></canvas>
                <button type="button" id="menu" class="btn btn-secondary">Home</button>

            `;
            document.body.appendChild(container);

            const ctx = document.getElementById('occupancyChartRange').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'אחוז תפוסה',
                        data: percentages,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                                display: true,
                                text: 'אחוז (%)'
                            }
                        }
                    }
                }
            });
            // Home page button
            $("#menu").click(function () {
                window.location.href = "/home";
            });

        }
    });

    // Home page button
    $("#menu").click(function () {
        window.location.href = "/home";
    });
});
function parseDateString(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);

    if (!day || !month || !year) throw new Error('Invalid date format');
    return new Date(Date.UTC(year, month - 1, day)); // Month is zero-indexed
}
