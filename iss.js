const needle = require('needle');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  const url = 'https://api.ipify.org?format=json';

  needle.get((url), (error, response, body) => {
    // There was an error in the API request.
    if (error) {
      callback(error, null);
      return;
    }
  
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    // if we get here, all's well and we got the data
    callback(null, body.ip);
  });
};


// Take in an IP address and return the latitude and longitude for it.
const fetchCoordsByIP = function(ip, callback) {
  // use request to fetch IP address from JSON API
  const url = `http://ipwho.is/${ip}`;

  needle.get((url), (error, response, body) => {
    // There was an error in the API request.
    if (error) {
      callback(error, null);
      return;
    }
  
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    // Response contains an error
    if (!body.success) {
      const msg = `Success status was ${body.success}. Server message says: ${body.message} when fetching for IP ${body.ip}.`;
      callback(Error(msg), null);
      return;
    }

    const coords = {
      latitude: body.latitude,
      longitude: body.longitude};

    // if we get here, all's well and we got the data
    callback(null, coords);
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  // use request to fetch IP address from JSON API
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  
  needle.get((url), (error, response, body) => {
    // There was an error in the API request.
    if (error) {
      callback(error, null);
      return;
    }
  
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching FlyOver Times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
      
    // if we get here, all's well and we got the data
    callback(null, body.response);
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
};



