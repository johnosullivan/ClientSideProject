<<<<<<< HEAD
$(document).ready(function(){
=======
/* openMenu for openning the menu */
function openMenu() {
   document.getElementById("menu").style.display = "block";
}
/* closeMenu for closing the menu */
function closeMenu() {
   document.getElementById("menu").style.display = "none";
}

//checks flight info then calls map opener
function checkFlightID(){
    var fName = document.getElementById(fName);
    var lName = document.getElementById(lName);
    if ((fName !== null) && (lName !== null)){
        goToMap()
    }
    else {
        document.getElementById(lNameLabel);
    }
}
//should move the
function goToMap() {
    "use strict";
//handle user event for `Go` button click
    $(".Gobutton").on("click", $map.html(opener))
    //{
//object for wrapper html for note
        //var $map = $("<p>");
//get value from input field
        //var note_text = $(".note-input input").val();
//set content for note
//append note text to note-output
        //$(".note-output").append($note);
    //});
};
>>>>>>> origin/master

  $("#go").click(function() {
    var flight = $('#flight').val();
    var location = $('#location').val();
    window.location = 'map.html?flight=' + flight + '&location=' + location;
    $("#flight").val("");
    $("#location").val("");
  });

});
