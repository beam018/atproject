define(['backbone'], function(Backbone){
  'use strict';

  var Job = Backbone.Model.extend({
    name: '',
    city: '',
    content: '',
    idAttribute: 'id'
  });

  return Job;
});