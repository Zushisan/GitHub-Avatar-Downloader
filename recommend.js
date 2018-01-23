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

  // function that will download the img at the url and put it in filePath
  function getStarredUrl(url, callback) {

    var options = {
      url: url,
      headers: {
        'User-Agent': 'request',
        'Authorization': process.env.GITHUB_TOKEN
      }
    };
    // console.log(url);
    request(options, function(err, res, body) {
    var currentCode = res.statusCode.toString();
    if(currentCode[0] !== "2"){  // Handle error type

      var bodyObject = JSON.parse(body);
      console.log("Status code: " + res.statusCode);
      console.log("Error: " + bodyObject.message);
      return;
    }

    var bodyObject = JSON.parse(body);
    // res.on('data', function (data) {
    for (key in bodyObject){
      globalObjectResult = globalObjectResult + bodyObject[key].full_name + " ";
    }
    // console.log(globalObjectResult);
  // });
    // console.log(typeof globalObjectResult);
    if(globalCounter === 1){
      // console.log(globalObjectResult);
      resultArray = globalObjectResult.split(" ");
      // console.log(resultArray);
      var resultObject = {};
      // console.log(bodyObject);
      for ( i = 0; i < resultArray.length; i++){
        if(resultObject[resultArray[i]]){
          resultObject[resultArray[i]] += 1;
        }
        else {
          resultObject[resultArray[i]] = 1;
        }
      }
      var finalObject = {};
      for(key in resultObject){
        // console.log(typeof resultObject[key]);

        if(resultObject[key] > 1){
          finalObject[key] = resultObject[key];

          // console.log(resultObject[key]);
          // console.log(typeof resultObject[key]);
        }
      }
      var keysSorted = Object.keys(finalObject).sort(function(a,b){return finalObject[b]-finalObject[a]})

      console.log("The top 5 most contributors !!");
      console.log("[ " + finalObject[keysSorted[0]] + " stars ] " + keysSorted[0]);
      console.log("[ " + finalObject[keysSorted[1]] + " stars ] " + keysSorted[1]);
      console.log("[ " + finalObject[keysSorted[2]] + " stars ] " + keysSorted[2]);
      console.log("[ " + finalObject[keysSorted[3]] + " stars ] " + keysSorted[3]);
      console.log("[ " + finalObject[keysSorted[4]] + " stars ] " + keysSorted[4]);
    }
    globalCounter--;
  });
}



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
      // var bodyObject = JSON.parse(body);
      // console.log(body);
      cb(err, body);
    });
  }


  // This function find the repo and feed our download image function the information on what to download.
  getRepoContributors(arg[0], arg[1], function(err, result) {

    if(process.env.GITHUB_TOKEN){
      // If the folder doesnt exist, throw and error.
       var resultObject = JSON.parse(result);

        // Loop throught the parsed object to find the url we want
      for(key in resultObject){
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

