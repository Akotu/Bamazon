var mysql = require("mysql");
var inquire = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "0657",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    afterConnection();

});

function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        console.log("--- Welcome to Bamazon! Please take a look at our fine inventory! ---");

        for (var i = 0; i < res.length; i++) {

            console.log(

                "\n" + res[i].item_id + ": " + res[i].product_name + " " +
                "|Department: " + res[i].department_name + "| " +
                "|Price: " + res[i].price +
                "| " + "|Left in Stock: " + res[i].stock_quantity + "|"

            );
        }
        console.log("--------------------------------------------------------------------------------" + "\n" + "");
        inquire
            .prompt([{
                    name: "choice",
                    message: "Please enter the number of the product to which you would like to purchase",
                    type: "input",
                    validate: function (ans) {
                        if (isNaN(ans) === true) {
                            console.log("\nPlease choose a numerical value.")
                            return false;
                        } else {
                            return true;
                        }
                    }
                }, {
                    name: "quantity",
                    message: "Please enter the quantity of your desired purchase",
                    type: "input",
                    validate: function (ans) {
                        if (isNaN(ans) === true) {
                            console.log("\nPlease choose a numerical value.")
                            return false;
                        } else {
                            return true;
                        }
                    }
                }


            ])
            .then(function (answer) {

            });

        connection.end();
    })
};