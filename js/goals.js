

// // // Sub Routines // // //


// Load Goals Data

function load_goals(){
    fs.readFile(path.join(__dirname, 'storage', 'goals.json'), function (err, data) {
            var goals_json = JSON.parse(data);
            // for each saved goal create html and append to goals list
            var i;
            for (i = 0; i < goals_json.name.length; i++) {
              var goals_container = document.createElement("div");
              goals_container.className = "goals_container";
              // Format numbers into currency -> add commas to thousands
              // Name, Cost, Saved
              // Amount, Left, Months Left
              var goals_left = goals_json.cost[i] - goals_json.saved[i];
              var goals_months = Math.ceil(goals_left / goals_json.amount[i]);
              goals_container.innerHTML = '<div class = "goals_col_1"> <p class = "" onclick="change_goal_name(this)" style="background-color: #DE4A00; padding-left: 20px;"> <span> Name - </span> ' + goals_json.name[i] + '</p> <p class = "" onclick="change_goal_amount(this)" style="background-color: #DE4A00; padding-left: 20px;"> <span> Monthly Saving - </span> £' + goals_json.amount[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' </p> </div> <div class = "goals_col_2"> <p class = "" onclick="change_goal_cost(this)" style="background-color: #F16C20; padding-left: 20px;"> <span> Required - </span> £' + goals_json.cost[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' </p> <p class = "" onclick="" style="background-color: #F16C20; padding-left: 20px;"> <span> Remaining - </span> £' + goals_left.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' </p></div> <div class = "goals_col_3"><p class = "" onclick = "change_goal_saved(this)" style="background-color: #F27934; padding-left: 20px;"> <span> Saved - </span> £' + goals_json.saved[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' </p> <p class = "" onclick="change_goal_left(this)" style="background-color: #F27934; padding-left: 20px;"> <span> Months left - </span> ' + goals_months.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' </p></div> <div class = "goals_col_4"><p class = "goals_close" style = "" > &#x2716; </p> </div>';
              document.getElementById("goals_list").appendChild(goals_container);
              // enable deletion
              delete_goal(goals_json);
            }
  })
}


// Enable Deletion of Each Goal

function delete_goal(goals_json){
  var close = document.getElementsByClassName("goals_close");
  var j;
  for (j = 0; j < close.length; j++) {
      close[j].onclick = function () {
        var div = this.parentElement.parentElement;
        var close_arr = Array.prototype.slice.call(document.getElementsByClassName("goals_close"));
        j = close_arr.indexOf(this)
        div.remove();
        // remove deleted element and rewrite file
        goals_json.name.splice(j,1);
        goals_json.cost.splice(j,1);
        goals_json.saved.splice(j,1);
        goals_json.amount.splice(j,1);
        fs.writeFile(path.join(__dirname, 'storage', 'goals.json'), JSON.stringify(goals_json), function(err){
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
        })
      }
    }
}


// // // General Goals Logic // // //

// Populate Goals Data

load_goals();


// Add New Goal

function add_goal(){
  // load goals.json
  fs.readFile(path.join(__dirname, 'storage', 'goals.json'), function (err, data) {
            var goals_json = JSON.parse(data);
            // check that there are (3+ goals), disable if true
            if (goals_json.name.length >= 3){
              alert("You can have up to 3 goals");
            } else{
              var goals_container = document.createElement("div");
              goals_container.className = "goals_container";
              // Format numbers into currency -> add commas to thousands
              goals_container.innerHTML = '<div class = "goals_col_1"> <p class = "" onclick="change_goal_name(this)" style="background-color: #DE4A00; padding-left: 20px;"> <span> Name - </span> Name </p> <p class = "" onclick="change_goal_amount(this)" style="background-color: #DE4A00; padding-left: 20px;"> <span> Monthly Saving - </span> £0 </p> </div> <div class = "goals_col_2"> <p class = "" onclick="change_goal_cost(this)" style="background-color: #F16C20; padding-left: 20px;"> <span> Required - </span> £0 </p> <p class = "" onclick="" style="background-color: #F16C20; padding-left: 20px;"> <span> Remaining - </span> £0 </p></div> <div class = "goals_col_3"><p class = "" onclick = "change_goal_saved(this)" style="background-color: #F27934; padding-left: 20px;"> <span> Saved - </span> £0 </p> <p class = "" onclick="change_goal_left(this)" style="background-color: #F27934; padding-left: 20px;"> <span> Months left - </span>  </p></div> <div class = "goals_col_4"><p class = "goals_close" style = "" > &#x2716; </p> </div>';
              document.getElementById("goals_list").appendChild(goals_container);
              // enable deletion
              delete_goal(goals_json);
              // update goals information
              goals_json.name.push("Name");
              goals_json.cost.push(0);
              goals_json.saved.push(0);
              goals_json.amount.push(0);
              fs.writeFile('./storage/goals.json', JSON.stringify(goals_json), function(err){
                      if (err) throw err;
                      console.log('The "data to append" was appended to file!');
              })
            }
          })
}


// Change Goal Name

function change_goal_name(elem){
  var goals_arr = Array.prototype.slice.call(document.getElementsByClassName("goals_container"));
  var parent = elem.parentElement
  console.log(goals_arr);
  console.log(parent.parentElement);
  index = goals_arr.indexOf(parent.parentElement);
  fs.writeFile(path.join(__dirname, 'storage', 'index.json'), JSON.stringify({index: index, file: "goals.json", arr_name: "name", item: "goal name"}), function(err){
          if (err) throw err;
          console.log('The "index data" was appended to file!');
  })
  ipcRenderer.send('change_data_1');
  $("#body").css({opacity: 1}).animate({opacity: 0.5}, 250);
}


// Change Goal Cost

function change_goal_cost(elem){
  var goals_arr = Array.prototype.slice.call(document.getElementsByClassName("goals_container"));
  var parent = elem.parentElement
  console.log(goals_arr);
  console.log(parent.parentElement);
  index = goals_arr.indexOf(parent.parentElement);
  fs.writeFile(path.join(__dirname, 'storage', 'index.json'), JSON.stringify({index: index, file: "goals.json", arr_name: "cost", item: "goal cost"}), function(err){
          if (err) throw err;
          console.log('The "index data" was appended to file!');
  })
  ipcRenderer.send('change_data_1');
  $("#body").css({opacity: 1}).animate({opacity: 0.5}, 250);
}


// Change Goal Saved

function change_goal_saved(elem){
  var goals_arr = Array.prototype.slice.call(document.getElementsByClassName("goals_container"));
  var parent = elem.parentElement
  console.log(goals_arr);
  console.log(parent.parentElement);
  index = goals_arr.indexOf(parent.parentElement);
  fs.writeFile(path.join(__dirname, 'storage', 'index.json'), JSON.stringify({index: index, file: "goals.json", arr_name: "saved", item: "amount currently saved"}), function(err){
          if (err) throw err;
          console.log('The "index data" was appended to file!');
  })
  ipcRenderer.send('change_data_1');
  $("#body").css({opacity: 1}).animate({opacity: 0.5}, 250);
}


// Change Goal Amount

function change_goal_amount(elem){
  var goals_arr = Array.prototype.slice.call(document.getElementsByClassName("goals_container"));
  var parent = elem.parentElement
  console.log(goals_arr);
  console.log(parent.parentElement);
  index = goals_arr.indexOf(parent.parentElement);
  fs.writeFile(path.join(__dirname, 'storage', 'index.json'), JSON.stringify({index: index, file: "goals.json", arr_name: "amount", item: "amount saved per month"}), function(err){
          if (err) throw err;
          console.log('The "index data" was appended to file!');
  })
  ipcRenderer.send('change_data_1');
  $("#body").css({opacity: 1}).animate({opacity: 0.5}, 250);
}


// Reset After DC1

ipcRenderer.on('message1', (event, message) => {
  $('#goals_list').empty();
  load_goals();
  $("#body").css({opacity: 0.5}).animate({opacity: 1}, 250);
})
