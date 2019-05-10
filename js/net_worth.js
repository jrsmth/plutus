

const { remote, ipcRenderer } = require ('electron');

var fs = require('fs')

var path = require('path')


// // // Sub Routines // // //

// Calulate & Poplulate Account Summary & Net Worth Summary

function calc_net_worth_sum(){
  // open up accounts, assets and liabilities in order to calc sums
  fs.readFile(path.join(__dirname, 'storage', 'accounts.json'), function (err, data) {
    accounts_json = JSON.parse(data);
    var accounts_sum = 0;
    for( var i = 0; i < accounts_json.name.length; i++ ){ accounts_sum += parseInt(accounts_json.amount[i]); }
    fs.readFile(path.join(__dirname, 'storage', 'assets.json'), function (err, data) {
      assets_json = JSON.parse(data);
      var assets_sum = 0;
      for( var i = 0; i < assets_json.name.length; i++ ){ assets_sum += parseInt(assets_json.amount[i]); }
      fs.readFile(path.join(__dirname, 'storage', 'liabilities.json'), function (err, data) {
        liabilities_json = JSON.parse(data);
        var liabilities_sum = 0;
        for( var i = 0; i < liabilities_json.name.length; i++ ){ liabilities_sum += parseInt(liabilities_json.amount[i]); }
        // Calc overall net worth
        var net_worth_sum = accounts_sum + assets_sum - liabilities_sum;
        // Create Account Summary + Net Worth graphic
        var blank = document.createElement("div");
        blank.className = "net_worth_summary";
        document.getElementById("net_worth_summary_list").appendChild(blank);
        var account_summary = document.createElement("div");
        account_summary.className = "net_worth_summary";
        // Format numbers into currency -> add commas to thousands
        account_summary.innerHTML = '<p class = "" onclick="" style="padding-left: 20px;"> Account Summary </p> <p class = "" onclick="" style="padding-left: 20px;"> £' + accounts_sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p>';
        document.getElementById("net_worth_summary_list").appendChild(account_summary);
        var net_worth_summary = document.createElement("div");
        net_worth_summary.className = "net_worth_summary";
        // Format numbers into currency -> add commas to thousands
        net_worth_summary.innerHTML = '<p class = "" onclick="" style="padding-left: 20px;"> Net Worth </p> <p class = "" onclick="" style="padding-left: 20px;"> £' + net_worth_sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p>';
        document.getElementById("net_worth_summary_list").appendChild(net_worth_summary);
      })
    })
  })
}


// Enable Deletion of Each Account

function delete_account(accounts_updated){
  var close = document.getElementsByClassName("net_worth_accounts_close");
  var j;
  for (j = 0; j < close.length; j++) {
      close[j].onclick = function () {
        var div = this.parentElement;
        var close_arr = Array.prototype.slice.call(document.getElementsByClassName("net_worth_accounts_close"));
        j = close_arr.indexOf(this)
        div.remove();
        // remove deleted element and rewrite file
        accounts_updated.name.splice(j,1);
        accounts_updated.amount.splice(j,1);
        fs.writeFile(path.join(__dirname, 'storage', 'accounts.json'), JSON.stringify(accounts_updated), function(err){
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
        })
        $('#net_worth_summary_list').empty();
        calc_net_worth_sum();
      }
    }
}


// Enable Deletion of Each Asset

function delete_asset(assets_updated){
  var close = document.getElementsByClassName("net_worth_assets_close");
  var j;
  for (j = 0; j < close.length; j++) {
      close[j].onclick = function () {
        var div = this.parentElement;
        var close_arr = Array.prototype.slice.call(document.getElementsByClassName("net_worth_assets_close"));
        j = close_arr.indexOf(this)
        div.remove();
        // remove deleted element and rewrite file
        assets_updated.name.splice(j,1);
        assets_updated.amount.splice(j,1);
        fs.writeFile(path.join(__dirname, 'storage', 'assets.json'), JSON.stringify(assets_updated), function(err){
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
        })
        $('#net_worth_summary_list').empty();
        calc_net_worth_sum();
      }
    }
}


// Enable Deletion of Each Liability

