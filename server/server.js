/*
 * Created by keetz and johnosullivan on 4/3/17.
 *
 * Node.js server for the client side project which is an hack created to get flight data for free
 */
//Imports the require library to run correctly
var express        = require("express");
var http           = require('http');
var app            = express();
var bodyParser     = require("body-parser");
var requestpromise = require('request-promise');
//Sets up the body parser for the node.js server
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
//Sets up the port and router
var port = process.env.PORT || 8080;
var router = express.Router();
//Sets the const for the flight accesspoint for this hack
const flighturl = "https://flightaware.com/live/flight/";
//Sets up the GET method for api/flight/:id for Go App to get the mock flight data from mongo database
router.get("/flight/:id", function(req, res) {
  //Creates an promise request for the flight website
  requestpromise.get({ uri: flighturl + req.params.id, transform: function(body, res) {
      //Splits the html data
      var bodysplit = body.split("var trackpollBootstrap = ");
      var bodysplit2 = bodysplit[1].split(";</script>");
      //Parse the split data string into JSON object
      var json = JSON.parse(bodysplit2[0])
      //Gets the flights object
      var flight = json['flights'];
      //Gets the keys within object since they are randon ids
      var keys = Object.keys(flight);
      //Gets final flight data from keys array
      var finaldata = flight[keys[0]];
      return finaldata;
    }
  }).then(function(data){
    //Responds to the request with flight data
    res.json({'flightdata':data});
  }, function(err){
    //Responds to the request with error data
    console.log("Error");
    res.console.error(err);
  }).catch(function(err){
    //console.error(err); //Will print any error that was thrown in the previous error handler.
  });
});
//Sets up the mock data in mongo database
router.get("/setup_db", function(req, res) {
  //Setups up the database for mock data
  res.json({ message: "Database has been configure and inject with mock data." });
});
//Use api name for router set
app.use("/api", router);
//Node.js listens on given port
app.listen(port);
//Notfty the user of the port server is running on
console.log("Running on port: " + port);
