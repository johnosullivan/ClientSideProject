/*script to randomly select background image*/
$(document).ready(function () {
    "use strict";
    //Array of images to pick from
    var images = ['images/chicago.jpg',
                  'images/newyork.jpg',
                  'images/city1.jpg',
                  'images/city2.jpg',
                  'images/city3.jpg',
                  'images/city4.jpg',
                  'images/city5.jpg',
                  'images/city6.jpg'];
    //Picks a number from 0 to array lengh
    var randomNumber = Math.floor(Math.random() * images.length);
    var bgImg = 'url(' + images[randomNumber] + ')';
    //sets the backgroud to a randon image and makes sure it is not repeating
    $('body').css({'background': bgImg, 'background-size': 'cover','background-repeat':'no-repeat','background-attachment':'fixed','background-position':'center center;','-webkit-background-size':'cover','-moz-background-size':'cover','-o-background-size':'cover'});
});
