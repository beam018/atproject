define(['backbone'], function(Backbone){
  'use strict';

  var Project = Backbone.Model.extend({
    caption: '',
    content: '',
    thumb: '',
    image: '',
    idAttribute: 'id'
  });

  return Project;
});