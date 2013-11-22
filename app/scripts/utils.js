define(['config', 'jquery'], function(config, $){
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

  res.jobs = res.json('jobs/');

  // var jobCategories = [];
  // for( var i = 0; i < res.jobs.length; i++ ){
  //   var category = res.jobs[i].category;

  //   var found = false;
  //   for( var j = 0; j < jobCategories.length; j++ ){
  //     if(category.id === jobCategories[j].id){
  //       found = true;
  //       break;
  //     }
  //   }

  //   if(!found){
  //     jobCategories.push(category);
  //   }
  // };

  // console.log(jobCategories);

  res.jobCategories = res.json('jobs/categories/');
  // res.cities = res.json('jobs/cities/');

  res.pages = [];
  res.pages.projects = res.json('pages/projects/');
  res.pages.home = res.json('pages/home/');
  res.pages.about = res.json('pages/about/');
  res.pages.notFound = res.json('pages/' + config.notFoundUrl + '/');

  res.contacts = res.json('pages/contacts/');
  res.contactsText = res.html('contacts/');

  res.posts = res.json('posts/');
  res.postsText = res.html('posts/');

  res.career = res.html('career/');

  dbg.log('remote resourses loaded');

  return utils;
});
