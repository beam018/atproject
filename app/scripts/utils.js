define(['config', 'jquery', 'jquery.xdr'], function(config, $){
  'use strict';

  $.support.cors = true;

  var utils = {};

  utils.debug = {
    log: function(msg){
      if(config.debug){
        console.log(msg);
      }
    },

    warn: function(msg){
      if(config.debug){
        console.warn(msg);
      }
    },

    error: function(msg){
      if(config.debug){
        console.error(msg);
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

    var fallback = function(status){
      dbg.error('Request failed: ' + status.status + ' ' + status.statusText);
      json = undefined;
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
      dbg.error('Request failed: ' + status.status + ' ' + status.statusText);
      return '';
    };

    var url = config.serverUrl + path;
    res.xhr(url, 'html', callback, fallback);

    return html;
  };

  dbg.log('utils created');

  $(window).trigger('myEvent')

  res.cities = res.json('jobs/cities/');
  res.jobCategories = res.json('jobs/categories/');
  res.jobs = res.json('jobs/');

  res.pages = [];
  res.pages.projects = res.json('pages/projects/');
  res.pages.home = res.json('pages/home/');
  res.pages.about = res.json('pages/about/');

  res.contacts = res.json('pages/contacts/');
  res.contactsText = res.html('contacts/');

  res.career = res.html('career/');

  $(window).trigger('pagesLoad');
  dbg.log('remote resourses loaded');

  return utils;
});