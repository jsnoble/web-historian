var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var hRequest = require('http-request');


exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};


exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, 'utf-8',function(err, data) {
     data = data.split('\n');
     if(callback){
       callback(data);
     }
  });

};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function(sites) {
    var found = _.any(sites, function(site, i) {
      return site.match(url)
    });
    callback(found);
  });

};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, url+'\n', function(err,file){
    callback();
  });

};

exports.isURLArchived = function(url, callback){
  var sitePath = path.join(exports.paths.archivedSites, url);

  fs.exists(sitePath, function(exists){
    callback(exists);
  });

};

exports.downloadUrls = function(urls){
  _.each(urls, function(url){console.log("this is url "+urls);
    hRequest.get('http://' + url, exports.paths.archivedSites+"/"+url, function(error, response){});
  });
};

