// create a table
function createTable(headers=[], classes=['table', 'table-sm', 'table-borderless'], parentdiv=null, id=null){
    const table = document.createElement("table");
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    var headrow = thead.insertRow();
    table.appendChild(thead);
    table.appendChild(tbody);
    for (var c of classes){
        table.classList.add(c);
    };
    for (var h of headers) {
        var th = document.createElement('th');
        th.style.textAlign = 'center';
        th.innerHTML = h;
        headrow.appendChild(th);
    };
    if (parentdiv !== null) {
        document.getElementById(parentdiv).appendChild(table);
    };
    if (id !== null) {
        table.id = id;
    };
    return [table, thead, tbody];
};


function createRowCols(parentdiv, ncols=2) {
    // Create a bootstrap row with multiple columns
    const row = document.createElement('div');
    row.classList.add('row');
    for (var i=0; i<ncols; i++) {
        const col = document.createElement('div');
        col.classList.add('col');
        row.appendChild(col);
    };
    parentdiv.appendChild(row);
    return row
};

