$(document).ready(function(){

  //function will parse the url parameters and return the data.
  $.parameter = function(name){
	  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	  return results[1] || 0;
  }

  //the script to get GPS data and plot data
  function running(){
    //Gets the location from the URL
    var location = decodeURI($.parameter('location'));
    //Gets the flight ID from the URL
    var flight = $.parameter('flight');
    //Sets the location and flight ID in the UI
    $('#youlocation').val(location);
    $('#flight').val(flight);
    //Makes the API call to the google API to get lat long of start location
    $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(location) + '&key=AIzaSyC_ep81AybHxhf6J3pc2eJ-AFEbxQ1cMbI', function( data ) {
      //Check if there is a valid address with array coiunt
      if (data.results.length != 0) {
        //If valid get the gps object
        var gpsobject = data.results[0].geometry.location;
        //Create the location marker
        var location = {lat: gpsobject['lat'], lng: gpsobject['lng']};
        //Accessing the map element
        var map = new google.maps.Map(document.getElementById('map'), { zoom: 11, center: location });
        //Creates the marker for the starting point
        var marker = new google.maps.Marker({ position: location, map: map });
      } else {
        //Not valid start address
        alert("Sorry not a valid address!");
      }
      //Hides the spinner since done running
      $("#loading").hide();
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
