define(['backbone'], function(Backbone){
  'use strict';

  var JobCategory = Backbone.Model.extend({
    name: '',
    thumb: '',
    background: '',
    content: '',
    idAttribute: 'id'
  });

  return JobCategory;
});