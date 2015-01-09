var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('./http-helpers');
var url = require('url');


var actions = {
  'GET': function(request, response){
    var parts = url.parse(request.url);
    var urlPath = parts.pathname === '/' ? '/index.html': parts.pathname;
    httpHelp.serveAssets(response, urlPath, function(){

      archive.isUrlInList(urlPath.slice(1), function(found){
          if(found){
            httpHelp.sendRedirect(response, '/loadng.html');
          } else {
            httpHelp.send404(response);
          }
        });
    });
  },
  'POST': function(request, response){
    httpHelp.collectData(request, function(data){
      var url = data.split('=')[1];
      archive.isUrlInList(url, function(found){
        if(found){
          archive.isURLArchived(url, function(exists){
            if(exists){
              httpHelp.sendRedirect(response, '/'+url);
            } else{
              httpHelp.sendRedirect(response, '/loading.html');
            }
          })
        }else{
          archive.addUrlToList(url, function(){
            httpHelp.sendRedirect(response, '/loading.html');
          });
        }
      })
    })
  }
};

//constant time lookups--use this pattern to differentiate between archives, static assests, and errors
exports.handleRequest = function (request, response) {
  var method = actions[request.method];
  if( method ){
    method(request, response);
  } else {
    helpers.send404(response);
  }
};













//var sendResponse = function(res, data, responseCode) {
//  responseCode = responseCode || 200;
//  res.writeHead(responseCode, httpHelp.headers);
//  res.end(data);
//};
//
//var actions = {
//  'GET': function(req, res) {
//    var homePath = url.parse(req.url);
//    var path = homePath.pathname;
//    httpHelp.serveAssets(res, path, sendResponse);
//  },
//
//  'POST': function(req, res){
//    var data = '';
//    req.on('data', function(chunk){
//      data += chunk;
//    });
//
//    req.on('end', function(){
//      var final = qs.parse(data).url;
//      if(archive.isURLArchived(final)){
//        httpHelp.serveAssets(res, final, sendResponse, 302);
//      } else {
//        archive.addUrlToList(res, final, sendResponse);
//      }
//    });
//  }
//};
//
//exports.handleRequest = function(req, res) {
//
//  var action = actions[req.method];
//  if (action) {
//    action (req , res);
//  } else {
//    helpers.sendResponse (res , 'Not Found' , 404);
//  }
//};
//
//
