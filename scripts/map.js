$(document).ready(function(){
  //Logic for the go app.
  //Variables for the app.
  var apikey = 'AIzaSyC_ep81AybHxhf6J3pc2eJ-AFEbxQ1cMbI';
  var debugging = false;
  var currenteta = 0;
  var drivingtime = 0;
  var drivingdistance = 0;
  var buffer = 0;
  var gotime = 0;
  //Global Data Variables
  var flightdelay = 0;
  var flighteta = 0;
  var arrivalairportcode = '';
  var departureairportcode = '';
  var airportGPS = {};
  var wproute = [];
  var orginaddress = '';
  var destinationaddress = '';
  var gdirectionsService;
  var gdirectionsDisplay;
  //Tabs control jquery change
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
    gotime = flighteta - drivingtime - buffer;
    logs("Gotime: " + gotime);
    if (gotime > 0) {
      //Time caluation for leaving time
      var realmin = gotime % 60
      var hours = Math.floor(gotime / 60)
      $("#navleave").html("<a>Leave in <b>"+ hours +" h " + Math.round(realmin) +" mins </b></a>");
      $("#leavein").html("Leave in <b>"+ hours +" h " + Math.round(realmin) +" mins </b>");
      $("#loading").hide();
    } else {
      //Time caluation for your late
      var gotimelate = Math.abs(gotime);
      var realminlate = gotime % 60
      var hourslate = Math.floor(gotimelate / 60)
      $("#navleave").html("<a>Your late by <b>"+ hourslate +" h " + Math.round(Math.abs(realminlate)) +" mins </b></a>");
      $("#leavein").html("Your late by <b>"+ hourslate +" h " + Math.round(Math.abs(realminlate)) +" mins </b>");
      $("#loading").hide();
    }
  }
  //find the total distance by adding up the routes in response.
  function totalDistance(result) {
    //gets all the waypoints
    var routes = result.routes[0];
    var steps = [];
    //adds up all the mirco distances
    for (var c = 0; c < routes.legs.length; c++) {
      var leg = routes.legs[c];
      steps = steps.concat(leg.steps);
      drivingdistance += leg.distance.value;
      drivingtime += leg.duration.value;
    }
    //Creates the directions data for inject into directions element
    var directiondata = "";
    for (var i = 0, j = steps.length; i < j; i++) {
      var s = steps[i]
      var step = s.instructions;
      var distance = s.distance.text;
      var snum = i + 1;
      directiondata += "<li class=\"side\"><b style=\"color: #335386;\">"+ snum + ")</b> " + step + " (" + distance + ")</li>";
    }
    $("#directions").html(directiondata);
    //Creates the routes data for inject into routes element
    var routesdata = "";
    routesdata += "<li class=\"side\"><b style=\"color: #335386;\">Start:</b>" + orginaddress + "</li>";
    for (var x = 0, y = wproute.length; x < y; x++) {
      var wp = wproute[x];
      routesdata += "<li class=\"side\"><b style=\"color: #335386;\">"+ (x + 1) + ") </b>"+ wp.title + "<br><button id=\""+ x +"\" style=\"background-color:#bf1111;\"><b><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></b></button></li>";
    }
    routesdata += "<li class=\"side\"><b style=\"color: #335386;\">End:</b> " + destinationaddress + "</li>";
    $("#routes").html(routesdata);
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
  //Detects the delete button being click to change routes waypoints
  $(document).on('click', '#routes button', function(){
     var id = parseInt(jQuery(this).attr("id"));
     wproute.splice(id, 1);
     $("#loading").show();
     //Re-caluation the directions
     findDirection(orginaddress, destinationaddress, gdirectionsService, gdirectionsDisplay);
  });
  //find the direction via google maps and displays them
  function findDirection(origin, destination, service, display) {
    //Creates the route request {location: new google.maps.LatLng(45.658197,-73.636333),stopover: true}
    gdirectionsService = service;
    gdirectionsDisplay = display;
    var points = [{location: origin}];
    for (var i = 0, j = wproute.length; i < j; i += 1) {
      var wp = wproute[i];
      points.push({location: new google.maps.LatLng(wp.position.lat(),wp.position.lng()),stopover: true});
    }
    points.push({location: destination});
    service.route({
      origin: origin, //sets the start location
      destination: destination, //sets the destination
      waypoints: points, //sets waypoints
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
  //Added marker place to the routes
  function addToRoute(marker) {
    wproute.push(marker);
    $("#loading").show();
    //Re-caluation the directions
    findDirection(orginaddress, destinationaddress, gdirectionsService, gdirectionsDisplay);
  }
  //Gets the weather data
  function weatherLoad() {
    var base = '';
    if (debugging) {
      base = 'http://localhost:8080/api/weather/'
    } else {
      base = 'https://obscure-bastion-20749.herokuapp.com/api/weather/';
    }
    $.get(base  + airportGPS['lat'] +"/" + airportGPS['lng'], function(data, status){
        $('#temperature').html("<i class=\"fa fa-thermometer-half\" aria-hidden=\"true\"></i> " + data['main']['temp'] + "&#x2103;</b>");
        $('#temp').html("<a><i class=\"fa fa-thermometer-half\" aria-hidden=\"true\"></i> " + data['main']['temp'] + "&#x2103;</b></a>");
    });
  }
  //Compares two dates for minutes
  function dateDiff(date1, date2){
    var diff = (date2 - date1)/1000;
    var diff = Math.abs(Math.floor(diff));
    var min = Math.floor(diff/(60));
    return min;
  }
  //Processes the flight data and given location
  function processData(data,location) {
    //Logs flight to console
    logs(data);
    //Sets the flight information from the data to the UI labels
    $('#flight').val(data['displayIdent']);
    $('#airlinevalue').text(data['airline']['shortName']);
    $('#airlinenumber').text(data['codeShare']['friendlyIdent']);
    $('#equipmentvalue').text(data['aircraft']['friendlyType']);
    $('#arrivalvalue').text(data['destination']['friendlyName']);
    $('#departurevalue').text(data['origin']['friendlyName']);
    $('#terminal').text("#" + data['destination']['terminal']);
    //Destintation and orgin address sets
    destinationaddress = data['destination']['friendlyName'];
    orginaddress = location;
    //Gets the flight times to caluate the diff in time
    var gateArrivalTimes_estimated= new Date(data['gateArrivalTimes']['estimated']*1000);
    var gateArrivalTimes_scheduled= new Date(data['gateArrivalTimes']['scheduled']*1000);
    var diff = Math.abs(gateArrivalTimes_estimated - new Date());
    var minutes = Math.floor((diff/1000)/60);
    //Sets time will landed in miuntes
    flighteta = minutes;
    //Sets the time delay or early value
    var diffmin = dateDiff(gateArrivalTimes_estimated,gateArrivalTimes_scheduled);
    var diffminreal = diffmin % 60
    var diffhours = Math.floor(diffmin / 60)
    if( (gateArrivalTimes_estimated.getTime() > gateArrivalTimes_scheduled.getTime())) {
      $("#delayvalue").text("Delay: " + Math.round(diffhours) + " h " +  Math.round(diffminreal) + " mins");
      flightdelay = diffmin;
    } else {
      $("#delayvalue").text("Early: " + Math.round(diffhours) + " h " +  Math.round(diffminreal) + " mins");
      flightdelay = (diffmin * -1);
    }
    //Sets the ETA and IATA code
    $('#etavalue').text(gateArrivalTimes_estimated.toString());
    arrivalairportcode = data['destination']['iata'];
    //Makes the API call to the google API to get lat long of start location
    /*
    * Google Docs
    * https://developers.google.com/maps/documentation/geocoding/start
    */
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
            //Gets the search box
            var input = document.getElementById('search');
            //Creates new google Search box
            var searchBox = new google.maps.places.SearchBox(input);
            //Adds an listener to detect bounds change
            map.addListener('bounds_changed', function() {
              searchBox.setBounds(map.getBounds());
            });
            //Holding array for the markers
            var markers = [];
            //Adds listener to the search box for when new places are found
            searchBox.addListener('places_changed', function() {
              //Gets the places from search
              var places = searchBox.getPlaces();
              //Clears search input
              $("#search").val('');
              //Checks the length
              if (places.length == 0) { return; }
              //Sets all the markers from map
              markers.forEach(function(marker) {
                marker.setMap(null);
              });
              //Sets empty array
              markers = [];
              //Creates a new bounds map object
              var bounds = new google.maps.LatLngBounds();
              places.forEach(function(place) {
                //Checks is valid point
                if (!place.geometry) { return; }
                //Creates the icon linked to place
                var icon = {
                  url: place.icon, size: new google.maps.Size(71, 71), origin: new google.maps.Point(0, 0), anchor: new google.maps.Point(17, 34), scaledSize: new google.maps.Size(25, 25)
                };
                //Creates and setup the markers
                var marker = new google.maps.Marker({
                  map: map, icon: icon, title: place.name, position: place.geometry.location
                });
                //Stores the marker for later
                markers.push(marker);
                //Adds listener for the click and infowindow setup
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                  return function() {
                    //Creates new info window with add button
                    var infowindow = new google.maps.InfoWindow({ });
                    var popupString = '<div ><b>' + marker.title + '</b><button id="add"><b><i class="fa fa-plus" aria-hidden="true"></i></b></button></div>';
                    //Sets the content and present to map
                    infowindow.setContent(popupString);
                    infowindow.open(map, marker);
                    //Detects add and will add to route
                    $("#add").click(function () {
                      //Start loading
                      $("#loading").show();
                      //Add waypoint
                      addToRoute(marker);
                      //CLose the info window
                      infowindow.close();
                    });
                  }
                })(marker, i));
                if (place.geometry.viewport) { bounds.union(place.geometry.viewport); } else { bounds.extend(place.geometry.location); }
              });
              //Resize map to fix bounds
              map.fitBounds(bounds);
            });
            //Detects drag in route change
            google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
                totalDistance(directionsDisplay.directions);
            });
            //finds the directions
            findDirection(location, arrivalairportcode, directionsService,directionsDisplay);
            $("#loading").hide();
            // error message in case airport is unrecognizable
          } else {
            alert("Sorry not valid airport.");
            window.location.href = "index.html";
            $("#loading").hide();
          }
        });
      } else {
        //Not valid start address
        alert("Sorry not a valid address!");
        window.location.href = "index.html";
        $("#loading").hide();
      }
    });
  }
  //Trigger function starts the processing
  function trigger() {
    var flight = $.parameter('flight');
    var location = decodeURI($.parameter('location'));
    processing(flight,location);
  }
  //the script to get GPS data and plot data
  function processing(flight,location){
    //Gets the flight ID from the URL
    var base = '';
    if (debugging) {
      base = 'http://localhost:8080/api/flight/'
    } else {
      base = 'https://obscure-bastion-20749.herokuapp.com/api/flight/';
    }
    $.ajax({
        type: "GET", url: base + flight, crossDomain : true
    }).done(function(data) {
      var unknown = data['flightdata']['unknown'];
      if (unknown == undefined) {
        processData(data['flightdata'],location);
      } else {
        alert("Not Valid Flight");
        window.location.href = "index.html";
      }
    }).fail( function(xhr, textStatus, errorThrown) {
      alert("Cannot connection to the serverside.");
    });
  }
  //Reruns the processing with the current value in the two textfields
  $('#rerun').click(function() {
    $("#loading").show();
    processing($('#flight').val(),$('#youlocation').val());
  });
  // To simulate the apps finding the data and rendering
  setTimeout(trigger, 100);
  // To trigger once the app sidebar is opened
  $('#openMenu').click(function() {
    document.getElementById("menu").style.display = "block";
  });
  // To trigger once the app sidebar is close
  $('#closeMenu').click(function() {
    document.getElementById("menu").style.display = "none";
  });
});
