define(['config', 'jquery'], function(config, $){
  'use strict';

  var utils = {};

  utils.debug = {
    log: function(){
      if(config.debug){
        console.log(arguments);
      }
    },

    warn: function(){
      if(config.debug){
        console.warn(arguments);
      }
    },

    error: function(){
      if(config.debug){
        console.error(arguments);
      }
    }
  };

  var dbg = utils.debug;

  utils.resources = {};
  var res = utils.resources;

  utils.resources.xhr = function(urn, type, callback, fallback){
    var request = $.ajax({
      url: urn,
      dataType: type,
      async: false
    });

    request.done(callback);
    request.fail(fallback);
  };

  utils.resources.json = function(path){
    var json = {};

    var callback = function(data){
      json = data;
    };

    var fallback = function(data, status){
      dbg.error('Request failed: ' + status);
    };

    var url = config.apiUrl + path;
    res.xhr(url, 'json', callback, fallback);

    return json;
  },

  utils.resources.html = function(path){
    var html = '';

    var callback = function(data){
      html = data;
    };

    var fallback = function(status){
      dbg.error('Request failed: ' + status);
    };

    var url = config.serverUrl + path;
    res.xhr(url, 'html', callback, fallback);

    return html;
  };

  dbg.log('utils created');

  res.projects = res.json('projects/');
  res.cities = res.json('jobs/cities/');
  res.jobCategories = res.json('jobs/categories/');
  res.jobs = res.json('jobs/');

  res.pages = [];
  res.pages.home = res.html('home/');
  res.pages.about = res.html('about/');
  res.pages.contacts = res.html('contacts/');
  res.pages.career = res.html('career/');

  dbg.log('remote resourses loaded');

  return utils;
});