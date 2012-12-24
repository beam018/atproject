define(['backbone', 'projects/models/slideImage'], function(Backbone, SlideImage){
  'use strict';

  var Project = Backbone.Model.extend({
    name: '',
    thumb: '',
    model: SlideImage,
    idAttribute: 'id'
  });

  return Project;
});