define(['backbone'], function(Backbone){
  'use strict';

  var Project = Backbone.Model.extend({
  	idAttribute: 'id',
    caption: '',
    content: '',
    thumb: '',
    image: '',
    type: ''
  });

  return Project;
});