var request = require('request');
var fs = require('fs');
var secret = require('./secret.js');

console.log('Welcome to the GitHub Avatar Downloader!');

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




getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  var resultObject = JSON.parse(result);

  for(key in resultObject){
    var avatarUrl = resultObject[key].avatar_url;
    console.log(avatarUrl);
  }

  // console.log(resultObject);

});


