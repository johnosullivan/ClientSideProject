$(document).ready(function(){

  $("#go").click(function() {
    var flight = $('#flight').val();
    var location = $('#location').val();
    window.location = 'map.html?flight=' + flight + '&location=' + location;
    $("#flight").val("");
    $("#location").val("");
  });

});
