
const ob = document.getElementById('outputbox');


setTimeout(function() {
    document.getElementById("vizloadingdiv").style.display = 'none'; 
    document.getElementById("vizdiv").style.display = 'block';
}, 1000);





/* 
When user clicks "Predict candidates" button, we send a request to the backend using
AJAX. This allows model pedictions without the need for refreshing the page.
*/
document.getElementById('predictcandidates').addEventListener("click", predictCandidates, false);
function predictCandidates() {
  toggleLoading('predictions-div', loadingmessage='Predicting surrogate properties...'); 
  addOutput("Reading " + document.getElementById('candidate-fp').value + '\n');  
  addOutput("Predicting surrogate properties...\n");
  $.ajax({
      url: "/predict_candidates",
      type: "get",
      data: {'candidate-fp': document.getElementById('candidate-fp').value},
      success: function(r) {
        
          addOutput("Surrogate properties predicted.\n");

          //document.getElementById('training_table').innerHTML = r['training_df_table'];

          updatePCA(newdata=JSON.parse(r['candidate_pca']));

          document.getElementById('predictions-div').innerHTML = makePredictionsTable(r['prediction_results']);


          // make the table a DataTable for sorting and searching
          var predtable = $('#predictions-table').DataTable();

      },

  });

};
//element.disabled = false;



function makePredictionsTable(data) {

    var labels = [
        ["name", "Name"],
        ["smiles", "SMILES"],
        ["bp_pred_mean", "Boiling mean (K)"],
        ["bp_pred_std", "Boiling std (K)"],
        ["mp_pred_mean", "Melting mean (K)"],
        ["mp_pred_std", "Melting std (K)"],
        ["fp_pred_mean", "Flash mean (K)"],
        ["fp_pred_std", "Flash std (K)"],
        ["homo_pred_mean", "HOMO mean (K)"],
        ["homo_pred_std", "HOMO std (K)"],
        ["lumo_pred_mean", "LUMO mean (K)"],
        ["lumo_pred_std", "LUMO std (K)"],
        ["dipole_pred_mean", "Dipole mom. mean (D)"],
        ["dipole_pred_std", "Dipole mom. std (D)"],
    ];

    var t = '<br><br><table id="predictions-table" class="table table-striped" class="pt-3">';
    // add table headers
    t += '<thead><tr>'
    for (const lab of labels) {
        //if (k !== 'smiles' && k !== 'name'){
        t += '<th>' + lab[1] + '</th>'
        //};
    };
    t += '</tr></thead><tbody>'
    // loop over each obj in the array and add it to a new table row
    for (var d0 of data) {
        for (const lab of labels) {
            t += '<td>' + d0[lab[0]] + '</td>';
        };
        t += '</tr>'
    };
    t += '</tbody></table>'
    return t;
};




// show the loading message in a specified div
function toggleLoading(divname, loadingmessage='Loading') {
    document.getElementById('loadingmessage').innerHTML = loadingmessage;
    const div = document.getElementById(divname);
    const loadingContent = document.getElementById('loadingdiv').innerHTML;
    div.innerHTML = '<div class="text-center">'+loadingContent+'</div>';
};


// add text to the output box and scroll to bottom
function addOutput(output) {
  ob.value += output + '\r\n';
  ob.scrollTop = ob.scrollHeight;
};

addOutput("Loaded reference electrolytes.\n");


/*
// for a basic DataTables initialization
$(document).ready(function () {
    $('#predictions-table').DataTable();
});
*/
