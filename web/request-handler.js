var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('./http-helpers');
var url = require('url');
var fs = require('fs');

// require more modules/folders here!

var sendResponse = function(res, data, responseCode) {
  responseCode = responseCode || 200;
  res.writeHead(responseCode, httpHelp.headers);
  res.end(data);
};

var actions = {
  'GET': function(req, res) {
    var homePath = url.parse(req.url);
    var path = homePath.pathname;
    httpHelp.serveAssets(res, path, sendResponse);
  },
  'POST': function(req, res){
    var data = '';
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function(){
      var final = data.slice(4);
      fs.appendFile(archive.paths.list, final+"\n");
      sendResponse(res, archive.paths.list, 302);
    });

  }
};



exports.handleRequest = function(req, res) {

  var action = actions[req.method];
  if (action) {
    action (req , res);
  } else {
    helpers.sendResponse (res , 'Not Found' , 404);
  }
};
