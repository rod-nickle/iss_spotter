// iss_promised.js
const needle = require('needle');

/*
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */
const fetchMyIP = function() {
  const url = 'https://api.ipify.org?format=json';

  return needle('get', url)
    .then((response) => {
      const body = response.body; // retrieve the body value from the response object
      const ip = body.ip; // retrieve the ip from the body object
      return ip;
    });
};

/*
 * Makes a request to ipwho.is using the provided IP address to get its geographical information (latitude/longitude)
 * Input: IP address as a string
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = function(ip) {
  // use request to fetch IP address from JSON API
  const url = `http://ipwho.is/${ip}`;

  return needle('get', url)
    .then((response) => {
      const body = response.body; // retrieve the body value from the response object
      const coords = {            // retrieve the coordinates from the body object
        latitude: body.latitude,
        longitude: body.longitude};
        
      return coords;
    });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input: An object with keys `latitude` and `longitude`
 * Returns: Promise of a request for flyover times
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords) {
  // use request to fetch IP address from JSON API
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  
  return needle('get', url)
    .then((response) => {
      const body = response.body; // retrieve the body value from the response object
      const flyoverTimes = body.response;  // Array of flyover times
      return flyoverTimes;
    });
};

/*
 * Input: None
 * Returns: Promise for fly over data for users location
 */
const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then((ip) => fetchCoordsByIP(ip))
    .then((coords) => fetchISSFlyOverTimes(coords))
    .then((flyoverTimes) => {
      return flyoverTimes;
    });
};


module.exports = { nextISSTimesForMyLocation };