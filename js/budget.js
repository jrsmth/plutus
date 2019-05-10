

// // // Sub Routines // // //

// Calulate & Poplulate Expenses & Difference

function calc_budget_overview(){
  // sum budget amounts, populate and calc & populate the difference
  fs.readFile(path.join(__dirname, 'storage', 'budget.json'), function (err, data) {
    budget_json = JSON.parse(data);
    // create income section
    var income_container = document.createElement("div");
    income_container.className = "budget_overview_container budget_overview_container-income";
    // Format numbers into currency -> add commas to thousands
    income_container.innerHTML = '<p class = "" onclick="change_income_amount(this)" style="background-color: #3B8C31; padding-left: 20px;"> Monthly Income </p> <p class = "income_amount" onclick="change_income_amount(this)" style="background-color: #6FAF49; padding-left: 20px;"> £' + budget_json.income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p>';
    document.getElementById("budget_overview_list").appendChild(income_container);

    var expenses_sum = 0;
    for( var i = 0; i < budget_json.name.length; i++ ){ expenses_sum += parseInt(budget_json.amount[i]); }

    // populate total monthly expenses
    var expense_container = document.createElement("div");
    expense_container.className = "budget_overview_container";
    // Format numbers into currency -> add commas to thousands
    expense_container.innerHTML = '<p class = "" onclick="" style="padding-left: 20px; background-color: #A80D48;"> Monthly Expenses </p> <p class = "" onclick="" style="padding-left: 20px; background-color: #D5174C;"> £' + expenses_sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p>';
    document.getElementById("budget_overview_list").appendChild(expense_container);

    // calc difference & populate
    var difference = budget_json.income - expenses_sum;
    var difference_container = document.createElement("div");
    difference_container.className = "budget_overview_container";
    // Format numbers into currency -> add commas to thousands
    difference_container.innerHTML = '<p class = "" onclick="" style="padding-left: 20px;"> Difference </p> <p class = "" onclick="" style="padding-left: 20px;"> £' + difference.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p>';
    document.getElementById("budget_overview_list").appendChild(difference_container);

  })
}


// Enable Deletion of Each Expense

function delete_expense(expenses_updated){
  var close = document.getElementsByClassName("budget_expense_close");
  var j;
  for (j = 0; j < close.length; j++) {
      close[j].onclick = function () {
        var div = this.parentElement;
        var close_arr = Array.prototype.slice.call(document.getElementsByClassName("budget_expense_close"));
        j = close_arr.indexOf(this)
        div.remove();
        // remove deleted element and rewrite file
        expenses_updated.name.splice(j,1);
        expenses_updated.amount.splice(j,1);
        fs.writeFile(path.join(__dirname, 'storage', 'budget.json'), JSON.stringify(expenses_updated), function(err){
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
        })
        // Summary Calculations
        $('#budget_overview_list').empty();
        calc_budget_overview();
      }
    }
}


// Load Expenses Data

function load_expenses(){
  fs.readFile(path.join(__dirname, 'storage', 'budget.json'), function (err, data) {
            var expenses_json = JSON.parse(data);
            // for each saved expense create html and append to expenses list
            var i;
            for (i = 0; i < expenses_json.name.length; i++) {
              var expense_container = document.createElement("div");
              expense_container.className = "budget_expense_container";
              // Format numbers into currency -> add commas to thousands
              expense_container.innerHTML = '<p class = "" onclick="change_expense_name(this)" style="background-color: #DE4A00; padding-left: 20px;">' + expenses_json.name[i] + '</p> <p class = "" onclick="change_expense_amount(this)" style="background-color: #F16C20; padding-left: 20px;"> £' + expenses_json.amount[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p> <p class = "budget_expense_close"> &#x2716; </p>';
              document.getElementById("budget_expenses_list").appendChild(expense_container);
              // enable deletion
              delete_expense(expenses_json);
              }
  })
}


// // // General Budget Logic // // //

// Populate Expenses Data

load_expenses();
calc_budget_overview()


// Add New Expense

function add_expense(){
  // load budget.json
  fs.readFile(path.join(__dirname, 'storage', 'budget.json'), function (err, data) {
            var expenses_json = JSON.parse(data);
            // check that there are (8+ expenses), disable if true
            if (expenses_json.name.length >= 8){
              alert("You can have up to 8 expenses");
            } else{
              var expense_container = document.createElement("div");
              expense_container.className = "budget_expense_container";
              // Format numbers into currency -> add commas to thousands
              expense_container.innerHTML = '<p class = "" onclick="change_expense_name(this)" style="background-color: #DE4A00; padding-left: 20px;"> Name </p> <p class = "" onclick="change_expense_amount(this)" style="background-color: #F16C20; padding-left: 20px;"> £0 </p> <p class = "budget_expense_close"> &#x2716; </p>';
              document.getElementById("budget_expenses_list").appendChild(expense_container);
              // enable deletion
              delete_expense(expenses_json);
              // update expenses information
              expenses_json.name.push("Name");
              expenses_json.amount.push(0);
              fs.writeFile(path.join(__dirname, 'storage', 'budget.json'), JSON.stringify(expenses_json), function(err){
                      if (err) throw err;
                      console.log('The "data to append" was appended to file!');
              })
            }
          })
}


// Change Expense Name

function change_expense_name(elem){
  // access which expense was clicked ->
  // access this expsense's index ->
  // send this index with the message
  var expenses_arr = Array.prototype.slice.call(document.getElementsByClassName("budget_expense_container"));
  index = expenses_arr.indexOf(elem.parentElement);
  fs.writeFile(path.join(__dirname, 'storage', 'index.json'), JSON.stringify({index: index, file: "budget.json", arr_name: "name", item: "monthly expense name"}), function(err){
          if (err) throw err;
          console.log('The "index data" was appended to file!');
  })
  ipcRenderer.send('change_data_1');
  $("#body").css({opacity: 1}).animate({opacity: 0.5}, 250);
}


// Change Expense Amount

function change_expense_amount(elem){
  // access which expense was clicked ->
  // access this expsense's index ->
  // send this index with the message
  var expenses_arr = Array.prototype.slice.call(document.getElementsByClassName("budget_expense_container"));
  index = expenses_arr.indexOf(elem.parentElement);
  fs.writeFile(path.join(__dirname, 'storage', 'index.json'), JSON.stringify({index: index, file: "budget.json", arr_name: "amount", item: "monthly expense amount"}), function(err){
          if (err) throw err;
          console.log('The "index data" was appended to file!');
  })
  ipcRenderer.send('change_data_1');
  $("#body").css({opacity: 1}).animate({opacity: 0.5}, 250);
}


// Change Monthly Income

function change_income_amount(elem){
  var income_arr = Array.prototype.slice.call(document.getElementsByClassName("budget_overview_container"));
  index = income_arr.indexOf(elem.parentElement);
  fs.writeFile(path.join(__dirname, 'storage', 'index.json'), JSON.stringify({index: index, file: "budget.json", arr_name: "income", item: "monthly income"}), function(err){
          if (err) throw err;
          console.log('The "index data" was appended to file!');
  })
  ipcRenderer.send('change_data_1');
  $("#body").css({opacity: 1}).animate({opacity: 0.5}, 250);
}


// Reset After DC1

ipcRenderer.on('message1', (event, message) => {
  $('#budget_expenses_list').empty();
  $('#budget_overview_list').empty();
  load_expenses();
  calc_budget_overview();
  $("#body").css({opacity: 0.5}).animate({opacity: 1}, 250);
})
