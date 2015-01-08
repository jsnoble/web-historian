var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var hRequest = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

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

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
// {encoding:'utf-8'}
exports.readListOfUrls = function(callback){
  var data =  fs.readFileSync(exports.paths.list, 'utf-8');
  var results = data.split('\n');
  callback(results);

};

exports.isUrlInList = function(someUrl){
  var pathUrl = path.basename(someUrl);
  var data;

  exports.readListOfUrls(function(dat){
      data = dat;
    });

  if(data === undefined){
    return false;
  }

  for(var i = 0; i < data.length; i++){
    if(pathUrl === data[i][0]){
      return true;
    }
  }
  return false;
};

exports.addUrlToList = function(url){
  fs.appendFile(exports.paths.list, url+'\n', function(err) {
    if (err) {
      console.log(err);
      throw err;
    }
  });
};

exports.isURLArchived = function(pathUrl){
  return fs.readFile(exports.paths.archivedSites+"/" +pathUrl, 'utf-8', function(err, data){
    if(err){
      return false;
    } else{
      return true;
    }
  });
};

exports.downloadUrls = function(){
  exports.readListOfUrls(function(data){
    _.each(data, function(url) {
      hRequest.get(url, exports.paths.archivedSites+"/"+url, function(err, res) {
        if (err) {
          console.log('couldn\'t download');
          throw err;
        } else {
          console.log('downloaded successfully!');
        }
      });
    });
  });
};
