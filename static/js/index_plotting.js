// read JSON that is being served by another URL
function readJsonUrl(url) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, false);
  xmlhttp.send();
  return (xmlhttp.status==200 ? JSON.parse(xmlhttp.responseText) : null);
}

// read the reference molecule data as JSON
var pcadata = readJsonUrl('/reference_molecules');
const hd = document.getElementById('hover-div');

/*
var pcadata = {
    training: {
        'x': [1,2,3],
        'y': [4,2,5],
        'z': [5,7,3],
    },
    candidate: {
        'x': [1,3,0],
        'y': [0, -1, -2],
        'z': [0, 1, 1],
    },
};
*/



// update the PCA plot
//hs.addEventListener("change", updateHist);
//histscale.addEventListener("change", updateHist);
function updatePCA(newdata=null) {

    var data = [
        {
            x: pcadata['pca-0'],
            y: pcadata['pca-1'],
            z: pcadata['pca-2'],
            type: 'scatter3d',
            name: 'reference',
            mode: 'markers',
            //hovertext: getHoverText(pcadata),
            marker: {
                color: 'dodgerblue',
                size: 3,
                opacity: newdata===null ? 1 : 0.2,
                line: {
                    color: 'white',
                    width: 0.1,
                    opacity: 0.2,
                }, 
            },
        },
    ]


    // add new predicted points to PCA plot
    if (newdata !== null){
        var new_series = {
            x: newdata['pca-0'],
            y: newdata['pca-1'],
            z: newdata['pca-2'],
            type: 'scatter3d',
            name: 'candidate',
            mode: 'markers',
            //hovertext: getHoverText(newdata),
            marker: {
                color: 'tomato',
                size: 5,
                opacity: 1,
                line: {
                    color: 'white',
                    width: 0.1,
                }, 
            },
        };
        data.push(new_series);
        var ht_can = getHoverText(newdata, dtype='can');

    };


    var config = {'displaylogo': false};
    var layout = {
        margin: {l: 20, r: 20, b: 20, t: 20},
        //autosize: true,
        width: 850,
        height: 700,           
        scene: {
            xaxis:{title: 'PCA-1'},
            yaxis:{title: 'PCA-2'},
            zaxis:{title: 'PCA-3'},
        },
    };
    Plotly.newPlot('pca', data, layout, config);


    // show data for hovered point in a separate div
    var ht_ref = getHoverText(pcadata, dtype='ref');
    document.getElementById('pca').on('plotly_hover', function(data){
        var infotext = data.points.map(function(i){
            if (i.curveNumber === 1) {
                return ht_can[i.pointNumber];
            } else {
                return ht_ref[i.pointNumber];
            }
        });

        hd.innerHTML = '';
        hd.appendChild(infotext[0]);

    });



    // when clicking on a point in the plot, filter the DataTable
    // by that point's SMILES string
    document.getElementById('pca').on('plotly_click', function(data){
        var pt = '';
        for(var i=0; i < data.points.length; i++){
            pt = data.points[i];
        }
        var smiles = '';
        if (pt.curveNumber === 0){
            smiles = pcadata['smiles'][pt.pointNumber];
        } else {
            smiles = newdata['smiles'][pt.pointNumber];
        }
        // populate search box on DataTable
        var predtable = $('#predictions-table').DataTable();
        predtable.search(smiles).draw();


        //document.getElementById('smilestosend').value = smiles;


    });




};


// create initial PCA plot
updatePCA();







function getHoverText(d, dtype='ref') {
    var t = [];
    var img_url  = '';

    // get length of data by looking at the first object key
    var dlength = d[Object.keys(d)[0]].length;

    if (dtype === 'ref') {
        var bgcolor = '#005A9C25',
            title = 'Reference solvent';

    } else {
        var bgcolor = '#FF634725',
        title = 'Candidate solvent';
    };
     

    // loop over each data point
    for (var ii=0; ii < dlength; ii++) {

        var card = document.createElement('div');
        card.classList.add('card', 'mt-0');
        card.style.fontSize = '0.85rem';
        card.style.height = '708px';
        card.style.border = '1 px solid '+bgcolor;

        var cardheader = document.createElement('h5');
        cardheader.classList.add('card-header');
        cardheader.style.backgroundColor = bgcolor;
        cardheader.innerHTML = title;
        card.appendChild(cardheader);
        
        var cardbody = document.createElement('div');
        cardbody.classList.add('card-body', 'bg-transparent');
        card.appendChild(cardbody);


        var tablediv = document.createElement('div');
        var table = document.createElement('table');
        tablediv.appendChild(table);
        tablediv.style.height = '320px';
        tablediv.style.overflow = 'auto';

        table.classList.add('table', 'table-sm', 'table-striped', 'table-borderless', 'w-100');
        table.style.wordBreak = 'break-word';
        tbody = document.createElement('tbody');
        table.appendChild(tbody);

        // loop over each object key in the dataset
        for (const [key, value] of Object.entries(d)) {

            if (d[key][ii] === '') {continue};

            tr = document.createElement('tr');
            th = document.createElement('th');
            td = document.createElement('td');
            tbody.appendChild(tr);
            tr.appendChild(th);
            tr.appendChild(td);
            th.innerHTML = formatLabel(key) + '<span style="width: 15px;"></span>';
            td.innerHTML = d[key][ii];
        };

        if (dtype === 'ref') {
            img_url = '/img/reference-'+ii+'.png';
        } else {
            img_url = '/img/candidate-'+ii+'.png';
        };


        // to add molecule images to the hover text
        var img = document.createElement('img');
        img.classList.add('center');
        img.style.margin = "0 auto";
        img.style.width = '80%';
        img.src = img_url;

        cardbody.appendChild(tablediv);
        cardbody.appendChild(img);



        t.push(card);
    };

    return t;
};




// format a label for display by capitalizing the
// first letter and replacing underscores with spaces
function formatLabel(label){
  if (label === ''){
    return '';
  } else {
    var label = label.charAt(0).toUpperCase() + label.slice(1);
    return label.replace('_', ' ');
  };
};
