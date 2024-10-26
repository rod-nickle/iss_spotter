const {nextISSTimesForMyLocation} = require('./iss');

nextISSTimesForMyLocation((error, flyoverTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  flyoverTimes.forEach(element => {
    console.log(`Next pass at ${Date(element.risetime)} for ${element.duration} seconds!`);
  });
});




