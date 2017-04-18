/**
 * Created by keetz on 4/3/17.
 */
/* a simple Express server for Node.js
 comp 424 - appTest
 */

var express = require("express"),
    http = require("http"),
    //bodyParser = require("body-parser"),
    testApp = express();
    http.createServer(testApp).listen(3000);


    testApp.get("/test_data.json", funtion(req,res){
        res.json(testSet1);
})



//set as static file server...
//jsonApp.use(express.static(__dirname + "/app"));

//parse jQuery JSON to useful JS object
//jsonApp.use(bodyParser.urlencoded({ extended: false }));

//create http server
//TODO: make a local server
///http.createServer(jsonApp).listen(3030);

//json get route
// //TODO: Make our root json file
// jsonApp.get("/trips.json", function(req, res) {
//     res.json(trips);
// });
//
// jsonApp.post("/trips", function(req, res) {
//     //store new object in req.body
//     var newNote = req.body;
//     //push new note to JSON
//     trips["trips"].push(newTrip);
//     //return simple JSON object
//     res.json({
//         "message": "post complete to server"
//     });
// });