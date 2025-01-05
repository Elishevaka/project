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
