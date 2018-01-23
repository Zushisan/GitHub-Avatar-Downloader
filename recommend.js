require('dotenv').config();

const request = require('request');
const fs = require('fs');
const dotenv = require('dotenv');

var arg = process.argv.splice(2);

var globalCounter = 0;
var globalObjectResult = "";

// Handle empty arg input
if(arg[0] === undefined || arg[1] === undefined || arg[2] !== undefined){
  console.log("You have given: "+ arg.length +" arguments. Please input two arguments: <owner> <repo>");
}
else {

  console.log('Welcome to the GitHub Recommended Repos !');

  // Function that will get the result from the url request
  function getStarredUrl(url, callback) {

    var options = {
      url: url,
      headers: {
        'User-Agent': 'request',
        'Authorization': process.env.GITHUB_TOKEN
      }
    };

    request(options, function(err, res, body) {
      var currentCode = res.statusCode.toString();
      if(currentCode[0] !== "2"){  // Handle error type

        var bodyObject = JSON.parse(body);
        console.log("Status code: " + res.statusCode);
        console.log("Error: " + bodyObject.message);
        return;
      }

      var bodyObject = JSON.parse(body);
      // We use that for loop as a buffer
      for (var key in bodyObject){
        globalObjectResult = globalObjectResult + bodyObject[key].full_name + " ";
      }

      // We use the globalCounter to wait until the for loop as taken all the data
      if(globalCounter === 1){
        // We put the data in an array to handle better
        resultArray = globalObjectResult.split(" ");
        //
        var resultObject = {};
        // We push our result into an object
        for (var i = 0; i < resultArray.length; i++){
          if(resultObject[resultArray[i]]){
            resultObject[resultArray[i]] += 1;
          }
          else {
            resultObject[resultArray[i]] = 1;
          }
        }

        // We sort our Object !! and we display the result.
        var keysSorted = Object.keys(resultObject).sort(function(a,b){return resultObject[b]-resultObject[a]})

        console.log("The top 5 most contributors !!");
        console.log("[ " + resultObject[keysSorted[0]] + " stars ] " + keysSorted[0]);
        console.log("[ " + resultObject[keysSorted[1]] + " stars ] " + keysSorted[1]);
        console.log("[ " + resultObject[keysSorted[2]] + " stars ] " + keysSorted[2]);
        console.log("[ " + resultObject[keysSorted[3]] + " stars ] " + keysSorted[3]);
        console.log("[ " + resultObject[keysSorted[4]] + " stars ] " + keysSorted[4]);
      }
      globalCounter--; // Global counter that wait the buffer
    });
  }


  // First step, taht function gets the repo contributor.
  function getRepoContributors(repoOwner, repoName, cb) {

    var options = {
      url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
      headers: {
        'User-Agent': 'request',
        'Authorization': process.env.GITHUB_TOKEN
      }
    };

    request(options, function(err, res, body) {
      var currentCode = res.statusCode.toString();
      if(currentCode[0] !== "2"){  // Handle error type

        var bodyObject = JSON.parse(body);
        console.log("Status code: " + res.statusCode);
        console.log("Error: " + bodyObject.message);
        return;
      }

      cb(err, body);
    });
  }


  // We get the repoContributors we want then feed the starredUrl to our function that will return our result
  getRepoContributors(arg[0], arg[1], function(err, result) {

    if(process.env.GITHUB_TOKEN){
      // If the folder doesnt exist, throw and error.
       var resultObject = JSON.parse(result);

        // Loop throught the parsed object to find the url we want
      for(var key in resultObject){
        var starredUrl = resultObject[key].starred_url;
        starredUrl = starredUrl.slice(0, -15);
        // console.log(starredUrl);
        globalCounter++;
        getStarredUrl(starredUrl);
      }

    }
    else{
      console.log("Could not find ENV file.");
      return;
    }
  });
}

