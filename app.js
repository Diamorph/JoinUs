const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'join_us'
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
    // find count of users in DB
    try {
        connection.query(
            'SELECT count(*) as total from users',
            function (err, results, fields) {
                if (err) throw err;
                console.log(results); // results contains rows returned by server
                console.log(fields); // fields contains extra meta data about results, if available
                const count = results[0].total;
                res.render("home", {count});
                // res.send(`We have ${count} users in our db`);
            }
        );
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

app.post("/register", function(req, res) {
    const person = {email: req.body.email};
    connection.query(
        `INSERT INTO users SET ?`, person,
        function (err, results, fields) {
            if (err) throw err;
            console.log(results); // results contains rows returned by server
            console.log(fields); // fields contains extra meta data about results, if available
            res.redirect("/");
        }
    );
});

app.get("/joke", function(req, res) {
    console.log("Requested the joke route!");
    const joke = "What do you call a dog that does magic tricks? Labracadabrador!"
    res.send(joke);
});

app.get("/random_num", function(req, res) {
    const random_num = Math.floor(Math.random() * 10) + 1;
    res.send(`Your lucky number is ${random_num}`);
});

app.listen(port, function(port) {
    console.log("App listening on port 8080", port);
});