
# Client-Side Project Final

## Team

* John O'Sullivan <a href="https://github.com/johnosullivan">https://github.com/johnosullivan</a> 
* Katie Eaton  <a href="https://github.com/k-eatonn ">https://github.com/k-eatonn </a> 

## Purpose
GO? accesses information from Google Maps’ API and flight information to determine when a person should leave for the airport when picking up a friend or loved one. Our application's purpose is to take the guesswork out of picking up a friend from the airport. The only user input needed is a flight number and beginning address, the application then calculates the most ideal route to the airport. Go! allows you to modify your route in case you would like stop somewhere. As expressed in the presentation John is very passionate about aviation and planes. We both believed this would be a perfect opportunity to use different forms of data to create a tool that is simple and universally beneficial. 

## Installation

```
git clone https://github.com/johnosullivan/ClientSideProject.git

cd ClientSideProject

cd server && npm install && cd ..

Open scripts/maps.js

Change 'var debugging' to either true to use localhost or false to have heroku hosted API. 

open index.html in Chrome

```

## API Endpoint 

|                        | Description                                                                                                                                                                                                                      |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| /api/flight/:id        | Takes in flight ID, returns JSON object containing the following values: aircraft details, flight plan, current position, ETA, delays, taxi times, gate information, ground conditions, departure airport, arrival airport, etc. |
| /api/weather/:lat/:lng | To fix the HTTP and HTTPS protocol conflict we were having when we deployed on Github, we created a API bridge which relays the lat and lng from our client-side to API to open weather’s API to avoid this issue.               |

## Environment
__Development Details__

*  IDE/ Editors
	* WebStorm
	* Atom

* Version Control
    * Git
    * Source Tree
    * Github

## Run Details
__SUPPORTED BROWSERS__

* Chrome
* Microsoft Browsers (Internet Explorer, Edge)
* Mozilla Firefox
