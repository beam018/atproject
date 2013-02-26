define(['backbone', 'career/models/city'], function(Backbone, City){
  'use strict';

  var Cities = Backbone.Collection.extend({
    model: City
  });

  return Cities;
});