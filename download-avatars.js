var request = require('request');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  // request.get('https://sytantris.github.io/http-examples/future.jpg')               // Note 1
  //      .on('error', function (err) {                                   // Note 2
  //        throw err;
  //      })
  //      .on('response', function (response) {                           // Note 3
  //        console.log('Response Status Code: ', response.statusCode);
  //        console.log(response.headers['content-type']);
  //        console.log("Image download complete.");

  //      })
  //      .pipe(fs.createWriteStream('./future.jpg'));

  // ...
}




getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});


