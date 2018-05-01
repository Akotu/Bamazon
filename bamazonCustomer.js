//Require NPM packages:
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
//----------------------------------------------------------------------------------------//
//Connect to my database:
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "0657",
    database: "bamazon"
});
//Display the information from the database inside a table:
function renderTable() {
    connection.connect(function (err) {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err
            else console.table(res, "\n");
            questions();
        });
    });
}
renderTable();

//Create prompt questions to get information back from the customer:

function questions() {

    inquirer.prompt([

        {
            type: "input",
            name: "id",
            message: "Enter the ID of the item of what you would like to purchase\n",
            validate: function (value) {
                if (!isNaN(value) && value < 11) {
                    return true;
                }
                return false;
            }
        },

        {
            type: "input",
            name: "quant",
            message: "How many of these items would you like to buy? \n",
            validate: function (value) {
                if (!isNaN(value)) {
                    return true;
                }
                return false;
            }
        }

    ]).then(function (answer) {


        //console.log("Answer: ", answer);

        var userId = answer.id;
        console.log("Chosen item id: ", userId);

        var userQuant = answer.quant;
        console.log("Chosen quantity from stock: ", userQuant, "\n");

        //select everything from the products table from what the user has entered in to the prompts:
        connection.query("SELECT * FROM products WHERE ?", [{ item_id: answer.id }], function (err, res) {

            if (err) throw err;
         
            console.table(res);

            //set the current quantitiy to what the databse has on file:
            var current_quantity = res[0].stock_quantity;

            console.log("Current quantity in stock: ", current_quantity);

            //set price equal to database price:
            var price = res[0].price;

            
            var remaining_quantity = current_quantity - answer.quant;

            console.log("Remaining quantity in stock: ", remaining_quantity);

            if (current_quantity > answer.quant) {

                console.log("Amount Remaining: " + remaining_quantity);
                console.log("Total Cost: " + (answer.quant * price) + "\n");

                connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [
                        remaining_quantity, answer.id
                    ],

               );


            } else {
                console.log("Insufficient amounts, please try again!");
            }
            
            connection.end();

        });
    })

}