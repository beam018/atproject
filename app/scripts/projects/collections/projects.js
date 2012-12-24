define(['backbone', 'projects/models/project'], function(Backbone, Project){
  'use strict';

  var Projects = Backbone.Collection.extend({
    model: Project
  });

  return Projects;
});