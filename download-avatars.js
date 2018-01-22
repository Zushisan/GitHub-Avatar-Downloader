var request = require('request');
var fs = require('fs');
var dotenv = require('dotenv');

var arg = process.argv.splice(2);

// Handle empty arg input
if(arg[0] === undefined || arg[1] === undefined || arg[2] !== undefined){
  console.log("You have given: "+ arg.length +" arguments. Please input two arguments: <owner> <repo>");
}
else {

  console.log('Welcome to the GitHub Avatar Downloader!');

  // function that will download the img at the url and put it in filePath
  function downloadImageByURL(url, filePath) {

    console.log("Attempting to download IMG at: " + url);
    request.get(url)
          .on('error', function (err) {
            throw err;
          })
          .on('response', function (response) {

           console.log('Response Status Code: ', response.statusCode);
           console.log("Image download complete.");

          })
          .pipe(fs.createWriteStream(filePath));
  }

  function getRepoContributors(repoOwner, repoName, cb) {

    var options = {
      url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
      headers: {
        'User-Agent': 'request',
        'Authorization': dotenv.GITHUB_TOKEN
      }
    };

    request(options, function(err, res, body) {
      var currentCode = res.statusCode.toString(); //tostring split
      if(currentCode[0] === "4"){
        var bodyObject = JSON.parse(body);
        console.log("Status code: " + res.statusCode);
        console.log("Error: " + bodyObject.message);
        return;
      }
      cb(err, body);
    });
  }


  // This function find the repo and feed our download image function the information on what to download.
  getRepoContributors(arg[0], arg[1], function(err, result) {

    // If the folder doesnt exist, throw and error.
    fs.stat("avatars", function(err, stats) {
      if(err){
        console.log("Directory avatars does not exist. Request terminated.")
        return;
      }

      var resultObject = JSON.parse(result);

      // Loop throught the parsed object to find the url we want
      for(key in resultObject){
        var avatarUrl = resultObject[key].avatar_url;
        downloadImageByURL(avatarUrl, "./avatars/" + resultObject[key].login + ".jpg")
      }

    });
  });
}


