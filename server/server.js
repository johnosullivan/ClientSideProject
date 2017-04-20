/**
 * Created by keetz on 4/3/17.
 */
/* a simple Express server for Node.js
 comp 424 - appTest
 */
 var express    = require("express");
 var app        = express();
 var bodyParser = require("body-parser");

 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(bodyParser.json());

 var port = process.env.PORT || 8080;
 var router = express.Router();

 router.get("/", function(req, res) {
                   var flight = {"departureCode":"KLAX",
                   "departureName":"Los Angeles International Airport",
                   "departureLat":"33.9428209",
                   "departureLong":"-118.4092766",
                   "arrivalCode":"KORD",
                   "arrivalName":"O'Hare International Airport",
                   "arrivalLat":"41.9773201",
                   "arrivalLong":"-87.9080059",
                   "equipment":"Boeing 737-800 (twin-jet)",
                   "airline":"American Airline",
                   "distance":"1,800mi",
                   "currentWayPoint":"IFEYE",
                   "flightID":"AA2223",
                   "delay":5,
                   "eta":110,
                   "route": [{"name":"KLAX","latitude":"33.9428209","longitude":"-118.4092766","dfo":"0","dfd":"1743","type":"Origin Airport"},{"name":"FABRA","latitude":"33.9456389","longitude":"-118.4649722","dfo":"3","dfd":"1746","type":"Waypoint"},{"name":"KLIPR","latitude":"33.9515000","longitude":"-118.4131944","dfo":"1","dfd":"1743","type":"Waypoint"},{"name":"KEGGS","latitude":"34.0084444","longitude":"-118.2995833","dfo":"8","dfd":"1735","type":"Reporting Point"},{"name":"COOPP","latitude":"34.1211389","longitude":"-118.1005278","dfo":"22","dfd":"1722","type":"Reporting Point"},{"name":"ORCKA","latitude":"34.3497222","longitude":"-117.6931389","dfo":"50","dfd":"1694","type":"Waypoint"},{"name":"NNAVY","latitude":"34.9196389","longitude":"-116.7280278","dfo":"117","dfd":"1627","type":"Waypoint"},{"name":"BLAZN","latitude":"35.6320000","longitude":"-115.7794722","dfo":"190","dfd":"1557","type":"Waypoint"},{"name":"LAS","latitude":"36.0796944","longitude":"-115.1598056","dfo":"236","dfd":"1513","type":"VOR-TAC (NAVAID)"},{"name":"LAS","latitude":"36.0797031","longitude":"-115.1597978","dfo":"236","dfd":"1513","type":"VOR-TAC (NAVAID)"},{"name":"IFEYE","latitude":"36.4155667","longitude":"-114.7970333","dfo":"266","dfd":"1485","type":"RNAV"},{"name":"BLIPP","latitude":"36.7114750","longitude":"-114.4740139","dfo":"293","dfd":"1460","type":"RNAV"},{"name":"EEVUN","latitude":"37.0480278","longitude":"-113.7118222","dfo":"341","dfd":"1413","type":"RNAV"},{"name":"BLOBB","latitude":"37.2960083","longitude":"-113.1144889","dfo":"377","dfd":"1376","type":"RNAV"},{"name":"BAWER","latitude":"37.6351889","longitude":"-112.2794139","dfo":"428","dfd":"1324","type":"RNAV"},{"name":"EKR","latitude":"40.0675000","longitude":"-107.9250000","dfo":"717","dfd":"1050","type":"VOR-DME (NAVAID)"},{"name":"BFF","latitude":"41.8941667","longitude":"-103.4819444","dfo":"981","dfd":"800","type":"VOR-TAC (NAVAID)"},{"name":"ABR","latitude":"45.4173567","longitude":"-98.3687197","dfo":"1323","dfd":"574","type":"VOR-DME (NAVAID)"},{"name":"GEP","latitude":"45.1456850","longitude":"-93.3731808","dfo":"1534","dfd":"351","type":"VOR-TAC (NAVAID)"},{"name":"DLL","latitude":"43.5508333","longitude":"-89.7636111","dfo":"1671","dfd":"144","type":"VOR-TAC (NAVAID)"},{"name":"MSN","latitude":"43.1447222","longitude":"-89.3397222","dfo":"1686","dfd":"109","type":"VOR-TAC (NAVAID)"},{"name":"JAKSA","latitude":"42.8439028","longitude":"-89.0451861","dfo":"1696","dfd":"83","type":"Waypoint (RNAV)"},{"name":"MOOPS","latitude":"42.6574778","longitude":"-88.8925167","dfo":"1701","dfd":"69","type":"Waypoint (RNAV)"},{"name":"FYTTE","latitude":"42.3800556","longitude":"-88.6678056","dfo":"1709","dfd":"48","type":"Waypoint"},{"name":"MOTRR","latitude":"42.3585000","longitude":"-88.5028889","dfo":"1717","dfd":"40","type":"Waypoint"},{"name":"COGSS","latitude":"42.3442778","longitude":"-88.3949167","dfo":"1722","dfd":"36","type":"Waypoint"},{"name":"MADII","latitude":"42.3009722","longitude":"-88.3138056","dfo":"1726","dfd":"31","type":"Waypoint"},{"name":"SOOLU","latitude":"42.1963889","longitude":"-88.1476944","dfo":"1733","dfd":"20","type":"Waypoint"},{"name":"KURKK","latitude":"42.0918333","longitude":"-88.0271944","dfo":"1738","dfd":"10","type":"Waypoint"},{"name":"VULCN","latitude":"42.0917500","longitude":"-87.7941667","dfo":"1750","dfd":"10","type":"Waypoint"},{"name":"HIMGO","latitude":"42.0910556","longitude":"-87.5088611","dfo":"1764","dfd":"22","type":"Waypoint"},{"name":"KORD","latitude":"41.9773201","longitude":"-87.9080059","dfo":"1743","dfd":"0","type":"Destination Airport"}]
                  };
     res.json({ data: flight });
 });

 app.use("/api", router);
 app.listen(port);

 console.log("Running on port: " + port);
