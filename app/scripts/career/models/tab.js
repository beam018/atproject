define(['backbone'], function(Backbone){
  'use strict';

  var Tab = Backbone.Model.extend({
    name: '',
    content: '',
    idAttribute: 'id'
  });

  return Tab;
});