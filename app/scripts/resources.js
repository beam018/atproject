define(['jquery', 'config'], function($, config){
  'use strict';

  var Resources = function(){
    this.projects = this.loadRes('v1/projects/');
    this.jobs = this.loadRes('v1/jobs/');
    this.jobCategories = this.loadRes('v1/jobs/categories/');
    this.cities = this.loadRes('v1/jobs/cities/');

    this.pages = [];
  };

  Resources.prototype.loadRes = function(path, dataType){
    var resource;

    if(!dataType){
      dataType = 'json';
    }

    var url = config.serverUrl + path;
    var request = $.ajax({
      url: url,
      dataType: dataType,
      async: false
    });

    request.done(function(data){
      if(!data) {
        data = [];
      }
      resource = data;
    });

    request.fail(function(jqXHR, textStatus) {
      console.error('Request failed: ' + textStatus);
      resource = [];
    });

    return resource;
  };

  return new Resources();
});