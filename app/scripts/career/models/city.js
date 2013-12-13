define(['backbone'], function(Backbone){
  'use strict';

  var City = Backbone.Model.extend({
    city_name: '',
    idAttribute: 'id'
  });

  return City;
});