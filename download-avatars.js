var request = require('request');
var fs = require('fs');
var secret = require('./secret.js');


var arg = process.argv.splice(2);

if( arg[0] === undefined || arg[1] === undefined){
  console.log("Please input two arguments: <owner> <repo>")
}

else {

  console.log('Welcome to the GitHub Avatar Downloader!');

  function downloadImageByURL(url, filePath) {

    console.log("Downloading IMG at: " + url);
    request.get(url)                                                      // Note 1
         .on('error', function (err) {                                   // Note 2
           throw err;
         })
         .on('response', function (response) {                           // Note 3
           console.log('Response Status Code: ', response.statusCode);
           // console.log(response.headers['content-type']);
           console.log("Image download complete.");

         })
         .pipe(fs.createWriteStream(filePath));
    // ...
  }

  function getRepoContributors(repoOwner, repoName, cb) {

    var options = {
      url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
      headers: {
        'User-Agent': 'request',
        'Authorization': secret.GITHUB_TOKEN
      }
    };

    request(options, function(err, res, body) {
      cb(err, body);
    });
  }

  getRepoContributors(arg[0], arg[1], function(err, result) {
    console.log("Errors:", err);
    var resultObject = JSON.parse(result);

    for(key in resultObject){
      var avatarUrl = resultObject[key].avatar_url;
      downloadImageByURL(avatarUrl, "./avatars/" + resultObject[key].login + ".jpg")
    }

    // console.log(resultObject);

  });
}


