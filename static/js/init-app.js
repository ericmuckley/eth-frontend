

var cgPriceUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

var openseaAssetsUrl = "https://api.opensea.io/api/v1/assets?owner=0x91a42eCF59abB8350A0A64c8D3f5eb3bD08cc6c2";


/*

function loadXMLDoc(url) {
    var xmlhttp = new XMLHttpRequest();


    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
           if (xmlhttp.status == 200) {
               document.getElementById("price-results").innerHTML = xmlhttp.responseText;
           } else {
               alert('something else other than 200 was returned');
           }
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
};
*/

//loadXMLDoc(cgPriceUrl);






// Using fetch method for an HTTP request
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

async function httpRequest(url, method="GET", data={}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //...(method === "POST" && {body: JSON.stringify(data)}),
        //body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
};



httpRequest(cgPriceUrl)
.then(data => {
    //console.log(data); // JSON data parsed by `data.json()` call
    //document.getElementById("price-results").innerHTML = JSON.stringify(data, null, 4);
    
    
    var keys = Object.keys(data[0]);
        

    // create the price feed table
    var [table, thead, tbody] = createTable(
        headers=keys,
        classes=['table', 'table-sm', 'table-borderless'],
        parentdiv='price-feed-div',
        id='price-feed-table',
    );
    table.style.width = "100%";
    table.style.overflow = "auto";
    
    // populate price feed table
    for (let coin of data) {
        var row = thead.insertRow()
        for (let k of keys) {
            var cell = row.insertCell()
            cell.innerHTML = coin[k];
        };
    };

    // for initializing basic DataTables
    $(document).ready(function() {
        $("#price-feed-table").DataTable({});
    });
    
});


/*
httpRequest(openseaAssetsUrl)
.then(data => {
    //console.log(data); // JSON data parsed by `data.json()` call
    document.getElementById("nft-results").innerHTML = JSON.stringify(data, null, 4);
});

*/













// initialize all hover tooltips in the application
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})







