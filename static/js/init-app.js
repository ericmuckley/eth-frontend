const ETHERSCAN_API_KEY = "9FBNJFFAW5H9X27RTUNVDTG3KH1X3VQVCI";
const MORALIS_API_KEY = "7ppRwksxCVAKooIVEKCaGMyfY67mvKi9du0QbpRdrLl7kR7UxpFshGZVk820AEsL";




// get address information
document.getElementById("submit-address").onclick = function () {
    document.getElementById("assets-loading").style.display = "block";

    for (let c of document.getElementById("assets-content").children) {
        c.innerHTML = "";
    }

    var myaddress = document.getElementById("address-input").value;
    var openseaAssetsUrl = `https://api.opensea.io/api/v1/assets?owner=${myaddress}`;
    var moralisAssetsUrl = `https://deep-index.moralis.io/api/v2/${myaddress}/erc20?chain=eth`



    // get ERC20 tokens using Moralis 
    httpRequest(
        moralisAssetsUrl,
        method="GET",
        data={},
        headers={
            //"accept": "application/json",
            'Content-Type': 'application/json',
            'X-API-Key': MORALIS_API_KEY},
    ).then(data => {

        document.getElementById('my-tokens').innerHTML = '<h3 class="text-center">My ERC-20 tokens</h3>';
        //document.getElementById('my-tokens').innerHTML = JSON.stringify(data);
        var [table, thead, tbody] = createTable(
            headers=["", "Symbol", "Name", "Balance"],
            classes=['table', 'table-sm', 'table-striped', 'table-dark', 'display', 'compact'],
            parentdiv='my-tokens',
            id='erc20-table',
        )
        for (let token of data) {


            if (token['name'] == null){
                continue;
            };
            if (token['name'] === '' || token['name'].includes('.')){
                continue;
            };

            var row = tbody.insertRow();
            for (let header of ['thumbnail', 'symbol', 'name', 'balance']){

                var cell = row.insertCell();

                if (header === "thumbnail") {

                    if (token[header] === null){
                        continue;
                    };

                    var img = document.createElement('img');
                    img.src = token[header];
                    img.style.height = '30px';
                    img.style.width = '30px';
                    img.style.display = "block";
                    cell.appendChild(img);

                } else if (header === "balance") {
                    cell.innerHTML = token[header] / 10**token['decimals'];
                } else {
                    cell.innerHTML = token[header];
                };
            };
        };

        $("#erc20-table").DataTable({
            "pageLength": 50,
        });
    });





    var ETHERSCAN_GET_ETH_URL = `https://api.etherscan.io/api?module=account&action=balance&address=${myaddress}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
    httpRequest(ETHERSCAN_GET_ETH_URL)
    .then(data => {
        var eth = data['result'] / 1e18;
        document.getElementById("my-ether").innerHTML += `<h3 class="text-center">My Ether</h3><p class="text-center lead">${eth}</p>`;
    });







    // load the address assets using the opensea API
    httpRequest(openseaAssetsUrl)
    .then(data => {

        // get NFT info out of opensea assets
        var nfts = data["assets"];
        document.getElementById("my-nfts").innerHTML += '<h3 class="text-center">My NFTs</h3>';

        var row = createRowCols('my-nfts', ncols=nfts.length)
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


            var p = document.createElement('p');
            p.innerHTML = `Created by: ${nft['creator']['user']['username']}`;
            cardObj['body'].appendChild(p);


            var a = document.createElement('a');
            a.href = nft['permalink'];
            a.target = "_blank";
            a.text = "View on OpenSea";
            cardObj['footer'].appendChild(a);

            row.children[nft_i].appendChild(cardObj['card']);
            nft_i += 1;

        };


    });


    document.getElementById("assets-content").style.display = "block";
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
        classes=['table', 'table-sm', 'table-striped', 'table-dark', 'display', 'compact'],
        parentdiv='price-feed-div',
        id='price-feed-table',
    );
    //table.style.width = "100%";
    //table.style.overflow = "auto";
    

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
                    cell.style.color = 'pink';
                } else {
                    cell.innerHTML = "+" + coin[k];
                    cell.style.color = 'lightgreen';
                };
    
            } else {
            
                cell.innerHTML = coin[k];
            };
        };
    };

    // for initializing basic DataTables
    $(document).ready(function() {
        $("#price-feed-table").DataTable({
            "pageLength": 50,
        });
    });
    
    document.getElementById("price-feed-loading").style.display = "none";
    document.getElementById("price-feed-content").style.display = "block";
    
});





