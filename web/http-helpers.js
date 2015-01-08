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

exports.read = function(res, asset, callback) {
  // read file
  fs.readFile (asset , function (error , content) {
    if (error) {
      res.writeHead (500);
      res.end ();
    }
    else {
      callback (res , content , 200);
    }
  });
};

exports.serveAssets = function(res, asset, callback) {
  var path = asset;
  console.log("path: "+path);
  if (path === '/') {
    path = archive.paths.siteAssets+ '/index.html';
    exports.read(res, path, callback);
  } else if (archive.isUrlInList(path)) {
    path = archive.paths.archivedSites + '/' + path;
    exports.read(res, path, callback);
  } else {
    callback(res, null, 404);
  }
};


