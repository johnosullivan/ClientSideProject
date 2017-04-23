$(document).ready(function() {
    "use strict";
    //random background generator
    var images = ['images/chicago.jpg',
        'images/newyork.jpg',
        'images/sanfran.jpg',
        'images/city1.jpg',
        'images/city2.jpg',
        'images/city3.jpg',
        'images/city4.jpg',
        'images/city5.jpg',
        'images/city6.jpg'];

        var randomNumber = Math.floor(Math.random() * images.length);
        var bgImg = 'url(' + images[randomNumber] + ')';

        $('body').css({'background': bgImg, 'background-size': 'cover'});
        ;

    // Grab the data from the input fields and build the url to set as location
    $("#go").click(function () {
        var flight = $('#flight').val();
        var location = $('#location').val();
        window.location = 'map.html?flight=' + flight + '&location=' + location;
        $("#flight").val("");
        $("#location").val("");


    })

});
