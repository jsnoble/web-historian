var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('./http-helpers');
var url = require('url');

// require more modules/folders here!

var sendResponse = function(res, data, responseCode) {
  responseCode = responseCode || 200;
  res.writeHead(responseCode, httpHelp.headers);
  res.end(data);
  // res.end(archive.paths.list);
};

var actions = {
  'GET': function(path, res) {
    if (path === '/') {
      path = archive.paths.siteAssets+ '/index.html';
    } else {
      console.log(path);
      path = archive.paths.archivedSites + '/' + path;
    }
    httpHelp.serveAssets(res, path, sendResponse);
  }
};



exports.handleRequest = function(req, res) {
  var homePath = url.parse(req.url);

  // if(homePath.pathname === '/') {
    var action = actions[req.method];
    if (action) {
      action (homePath.pathname , res);
    } else {
      helpers.sendResponse (res , 'Not Found' , 404);
    }
  // }
};
