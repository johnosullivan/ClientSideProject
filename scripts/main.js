$(document).ready(function(){
  // Grab the data from the input fields and build the url to set as location
  $("#go").click(function() {
    var flight = $('#flight').val();
    var location = $('#location').val();
    window.location = 'map.html?flight=' + flight + '&location=' + location;
    $("#flight").val("");
    $("#location").val("");
  });
});
