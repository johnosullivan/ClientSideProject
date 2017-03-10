/* openMenu for openning the menu */
function openMenu() {
   document.getElementById("menu").style.display = "block";
}
/* closeMenu for closing the menu */
function closeMenu() {
   document.getElementById("menu").style.display = "none";
}

function getFlightID(){
   //grab flight info for the flight
}
function initMap() {
  var uluru = {lat: 41.885452, lng: -87.619921};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}
