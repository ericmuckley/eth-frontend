// create a table
function createTable(headers=[], classes=['table'], parentdiv=null, id=null){
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




function createCard(config={"img": true, "header": true, "body": true, "footer": true}) {
    var cardObj = {};
    var card = document.createElement("div");
    card.classList.add("card");
    cardObj['card'] = card;
    if (config['img']) {
        var img = document.createElement('img');
        img.classList.add('card-img-top');
        card.appendChild(img);
        cardObj['img'] = img;
    };
    for (let key of ['header', 'body', 'footer']){
        if (config[key]) {
            var div = document.createElement("div");
            div.classList.add('card-' + key);
            card.appendChild(div);
            cardObj[key] = div;
        };
    };
    return cardObj;
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
    document.getElementById(parentdiv).appendChild(row);
    return row
};



// format a label for display by capitalizing the
// first letter and replacing underscores with spaces.
// use the "mapping" argument object to map specific labels
// to new ones.
function formatLabels(labels, mapping={}){
    var new_labels = [];
    for (let label of labels) {
        var new_label = null;
    
        if (mapping.hasOwnProperty(label)) {
            new_label = mapping[label];
        } else {
	        if (label === '') {
		        new_label = '';
	        } else {
	            new_label = (label.charAt(0).toUpperCase() + label.slice(1));
	            new_label = new_label.replace('_', ' ');
	        };
	    };
	    new_labels.push(new_label);
	};
	return new_labels;
};




// Using fetch method for an HTTP GET request
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function httpRequest(url, method="GET", data={}, headers={}) {
    const response = await fetch(url, {
        method: method,
        headers: headers,
        credential: 'include',
        //headers: {'Content-Type': 'application/json', ...headers},
        //...(method === "POST" && {body: JSON.stringify(data)}),
        //body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json();
};



// initialize all hover tooltips in the application
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
