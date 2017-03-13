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
  var flightdelay = 25;
  var flighteta = 200;

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
    $("#govalue").text("Go in " + gotime + " mins");
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
    $("#drivingtime").text(drivingtime + " mins (" + drivingdistance + " km)");
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
  //the script to get GPS data and plot data
  function running(){
    //Gets the location from the URL
    var location = decodeURI($.parameter('location'));
    //logs start location
    logs('Starting Point: ' + location);
    //Gets the flight ID from the URL
    var flight = $.parameter('flight');
    //logs the flight
    logs('Flight ID: ' + flight)
    //Sets the location and flight ID in the UI
    $('#youlocation').val(location);
    $('#flight').val(flight);
    //Makes the API call to the google API to get lat long of start location
    /*
    * Google Docs
    * https://developers.google.com/maps/documentation/geocoding/start
    */
    var airportcode = 'ORD';
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
        $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + airportcode + '&key=' + apikey, function(airportdata) {
          logs(airportdata);
          //Check if there is a valid airportdata
          if (airportdata.results.length != 0) {
            //If valid get the gps object
            var gpsairport = airportdata.results[0].geometry.location;
            //Sets the airport marker
            var marker = new google.maps.Marker({ position: gpsairport, map: map });
            //Gets the airport shortname
            var aiportaddress = airportdata.results[0].address_components[0].short_name;
            logs("Arrival Airport: " + aiportaddress);
            //Sets UI for arrival
            $("#arrivalvalue").text("(" + airportcode + ") " + aiportaddress);

            //Process Flight Data (Under Construction)
            /*=======================================*/
            $("#etavalue").text(flighteta + " mins");
            if (flightdelay > 0) {
              $("#delayvalue").text("+" + flightdelay);
            } else {
              $("#delayvalue").text("" + flightdelay);
            }
            /*=======================================*/

            //Start caluating the directions via google maps
            /*
            * https://developers.google.com/maps/documentation/javascript/examples/directions-draggable
            */
            //Creates the directions services
            var directionsService = new google.maps.DirectionsService;
            //Creates the directions rendering object with the draggable set to true and map element
            var directionsDisplay = new google.maps.DirectionsRenderer({
              draggable: true,
              map: map,
            });
            //finds the directions
            findDirection(location, airportcode, directionsService,directionsDisplay);
            $("#loading").hide();
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
  // To simulate the apps finding the data and rendering
  setTimeout(running, 100);
  // To trigger once the app sidebar is opened
  $('#openMenu').click(function() {
    document.getElementById("menu").style.display = "block";
  });
  // To trigger once the app sidebar is close
  $('#closeMenu').click(function() {
    document.getElementById("menu").style.display = "none";
  });
});
