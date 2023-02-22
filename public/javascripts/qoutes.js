$(document).ready(function(){
  var count=1;
  $("#btnAdd").click(function(){
  
    $("#container").append(addNewRow(count));
    count++;

  });

  $("#btnRemove").click(function(){
    
    row = "#row" + (count-1);
    $(row).remove();
    if(count != 1) {
      count--;
    }
  });
});

function addNewRow(count){
  var newrow='<div class="row" id="row' + count + '">'+
  '<div class="col">'+
  '    <div class="form-group label-floating">'+
  '        <label class="control-label">Employee</label>'+
  '        <input type="text" class="form-control" v-model="act" >'+
  '    </div>'+
  '</div>'+
  '<div class="col">'+
  '    <div class="form-group label-floating">'+
  '        <label class="control-label">Rate type</label>'+
  '        <select class="form-select" aria-label="Default select example">'+
  '            <option selected>Open this select menu</option>'+
  '            <option value="1">Daily</option>'+
  '            <option value="2">Hourly</option>'+
  '        </select>'+
  '    </div>'+
  '</div>'+
  '<div class="col">'+
  '    <div class="form-group label-floating">'+
  '        <label class="control-label">Rate</label>'+
  '        <input id="postfix" value="$" type="number" step="0.01" min="0" class="form-control" v-model="section">'+
  '    </div>'+
  '</div>'+
  '<div class="col">'+
  '    <div class="form-group label-floating">'+
  '        <label class="control-label">pre-set pay grade</label>'+
  '        <select class="form-select" aria-label="Default select example">'+
  '            <option selected>Open this select menu</option>'+
  '            <option value="1">Subject Expert</option>'+
  '            <option value="2">Casual Worker</option>'+
  '        </select>'+
  '    </div>'+
  '</div>'+
  '</div>'
  return newrow;
}