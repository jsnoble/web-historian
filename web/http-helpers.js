var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  fs.readFile(asset, function(error, content) {
    //console.dir("content:" +content);
    if (error) {
      res.writeHead(500);
      res.end();
    }
    else {
      //return content;
      callback(res, content, 200);
      // res.writeHead(200, headers);
      // res.end(content, 'utf-8');
    }
  });

};