function delete_liability(liabilities_updated){
  var close = document.getElementsByClassName("net_worth_liabilities_close");
  var j;
  for (j = 0; j < close.length; j++) {
      close[j].onclick = function () {
        var div = this.parentElement;
        var close_arr = Array.prototype.slice.call(document.getElementsByClassName("net_worth_liabilities_close"));
        j = close_arr.indexOf(this)
        div.remove();
        // remove deleted element and rewrite file
        liabilities_updated.name.splice(j,1);
        liabilities_updated.amount.splice(j,1);
        fs.writeFile(path.join(__dirname, 'storage', 'liabilities.json'), JSON.stringify(liabilities_updated), function(err){
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
        })
        $('#net_worth_summary_list').empty();
        calc_net_worth_sum();
      }
    }
}


// Load Accounts Data

function load_accounts(){
  fs.readFile(path.join(__dirname, 'storage', 'accounts.json'), function (err, data) {
            var accounts_json = JSON.parse(data);
            // for each saved account create html and append to accounts list
            var i;
            for (i = 0; i < accounts_json.name.length; i++) {
              var account_container = document.createElement("div");
              account_container.className = "net_worth_accounts_container";
              // Format numbers into currency -> add commas to thousands
              account_container.innerHTML = '<p class = "" onclick="change_account_name(this)" style="background-color: #DE4A00; padding-left: 20px;">' + accounts_json.name[i] + '</p> <p class = "acc_amount" onclick="change_account_amount(this)" style="background-color: #F16C20; padding-left: 20px;"> £' + accounts_json.amount[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p> <p class = "net_worth_accounts_close"> &#x2716; </p>';
              document.getElementById("net_worth_accounts_list").appendChild(account_container);
              // enable deletion
              delete_account(accounts_json);
              }
  })
}


// Load Assets Data

function load_assets(){
  fs.readFile(path.join(__dirname, 'storage', 'assets.json'), function (err, data) {
            var assets_json = JSON.parse(data);
            // for each saved asset create html and append to assets list
            var i;
            for (i = 0; i < assets_json.name.length; i++) {
              var assets_container = document.createElement("div");
              assets_container.className = "net_worth_assets_container";
              // Format numbers into currency -> add commas to thousands
              assets_container.innerHTML = '<p class = "" onclick="change_asset_name(this)" style="background-color: #3B8C31; padding-left: 20px;">' + assets_json.name[i] + '</p> <p class = "" onclick="change_asset_amount(this)" style="background-color: #6FAF49; padding-left: 20px;"> £' + assets_json.amount[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p> <p class = "net_worth_assets_close"> &#x2716; </p>';
              document.getElementById("net_worth_assets_list").appendChild(assets_container);
              // enable deletion
              delete_asset(assets_json);
              }
  })
}


// Load Liability Data

function load_liabilities(){
  fs.readFile(path.join(__dirname, 'storage', 'liabilities.json'), function (err, data) {
            var liabilities_json = JSON.parse(data);
            // for each saved liability create html and append to liabilities list
            var i;
            for (i = 0; i < liabilities_json.name.length; i++) {
              var liabilities_container = document.createElement("div");
              liabilities_container.className = "net_worth_liabilities_container";
              // Format numbers into currency -> add commas to thousands
              liabilities_container.innerHTML = '<p class = "" onclick="change_liability_name(this)" style="background-color: #A80D48; padding-left: 20px;">' + liabilities_json.name[i] + '</p> <p class = "" onclick="change_liability_amount(this)" style="background-color: #D5174C; padding-left: 20px;"> £' + liabilities_json.amount[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</p> <p class = "net_worth_liabilities_close"> &#x2716; </p>';
              document.getElementById("net_worth_liabilities_list").appendChild(liabilities_container);
              // enable deletion
              delete_liability(liabilities_json);
              }
  })
}


// // // General Net Worth Logic // // //

// Populate Net Worth w/ Accounts, Assets, Liabilities & Summary Data

load_accounts();
load_assets();
load_liabilities();
calc_net_worth_sum();


// Add New Account

function add_account(){
  // load accounts.json
  fs.readFile(path.join(__dirname, 'storage', 'accounts.json'), function (err, data) {
            var accounts_json = JSON.parse(data);
            // check that there are (5+ accounts), disable if true
            if (accounts_json.name.length >= 5){
              alert("You can have up to 5 accounts");
            } else{
              var account_container = document.createElement("div");
              account_container.className = "net_worth_accounts_container";
              // Format numbers into currency -> add commas to thousands
              account_container.innerHTML = '<p class = "" onclick="change_account_name(this)" style="background-color: #DE4A00; padding-left: 20px;"> Name </p> <p class = "acc_amount" onclick="change_account_amount(this)" style="background-color: #F16C20; padding-left: 20px;"> £0 </p> <p class = "net_worth_accounts_close"> &#x2716; </p>';
              document.getElementById("net_worth_accounts_list").appendChild(account_container);
              // enable deletion
              delete_account(accounts_json);
              // update accounts information
              accounts_json.name.push("Name");
              accounts_json.amount.push(0);
              fs.writeFile(path.join(__dirname, 'storage', 'accounts.json'), JSON.stringify(accounts_json), function(err){
                      if (err) throw err;
                      console.log('The "data to append" was appended to file!');
              })
            }
          })
}


// Add New Asset

function add_asset(){
  // load assets.json
  fs.readFile(path.join(__dirname, 'storage', 'assets.json'), function (err, data) {
            var assets_json = JSON.parse(data);
            // check that there are (3+ assets), disable if true
            if (assets_json.name.length >= 3){
              alert("You can have up to 3 assets");
            } else{
              var assets_container = document.createElement("div");
              assets_container.className = "net_worth_assets_container";
              // Format numbers into currency -> add commas to thousands
              assets_container.innerHTML = '<p class = "" onclick="change_asset_name(this)" style="background-color: #3B8C31; padding-left: 20px;"> Name </p> <p class = "" onclick="change_asset_amount(this)" style="background-color: #6FAF49; padding-left: 20px;"> £0 </p> <p class = "net_worth_assets_close"> &#x2716; </p>';
              document.getElementById("net_worth_assets_list").appendChild(assets_container);
              // enable deletion
              delete_asset(assets_json);
              // update assets information
              assets_json.name.push("Name");
              assets_json.amount.push(0);
              fs.writeFile(path.join(__dirname, 'storage', 'assets.json'), JSON.stringify(assets_json), function(err){
                      if (err) throw err;
                      console.log('The "data to append" was appended to file!');
              })
            }
          })
}


// Add New Liability

function add_liability(){
  // load assets.json
  fs.readFile(path.join(__dirname, 'storage', 'liabilities.json'), function (err, data) {
            var liabilities_json = JSON.parse(data);
            // check that there are (3+ liabilities), disable if true
            if (liabilities_json.name.length >= 3){
              alert("You can have up to 3 liabilities");
            } else{
              var liabilities_container = document.createElement("div");
              liabilities_container.className = "net_worth_liabilities_container";
              // Format numbers into currency -> add commas to thousands
              liabilities_container.innerHTML = '<p class = "" onclick="change_liability_name(this)" style="background-color: #A80D48; padding-left: 20px;"> Name </p> <p class = "" onclick="change_liability_amount(this)" style="background-color: #D5174C; padding-left: 20px;"> £0 </p> <p class = "net_worth_liabilities_close"> &#x2716; </p>';
              document.getElementById("net_worth_liabilities_list").appendChild(liabilities_container);
              // enable deletion
              delete_asset(liabilities_json);
              // update liabilities information
              liabilities_json.name.push("Name");
              liabilities_json.amount.push(0);
              fs.writeFile(path.join(__dirname, 'storage', 'liabilities.json'), JSON.stringify(liabilities_json), function(err){
                      if (err) throw err;
                      console.log('The "data to append" was appended to file!');
              })
            }
          })
}


// Change Account Name

function change_account_name(elem){
  // access which account was clicked ->
  // access this account's index ->
  // send this index with the message
  var accounts_arr = Array.prototype.slice.call(document.getElementsByClassName("net_worth_accounts_container"));
  index = accounts_arr.indexOf(elem.parentElement);
  fs.writeFile(path.join(__dirname, 'storage', 'index.json'), JSON.stringify({index: index, file: "accounts.json", arr_name: "name", item: "account name"}), function(err){
          if (err) throw err;
          console.log('The "index data" was appended to file!');
  })
  ipcRenderer.send('change_data_1');
  $("#body").css({opacity: 1}).animate({opacity: 0.5}, 250);
}


// Change Account Amount

function change_account_amount(elem){
  // access which account was clicked ->
  // access this account's index ->
  // send this index with the message
  var accounts_arr = Array.prototype.slice.call(document.getElementsByClassName("net_worth_accounts_container"));
  index = accounts_arr.indexOf(elem.parentElement);
  console.log(accounts_arr);
  console.log(elem.parentElement);
  fs.writeFile(path.join(__dirname, 'storage', 'index.json'), JSON.stringify({index: index, file: "accounts.json", arr_name: "amount", item: "account amount"}), function(err){
          if (err) throw err;
          console.log('The "index data" was appended to file!');
  })
  ipcRenderer.send('change_data_1');
  $("#body").css({opacity: 1}).animate({opacity: 0.5}, 250);
}


// Change Asset Name

function change_asset_name(elem){
  // access which asset was clicked ->
  // access this asset's index ->
  // send this index with the message
  var asset_arr = Array.prototype.slice.call(document.getElementsByClassName("net_worth_assets_container"));
  index = asset_arr.indexOf(elem.parentElement);
  fs.writeFile(path.join(__dirname, 'storage', 'index.json'), JSON.stringify({index: index, file: "assets.json", arr_name: "name", item: "asset name"}), function(err){
          if (err) throw err;
          console.log('The "index data" was appended to file!');
  })
  ipcRenderer.send('change_data_1');
  $("#body").css({opacity: 1}).animate({opacity: 0.5}, 250);
}


// Change Asset Amount

function change_asset_amount(elem){
  // access which asset was clicked ->
  // access this asset's index ->
  // send this index with the message
  var asset_arr = Array.prototype.slice.call(document.getElementsByClassName("net_worth_assets_container"));
  index = asset_arr.indexOf(elem.parentElement);
  fs.writeFile(path.join(__dirname, 'storage', 'index.json'), JSON.stringify({index: index, file: "assets.json", arr_name: "amount", item: "asset amount"}), function(err){
          if (err) throw err;
          console.log('The "index data" was appended to file!');
  })
  ipcRenderer.send('change_data_1');
  $("#body").css({opacity: 1}).animate({opacity: 0.5}, 250);
}


// Change Liability Name

function change_liability_name(elem){
  // access which liability was clicked ->
  // access this liability's index ->
  // send this index with the message
  var liability_arr = Array.prototype.slice.call(document.getElementsByClassName("net_worth_liabilities_container"));
  index = liability_arr.indexOf(elem.parentElement);
  fs.writeFile(path.join(__dirname, 'storage', 'index.json'), JSON.stringify({index: index, file: "liabilities.json", arr_name: "name", item: "liability name"}), function(err){
          if (err) throw err;
          console.log('The "index data" was appended to file!');
  })
  ipcRenderer.send('change_data_1');
  $("#body").css({opacity: 1}).animate({opacity: 0.5}, 250);
}


// Change Liability Amount

function change_liability_amount(elem){
  // access which liability was clicked ->
  // access this liability's index ->
  // send this index with the message
  var liability_arr = Array.prototype.slice.call(document.getElementsByClassName("net_worth_liabilities_container"));
  index = liability_arr.indexOf(elem.parentElement);
  fs.writeFile(path.join(__dirname, 'storage', 'index.json'), JSON.stringify({index: index, file: "liabilities.json", arr_name: "amount", item: "liability amount"}), function(err){
          if (err) throw err;
          console.log('The "index data" was appended to file!');
  })
  ipcRenderer.send('change_data_1');
  $("#body").css({opacity: 1}).animate({opacity: 0.5}, 250);
}


// Reset After DC1

ipcRenderer.on('message1', (event, message) => {
    $('#net_worth_accounts_list').empty();
    $('#net_worth_assets_list').empty();
    $('#net_worth_liabilities_list').empty();
    $('#net_worth_summary_list').empty();
    load_accounts();
    load_assets();
    load_liabilities();
    calc_net_worth_sum();
  $("#body").css({opacity: 0.5}).animate({opacity: 1}, 250);
})
