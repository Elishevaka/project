
$(function () {

    $("#datepicker1").datepicker({
        dateFormat: "dd/mm/yy"
    });

    $("#datepicker2").datepicker({
        dateFormat: "dd/mm/yy",
        onSelect: function (dateText) {
            $("#dateDisplay").text(`בחר תאריך סיום: ${dateText}`);
        }
    });
    function toggleEndDateVisibility() {
        const option = $("#dateOption").val();
        if (option === "range") {
            $("#endDateContainer").show();
            $("#datepicker2").show();

        } else {
            $("#endDateContainer").hide();
        }
    }
    toggleEndDateVisibility();
    $("#dateOption").change(function () {
        toggleEndDateVisibility();
    });
    // Confirm date button
    $("#selectDate").click(function () {
        const option = $("#dateOption").val();
        const startDate = $("#datepicker1").val();
        const endDate = $("#datepicker2").val();

        if (option === "single" && !startDate) {
            alert("חייב לבחור תאריך התחלה");
            return;
        } else if (option === "range" && (!startDate || !endDate)) {
            alert("חייב לבחור תאריך התחלה וסוף");
            return;
        }
        if (option === "single") {
            const start = parseDateString(startDate);
            $.ajax({
                url: "/api/getDailyOccupancy",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ date: start }),
                success: function (data) {
                    const { occupiedCount, totalRooms } = data;
                    const occupancyPercentage = ((occupiedCount / totalRooms) * 100).toFixed(2);
                    
                    // Update only the content inside #dynamicContent without clearing the entire page
                    $("#dynamicContent").html(`
                        <h2 class="daily-by-one-date">בתאריך: ${startDate} אחוז התפוסה הוא: ${occupancyPercentage}%</h2>
                    `);
                },
                error: function (err) {
                    console.error("שגיאה בהבאת תפוסה:", err);
                }
            });
        }
        else if (option === "range") {
            // Date Range Option
            const labels = [];
            const percentages = [];
            const start = parseDateString(startDate);
            const end = parseDateString(endDate);

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
                        console.error(`שגיאה בהבאת תפוסה עבור: ${formattedDate}:`, err);
                        percentages.push(0); // Push 0 if there's an error
                    }
                });
            }

            // Render Bar Chart
            document.body.innerHTML = "";
            const container = document.createElement('div');
            container.classList.add('container', 'mt-4');
            container.innerHTML = `
                <h3>אחוז תפוסה בין התאריכים:</h3>
                <canvas id="occupancyChartRange" width="800" height="400"></canvas>
                <button type="button" id="menu" class="btn btn-custom btn-proj btn-home"><i class="fas fa-home"></i>עמוד הבית</button>

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
