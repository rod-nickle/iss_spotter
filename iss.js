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
  const url = "http://ipwho.is/" + ip;

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

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
};



