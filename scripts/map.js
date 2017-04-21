$(document).ready(function(){
  //Logic for the go app.
  //Variables for the app.
  var apikey = 'AIzaSyC_ep81AybHxhf6J3pc2eJ-AFEbxQ1cMbI';
  var debugging = true;
  var currenteta = 0;
  var drivingtime = 0;
  var drivingdistance = 0;
  var buffer = 0;
  var gotime = 0;
  //Mock data
  var flightdelay = 0;
  var flighteta = 0;
  var arrivalairportcode = 'ORD';
  var departureairportcode = '';
  var airportGPS = {};


  $('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})
  //Function for angle caluation for flight icon rotation
  degrFrom_rad = function(rad) { return rad * 180 / Math.PI; }
  radFrom_degr  = function(degr) { return degr * Math.PI / 180; }
  getAngle = function(startLat,startLong,endLat,endLong){
    startLat = radFrom_degr(startLat), startLong = radFrom_degr(startLong), endLat = radFrom_degr(endLat), endLong = radFrom_degr(endLong);
    var x = endLong - startLong;
    var a = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
    if (Math.abs(x) > Math.PI){ if (x > 0.0) { x = -(2.0 * Math.PI - x); } else {  x = (2.0 * Math.PI + x); } }
    return (degrFrom_rad(Math.atan2(x, a)) + 360.0) % 360.0;
  }
  //UI setup
  //Trigger when slider is moved
  $("#slider").change(function(){
    //Gets the value and sets updated text to buffer
    var buffervalue = $("#slider").val();
    $("#bufferlabel").text("Buffer: " + buffervalue + " mins");
    buffer = buffervalue;
    //updateGoTime after buffer change
    updateGoTime();
  });
  //function will parse the url parameters and return the data.
  $.parameter = function(name){
	  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	  return results[1] || 0;
  }
  //Debugging function with simple boolean switch
  function logs(data) {
    //Writes the data to console.
    if (debugging) { console.log(data); }
  }
  //Updates the go time.
  function updateGoTime() {
    gotime = flighteta + flightdelay - drivingtime - buffer;
    var now = new Date();

    var realmin = gotime % 60
    var hours = Math.floor(gotime / 60)
    $("#navleave").html("<a>Leave in <b>"+ hours +" h " + Math.round(realmin) +" mins </b></a>");


    now.setMinutes(now.getMinutes() + gotime);
    $("#govalue").text("Go at:  " + now.toLocaleTimeString());
  }
  //find the total distance by adding up the routes in response.
  function totalDistance(result) {
    //gets all the waypoints
    var routes = result.routes[0];
    //adds up all the mirco distances
    for (var i = 0; i < routes.legs.length; i++) {
      var leg = routes.legs[i];
      drivingdistance += leg.distance.value;
      drivingtime += leg.duration.value;
    }
    //gets the total in km.
    drivingdistance = drivingdistance / 1000;
    drivingtime = drivingtime / 60;
    //logs the distance
    logs('Distance: ' + drivingdistance);
    logs('Duration: ' + drivingtime);
    //Sets UI
    $("#drivingtime").text(Math.round(drivingtime) + " mins (" + drivingdistance + " km)");
    //updateGoTime with all data received
    updateGoTime();
  }
  //find the direction via google maps and displays them
  function findDirection(origin, destination, service, display) {
    //Creates the route request
    service.route({
      origin: origin, //sets the start location
      destination: destination, //sets the destination
      waypoints: [{location: origin}, {location: destination}], //sets waypoints
      travelMode: 'DRIVING', //travel mode set to driving
      avoidTolls: true //avoid YES please who like toll trolls
    }, function(response, status) { //callback
      if (status === 'OK') { // Status 200
        logs(response); //logs the directions
        display.setDirections(response); //Writing the maps directions
        totalDistance(response);
      } else {
        //Directions failed
        alert("Sorry, your location is not supported in Go");
        $("#loading").hide();
      }
    });
  }

  function weatherLoad() {
    $.get("http://api.openweathermap.org/data/2.5/weather?lat=" + airportGPS['lat'] +"&lon=" + airportGPS['lng'] + "&units=metric&apikey=9e5fb56909438d04028050b28c54dfd7", function(data, status){
        $('#temp').html("<a><i class=\"fa fa-thermometer-half\" aria-hidden=\"true\"></i> " + data['main']['temp'] + "&#x2103;</b></a>");
    });
  }

  function processData(data) {
    //Logs flight to console
    logs(data);
    //Sets the flight information from the data to the UI labels
    $('#flight').val(data['displayIdent']);
    $('#airlinevalue').text(data['airline']['shortName']);
    $('#airlinenumber').text(data['codeShare']['friendlyIdent']);
    $('#equipmentvalue').text(data['aircraft']['friendlyType']);
    $('#arrivalvalue').text(data['destination']['friendlyName'])
    $('#departurevalue').text(data['origin']['friendlyName'])

    var estimated= new Date(data['landingTimes']['estimated']*1000);
    var scheduled= new Date(data['landingTimes']['scheduled']*1000);

    var diff = Math.abs(estimated - new Date());
    var minutes = Math.floor((diff/1000)/60);
    flighteta = minutes;

    logs(estimated.toString());
    logs(minutes);


    $('#etavalue').text(estimated.toString());

    arrivalairportcode = data['destination']['iata'];
    //Makes the API call to the google API to get lat long of start location
    /*
    * Google Docs
    * https://developers.google.com/maps/documentation/geocoding/start
    */
    var location = decodeURI($.parameter('location'));
    $('#youlocation').val(location);
    $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(location) + '&key=' + apikey, function(startdata) {
      //Check if there is a valid address with array coiunt
      logs(startdata);
      if (startdata.results.length != 0) {
        //If valid get the gps object
        var gpslocation = startdata.results[0].geometry.location;
        //Accessing the map element
        var map = new google.maps.Map(document.getElementById('map'), { zoom: 11, center: gpslocation });
        //Creates the traffic layer
        var trafficLayer = new google.maps.TrafficLayer();
        //Sets the layer over the map.
        trafficLayer.setMap(map);
        //Creates the marker for the starting point
        var marker = new google.maps.Marker({ position: gpslocation, map: map });
        $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + arrivalairportcode + '&key=' + apikey, function(airportdata) {
          logs(airportdata);
          //Check if there is a valid airportdata
          if (airportdata.results.length != 0) {
            //If valid get the gps object
            var gpsairport = airportdata.results[0].geometry.location;
            airportGPS = gpsairport;
            weatherLoad();
            //Sets the airport marker
            var marker = new google.maps.Marker({ position: gpsairport, map: map });
            //Gets the airport shortname
            var aiportaddress = airportdata.results[0].address_components[0].short_name;
            logs("Arrival Airport: " + aiportaddress);
            //Sets UI for arrival
            $("#arrivalvalue").text(aiportaddress);
            //Waypoints of filed flight plane
            var waypoints = data['waypoints'];
            var flightPlanCoordinates = [];
            //Formats the data for google maps
            for (var i = 0, j = waypoints.length; i < j; i += 1) {
              var point = waypoints[i];
              flightPlanCoordinates.push({lat: point[1], lng: point[0]});
            }
            var lineSymbol = { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 };
            //Creates the polyline to set to the maps object
            var flightPath = new google.maps.Polyline({
              path: flightPlanCoordinates,
              strokeOpacity: 0,
              icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: '20px'
              }],
              strokeColor: '#939393'
            });
            flightPath.setMap(map);
            //Current waypoint from the actual flight
            var waypointtrack = data['track'];
            var flightPlanCoordinatetrack = [];
            //Formats the data for google maps
            for (var i = 0, j = waypointtrack.length; i < j; i += 1) {
              var point = waypointtrack[i].coord;
              flightPlanCoordinatetrack.push({lat: point[1], lng: point[0]});
            }
            //Creates the polyline to set to the maps object
            var flightPathTrack = new google.maps.Polyline({
              path: flightPlanCoordinatetrack, geodesic: true, strokeColor: '#333', strokeOpacity: 1.0, strokeWeight: 4
            });
            flightPathTrack.setMap(map);
            //Gets the last two plane waypoint to find angle to turn icon marker
            var lastItem = waypointtrack.pop();
            var secondlastItem = waypointtrack[waypointtrack.length - 1];
            var angle = getAngle(secondlastItem.coord[0],secondlastItem.coord[1],lastItem.coord[0],lastItem.coord[1]);
            logs(angle);
            //Plane icon with it svg data
            /*var plane = {
                path: 'm510,255c0,-20.4 -17.85,-38.25 -38.25,-38.25l-140.25,0l-127.5,-204l-51,0l63.75,204l-140.25,0l-38.25,-51l-38.25,0l25.5,89.25l-25.5,89.25l38.25,0l38.25,-51l140.25,0l-63.75,204l51,0l127.5,-204l140.25,0c20.4,0 38.25,-17.85 38.25,-38.25z',
                fillColor: 'black',fillOpacity: 0.8,scale: 0.1,strokeColor: 'black',strokeWeight: 1,anchor: new google.maps.Point(10, 250), rotation:angle
            };*/
            var plane = {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: 'black',fillOpacity: 1.0,scale: 10,strokeColor: 'black',strokeWeight: 1,rotation: angle
            };
            //Sets the plane marks for where it is located
            var marker = new google.maps.Marker({ position: {lat: lastItem.coord[1], lng: lastItem.coord[0]}, map: map, title: 'Plane Current Location',icon: plane });
            //Start caluating the directions via google maps
            //Creates the directions services
            var directionsService = new google.maps.DirectionsService;
            //Creates the directions rendering object with the draggable set to true and map element
            var directionsDisplay = new google.maps.DirectionsRenderer({
              draggable: true,
              map: map,
            });
            //finds the directions
            findDirection(location, arrivalairportcode, directionsService,directionsDisplay);
            $("#loading").hide();
            // error message in case airport is unrecognizable
          } else {
            alert("Sorry not valid airport.");
            $("#loading").hide();
          }
        });
      } else {
        //Not valid start address
        alert("Sorry not a valid address!");
        $("#loading").hide();
      }
      //Hides the spinner since done running
    });

  }
  //the script to get GPS data and plot data
  function processing(){
    //Gets the flight ID from the URL
    var flight = $.parameter('flight');
    $.ajax({
        type: "GET", url: "http://localhost:8080/api/flight/" + flight, crossDomain : true
    }).done(function(data) {
      processData(data['flightdata']);
    }).fail( function(xhr, textStatus, errorThrown) {
      alert("KJ");
    });
  }
  // To simulate the apps finding the data and rendering
  setTimeout(processing, 100);
  // To trigger once the app sidebar is opened
  $('#openMenu').click(function() {
    document.getElementById("menu").style.display = "block";
  });
  // To trigger once the app sidebar is close
  $('#closeMenu').click(function() {
    document.getElementById("menu").style.display = "none";
  });
});
