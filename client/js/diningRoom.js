// const canvas = document.getElementById("diningCanvas");
// const ctx = canvas.getContext("2d");

// let tables = []; // Array to hold table objects
// let selectedTable = null;

// // Function to draw all tables
// function drawTables() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
//     tables.forEach(table => {
//         ctx.fillStyle = table.isSelected ? "blue" : "green";
//         ctx.fillRect(table.x, table.y, table.width, table.height);
//         ctx.fillStyle = "white";
//         ctx.fillText(`Table ${table.id}`, table.x + 10, table.y + 20);
//     });
// }

// // Add a new table
// document.getElementById("addTableButton").addEventListener("click", () => {
//     const newTable = {
//         id: tables.length + 1,
//         x: 100,
//         y: 100,
//         width: 100,
//         height: 50,
//         isSelected: false,
//     };
//     tables.push(newTable);
//     drawTables();
// });

// // Handle table selection and dragging
// canvas.addEventListener("mousedown", (e) => {
//     const mouseX = e.offsetX;
//     const mouseY = e.offsetY;

//     selectedTable = tables.find(table => 
//         mouseX > table.x && mouseX < table.x + table.width &&
//         mouseY > table.y && mouseY < table.y + table.height
//     );

//     if (selectedTable) selectedTable.isSelected = true;
//     drawTables();
// });

// canvas.addEventListener("mousemove", (e) => {
//     if (!selectedTable) return;

//     const mouseX = e.offsetX;
//     const mouseY = e.offsetY;

//     // Update table position
//     selectedTable.x = mouseX - selectedTable.width / 2;
//     selectedTable.y = mouseY - selectedTable.height / 2;
//     drawTables();
// });

// canvas.addEventListener("mouseup", () => {
//     if (selectedTable) selectedTable.isSelected = false;
//     selectedTable = null;
// });
//

//$(document).ready(function () {
$(function() {
    function createTables(roomId, numTables) {
        let container = $(`#${roomId} .tables-container`);
        for (let i = 1; i <= numTables; i++) {
            let characteristics = `Table Size: ${Math.ceil(Math.random() * 10) + 2}, Color: ${['Red', 'Blue', 'Green'][Math.floor(Math.random() * 3)]}`;
            let table = $(`<div class='table' data-characteristics='${characteristics}'>Table ${i}</div>`);
            container.append(table);
        }
    }

    createTables('dining-room-1', 100);
    createTables('dining-room-2', 100);

    $('.table').on('click', function () {
        alert($(this).data('characteristics'));
    });
});
