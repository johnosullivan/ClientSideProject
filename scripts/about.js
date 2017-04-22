/*jslint browser: true*/
/*global $, jQuery, alert*/

/*script to randomly select background image*/
$(document).ready(function () {
    "use strict";
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

});
