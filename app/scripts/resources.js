define(['config'], function(config){
  'use strict';

  var Resources = function(){
    this.tabs = this.loadRes('tabs.json');
    this.projects = this.loadRes('projects.json');
    this.jobs = this.loadRes('jobs.json');
  };

  Resources.prototype.loadRes = function(path){
    var resource;

    var url = config.serverUrl + path;
    var request = $.ajax({
      url: url,
      dataType: 'json',
      async: false,
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

  var resources = new Resources();

  return resources;
});