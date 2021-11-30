

const ETHERSCAN_API_KEY = "9FBNJFFAW5H9X27RTUNVDTG3KH1X3VQVCI";







// get address information
document.getElementById("submit-address").onclick = function () {
    document.getElementById("assets-loading").style.display = "block";
    document.getElementById("assets-content").innerHTML = "";

    var myaddress = document.getElementById("address-input").value;
    var openseaAssetsUrl = "https://api.opensea.io/api/v1/assets?owner=" + myaddress;




    var ETHERSCAN_GET_ETH_URL = `https://api.etherscan.io/api?module=account&action=balance&address=${myaddress}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
    httpRequest(ETHERSCAN_GET_ETH_URL)
    .then(data => {
        console.log(data['result'] / 1e18);
    });










    // load the address assets using the opensea API
    httpRequest(openseaAssetsUrl)
    .then(data => {
        console.log(data);
        //document.getElementById("assets-content").innerHTML = JSON.stringify(data, null, 4);


        // get NFT info out of opensea assets
        var nfts = data["assets"];
         document.getElementById("assets-content").innerHTML += '<h3>NFTs</h3>';

        var row = createRowCols('assets-content', ncols=nfts.length)
        row.style.width = "100%";
        row.style.overflow = "auto";
        var nft_i = 0;

        for (let nft of nfts) {

            cardObj = createCard(config={"img": true, "header": false, "body": true, "footer": true});
            //cardObj['card'].style = "width: 18rem";
            cardObj['img'].src = nft['image_url'];
            cardObj['img'].alt = nft['name'] + ' image';

            var cardtitle = document.createElement('h3');
            cardtitle.innerHTML = nft['name'];
            cardObj['body'].appendChild(cardtitle);

            var p = document.createElement('p');
            p.classList.add('lead');
            p.innerHTML = nft['description'] !== null ? nft['description'] : "no description";
            cardObj['body'].appendChild(p);

            var a = document.createElement('a');
            a.href = nft['permalink'];
            a.target = "_blank";
            a.text = "View on OpenSea";
            cardObj['footer'].appendChild(a);

            row.children[nft_i].appendChild(cardObj['card']);
            nft_i += 1;

            //document.getElementById("assets-content").appendChild(cardObj['card']);

        };


    });





    document.getElementById("assets-loading").style.display = "none";


};












// load the price feed information using the CoinGecko API
const COINGECKO_PRICE_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
httpRequest(COINGECKO_PRICE_URL)
.then(data => {

    //var keys = Object.keys(data[0]);
    var keys = ["", "name", "current_price", "market_cap", "price_change_percentage_24h"];
    var mapping = {
        "current_price": "Price ($)",
        "market_cap": "Market cap ($B)",
        "price_change_percentage_24h": "24 hr change (%)",
    };

    // create the price feed table
    var [table, thead, tbody] = createTable(
        headers=formatLabels(keys, mapping=mapping),
        classes=['table', 'table-sm', 'table-striped'],
        parentdiv='price-feed-div',
        id='price-feed-table',
    );
    table.style.width = "100%";
    table.style.overflow = "auto";
    

    // populate price feed table
    for (let coin of data) {
        var row = tbody.insertRow()
        for (let k of keys) {
            var cell = row.insertCell();
            
            if (k === ""){
            
                var img = document.createElement('img');
                img.src = coin["image"];
                img.style.height = '30px';
                img.style.width = '30px';
                img.style.display = "block";
                cell.appendChild(img);
            
            } else if (k === "market_cap") {
                cell.innerHTML = coin[k] / 1000000000;
            } else if (k === "price_change_percentage_24h") {
                if (coin[k].toString().startsWith("-")) {
                    cell.innerHTML = coin[k];
                    cell.style.color = 'red';
                } else {
                    cell.innerHTML = "+" + coin[k];
                    cell.style.color = 'green';
                };
    
            } else {
            
                cell.innerHTML = coin[k];
            };
        };
    };

    // for initializing basic DataTables
    $(document).ready(function() {
        $("#price-feed-table").DataTable({});
    });
    
    document.getElementById("price-feed-loading").style.display = "none";
    document.getElementById("price-feed-content").style.display = "block";
    
});





