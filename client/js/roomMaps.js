$(document).ready(function() {
    // Add click event listener to each building
    $(".building").click(function() {
        var buildingName = $(this).text();

        // Update building name in apartment list
        $("#building-name").text(`Apartments in ${buildingName}`);

        // Dummy data: List of apartments (you can replace it with your data)
        var apartments = [
            "Apartment 101",
            "Apartment 102",
            "Apartment 103"
            // Add more apartments as needed
        ];

        // Clear existing apartment list
        $("#apartments").empty();

        // Populate apartment list
        $.each(apartments, function(index, apartment) {
            $("<li>").text(apartment).appendTo("#apartments");
        });

        // Show apartment list
        $("#apartment-list").show();
    });
});
