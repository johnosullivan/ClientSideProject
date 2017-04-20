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
//Sets up the port and router
var port = process.env.PORT || 8080;
var router = express.Router();
//Sets the const for the flight accesspoint for this hack
const flighturl = "https://flightaware.com/live/flight/";
//Sets up the GET method for api/flight/:id for Go App to get the mock flight data from mongo database
router.get("/flight/:id", function(req, res) {
  //Creates an promise request for the flight website
  requestpromise.get({ uri: 'https://flightaware.com/live/flight/' + req.params.id, transform: function(body, res) {
      //Splits the html data
      var bodysplit = body.split("var trackpollBootstrap = ");
      var bodysplit2 = bodysplit[1].split(";</script>");
      //Parse the split data string into JSON object
      return JSON.parse(bodysplit2[0]);
    }
  }).then(function(data){
    //Responds to the request with flight data
    res.json({'flightdata':data});
  }, function(err){
    //Parses the error  data
    var respErr  = JSON.parse(err.error);
    var errorResult = { origUrl: respErr.origUrl, error: respErr };
      //Responds to the request with error data
    res.json(errorResult);
  }).catch(function(err){
    console.error(err); //Will print any error that was thrown in the previous error handler.
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
