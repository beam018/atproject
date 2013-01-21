define(['backbone'], function(Backbone){
  'use strict';

  var Tab = Backbone.Model.extend({
    caption: '',
    content: '',
    idAttribute: 'id'
  });

  return Tab;
});